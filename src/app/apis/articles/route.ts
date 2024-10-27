import { dynamoDb } from "@/lib/dynamo";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title')
    const content = formData.get('content')

    if (!title) {
      return Response.json({ error: 'Please provide Title' }, { status: 400 });
    }

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

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

    const id = uuidv4();

    const imageUrl = result.secure_url

    const params = {
      TableName: 'Blog',
      Item: {
        id,
        title,
        content,
        imageUrl,
        createdAt: new Date().toISOString(),
      },
    };

    const command = new PutCommand(params);
    await dynamoDb.send(command);

    return NextResponse.json({
      article: params.Item,
      message: 'Article created successfully',
      success: true,
      status: 201,
    }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
    }
  }
}

export async function GET() {
  try {
    const params = {
      TableName: 'Blog',
    };

    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);

    return NextResponse.json({
      posts: data.Items,
      message: 'Fetch successful',
      success: true,
      status: 200,
    }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
    }
  }
}
