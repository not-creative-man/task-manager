import { jest } from '@jest/globals';

const mockConnection = {
    query: jest.fn(),
    execute: jest.fn(),
    end: jest.fn(),
};

const mockPool = {
    getConnection: jest.fn().mockResolvedValue(mockConnection),
    query: jest.fn(),
    execute: jest.fn(),
    end: jest.fn(),
};

jest.unstable_mockModule('mysql2/promise', () => ({
    createConnection: jest.fn().mockResolvedValue(mockConnection),
    createPool: jest.fn().mockReturnValue(mockPool),
})); 