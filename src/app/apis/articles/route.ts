import { uploadImage } from "@/lib/cloudinary";
import { dynamoDb } from "@/lib/dynamo";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

import busboy from 'busboy';
import { Readable } from 'stream';
import { IncomingMessage } from 'http';
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false
  },
};

async function parseFormData(req: NextRequest): Promise<{ fields: any, files: any }> {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    const fields: any = {};
    const files: any = [];

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks: any[] = [];

      file.on('data', (data) => {
        chunks.push(data);
      });

      file.on('end', () => {
        files.push({ filename, encoding, mimeType, buffer: Buffer.concat(chunks) });
      });
    });

    bb.on('field', (name, value) => {
      fields[name] = value;
    });

    bb.on('finish', () => {
      resolve({ fields, files });
    });

    bb.on('error', (err) => {
      reject(err);
    });

    const reqBody = Readable.from(req.body);
    reqBody.pipe(bb);
  });
}

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseFormData(req);

    const { title, content } = fields;
    const imageFile = files.image;

    const id = uuidv4();

    const uploadedImage = await uploadImage(imageFile);
    const imageUrl = uploadedImage.secure_url;

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
      message: 'Article created successfully',
      success: true,
      status: 201,
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
      success: false,
      status: 500,
    }, { status: 500 });
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

  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
      success: false,
      status: 500,
    }, { status: 500 });
  }
}
