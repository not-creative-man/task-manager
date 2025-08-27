import { jest } from '@jest/globals';
import { mockUserService } from '../mocks/UserService.js';

// Mock UserService
jest.unstable_mockModule('../../services/UserService.js', () => ({
    default: mockUserService
}));

// Import UserController after mocking
const UserController = (await import('../../controllers/UserController.js')).default;

describe('UserController', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
            query: {},
            params: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            await UserController.register(req, res, next);

            expect(mockUserService.registerUser).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ userId: 1 });
        });

        it('should handle registration error', async () => {
            req.body = {
                email: 'existing@example.com',
                password: 'password123'
            };

            mockUserService.registerUser.mockRejectedValueOnce(new Error('User already exists'));

            await UserController.register(req, res, next);

            expect(mockUserService.registerUser).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            req.query = {
                email: 'test@example.com',
                password: 'password123'
            };

            await UserController.login(req, res, next);

            expect(mockUserService.loginUser).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(1);
        });

        it('should handle login error', async () => {
            req.query = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            mockUserService.loginUser.mockRejectedValueOnce(new Error('User not found'));

            await UserController.login(req, res, next);

            expect(mockUserService.loginUser).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            await UserController.getAllUsers(req, res, next);

            expect(mockUserService.getAllUsers).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { id: 1, email: 'user1@example.com' },
                { id: 2, email: 'user2@example.com' }
            ]);
        });

        it('should handle error when getting users', async () => {
            mockUserService.getAllUsers.mockRejectedValueOnce(new Error('Database error'));

            await UserController.getAllUsers(req, res, next);

            expect(mockUserService.getAllUsers).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });
});
