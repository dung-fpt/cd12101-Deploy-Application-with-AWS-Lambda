import { getUserId } from '../utils.mjs'
import { v4 as uuidv4 } from "uuid"
import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../../utils/logger.mjs'

const XAWS = AWSXRay.captureAWS(AWS);
const dynamoDB = new XAWS.DynamoDB.DocumentClient();

const logger = createLogger('generateUpload');
export async function handler(event) {
  const todoId = event.pathParameters.todoId

  const userId = getUserId(event)
  const attachmentId = uuidv4()

  const s3Client = new XAWS.S3({ signatureVersion: 'v4' });
  const bucketName = process.env.S3_BUCKET;

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${attachmentId}`;

  await dynamoDB.update({
        TableName: process.env.TODOS_TABLE,
        Key: { todoId, userId },
        UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
        ExpressionAttributeNames: {
          '#attachmentUrl': 'attachmentUrl',
        },
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl,
        },
  }).promise();

  const uploadUrl = s3Client.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: attachmentId,
        Expires: 300,
      });
  logger.info(`Generated uploadUrl URL: ${uploadUrl}`);

  return {
          statusCode: 200,
          headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
          body: JSON.stringify({
            uploadUrl
          })
   }
}

