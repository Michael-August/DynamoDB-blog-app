import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS configuration is missing environment variables");
}

const client = new DynamoDBClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
const dynamoDb = DynamoDBDocumentClient.from(client);

export { dynamoDb };
