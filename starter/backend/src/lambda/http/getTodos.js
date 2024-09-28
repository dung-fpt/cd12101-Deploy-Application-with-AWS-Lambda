import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('getTodos');

const dynamoDB = new XAWS.DynamoDB.DocumentClient();

export async function handler(event) {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)

  if (!userId) {
      logger.info('User not authenticated')
      return false
    }

  const result = await dynamoDB.query({
         TableName: process.env.TODOS_TABLE,
         IndexName: process.env.TODOS_CREATED_AT_INDEX,
         KeyConditionExpression: '#userId = :userId',
         ExpressionAttributeNames: {
           '#userId': 'userId',
         },
         ExpressionAttributeValues: {
           ':userId': userId,
         },
  }).promise();

  logger.info('Todos fetched successfully', result);
  return {
        statusCode: 200,
        headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
        body: JSON.stringify({
          items: result.Items
        })
      }
}
