import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS);
const dynamoDB = new XAWS.DynamoDB.DocumentClient();

export class TodoDataLayer {

    async getTodos(userId) {
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

        return result;
    }

    async createTodo(todo) {
        await dynamoDB.put({
            TableName: process.env.TODOS_TABLE,
            Item: todo
        }).promise();

        return todo;
    }

    async updateTodo(userId, todoId, todo) {
        await dynamoDB.update({
            TableName: process.env.TODOS_TABLE,
            Key: {
              todoId,
              userId
            },
            UpdateExpression: 'set #name = :name, createdAt = :createdAt, done = :done',
            ExpressionAttributeValues: {
              ':name': todo.name,
              ':createdAt': todo.dueDate,
              ':done': todo.done
            },
            ExpressionAttributeNames: {
               '#name': 'name'
            }
        }).promise();
    }

    async deleteTodo(todoId, userId) {
        await dynamoDB.delete({
           TableName: process.env.TODOS_TABLE,
           Key: {
             todoId,
             userId
           }
        }).promise();
    }

    async updateImage(todoId, userId, attachmentUrl) {

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
    }
}