import mysql from 'mysql2/promise';
import dbOptions from '../config/db_options.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function connectWithRetry(maxRetries = 5, initialDelay = 1000) {
  let retries = 0;
  let delay = initialDelay;

  while (retries < maxRetries) {
    try {
      console.log(`[${new Date().toISOString()}] Attempting to connect to database (attempt ${retries + 1}/${maxRetries})...`);
      const connection = await mysql.createConnection(dbOptions);
      console.log(`[${new Date().toISOString()}] Successfully connected to database`);
      return connection;
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        console.error(`[${new Date().toISOString()}] Failed to connect to database after ${maxRetries} attempts:`, error);
        throw error;
      }
      console.log(`[${new Date().toISOString()}] Connection failed, retrying in ${delay}ms...`);
      await sleep(delay);
      delay *= 2; // Exponential backoff
    }
  }
}

const connection = await connectWithRetry();

export default connection;