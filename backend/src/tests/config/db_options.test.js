import { jest } from '@jest/globals';

// Mock process.env
const mockEnv = {
    DB_HOST: 'localhost',
    DB_USER: 'root',
    DB_PASSWORD: 'password'
};

jest.replaceProperty(process, 'env', mockEnv);

// Import dbOptions after mocking process.env
const { default: dbOptions } = await import('../../config/db_options.js');

describe('Database Options', () => {
    it('should have required properties', () => {
        expect(dbOptions).toHaveProperty('host');
        expect(dbOptions).toHaveProperty('user');
        expect(dbOptions).toHaveProperty('password');
        expect(dbOptions).toHaveProperty('database');
    });

    it('should have correct types for properties', () => {
        expect(typeof dbOptions.host).toBe('string');
        expect(typeof dbOptions.user).toBe('string');
        expect(typeof dbOptions.password).toBe('string');
        expect(typeof dbOptions.database).toBe('string');
    });

    it('should have non-empty values', () => {
        expect(dbOptions.host).toBe('localhost');
        expect(dbOptions.user).toBe('root');
        expect(dbOptions.password).toBe('password');
        expect(dbOptions.database).toBe('my_db');
    });
});
