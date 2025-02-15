import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS configuration is missing environment variables");
}

const S3ClientConfig = new S3Client({
  region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

export { S3ClientConfig }
