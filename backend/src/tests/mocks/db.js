import { jest } from '@jest/globals';

const mockQuery = jest.fn();

export const mockDb = {
  query: mockQuery
};
