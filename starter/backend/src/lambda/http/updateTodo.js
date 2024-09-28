import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk'

const logger = createLogger('updateTodo');
const XAWS = AWSXRay.captureAWS(AWS);
const dynamoDB = new XAWS.DynamoDB.DocumentClient();
export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  const userId = getUserId(event)

   const item = {
          userId: userId,
          todoId: todoId,
          ...updatedTodo
      }

    await dynamoDB.update({
                TableName: process.env.TODOS_TABLE,
                Key: {
                    todoId,
                    userId
                },
                UpdateExpression: 'set #name = :name, createdAt = :createdAt, done = :done',
                ExpressionAttributeValues: {
                    ':name': updatedTodo.name,
                    ':createdAt': updatedTodo.dueDate,
                    ':done': updatedTodo.done
                },
                ExpressionAttributeNames: {
                    '#name': 'name'
                }
            }).promise();

  return {
      statusCode: 200,
      headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                  },
      body: JSON.stringify({})
    }
}
