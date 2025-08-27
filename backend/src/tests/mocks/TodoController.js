import { jest } from '@jest/globals';

export const mockTodoController = {
  findAllTasksByUser: jest.fn().mockImplementation((req, res) => {
    res.status(200).json([]);
  }),
  changeTaskDone: jest.fn().mockImplementation((req, res) => {
    res.status(200).json([]);
  }),
  getTaskData: jest.fn().mockImplementation((req, res) => {
    res.status(200).json([]);
  }),
  createTask: jest.fn().mockImplementation((req, res) => {
    res.status(200).json([]);
  }),
  updateTask: jest.fn().mockImplementation((req, res) => {
    res.status(200).json([]);
  }),
  deleteTask: jest.fn().mockImplementation((req, res) => {
    res.status(200).json([]);
  })
}