import type TasksInterface from '@/interfaces/TasksInterface.ts'

const API_URL = "http://localhost:3000";

class TodoServices{
  async getTasks(userId: string|string[]) {
    const response = await fetch(API_URL + "/api/todo/getUserTasks?userId=" + userId, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json' // Этот заголовок важен
      },
    })
    return await response.json();
  }

  async changeTaskDone(taskId: number | undefined, value: boolean){
    const task = {
      id: taskId,
      is_task_done: value,
    }
    const response = await fetch(API_URL + "/api/todo/changeTaskDone", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // Этот заголовок важен
      },
      body: JSON.stringify(task)
    })
    return await response.json();
  }

  async getTaskData(taskId: number){
    const response = await fetch(API_URL + "/api/todo/getTaskData?taskId=" + taskId.toString(), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json' // Этот заголовок важен
      },
    })
    return await response.json();
  }

  async createTask(taskData: TasksInterface){
    const response = await fetch(API_URL + "/api/todo/createTask", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json' // Этот заголовок важен
      },
      body: JSON.stringify(taskData)
    })
    return await response.json();
  }

  async deleteTask(taskId: number){
    const response = await fetch(API_URL + "/api/todo/deleteTask", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // Этот заголовок важен
      },
      body: JSON.stringify({task_id: taskId})
    })
    return await response.json()
  }

  async updateTask(taskData: TasksInterface){
    const response = await fetch(API_URL + "/api/todo/updateTask", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // Этот заголовок важен
      },
      body: JSON.stringify(taskData)
    })
    return await response.json()
  }
}

export default new TodoServices();