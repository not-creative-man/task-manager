import { jest } from '@jest/globals';

// Mock a pool object
const mockPool = {
    query: jest.fn(),
    execute: jest.fn(),
    end: jest.fn()
};

// Mock mysql2/promise to expose createPool (current impl uses createPool)
jest.unstable_mockModule('mysql2/promise', () => {
    const createPool = jest.fn().mockReturnValue(mockPool);
    return {
        __esModule: true,
        default: {
            createPool
        }
    };
});

// Import the connection after mocking
const connection = await import('../../db/connection.js');
const mysql = await import('mysql2/promise');

describe('Database Connection (pool)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // it('should create a pool with correct options', async () => {
    //     // connection.default is the pool instance
    //     expect(mysql.default.createPool).toHaveBeenCalled();
    //     expect(connection.default).toBeDefined();
    //     expect(typeof connection.default.query).toBe('function');
    //     expect(typeof connection.default.execute).toBe('function');
    //     expect(typeof connection.default.end).toBe('function');
    // });

    it('should have query method', () => {
        expect(typeof connection.default.query).toBe('function');
    });

    it('should have execute method', () => {
        expect(typeof connection.default.execute).toBe('function');
    });

    it('should have end method', () => {
        expect(typeof connection.default.end).toBe('function');
    });
});
