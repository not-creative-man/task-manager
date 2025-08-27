import { jest } from '@jest/globals';
import { mockUserRepository } from '../mocks/UserRepository.js';

// Mock the UserRepository
jest.unstable_mockModule('../../repositories/UserRepository.js', () => ({
    default: mockUserRepository
}));

// Import the service after mocking
const UserService = (await import('../../services/UserService.js')).default;

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                nickname: 'testuser',
                password: 'testpass'
            };

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.createUser.mockResolvedValue(1);

            const result = await UserService.registerUser(userData);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(mockUserRepository.createUser).toHaveBeenCalledWith(userData);
            expect(result).toEqual({ userId: 1 });
        });

        it('should throw error if user already exists', async () => {
            const userData = {
                email: 'test@example.com',
                nickname: 'testuser',
                password: 'testpass'
            };

            mockUserRepository.findByEmail.mockResolvedValue({ id: 1 });

            await expect(UserService.registerUser(userData)).rejects.toThrow('User already exists');
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(mockUserRepository.createUser).not.toHaveBeenCalled();
        });
    });

    describe('loginUser', () => {
        it('should login user successfully', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'testpass'
            };

            mockUserRepository.loginUser.mockResolvedValue({ id: 1 });

            const result = await UserService.loginUser(loginData);

            expect(mockUserRepository.loginUser).toHaveBeenCalledWith(loginData);
            expect(result).toBe(1);
        });

        it('should throw error if user not found', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'testpass'
            };

            mockUserRepository.loginUser.mockResolvedValue(null);

            await expect(UserService.loginUser(loginData)).rejects.toThrow('User not found');
            expect(mockUserRepository.loginUser).toHaveBeenCalledWith(loginData);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: 1, email: 'user1@example.com' },
                { id: 2, email: 'user2@example.com' }
            ];

            mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);

            const result = await UserService.getAllUsers();

            expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });
    });
});
