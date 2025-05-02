import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'my_db',
});

export default connection;