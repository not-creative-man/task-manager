import { jest } from '@jest/globals';
import { mockTodoRepository } from '../mocks/TodoRepository.js';

// Mock the TodoRepository
jest.unstable_mockModule('../../repositories/TodoRepository.js', () => ({
  default: mockTodoRepository
}));

// Import the service after mocking
const TodoService = (await import('../../services/TodoService.js')).default;

describe('TodoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllTasksByUser', () => {
    it('returns tasks from repository', async () => {
      mockTodoRepository.findAllTasksByUser.mockResolvedValueOnce([{ id: 1 }]);
      const result = await TodoService.findAllTasksByUser(1);
      expect(mockTodoRepository.findAllTasksByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual([{ id: 1 }]);
    });

    it('rethrows repository error', async () => {
      mockTodoRepository.findAllTasksByUser.mockRejectedValueOnce(new Error('DB error'));
      await expect(TodoService.findAllTasksByUser(1)).rejects.toThrow('DB error');
    });
  });

  describe('changeTaskDone', () => {
    it('updates and returns result', async () => {
      const payload = { id: 10, is_task_done: true };
      mockTodoRepository.changeTaskDone.mockResolvedValueOnce({ affectedRows: 1 });
      const result = await TodoService.changeTaskDone(payload);
      expect(mockTodoRepository.changeTaskDone).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ affectedRows: 1 });
    });

    it('rethrows repository error', async () => {
      mockTodoRepository.changeTaskDone.mockRejectedValueOnce(new Error('Update failed'));
      await expect(TodoService.changeTaskDone({})).rejects.toThrow('Update failed');
    });
  });

  describe('getTaskData', () => {
    it('returns task data', async () => {
      mockTodoRepository.getTaskData.mockResolvedValueOnce({ id: 5 });
      const result = await TodoService.getTaskData(5);
      expect(mockTodoRepository.getTaskData).toHaveBeenCalledWith(5);
      expect(result).toEqual({ id: 5 });
    });

    it('rethrows repository error', async () => {
      mockTodoRepository.getTaskData.mockRejectedValueOnce(new Error('Not found'));
      await expect(TodoService.getTaskData(5)).rejects.toThrow('Not found');
    });
  });

  describe('createTask', () => {
    it('creates task', async () => {
      const task = { user_id: 1, task_body: 't', is_task_done: false, task_deadline: null };
      mockTodoRepository.createTask.mockResolvedValueOnce({ insertId: 100 });
      const result = await TodoService.createTask(task);
      expect(mockTodoRepository.createTask).toHaveBeenCalledWith(task);
      expect(result).toEqual({ insertId: 100 });
    });

    it('rethrows repository error', async () => {
      mockTodoRepository.createTask.mockRejectedValueOnce(new Error('Create failed'));
      await expect(TodoService.createTask({})).rejects.toThrow('Create failed');
    });
  });

  describe('updateTask', () => {
    it('updates task', async () => {
      const task = { task_id: 100, task_body: 'u', is_task_done: true, task_deadline: null };
      mockTodoRepository.updateTask.mockResolvedValueOnce({ affectedRows: 1 });
      const result = await TodoService.updateTask(task);
      expect(mockTodoRepository.updateTask).toHaveBeenCalledWith(task);
      expect(result).toEqual({ affectedRows: 1 });
    });

    it('rethrows repository error', async () => {
      mockTodoRepository.updateTask.mockRejectedValueOnce(new Error('Update failed'));
      await expect(TodoService.updateTask({})).rejects.toThrow('Update failed');
    });
  });

  describe('deleteTask', () => {
    it('deletes task', async () => {
      const payload = { task_id: 100 };
      mockTodoRepository.deleteTask.mockResolvedValueOnce({ affectedRows: 1 });
      const result = await TodoService.deleteTask(payload);
      expect(mockTodoRepository.deleteTask).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ affectedRows: 1 });
    });

    it('rethrows repository error', async () => {
      mockTodoRepository.deleteTask.mockRejectedValueOnce(new Error('Delete failed'));
      await expect(TodoService.deleteTask({})).rejects.toThrow('Delete failed');
    });
  });
});
