import { createLogger } from "../../utils/logger.mjs"
import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk'
import { getUserId } from '../utils.mjs'


const logger = createLogger('deleteTodo');

const XAWS = AWSXRay.captureAWS(AWS);
const dynamoDB = new XAWS.DynamoDB.DocumentClient();

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

   logger.info(`Deleting todo ${todoId} for user ${userId}`)
      const item = {
          userId: userId,
          todoId: todoId
      }

   await dynamoDB.delete({
               TableName: process.env.TODOS_TABLE,
               Key: {
                   todoId,
                   userId
               }
           }).promise();

  return {
          statusCode: 200,
          headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
          body: JSON.stringify({
            data: item
          })
        }
}

