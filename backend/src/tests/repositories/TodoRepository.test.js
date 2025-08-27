import { jest } from '@jest/globals';
import { mockDb } from '../mocks/db.js';

// Mock DB connection
jest.unstable_mockModule('../../db/connection.js', () => ({
  default: mockDb,
}));

// Import repository after mocking
const TodoRepository = (await import('../../repositories/TodoRepository.js')).default;

describe('TodoRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllTasksByUser', () => {
    it('queries tasks by user id', async () => {
      const userId = 1;
      const rows = [{ id: 1 }];
      mockDb.query.mockResolvedValueOnce([rows]);

      const result = await TodoRepository.findAllTasksByUser(userId);

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM tasks WHERE user_id=?', [userId]);
      expect(result).toEqual(rows);
    });
  });

  describe('changeTaskDone', () => {
    it('updates is_task_done by task id', async () => {
      const payload = { id: 10, is_task_done: true };
      const rows = { affectedRows: 1 };
      mockDb.query.mockResolvedValueOnce([rows]);

      const result = await TodoRepository.changeTaskDone(payload);

      expect(mockDb.query).toHaveBeenCalledWith('UPDATE tasks SET is_task_done = ? WHERE task_id = ?', [payload.is_task_done, payload.id]);
      expect(result).toEqual(rows);
    });
  });

  describe('getTaskData', () => {
    it('selects by task id', async () => {
      const rows = [{ id: 5 }];
      mockDb.query.mockResolvedValueOnce([rows]);

      const result = await TodoRepository.getTaskData(5);

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM tasks WHERE task_id = ?', [5]);
      expect(result).toEqual(rows);
    });
  });

  describe('createTask', () => {
    it('inserts task', async () => {
      const task = { user_id: 1, task_body: 't', is_task_done: false, task_deadline: null };
      const rows = { insertId: 100 };
      mockDb.query.mockResolvedValueOnce([rows]);

      const result = await TodoRepository.createTask(task);

      expect(mockDb.query).toHaveBeenCalledWith('INSERT INTO tasks VALUES (?, ?, ?, ?, ?)', [null, task.user_id, task.task_body, task.is_task_done, task.task_deadline]);
      expect(result).toEqual(rows);
    });
  });

  describe('updateTask', () => {
    it('updates task fields', async () => {
      const task = { task_id: 100, task_body: 'u', is_task_done: true, task_deadline: null };
      const rows = { affectedRows: 1 };
      mockDb.query.mockResolvedValueOnce([rows]);

      const result = await TodoRepository.updateTask(task);

      expect(mockDb.query).toHaveBeenCalledWith('UPDATE tasks SET task_body = ?, is_task_done = ?, task_deadline = ? WHERE task_id = ?', [task.task_body, task.is_task_done, task.task_deadline, task.task_id]);
      expect(result).toEqual(rows);
    });
  });

  describe('deleteTask', () => {
    it('deletes by task id', async () => {
      const payload = { task_id: 100 };
      const rows = { affectedRows: 1 };
      mockDb.query.mockResolvedValueOnce([rows]);

      const result = await TodoRepository.deleteTask(payload);

      expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM tasks WHERE task_id = ?', [payload.task_id]);
      expect(result).toEqual(rows);
    });
  });
});
