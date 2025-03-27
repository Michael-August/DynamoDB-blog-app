import { dynamoDb } from "@/lib/dynamo";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from 'uuid';

import { NextRequest, NextResponse } from "next/server";
import { S3ClientConfig } from "@/lib/s3bucket.config";
import { SESClientConfig } from "@/lib/sesclient.config";
import { SendEmailCommand } from "@aws-sdk/client-ses";

export const runtime = 'nodejs';

function generateSlug(title: string, id: string) {
  // Remove special characters except for hyphens
  const cleanTitle = title.replace(/[^\w\s-]/g, '');
  
  // Replace spaces with hyphens and convert to lowercase
  const slugTitle = cleanTitle.replace(/\s+/g, '-').toLowerCase();
  
  // Extract the first 6 characters of the ID
  const slugId = id.toString().slice(0, 6);
  
  // Concatenate the title and ID to form the slug
  const slug = `${slugTitle}-${slugId}`;
  
  return slug;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title')
    const content = formData.get('content')
    const tags = JSON.parse(formData.get("tags") as string)

    if (!title) {
      return Response.json({ error: 'Please provide Title' }, { status: 400 });
    }

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

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

    const id = uuidv4();

    // const imageUrl = result.secure_url
    const slug = generateSlug(title as string, id)
    const status = "unpublished"

    const params = {
      TableName: 'Blog',
      Item: {
        id,
        title,
        content,
        imageFileName: fileName,
        status,
        slug,
        tags,
        createdAt: Date.now()
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

// export async function GET(req: NextRequest) {
//   try {
//     const params = { TableName: "Blog" };
//     let allItems: any[] = [];
//     let lastEvaluatedKey = undefined;

//     do {
//       const command: ScanCommand = new ScanCommand({
//         ...params,
//         ExclusiveStartKey: lastEvaluatedKey, // Start where the last scan left off
//       });

//       const data = await dynamoDb.send(command);
//       if (data.Items) {
//         allItems = [...allItems, ...data.Items]; // Append results
//       }

//       lastEvaluatedKey = data.LastEvaluatedKey; // Check if more data exists
//     } while (lastEvaluatedKey); // Continue scanning until all items are retrieved

//     return NextResponse.json({
//       posts: allItems,
//       message: "Fetch successful",
//       success: true,
//       status: 200,
//     });

//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message, success: false, status: 500 });
//     } else {
//       return NextResponse.json({ error: "An unknown error occurred", success: false, status: 500 });
//     }
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const params = { TableName: "Blog" };
    let allItems: any[] = [];
    let lastEvaluatedKey = undefined;

    // Extract search query from request URL
    const searchQuery = req.nextUrl.searchParams.get("search")?.trim().toLowerCase();

    do {
      const command: ScanCommand = new ScanCommand({
        ...params,
        ExclusiveStartKey: lastEvaluatedKey, // Start where the last scan left off
      });

      const data = await dynamoDb.send(command);
      if (data.Items) {
        allItems = [...allItems, ...data.Items]; // Append results
      }

      lastEvaluatedKey = data.LastEvaluatedKey; // Check if more data exists
    } while (lastEvaluatedKey); // Continue scanning until all items are retrieved

    // **Apply Search Filtering**
    if (searchQuery) {
      allItems = allItems.filter((item) =>
        item.title?.toLowerCase().includes(searchQuery) // Adjust field as needed
      );
    }

    return NextResponse.json({
      posts: allItems,
      message: "Fetch successful",
      success: true,
      status: 200,
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false, status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred", success: false, status: 500 });
    }
  }
}


