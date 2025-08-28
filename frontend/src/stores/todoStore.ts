import { defineStore } from 'pinia'
import type TasksInterface from '@/interfaces/TasksInterface.ts'

export const useTaskData = defineStore('taskData', {
  state: () => {
    return {
      taskId: <number | undefined>undefined,
      userId: <number | undefined>undefined,
      taskBody: null as string | null,
      isTaskDone: false,
      taskDeadline: null as Date | string | null
    }
  },

  actions: {
    setTaskData(task: TasksInterface) {
      this.taskId = task.task_id
      this.userId = task.user_id
      this.taskBody = task.task_body
      this.isTaskDone = task.is_task_done
      this.taskDeadline = task.task_deadline
    },

    getTaskData(): TasksInterface | null {
      return {
        task_id: this.taskId,
        user_id: this.userId,
        task_body: this.taskBody,
        is_task_done: this.isTaskDone,
        task_deadline: this.taskDeadline
      }
    }
  }
})