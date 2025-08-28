<script setup lang="ts">
import TodoServices from '@/services/TodoServices.ts'
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useUserData } from '@/stores/userStore.ts'

defineProps({
  action: {
    type: String,
    required: true
  },
  task_id: [String, Number]
})
const route = useRoute()
const router = useRouter()
const taskData = ref({
  task_body: '',
  task_deadline: <string | Date>'',
  is_task_done: false,
  user_id: undefined as number | undefined,
  task_id: undefined as number | undefined
})
const backPath = '/user'
const userStore = useUserData()

onMounted(() => {
  userStore.logOut()
  if (route.params.action !== 'create' && route.params.task_id)
    getTaskData(Number(route.params.task_id))
})

async function getTaskData(taskId: number | undefined) {
  if (!taskId) return

  const response = await TodoServices.getTaskData(taskId)
  if (response.error) {
    alert(response.error)
  } else {
    taskData.value = {
      ...response[0],
      task_deadline: formatDateForInput(response[0].task_deadline)
    }
  }
}

function formatDateForInput(date: string | Date): string {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

async function execute(e: Event) {
  e.preventDefault()
  console.log(e)
  console.log(taskData)
  const task = taskData.value
  task.user_id = userStore.userId
  let response
  if (route.params.action === 'create') {
    response = await TodoServices.createTask(task)
  } else {
    task.task_id = Number(route.params.task_id)
    response = await TodoServices.updateTask(task)
  }
  console.log(response)
  if (response.error) {
    alert(response.error)
  }
  await router.push(backPath)
}
</script>

<template>
  <form @submit.prevent="execute">
    <div class="regForm">
      <h1>Task</h1>
      <div class="formInput">
        <label for="task_body">Task</label>
        <input type="text" name="task_body" id="task_body" v-model="taskData.task_body" />
      </div>
      <div class="formInput">
        <label for="task_deadline">Deadline</label>
        <input type="date" name="task_deadline" id="task_deadline" v-model="taskData.task_deadline" />
      </div>
      <div class="formInput">
        <label for="is_task_done">Already done</label>
        <input type="checkbox" name="is_task_done" id="is_task_done" v-model="taskData.is_task_done" />
      </div>
      <button class="beautiful">Execute</button>
      <RouterLink :to="backPath" style="display: flex; justify-content: center; width: 100%">
        <div class="backButton">Back</div>
      </RouterLink>
    </div>
  </form>
</template>

<style scoped>
.regForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  width: 400px;
  height: 400px;
  gap: 20px;
  background-color: rgb(255, 255, 255);
  color: black;
  padding: 40px;

}

.formInput {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.formInput input {
  width: 200px;
  height: 30px;
}

.backButton {
  width: 70%;
  height: 30px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  background: linear-gradient(-45deg, #bf19ed, #bd2fb5, #f286e2, #b235cc);
  animation: beautiful 10s ease infinite;
  background-size: 400% 400%;
}
</style>