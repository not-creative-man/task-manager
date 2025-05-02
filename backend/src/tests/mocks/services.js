import { jest } from '@jest/globals';

export const mockUserService = {
    registerUser: jest.fn().mockImplementation(async (email, password) => {
        if (email === 'existing@example.com') {
            throw new Error('User already exists');
        }
        return { userId: 1 };
    }),

    loginUser: jest.fn().mockImplementation(async (email, password) => {
        if (email === 'nonexistent@example.com') {
            throw new Error('Invalid credentials');
        }
        return 1;
    }),

    getAllUsers: jest.fn().mockResolvedValue([
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' }
    ])
}; 