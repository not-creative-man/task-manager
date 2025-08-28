import { jest } from '@jest/globals';

export const mockUserService = {
  registerUser: jest.fn().mockImplementation(async () => {
    return { userId: 1 };
  }),

  loginUser: jest.fn().mockImplementation(async () => {
    return 1;
  }),

  getAllUsers: jest.fn().mockResolvedValue([
    { id: 1, email: 'user1@example.com' },
    { id: 2, email: 'user2@example.com' }
  ])
};