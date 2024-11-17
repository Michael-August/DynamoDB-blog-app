import { dynamoDb } from "@/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const blogId = searchParams.get("blogId");
    const tags = searchParams.get("tags")?.split(",") || []; // Tags from current blog

    if (!blogId || tags.length === 0) {
      return NextResponse.json(
        { message: "Blog ID and tags are required", success: false },
        { status: 400 }
      );
    }

    const params = {
      TableName: "Blog",
      FilterExpression:
        "id <> :blogId AND (contains(tags, :tag1) OR contains(tags, :tag2) OR contains(tags, :tag3))",
      ExpressionAttributeValues: {
        ":blogId": blogId,
        ":tag1": tags[0] || "",
        ":tag2": tags[1] || "",
        ":tag3": tags[2] || "",
      },
    };

    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);

    return NextResponse.json({
      posts: data.Items,
      message: "Similar blogs fetched successfully",
      success: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, success: false, status: 500 },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred", success: false, status: 500 },
        { status: 500 }
      );
    }
  }
}
