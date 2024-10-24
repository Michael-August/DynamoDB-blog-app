const {DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb')
const { CreateTableCommand, KeyType, ScalarAttributeType, DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const dynamoDb = DynamoDBDocumentClient.from(client);

async function createTable() {
  const params = {
    TableName: 'Blog',
    KeySchema: [
      { AttributeName: 'id', KeyType: KeyType.HASH }, // Partition key (Primary Key)
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: ScalarAttributeType.S }, // id is of type String (UUID)
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    const command = new CreateTableCommand(params);
    const data = await dynamoDb.send(command);
    console.log('Table created successfully:', data);
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

createTable();