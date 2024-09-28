import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'
import { updateTodo } from "../../service/TodoService.js"

const logger = createLogger('updateTodo');

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  const userId = getUserId(event)
  await updateTodo(userId, todoId, updatedTodo)

  return {
      statusCode: 200,
      headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                  },
      body: JSON.stringify({})
    }
}
