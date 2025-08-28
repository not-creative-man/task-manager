import { jest } from '@jest/globals';
import { mockDb } from '../mocks/db.js';

// Mock database connection
jest.unstable_mockModule('../../db/connection.js', () => ({
  default: mockDb
}));

// Import UserRepository after mocking
const UserRepository = (await import('../../repositories/UserRepository.js')).default;

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const mockUser = { id: 1, email };

      mockDb.query.mockResolvedValueOnce([[mockUser]]);

      const result = await UserRepository.findByEmail(email);

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email=?', email);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const email = 'test@example.com';

      mockDb.query.mockResolvedValueOnce([[]]);

      const result = await UserRepository.findByEmail(email);

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email=?', email);
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'testpass'
      };

      mockDb.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const result = await UserRepository.createUser(userData);

      expect(mockDb.query).toHaveBeenCalledWith(
        'INSERT INTO users (id, email, nickname, password, active) VALUES (?,?,?,?,?);',
        [null, userData.email, userData.nickname, userData.password, expect.any(Date)]
      );
      expect(result).toBe(1);
    });
  });

  describe('loginUser', () => {
    it('should find user by email and password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'testpass'
      };

      mockDb.query.mockResolvedValueOnce([[{ id: 1 }]]);

      const result = await UserRepository.loginUser(credentials);

      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT id FROM users WHERE email=? AND password=?;',
        [credentials.email, credentials.password]
      );
      expect(result).toEqual({ id: 1 });
    });

    it('should return undefined if user not found', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'testpass'
      };

      mockDb.query.mockResolvedValueOnce([[]]);

      const result = await UserRepository.loginUser(credentials);

      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT id FROM users WHERE email=? AND password=?;',
        [credentials.email, credentials.password]
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' }
      ];

      mockDb.query.mockResolvedValueOnce([mockUsers]);

      const result = await UserRepository.getAllUsers();

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users');
      expect(result).toEqual(mockUsers);
    });
  });
});
