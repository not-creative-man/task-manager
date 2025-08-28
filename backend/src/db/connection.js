import mysql from 'mysql2/promise';
import dbOptions from '../config/db_options.js';

// Create a shared connection pool instead of a single connection with top-level await.
// This avoids blocking app startup and provides better concurrency.
const pool = mysql.createPool({
  ...dbOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;