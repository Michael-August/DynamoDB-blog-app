import { dynamoDb } from "@/lib/dynamo";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { SESClientConfig } from "@/lib/sesclient.config";

export const runtime = 'nodejs';

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
                                        text-color: #fff;
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
                                        <p>&copy; 2025 Ewere.tech. All Rights Reserved.</p>
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
        console.log(error)
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message, success: false, status: 500 }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred', success: false, status: 500 }, { status: 500 });
        }
    }
}