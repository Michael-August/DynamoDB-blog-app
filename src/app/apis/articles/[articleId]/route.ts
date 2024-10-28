import { dynamoDb } from "@/lib/dynamo";
import { DeleteCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

// GET Request
export async function GET(req: Request, {params}: { params: { articleId: string } }) {
  const { articleId } = params;

  if (!articleId || typeof articleId !== 'string') {
    return NextResponse.json({ message: "Invalid article id", success: false, status: 400 }, { status: 400 });
  }

  try {
    const dynamoParams = {
      TableName: 'Blog',
      Key: { id: articleId },
    };

    const data = await dynamoDb.send(new GetCommand(dynamoParams));
    
    if (!data.Item) return NextResponse.json({ message: "Blog post not found", success: false, status: 404 }, { status: 404 });


    const blogPost = data.Item;

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
export async function PUT(req: Request, {params}: { params: { articleId: string } }) {
  const { articleId } = params;

  if (!articleId || typeof articleId !== 'string') {
    return NextResponse.json({ message: "Invalid article id", success: false, status: 400 }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title')
    const content = formData.get('content')
    let imageUrl;

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

    const params = {
      TableName: 'Blog',
      Key: { id: articleId },
      UpdateExpression: 'set #title = :title, content = :content, imageUrl = if_not_exists(imageUrl, :imageUrl)',
      ExpressionAttributeNames: { '#title': 'title' },
      ExpressionAttributeValues: {
        ':title': title,
        ':content': content,
        ':imageUrl': imageUrl || '',
      },
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

// DELETE Request
export async function DELETE(req: Request, {params}: { params: { articleId: string } }) {
  const { articleId } = params;

  if (!articleId || typeof articleId !== 'string') {
    return NextResponse.json({ message: "Invalid article id", success: false, status: 400 }, { status: 400 });
  }

  try {
    const params = {
      TableName: 'Blog',
      Key: { id: articleId },
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
