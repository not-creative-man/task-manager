import { jest } from '@jest/globals';

export const mockUserRepository = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    loginUser: jest.fn(),
    getAllUsers: jest.fn()
}; 