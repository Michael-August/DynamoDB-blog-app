import { dynamoDb } from "@/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const tag = searchParams.get("tag");

    if (!tag) {
        return NextResponse.json({ message: "Tag is required", success: false }, { status: 400 });
    }

    const params = {
        TableName: "Blog",
        FilterExpression: "contains(tags, :tag)",
        ExpressionAttributeValues: {
        ":tag": tag,
        },
    };

    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);

    return NextResponse.json({
        posts: data.Items,
        message: 'Fetch successful',
        success: true,
        status: 200,
    });
}
