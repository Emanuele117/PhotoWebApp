const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();


module.exports.getPhotos = async (event) => {
    const results = await dynamodb
        .scan({
            TableName: process.env.PHOTOS_TABLE,
            limit: 50,
        }).promise();
  
    return{
      statusCode: 200,
      body: JSON.stringify({
        results,
      })
    }
};