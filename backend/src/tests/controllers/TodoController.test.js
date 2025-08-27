import { jest } from '@jest/globals';
import { mockTodoService } from '../mocks/TodoService.js';

// Mock TodoService
jest.unstable_mockModule('../../services/TodoService.js', () => ({
  default: mockTodoService,
}));

// Import TodoController after mocking
const TodoController = (await import('../../controllers/TodoController.js')).default;

describe('TodoController', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('findAllTasksByUser', () => {
    it('should return tasks for a user', async () => {
      req.query = { userId: 1 };
      mockTodoService.findAllTasksByUser.mockResolvedValueOnce([{ id: 1 }]);

      await TodoController.findAllTasksByUser(req, res, next);

      expect(mockTodoService.findAllTasksByUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it('should handle error', async () => {
      req.query = { userId: 1 };
      mockTodoService.findAllTasksByUser.mockRejectedValueOnce(new Error('DB error'));

      await TodoController.findAllTasksByUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('changeTaskDone', () => {
    it('should change done state and return result', async () => {
      req.body = { id: 10, is_task_done: true };
      mockTodoService.changeTaskDone.mockResolvedValueOnce({ affectedRows: 1 });

      await TodoController.changeTaskDone(req, res, next);

      expect(mockTodoService.changeTaskDone).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ affectedRows: 1 });
    });

    it('should handle error', async () => {
      req.body = { id: 10, is_task_done: true };
      mockTodoService.changeTaskDone.mockRejectedValueOnce(new Error('Update failed'));

      await TodoController.changeTaskDone(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });

  describe('getTaskData', () => {
    it('should return task data', async () => {
      req.query = { taskId: 5 };
      mockTodoService.getTaskData.mockResolvedValueOnce({ id: 5 });

      await TodoController.getTaskData(req, res, next);

      expect(mockTodoService.getTaskData).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 5 });
    });

    it('should handle error', async () => {
      req.query = { taskId: 5 };
      mockTodoService.getTaskData.mockRejectedValueOnce(new Error('Not found'));

      await TodoController.getTaskData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('createTask', () => {
    it('should create task and return result', async () => {
      req.body = { user_id: 1, task_body: 't', is_task_done: false, task_deadline: null };
      mockTodoService.createTask.mockResolvedValueOnce({ insertId: 100 });

      await TodoController.createTask(req, res, next);

      expect(mockTodoService.createTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ insertId: 100 });
    });

    it('should handle error', async () => {
      req.body = { user_id: 1 };
      mockTodoService.createTask.mockRejectedValueOnce(new Error('Create failed'));

      await TodoController.createTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Create failed' });
    });
  });

  describe('updateTask', () => {
    it('should update task and return result', async () => {
      req.body = { task_id: 100, task_body: 'u', is_task_done: true, task_deadline: null };
      mockTodoService.updateTask.mockResolvedValueOnce({ affectedRows: 1 });

      await TodoController.updateTask(req, res, next);

      expect(mockTodoService.updateTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ affectedRows: 1 });
    });

    it('should handle error', async () => {
      req.body = { task_id: 100 };
      mockTodoService.updateTask.mockRejectedValueOnce(new Error('Update failed'));

      await TodoController.updateTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });

  describe('deleteTask', () => {
    it('should delete task and return result', async () => {
      req.body = { task_id: 100 };
      mockTodoService.deleteTask.mockResolvedValueOnce({ affectedRows: 1 });

      await TodoController.deleteTask(req, res, next);

      expect(mockTodoService.deleteTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ affectedRows: 1 });
    });

    it('should handle error', async () => {
      req.body = { task_id: 100 };
      mockTodoService.deleteTask.mockRejectedValueOnce(new Error('Delete failed'));

      await TodoController.deleteTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Delete failed' });
    });
  });
});