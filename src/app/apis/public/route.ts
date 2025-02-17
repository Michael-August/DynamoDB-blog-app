import { dynamoDb } from "@/lib/dynamo";
import { Select } from "@aws-sdk/client-dynamodb";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

// export async function GET(req: NextRequest) {
//   try {
//     const search = req.nextUrl.searchParams.get('search');
//     const lastEvaluatedKey = req.nextUrl.searchParams.get('lastKey');

//     // Base parameters for query
//     const params: any = {
//       TableName: 'Articles',
//       IndexName: 'CreatedAt-index', // Use the GSI for pagination
//       KeyConditionExpression: '#status = :status',
//       ExpressionAttributeNames: { '#status': 'status' },
//       ExpressionAttributeValues: { ':status': 'published' },
//       ScanIndexForward: false, // Sort by createdAt DESC
//       Limit: 20,
//     };

//     if (search) {
//       params.FilterExpression = 'contains(title, :search) OR contains(content, :search)';
//       params.ExpressionAttributeValues[':search'] = search;
//     }

//     if (lastEvaluatedKey) {
//       params.ExclusiveStartKey = JSON.parse(lastEvaluatedKey);
//     }

//     // Run the paginated query
//     const paginatedCommand = new QueryCommand(params);
//     const paginatedData = await dynamoDb.send(paginatedCommand);

//     return NextResponse.json({
//       posts: paginatedData.Items,
//       lastKey: paginatedData.LastEvaluatedKey ? JSON.stringify(paginatedData.LastEvaluatedKey) : null,
//       limit: 20,
//       total: 76,
//       message: "Fetch successful",
//       success: true,
//       status: 200,
//     }, { status: 200 });

//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
//     } else {
//       return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
//     }
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search");

    const params: any = {
      TableName: "Blog",
      FilterExpression: "#status = :status",
      ExpressionAttributeNames: {
        "#status": "status", // Map reserved keyword 'status' to '#status'
      },
      ExpressionAttributeValues: {
        ":status": "published",
      } as { [key: string]: any },
    };

    if (search) {
      params.FilterExpression +=
        " and (contains(title, :search) or contains(content, :search))";
      params.ExpressionAttributeValues[":search"] = search;
    }

    let allItems: any[] = [];
    let lastEvaluatedKey = undefined;

    do {
      const command: ScanCommand = new ScanCommand({
        ...params,
        ExclusiveStartKey: lastEvaluatedKey, // Continue from the last batch
      });

      const data = await dynamoDb.send(command);

      if (data.Items) {
        allItems = [...allItems, ...data.Items]; // Collect all fetched items
      }

      lastEvaluatedKey = data.LastEvaluatedKey; // Check if more data exists
    } while (lastEvaluatedKey); // Continue scanning until all data is retrieved

    return NextResponse.json(
      {
        posts: allItems,
        total: allItems.length || 0,
        message: "Fetch successful",
        success: true,
        status: 200,
      },
      { status: 200 }
    );
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


