import TodoService from '../services/TodoService.js';

class TodoController {
  async findAllTasksByUser(req, res) {
    try {
      console.log(`[${(new Date()).toISOString()}] - TodoController.findAllTasksByUser - ${JSON.stringify(req.query)}`);
      const tasks = await TodoService.findAllTasksByUser(req.query.userId);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async changeTaskDone(req, res) {
    try {
      console.log(`[${(new Date()).toISOString()}] - TodoController.changeTaskDone - ${JSON.stringify(req.body)}`);
      const task = await TodoService.changeTaskDone(req.body);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTaskData(req, res) {
    try {
      console.log(`[${(new Date()).toISOString()}] - TodoController.getTaskData - ${JSON.stringify(req.query)}`);
      const task = await TodoService.getTaskData(req.query.taskId);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createTask(req, res) {
    try {
      console.log(`[${(new Date()).toISOString()}] - TodoController.createTask - ${JSON.stringify(req.body)}`);
      const task = await TodoService.createTask(req.body);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      console.log(`[${(new Date()).toISOString()}] - TodoController.updateTask - ${JSON.stringify(req.body)}`);
      const task = await TodoService.updateTask(req.body);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      console.log(`[${(new Date()).toISOString()}] - TodoController.deleteTask - ${JSON.stringify(req.body)}`);
      const task = await TodoService.deleteTask(req.body);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new TodoController();