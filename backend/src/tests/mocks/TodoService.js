import { jest } from '@jest/globals';

export const mockTodoService = {
  findAllTasksByUser: jest.fn(),
  changeTaskDone: jest.fn(),
  getTaskData: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
};
