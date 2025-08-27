import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { mockTodoController } from '../mocks/TodoController.js';

// Mock the TodoController
jest.unstable_mockModule('../../controllers/TodoController.js', () => ({
    default: mockTodoController
}));

// Import the router after mocking
const TodoRoutes = (await import('../../routes/TodoRoutes.js')).default;

const app = express();
app.use(express.json());
app.use('/api/todo', TodoRoutes);

describe('Todo Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/todo/getUserTasks', () => {
        it('should get all tasks for a user', async () => {
            const userId = '123';
            await request(app)
                .get('/api/todo/getUserTasks')
                .query({ userId })
                .expect(200);

            expect(mockTodoController.findAllTasksByUser).toHaveBeenCalled();
        });
    });

    describe('POST /api/todo/changeTaskDone', () => {
        it('should change task done status', async () => {
            const taskData = { taskId: '123', done: true };
            await request(app)
                .post('/api/todo/changeTaskDone')
                .send(taskData)
                .expect(200);

            expect(mockTodoController.changeTaskDone).toHaveBeenCalled();
        });
    });

    describe('GET /api/todo/getTaskData', () => {
        it('should get task data', async () => {
            const taskId = '123';
            await request(app)
                .get('/api/todo/getTaskData')
                .query({ taskId })
                .expect(200);

            expect(mockTodoController.getTaskData).toHaveBeenCalled();
        });
    });

    describe('PUT /api/todo/createTask', () => {
        it('should create a new task', async () => {
            const taskData = { title: 'Test Task', userId: '123' };
            await request(app)
                .put('/api/todo/createTask')
                .send(taskData)
                .expect(200);

            expect(mockTodoController.createTask).toHaveBeenCalled();
        });
    });

    describe('POST /api/todo/updateTask', () => {
        it('should update a task', async () => {
            const taskData = { taskId: '123', title: 'Updated Task' };
            await request(app)
                .post('/api/todo/updateTask')
                .send(taskData)
                .expect(200);

            expect(mockTodoController.updateTask).toHaveBeenCalled();
        });
    });

    describe('POST /api/todo/deleteTask', () => {
        it('should delete a task', async () => {
            const taskData = { taskId: '123' };
            await request(app)
                .post('/api/todo/deleteTask')
                .send(taskData)
                .expect(200);

            expect(mockTodoController.deleteTask).toHaveBeenCalled();
        });
    });
}); 