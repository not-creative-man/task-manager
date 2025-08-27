import { jest } from '@jest/globals';

export const mockUserController = {
    register: jest.fn().mockImplementation((req, res) => {
        res.status(201).json({});
    }),
    login: jest.fn().mockImplementation((req, res) => {
        res.status(200).json({});
    }),
    getAllUsers: jest.fn().mockImplementation((req, res) => {
        res.status(200).json([]);
    })
}; 