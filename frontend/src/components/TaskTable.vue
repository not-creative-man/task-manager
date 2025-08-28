<script setup lang="ts">
import type TasksInterface from '@/interfaces/TasksInterface.ts'
import editIcon from '@/assets/edit.png'
import deleteIcon from '@/assets/delete.png'
import TaskButton from '@/components/TaskButton.vue'
import TodoServices from '@/services/TodoServices.ts'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const tasksProps = defineProps(['userId'])
const tasks = ref<TasksInterface[] | undefined>(undefined)

onMounted(onAfterMount)

async function onAfterMount() {
  const response = await TodoServices.getTasks(tasksProps.userId)
  if (response.error) {
    alert(response.error)
  } else {
    tasks.value = response
  }
}

async function changeTaskDone(id: number | undefined): Promise<void> {
  const task = tasks.value?.find((e) => {
    return e.task_id === id
  })
  if (!task) return

  const status = !task.is_task_done
  const response = await TodoServices.changeTaskDone(id, status)
  if (response.error) {
    alert(response.error)
  }
  task.is_task_done = status
  await onAfterMount()
}

async function deleteTask(id: number | undefined): Promise<void> {
  if (id === undefined) {
    return
  }
  const response = await TodoServices.deleteTask(id)
  if (response.error) {
    alert(response.error)
  }
  await onAfterMount()
}
</script>

<template>
  <div class="table-container">
    <div class="task-header">
      <div class="done">Is done?</div>
      <div class="id">Task ID</div>
      <div class="body">Task body</div>
      <div class="deadline">Deadline</div>
      <div class="buttons">
        <TaskButton msg="Add new task" />
      </div>
    </div>
    <div v-if="tasks && tasks.length > 0" v-for="task in tasks" class="task-row" :key="task.task_id">
      <div class="done">
        <input type="checkbox" name="done" :id="'task-' + task.task_id?.toString()" :checked=task.is_task_done
               @click="changeTaskDone(task.task_id)" />
      </div>
      <div class="id">{{ task.task_id }}</div>
      <div class="body">{{ task.task_body }}</div>
      <div class="deadline">{{ task.task_deadline ? new Date(task.task_deadline).toLocaleDateString() : '' }}</div>
      <div class="buttons">
        <RouterLink :to='{name: "Task Page", params:{
          action: "update",
          task_id: task.task_id
        }}' style="display: flex; justify-content: center;">
          <img :src="editIcon" alt="Edit task" />
        </RouterLink>
        <img :src="deleteIcon" alt="Delete task" @click="deleteTask(task.task_id)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  display: grid;
  justify-items: center;
}

.task-header {
  display: grid;
  width: 600px;
  grid-template-columns: 70px 70px auto 100px 150px;
  background-color: white;
  color: black;
}

.task-header > div {
  text-align: center;
  height: 50px;
  width: auto;
  outline: black solid 1px;
}

.task-header > .buttons {
  width: 100%;
}

.task-row {
  display: grid;
  width: 600px;
  grid-template-columns: 70px 70px auto 100px 150px;
  background-color: white;
  color: black;
}

.task-row > div {
  text-align: center;
  height: 50px;
  width: 100%;
  outline: black solid 1px;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  height: 30px;
}
</style>