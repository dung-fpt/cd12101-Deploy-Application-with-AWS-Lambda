import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import { getTodos } from "../../businessLogic/TodoBusinessLogic.js"

const logger = createLogger('getTodos');

export async function handler(event) {
  const userId = getUserId(event)
  const result = await getTodos(userId)

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
