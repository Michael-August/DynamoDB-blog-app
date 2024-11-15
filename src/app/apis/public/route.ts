import { dynamoDb } from "@/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search');
    const params = {
      TableName: 'Blog',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status', // Map reserved keyword 'status' to '#status'
      },
      ExpressionAttributeValues: {
        ':status': 'published',
      } as { [key: string]: any },
    };

    if (search) {
      params.FilterExpression += ' and (contains(title, :search) or contains(content, :search))';
      params.ExpressionAttributeValues[':search'] = search;
    }

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
