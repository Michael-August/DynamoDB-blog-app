import { SESClient } from "@aws-sdk/client-ses";

const region = process.env.REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS configuration is missing environment variables");
}

const SESClientConfig = new SESClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

export { SESClientConfig }
