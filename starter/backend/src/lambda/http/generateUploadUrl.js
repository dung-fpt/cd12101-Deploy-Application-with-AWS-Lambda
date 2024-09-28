import { getUserId } from '../utils.mjs'
import { v4 as uuidv4 } from "uuid"
import { createLogger } from '../../utils/logger.mjs'
import { updateImage, getPreSignedUrl  } from "../../businessLogic/TodoBusinessLogic.js"

const logger = createLogger('generateUpload');
export async function handler(event) {
  const todoId = event.pathParameters.todoId

  const userId = getUserId(event)

  const attachmentUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${todoId}`;

  await updateImage(todoId, userId, attachmentUrl)
  const uploadUrl = await getPreSignedUrl(todoId)
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

