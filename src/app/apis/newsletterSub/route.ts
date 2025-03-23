import { dynamoDb } from "@/lib/dynamo";
import { DeleteCommand, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { SESClientConfig } from "@/lib/sesclient.config";
import moment from "moment";

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Fetch all subscribers
    const command = new ScanCommand({ TableName: "Subscribers" });
    const result = await dynamoDb.send(command);

    return NextResponse.json({
      subscribers: result.Items || [],
      message: "Subscribers fetched successfully",
      success: true,
    }, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) { 
    try {
        const body = await req.json(); // Parse JSON body
        const { fullName, email } = body;

        const id = uuidv4(); // Generate a unique ID

        if (!fullName || !email) {
            return new Response(JSON.stringify({ message: "Full name and email are required." }), {
                status: 400,
            });
        }

        // Check for duplicates
        const queryParams = {
            TableName: "Subscribers",
            IndexName: "email-index", // Replace with the correct index name if using a secondary index
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email,
            },
        };

        const queryCommand = new QueryCommand(queryParams);
        const queryResult = await dynamoDb.send(queryCommand);

        if (queryResult.Items && queryResult.Items.length > 0) {
            return NextResponse.json(
                { message: "This email is already subscribed.", success: false },
                { status: 409 }
            );
        }

        // Save subscriber to database
        const params = {
            TableName: "Subscribers",
            Item: {
                id,
                email,
                fullName,
                status: "subscribed",
                subscribedAt: new Date().toISOString(),
            },
        };

        const command = new PutCommand(params);
        await dynamoDb.send(command);

        // Send Email via Amazon SES
        const emailParams = {
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                            <!DOCTYPE html>
                            <html>
                                <head>
                                    <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        margin: 0;
                                        padding: 0;
                                        background-color: #000;
                                        color: #fff;
                                    }
                                    .email-container {
                                        max-width: 600px;
                                        margin: 0 auto;
                                        padding: 20px;
                                        background-color: #111;
                                        border: 1px solid #333;
                                        border-radius: 8px;
                                    }
                                    .header {
                                        text-align: center;
                                        padding: 10px 0;
                                        border-bottom: 1px solid #333;
                                    }
                                    .header h1 {
                                        font-size: 24px;
                                        margin: 0;
                                        color: #fff;
                                    }
                                    .content {
                                        padding: 20px 10px;
                                        text-align: center;
                                        color: #fff;
                                    }
                                    .content p {
                                        font-size: 16px;
                                        line-height: 1.5;
                                        margin: 10px 0;
                                    }
                                    .footer {
                                        text-align: center;
                                        padding: 15px 0;
                                        border-top: 1px solid #333;
                                        font-size: 14px;
                                        color: #bbb;
                                    }
                                    .button {
                                        display: inline-block;
                                        margin: 20px auto;
                                        padding: 10px 20px;
                                        background-color: #fff;
                                        color: #000;
                                        text-decoration: none;
                                        font-weight: bold;
                                        border-radius: 4px;
                                        transition: background-color 0.3s ease;
                                    }
                                    .button:hover {
                                        background-color: #ddd;
                                    }
                                    </style>
                                </head>
                                <body>
                                    <div class="email-container">
                                    <div class="header">
                                        <h1>Thank You for Subscribing!</h1>
                                    </div>
                                    <div class="content">
                                        <p>Hello <strong>${fullName}</strong>,</p>
                                        <p>
                                            You've successfully subscribed to our newsletter. We're excited to keep you updated
                                            with the latest news and updates.
                                        </p>
                                        <a
                                            href="https://ewere.tech"
                                            class="button"
                                        >
                                            Visit Our Website
                                        </a>
                                    </div>
                                    <div class="footer">
                                        <p>&copy; ${moment().year()} Ewere.tech. All Rights Reserved.</p>
                                        <p><a href="http://ewere.tech/unsubscribe?email=${email}" class="unsubscribe">Unsubscribe</a></p>
                                    </div>
                                    </div>
                                </body>
                            </html>
                        `,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Subscription Confirmation",
                },
            },
            Source: `Ewere Diagboya <${process.env.SES_VERIFIED_EMAIL}>`,
        };

        await SESClientConfig.send(new SendEmailCommand(emailParams));

        return NextResponse.json({
            message: 'Newletter subscription succesful',
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

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ message: "Email is required.", success: false }, { status: 400 });
        }

        // Step 1: Query to find the subscriber's ID using the email-index GSI
        const queryParams = {
            TableName: "Subscribers",
            IndexName: "email-index",
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email,
            },
        };

        const queryCommand = new QueryCommand(queryParams);
        const queryResult = await dynamoDb.send(queryCommand);

        if (!queryResult.Items || queryResult.Items.length === 0) {
            return NextResponse.json({ message: "Subscriber not found.", success: false }, { status: 404 });
        }

        // Get the subscriber's unique ID
        const subscriberId = queryResult.Items[0].id;

        // Step 2: Delete the subscriber using their ID (Primary Key)
        const deleteParams = {
            TableName: "Subscribers",
            Key: { id: subscriberId }, // Use the primary key
        };

        await dynamoDb.send(new DeleteCommand(deleteParams));

        return NextResponse.json({ message: "You have been unsubscribed.", success: true }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message, success: false }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred.", success: false }, { status: 500 });
    }
}

