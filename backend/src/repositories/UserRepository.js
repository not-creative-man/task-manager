import db from '../db/connection.js';
import crypto from 'crypto';

class UserRepository {
  async findByEmail(email) {
    console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.findByEmail [IN] - ${ email }`);
    const [rows] = await db.query('SELECT * FROM users WHERE email=?', email);
    console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.findByEmail [OUT] - ${ JSON.stringify(rows) }`);
    return rows[0];
  }

  async findByUsername(nickname) {
    const [rows] = await db.query('SELECT * FROM users WHERE nickname=?', [nickname]);
    return rows[0];
  }

  async createUser(user) {
    console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.createUser [IN] - ${ JSON.stringify(user) }`);
    const [result] = await db.query('INSERT INTO users (id, email, nickname, password, active) VALUES (?,?,?,?,?);', [null, user.email, user.nickname, user.password, new Date()]);
    console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.createUser [OUT] - ${ JSON.stringify(result) }`);
    return result.insertId;
  }

  async loginUser(user) {
    console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.loginUser [IN] - ${ JSON.stringify(user) }`);
    const [result] = await db.query('SELECT id FROM users WHERE email=? AND password=?;', [user.email, user.password]);
    console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.loginUser [OUT] - ${ JSON.stringify(result) }`);
    return result[0];
  }

  // async findToken(id){
  //   console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.findToken [IN] - ${ id }`);
  //   const [rows] = await db.query('SELECT * FROM users WHERE id=?', [id]);
  //   console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.findToken [OUT] - ${ JSON.stringify(rows) }`);
  //   return rows[0].token;
  // }

  async getAllUsers() {
    console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.getAllUsers [IN] -`);
    const [rows] = await db.query('SELECT * FROM users');
    console.log(`[${(new Date()).toISOString()}] - ASYNC UserRepository.getAllUsers [OUT] - ${ JSON.stringify(rows) }`);
    return rows;
  }
}

export default new UserRepository();