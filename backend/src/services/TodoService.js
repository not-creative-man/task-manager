import TodoRepository from '../repositories/TodoRepository.js'

class TodoService {
  async findAllTasksByUser(userId){
    console.log(userId)
    try{
      return await TodoRepository.findAllTasksByUser(userId);
    } catch(error){
      console.error(error);
      throw error;
    }
  }

  async changeTaskDone(task){
    console.log(JSON.stringify(task));
    try{
      return await TodoRepository.changeTaskDone(task);
    } catch(error){
      console.error(error);
      throw error;
    }
  }

  async getTaskData(taskId){
    console.log(JSON.stringify(taskId));
    try{
      return await TodoRepository.getTaskData(taskId);
    } catch(error){
      console.error(error);
      throw error;
    }
  }

  async createTask(task){
    console.log(JSON.stringify(task));
    try{
      return await TodoRepository.createTask(task);
    } catch(error){
      console.error(error);
      throw error;
    }
  }

  async updateTask(task){
    console.log(JSON.stringify(task));
    try{
      return await TodoRepository.updateTask(task);
    } catch(error){
      console.error(error);
      throw error;
    }
  }

  async deleteTask(taskId){
    console.log(JSON.stringify(taskId));
    try{
      return await TodoRepository.deleteTask(taskId);
    } catch(error){
      console.error(error);
      throw error;
    }
  }
}

export default new TodoService();