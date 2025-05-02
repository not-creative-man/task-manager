import connection from './dbTestConnection.js';
//import db from '../../db/connection.js'

class Controller{
  async findByUsername(username) {
    const [rows] = await connection.query('SELECT * FROM users WHERE nickname=?', username);
    return rows[0];
  }

  async createUser(user) {
    const result = await connection.query('INSERT INTO users (id, email, nickname, password) VALUES (?,?,?,?);', [null, user.email, user.nickname, user.password]);
    return result.insertId;
  }
}

export default new Controller();