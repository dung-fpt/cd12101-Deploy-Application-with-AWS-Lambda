import { createLogger } from "../../utils/logger.mjs"
import { getUserId } from '../utils.mjs'
import { deleteTodo  } from "../../businessLogic/TodoBusinessLogic.js"


const logger = createLogger('deleteTodo');
export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const result = await deleteTodo(userId, todoId)

  return {
          statusCode: 200,
          headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
          body: JSON.stringify({
            data: result
          })
        }
}

