import { createLogger } from '../../utils/logger.mjs'
import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk'
import { getUserId } from '../utils.mjs'
import { v4 as uuidv4 } from "uuid"

const XAWS = AWSXRay.captureAWS(AWS);


const dynamoDB = new XAWS.DynamoDB.DocumentClient();

const logger = createLogger('createTodo')
export async function handler(event) {
  const body = JSON.parse(event.body)

  const userId = getUserId(event)

  const todoId = uuidv4()
    const createdAt = new Date().toISOString()
    const newTodo = {
      userId,
      todoId,
      createdAt,
      done: false,
      ...body
    }

  const result = await dynamoDB.put({
        TableName: process.env.TODOS_TABLE,
        Item: newTodo,
      }).promise();
  logger.info(`Todo item ${newTodo.name} added successfully`);

  return {
      statusCode: 201,
      headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
      body: JSON.stringify({
        item: newTodo
      })
    }
}

