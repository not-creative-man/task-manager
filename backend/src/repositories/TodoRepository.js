import db from '../db/connection.js';

class TodoRepository{
  async findAllTasksByUser(userId){
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.findAllTasksByUser [IN] - ${ userId }`);
    const [rows] = await db.query('SELECT * FROM tasks WHERE user_id=?', [userId]);
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.findAllTasksByUser [OUT] - ${ JSON.stringify(rows) }`);
    return rows;
  }

  async changeTaskDone(task){
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.changeTaskDone [IN] - ${  JSON.stringify(task) }`);
    const [rows] = await db.query('UPDATE tasks SET is_task_done = ? WHERE task_id = ?', [task.is_task_done, task.id]);
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.changeTaskDone [OUT] - ${ JSON.stringify(rows) }`);
    return rows;
  }

  async getTaskData(taskId){
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.getTaskData [IN] - ${  JSON.stringify(taskId) }`);
    const [rows] = await db.query('SELECT * FROM tasks WHERE task_id = ?', [taskId]);
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.getTaskData [OUT] - ${ JSON.stringify(rows) }`);
    return rows;
  }

  async createTask(task){
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.createTask [IN] - ${  JSON.stringify(task) }`);
    const [rows] = await db.query('INSERT INTO tasks VALUES (?, ?, ?, ?, ?)', [null, task.user_id, task.task_body, task.is_task_done, task.task_deadline]);
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.createTask [OUT] - ${ JSON.stringify(rows) }`);
    return rows;
  }

  async updateTask(task){
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.updateTask [IN] - ${  JSON.stringify(task) }`);
    const [rows] = await db.query('UPDATE tasks SET task_body = ?, is_task_done = ?, task_deadline = ? WHERE task_id = ?', [task.task_body, task.is_task_done, task.task_deadline, task.task_id]);
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.updateTask [OUT] - ${ JSON.stringify(rows) }`);
    return rows;
  }

  async deleteTask(task){
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.deleteTask [IN] - ${  JSON.stringify(task) }`);
    const [rows] = await db.query('DELETE FROM tasks WHERE task_id = ?', [task.task_id]);
    console.log(`[${(new Date()).toISOString()}] - ASYNC TodoRepository.deleteTask [OUT] - ${ JSON.stringify(rows) }`);
    return rows;
  }
}

export default new TodoRepository();