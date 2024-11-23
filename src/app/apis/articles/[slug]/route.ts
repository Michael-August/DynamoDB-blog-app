import { dynamoDb } from "@/lib/dynamo";
import { DeleteCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

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
    const tags = JSON.parse(formData.get("tags") as string)

    let imageUrl;

    if (formData.get("imageUrl")) {
      imageUrl = formData.get("imageUrl")
      console.log(imageUrl)
    } else {
      const file = formData.get('image') as File;
      if (file) {
        const fileBuffer = await file.arrayBuffer();
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: 'auto', folder: "blogImages" },
              (error, result) => {
                if (error || !result) reject(error);
                else resolve(result);
              },
            )
            .end(Buffer.from(fileBuffer));
        });
        imageUrl = result.secure_url;
      }
    }

    const params = {
      TableName: 'Blog',
      Key: { id: id },
      UpdateExpression: 'set #title = :title, content = :content, tags =:tags, imageUrl = :imageUrl',
      ExpressionAttributeNames: { '#title': 'title' },
      ExpressionAttributeValues: {
        ':title': title,
        ':content': content,
        ':tags': tags,
        ':imageUrl': imageUrl,
      },
      ReturnValues: ReturnValue.ALL_NEW,
    };

    console.log(params)

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
    const { status, id } = body;

    // Validate the status field
    if (!status || typeof status !== 'string') {
      return NextResponse.json({ message: "Invalid status", success: false, status: 400 }, { status: 400 });
    }

    // Prepare parameters for the UpdateCommand
    const params = {
      TableName: 'Blog',
      Key: { id: id },
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

    // Return the updated article
    return NextResponse.json({
      updatedArticle: data.Attributes,
      message: "Status updated successfully",
      success: true,
      status: 200,
    });
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
  const {id} = await req.json()

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ message: "Invalid slug", success: false, status: 400 }, { status: 400 });
  }

  try {
    const params = {
      TableName: 'Blog',
      Key: { id: id },
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
