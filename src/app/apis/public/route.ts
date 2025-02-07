import { dynamoDb } from "@/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

// export async function GET(req: NextRequest) {
//   try {
//     const search = req.nextUrl.searchParams.get('search');
//     const lastEvaluatedKey = req.nextUrl.searchParams.get('lastKey');
    
//     const params: any = {
//       TableName: 'Blog',
//       FilterExpression: '#status = :status',
//       ExpressionAttributeNames: {
//         '#status': 'status', // Map reserved keyword 'status' to '#status'
//       },
//       ExpressionAttributeValues: {
//         ':status': 'published',
//       } as { [key: string]: any },
//     };

//     if (search) {
//       params.FilterExpression += ' and (contains(title, :search) or contains(content, :search))';
//       params.ExpressionAttributeValues[':search'] = search;
//     }

//     const paginatedParams = { ...params, Limit: 18 };
//     if (lastEvaluatedKey) {
//       paginatedParams.ExclusiveStartKey = JSON.parse(lastEvaluatedKey);
//     }

//     // Run the paginated query
//     const paginatedCommand = new ScanCommand(paginatedParams);
//     const paginatedData = await dynamoDb.send(paginatedCommand);

//     // Run a count query to get the total number of matching items
//     const countCommand = new ScanCommand(params);
//     const countData = await dynamoDb.send(countCommand);

//     return NextResponse.json({
//       posts: paginatedData.Items,
//       lastKey: paginatedData.LastEvaluatedKey ? JSON.stringify(paginatedData.LastEvaluatedKey) : null,
//       total: countData.ScannedCount,
//       limit: 20,
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

    let params: any = {
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


