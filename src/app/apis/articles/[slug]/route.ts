import { dynamoDb } from "@/lib/dynamo";
import { DeleteCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { ReturnValue, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3ClientConfig } from "@/lib/s3bucket.config";
import { SESClientConfig } from "@/lib/sesclient.config";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import moment from "moment";

// GET Request
export async function GET(req: Request, {params}: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ message: "Invalid slug", success: false, status: 400 }, { status: 400 });
  }

  try {
    const dynamoParams = {
      TableName: 'Blog',
      IndexName: 'slug-index',
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug,
      },
    };


    const data = await dynamoDb.send(new QueryCommand(dynamoParams));
    
    if (!data.Items || data.Items.length === 0) {
      return NextResponse.json({ message: "Article not found", success: false, status: 404 }, { status: 404 });
    }

    const blogPost = data.Items[0];

    return NextResponse.json({ article: blogPost, message: "Fetch successful", success: true, status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
    }
  }
}

// PUT Request
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ message: "Invalid slug", success: false, status: 400 }, { status: 400 });
  }


  try {
    const formData = await req.formData();
    const title = formData.get('title')
    const content = formData.get('content')
    const id = formData.get('id')
    const createdAt = formData.get('createdAt')
    const tags = JSON.parse(formData.get("tags") as string)

    let imageUrl = undefined;
    let imageFileName = undefined;

    if (formData.get("imageUrl")) {
      imageUrl = formData.get("imageUrl")
    } else if (formData.get("imageFileName")) {
      imageFileName = formData.get("imageFileName")
    } else {
      const file = formData.get('image') as File;
      if (file) {
        const fileBuffer = await file.arrayBuffer();
        const fileName = file.name

        // Upload file to S3
        const uploadParams = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: Buffer.from(fileBuffer),
          ContentType: file.type,
        });

        await S3ClientConfig.send(uploadParams);
        imageFileName = fileName
      }
    }

    const updateExpressionParts = ["#title = :title", "content = :content", "tags = :tags"];
    const expressionAttributeValues: Record<string, any> = {
      ":title": title,
      ":content": content,
      ":tags": tags,
    };

    if (imageUrl) {
      updateExpressionParts.push("imageUrl = :imageUrl");
      expressionAttributeValues[":imageUrl"] = imageUrl;
    } else {
      updateExpressionParts.push("imageFileName = :imageFileName");
      expressionAttributeValues[":imageFileName"] = imageFileName;
    }

    const key = { id: String(id), createdAt: Number(createdAt) };

    const params = {
      TableName: 'Blog',
      // Key: key,
      Key: {id: id},
      UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
      ExpressionAttributeNames: { '#title': 'title' },
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: ReturnValue.ALL_NEW,
    };

    const command = new UpdateCommand(params);
    const data = await dynamoDb.send(command);

    return NextResponse.json({ updatedArticle: data.Attributes, message: "Update successful", success: true, status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
    }
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ message: "Invalid slug", success: false, status: 400 }, { status: 400 });
  }

  try {
    // Parse JSON body
    const body = await req.json();
    const { status, id, createdAt } = body;

    // Validate the status field
    if (!status || typeof status !== 'string') {
      return NextResponse.json({ message: "Invalid status", success: false, status: 400 }, { status: 400 });
    }

    if (!createdAt) {
      return NextResponse.json({ message: "Invalid createdAt value", success: false, status: 400 }, { status: 400 });
    }

    const key = { id: String(id), createdAt: createdAt };

    // Prepare parameters for the UpdateCommand
    const params = {
      TableName: 'Blog',
      // Key: key,
      Key: { id },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
      },
      ReturnValues: ReturnValue.ALL_NEW,
    };

    const command = new UpdateCommand(params);
    const data = await dynamoDb.send(command);

    if (!data.Attributes) {
      return NextResponse.json({
        message: "Article not found",
        success: false,
        status: 404,
      }, { status: 404 });
    }

    const response = NextResponse.json({
      updatedArticle: data.Attributes,
      message: "Status updated successfully",
      success: true,
      status: 200,
    });

    // **Trigger Background Job After Response**
    if (status === "published") {
      setTimeout(async () => {
        await sendEmailsToSubscribers(data.Attributes?.title, data.Attributes?.content, data.Attributes?.slug);
      }, 0);
    }

    // Return the updated article
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
    }
  }
}

// DELETE Request
export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const {id, createdAt} = await req.json()

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ message: "Invalid slug", success: false, status: 400 }, { status: 400 });
  }

  const key = { id: String(id), createdAt: createdAt };

  try {
    const params = {
      TableName: 'Blog',
      // Key: key,
      Key: {id}
    };

    const command = new DeleteCommand(params);
    await dynamoDb.send(command);

    return NextResponse.json({ message: 'Item deleted successfully', success: true, status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
    }
  }
}

async function sendEmailNotifications(subscribers: any[], content: string, title: string, slug: string) {
  const websiteUrl = "https://www.ewere.tech";
  const articleUrl = `${websiteUrl}/blog/${slug}`;

  for (const subscriber of subscribers) {
    const emailParams = {
      Destination: { ToAddresses: [subscriber.email] },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                  }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                  .button { display: inline-block; padding: 10px 20px; background: black; color: white !important; text-decoration: none; border-radius: 5px; margin-bottom: 20px; }
                  .privacy { margin-top: 10px; color: white !important; font-size: 12px; }
                  .footer {
                    text-align: center;
                    padding: 15px 0;
                    border-top: 1px solid #333;
                    font-size: 14px;
                    color: #bbb;
                    background: black;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <p>Hey ${subscriber.fullName},</p>
                  <p>We've just published a new article that you might be interested in!</p>
                  <h2>${title}</h2>
                  <p>${content.slice(3, 300)}... <a href="${articleUrl}">Read more</a></p>
                  <a href="${articleUrl}" class="button">Read Now</a>
                  <div class="footer">
                    <p>&copy; ${moment().year()} Ewere.tech. All Rights Reserved.</p>
                    <div class='privacy'>
                      <a href="${websiteUrl}/terms">Terms of Service</a> | <a href="${websiteUrl}/privacy">Privacy Policy</a>
                    </div>
                    <p><a href="http://ewere.tech/unsubscribe?email=${subscriber.email}" class="unsubscribe">Unsubscribe</a></p>
                  </div>
                </div>
              </body>
              </html>
            `,
          },
        },
        Subject: { Charset: "UTF-8", Data: `New Article Alert: ${title}` },
      },
      Source: `Ewere Diagboya <${process.env.SES_VERIFIED_EMAIL}>`,
    };

    try {
      await SESClientConfig.send(new SendEmailCommand(emailParams));
    } catch (error) {
      console.error(`Failed to send email to ${subscriber.email}:`, error);
    }
  }
}

async function sendEmailsToSubscribers(title: string, content: string, slug: string) {
  console.log("Fetching subscribers for email notification...");

  // **Fetch all subscribers**
  const subscribersCommand = new ScanCommand({ TableName: "Subscribers" });
  const subscribersResult = await dynamoDb.send(subscribersCommand);
  const subscribers = subscribersResult.Items || [];

  if (subscribers.length === 0) {
    console.log("No subscribers found.");
    return;
  }

  sendEmailNotifications(subscribers, content, title, slug);
}
