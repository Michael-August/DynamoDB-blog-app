import { uploadImage } from "@/lib/cloudinary";
import { dynamoDb } from "@/lib/dynamo";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";

const PostHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, content, image } = req.body;

  try {

    const uploadedImage = await uploadImage(image);
    const imageUrl = uploadedImage.secure_url;
    
    const params = {
      TableName: 'BlogArticles',
      Item: {
        id: new Date().toISOString(),
        title,
        content,
        imageUrl,
        createdAt: new Date().toISOString(),
      },
    };

    const command = new PutCommand(params);
    await dynamoDb.send(command);

    res.status(201).json({ message: 'Article created successfully', success: true, status: 201 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

const GetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const params = {
        TableName: 'YourDynamoDBTable',
      };
      
      const command = new ScanCommand(params);
      const data = await dynamoDb.send(command);
      
      res.status(200).json({ posts: data.Items, message: "fetch successful", success: true, status: 200 });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "GET":
            return GetHandler(req, res)
        case "POST":
            return PostHandler(req, res)
        default:
            res.status(400).json({message: "Check your request method", success: false, status: 400});
    }
}

export default handler
