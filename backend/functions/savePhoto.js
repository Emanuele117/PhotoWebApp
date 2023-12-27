const AWS = require("aws-sdk");
const parser = require("lambda-multipart-parser");
const {v4: uuidv4} = require('uuid');

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynamodb = new AWS.DynamoDB.DocumentClient();


async function saveFile(file) {
  console.log({file})
  const BucketName = process.env.BUCKET_NAME;
  console.log(BucketName);
  const savedFile = await s3
    .putObject({
        Bucket: BucketName,
        Key: file.filename,
        Body: file.content,
    })
    .promise();
  const { Labels } = await rekognition
      .detectLabels({
        Image: {
          Bytes: file.content,
        },
      })
      .promise();
  const primary_key = uuidv4();
  const labels = Labels.map(label => label.Name);
  await dynamodb.put({
    TableName: process.env.PHOTOS_TABLE,
    Item: {
      primary_key,
      name: file.filename,
      labels,
    }
  }).promise();

  return {
    primary_key,
    savedFile: `https://${BucketName}.s3.amazonaws.com/${file.filename}`, 
    labels,
  };
}

module.exports.savePhoto = async (event) => {
  const { files } = await parser.parse(event);
  const filesData = files.map(saveFile);
  const results = await Promise.all(filesData);

  return{
    statusCode: 200,
    body: JSON.stringify({
      results,
    })
  }
};
