import { uploadImage } from "@/lib/cloudinary";
import { dynamoDb } from "@/lib/dynamo";
import { DeleteCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { ReturnValue } from "@aws-sdk/client-dynamodb";

// GET Request
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ message: "Missing articleId parameter", success: false, status: 400 }, { status: 400 });
  }

  try {
    const params = {
      TableName: 'Blog',
      Key: { id: articleId },
    };

    const command = new GetCommand(params);
    const data = await dynamoDb.send(command);

    if (!data.Item) {
      return NextResponse.json({ message: 'Article not found', success: false, status: 404 }, { status: 404 });
    }

    return NextResponse.json({ article: data.Item, message: "Fetch successful", success: true, status: 200 });
  } catch (error: any) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
    }
  }
}

// PUT Request
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ message: "Missing articleId parameter", success: false, status: 400 }, { status: 400 });
  }

  try {
    const { title, content, image } = await req.json();
    let imageUrl;

    if (image) {
      const uploadedImage = await uploadImage(image);
      imageUrl = uploadedImage.secure_url;
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
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ message: "Missing articleId parameter", success: false, status: 400 }, { status: 400 });
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
