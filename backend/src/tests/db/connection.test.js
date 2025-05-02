import { jest } from '@jest/globals';

// Mock mysql2
const mockConnection = {
    query: jest.fn(),
    execute: jest.fn(),
    end: jest.fn()
};

// Mock mysql2/promise
jest.unstable_mockModule('mysql2/promise', () => {
    const createConnection = jest.fn().mockResolvedValue(mockConnection);
    return {
        __esModule: true,
        default: {
            createConnection
        }
    };
});

// Import the connection after mocking
const connection = await import('../../db/connection.js');
const mysql = await import('mysql2/promise');

describe('Database Connection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // TODO: Fix this test
    /*
    it('should create a connection with correct options', async () => {
        // Wait for the connection to be established
        await connection.default;
        
        expect(mysql.default.createConnection).toHaveBeenCalledWith({
            host: 'mysql',
            port: 3306,
            user: 'root',
            password: 'password',
            database: 'my_db'
        });
        expect(connection.default).toBeDefined();
    });
    */

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
