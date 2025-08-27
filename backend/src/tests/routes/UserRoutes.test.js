import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { mockUserController } from '../mocks/UserController.js';

// Mock the UserController
jest.unstable_mockModule('../../controllers/UserController.js', () => ({
    default: mockUserController
}));

// Import the router after mocking
const UserRoutes = (await import('../../routes/UserRoutes.js')).default;

const app = express();
app.use(express.json());
app.use('/api/user', UserRoutes);

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/user/register', () => {
        it('should register a new user', async () => {
            const userData = {
                username: 'testuser',
                password: 'testpass',
                email: 'test@example.com'
            };

            await request(app)
                .post('/api/user/register')
                .send(userData)
                .expect(201);

            expect(mockUserController.register).toHaveBeenCalled();
        });
    });

    describe('GET /api/user/login', () => {
        it('should login a user', async () => {
            const loginData = {
                username: 'testuser',
                password: 'testpass'
            };

            await request(app)
                .get('/api/user/login')
                .query(loginData)
                .expect(200);

            expect(mockUserController.login).toHaveBeenCalled();
        });
    });

    describe('GET /api/user/getAllUsers', () => {
        it('should get all users', async () => {
            await request(app)
                .get('/api/user/getAllUsers')
                .expect(200);

            expect(mockUserController.getAllUsers).toHaveBeenCalled();
        });
    });
});
