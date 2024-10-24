import { uploadImage } from "@/lib/cloudinary";
import { dynamoDb } from "@/lib/dynamo";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";

const GetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { articleId } = req.query;

    try {
        const params = {
            TableName: 'Blog',
            Key: { id: articleId },
        };

        const command = new GetCommand(params);
        const data = await dynamoDb.send(command);

        if (!data.Item) {
            return res.status(404).json({ message: 'Article not found', success: false, status: 404 });
        }

        res.status(200).json({article: data.Item, message: "fetch successful", success: true, status: 200});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const UpdateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { articleId } = req.query;

    const { title, content, image } = req.body;

    try {

        let imageUrl;
        if (image) {
            const uploadedImage = await uploadImage(image);
            imageUrl = uploadedImage.secure_url;
        }

        const params = {
            TableName: 'Blog',
            Key: { id: articleId },
            UpdateExpression: 'set #title = :title, content = :content, imageUrl = if_not_exists(imageUrl, :imageUrl)',
            // ExpressionAttributeNames: { '#title': 'title' },
            ExpressionAttributeValues: {
                ':title': title,
                ':content': content,
                ':imageUrl': imageUrl || '',
            },
            ReturnValues: ReturnValue.ALL_NEW,
        };

        const command = new UpdateCommand(params);
        const data = await dynamoDb.send(command);

        res.status(200).json({ updatedArticle: data.Attributes, message: "Update successful", success: true, status: 200 });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
}

const DeleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { articleId } = req.query;

    try {
      const params = {
        TableName: 'Blog',
        Key: { id: articleId },
      };

      const command = new DeleteCommand(params);
      await dynamoDb.send(command);

      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "GET":
            return GetHandler(req, res)
        case "PUT":
            return UpdateHandler(req, res)
        case "DELETE":
            return DeleteHandler(req, res)
        default:
            res.status(400).json({message: "Check your request method", success: false, status: 400});
    }
}

export default handler
