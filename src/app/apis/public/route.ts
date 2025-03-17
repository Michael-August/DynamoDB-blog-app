import { dynamoDb } from "@/lib/dynamo";
import { Select } from "@aws-sdk/client-dynamodb";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search");
    const lastEvaluatedKey = req.nextUrl.searchParams.get("lastKey");
    const tagsParam = req.nextUrl.searchParams.get("tag"); // Get tags from query

    // Base parameters for query
    const params: any = {
      TableName: "Articles",
      IndexName: "CreatedAt-index", // Use the GSI for pagination
      KeyConditionExpression: "#status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": "published" }, // ✅ Use plain string, not `{ S: "published" }`
      ScanIndexForward: false, // Sort by createdAt DESC
      Limit: 20,
    };

    let filterConditions: string[] = [];
    
    // Apply search filter if provided
    if (search) {
      filterConditions.push("contains(title, :search) OR contains(content, :search)");
      params.ExpressionAttributeValues[":search"] = search;
    }

    // Apply tag filter if provided
    if (tagsParam) {
      filterConditions.push("contains(tags, :tag)");
      params.ExpressionAttributeValues[":tag"] = tagsParam;
    }

    // Combine filter conditions only if there are any
    if (filterConditions.length > 0) {
      params.FilterExpression = filterConditions.join(" AND ");
    }

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(lastEvaluatedKey);
    }

    // Run the paginated query
    const paginatedCommand = new QueryCommand(params);
    const paginatedData = await dynamoDb.send(paginatedCommand);

    // Get total count (Option 1: Scan with COUNT)
    const countCommand = new ScanCommand({
      TableName: "Articles",
      Select: "COUNT",
    });
    const countData = await dynamoDb.send(countCommand);
    const total = countData.Count || 0;

    return NextResponse.json(
      {
        posts: paginatedData.Items,
        lastKey: paginatedData.LastEvaluatedKey
          ? JSON.stringify(paginatedData.LastEvaluatedKey)
          : null,
        limit: 20,
        total, // Total count of articles
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

// export async function GET(req: NextRequest) {
//   try {
//     const search = req.nextUrl.searchParams.get("search");
//     const tagsParam = req.nextUrl.searchParams.get("tag"); // Get tags from query

//     const params: any = {
//       TableName: "Blog",
//       FilterExpression: "#status = :status",
//       ExpressionAttributeNames: {
//         "#status": "status",
//       },
//       ExpressionAttributeValues: {
//         ":status": "published",
//       } as { [key: string]: any },
//     };

//     // Apply search filter if search term is provided
//     if (search) {
//       params.FilterExpression +=
//         " AND (contains(title, :search) OR contains(content, :search))";
//       params.ExpressionAttributeValues[":search"] = search;
//     }

//     // Apply tags filter if tags are provided
//     if (tagsParam) {
//       params.FilterExpression += ` AND contains(tags, :tag)`;
//       params.ExpressionAttributeValues[":tag"] = tagsParam;
//     }

//     let allItems: any[] = [];
//     let lastEvaluatedKey = undefined;

//     do {
//       const command: ScanCommand = new ScanCommand({
//         ...params,
//         ExclusiveStartKey: lastEvaluatedKey,
//       });

//       const data = await dynamoDb.send(command);

//       if (data.Items) {
//         allItems = [...allItems, ...data.Items];
//       }

//       lastEvaluatedKey = data.LastEvaluatedKey;
//     } while (lastEvaluatedKey);

//     return NextResponse.json(
//       {
//         posts: allItems,
//         total: allItems.length || 0,
//         message: "Fetch successful",
//         success: true,
//         status: 200,
//       },
//       { status: 200 }
//     );
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return NextResponse.json(
//         { error: error.message, success: false, status: 500 },
//         { status: 500 }
//       );
//     } else {
//       return NextResponse.json(
//         { error: "An unknown error occurred", success: false, status: 500 },
//         { status: 500 }
//       );
//     }
//   }
// }


