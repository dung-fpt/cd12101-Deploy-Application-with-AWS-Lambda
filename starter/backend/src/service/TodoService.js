import { TodoRepository } from "../repository/TodoRepository.js"
import { v4 as uuidv4 } from "uuid"
import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk'

const repository = new TodoRepository();

export async function getTodos(userId) {
    return await repository.getTodos(userId)
}

export async function createTodo(userId, createdTodo) {
    const todoId = uuidv4()
    const createdAt = new Date().toISOString()
    const newTodo = {
      userId,
      todoId,
      createdAt,
      done: false,
      ...createdTodo
    }

    await repository.createTodo(newTodo)
    return newTodo
}

export async function updateTodo(userId, todoId, updatedTodo) {
    const item = {
        userId: userId,
        todoId: todoId,
        ...updatedTodo
    }

    await repository.updateTodo(userId, todoId, item)
    return item
}

export async function deleteTodo(userId, todoId) {
    const item = {
        userId: userId,
        todoId: todoId
    }

    await repository.deleteTodo(todoId, userId)
    return item
}

export async function getPreSignedUrl(todoId) {

    const XAWS = AWSXRay.captureAWS(AWS);
    const s3 = new XAWS.S3({
       signatureVersion: 'v4'
    });

    return s3.getSignedUrl('putObject', {
       Bucket: process.env.S3_BUCKET,
       Key: todoId,
       Expires: 250
    });
}

export async function updateImage(todoId, userId, imageUrl) {

    await repository.updateImage(todoId, userId, imageUrl)
}