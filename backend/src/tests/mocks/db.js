import { jest } from '@jest/globals';

const mockQuery = jest.fn();
const mockConnection = {
    query: mockQuery
};

export const mockDb = {
    query: mockQuery
};

jest.unstable_mockModule('../../db/connection.js', () => ({
    default: mockDb
})); 