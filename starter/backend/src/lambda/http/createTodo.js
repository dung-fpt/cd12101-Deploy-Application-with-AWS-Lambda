import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import { createTodo } from "../../businessLogic/TodoBusinessLogic.js"


const logger = createLogger('createTodo')
export async function handler(event) {
  const body = JSON.parse(event.body)
  const userId = getUserId(event)
  const result = await createTodo(userId, body)

  logger.info(`${result.name} created successfully`);

  return {
      statusCode: 201,
      headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
      body: JSON.stringify({
        item: result
      })
    }
}

