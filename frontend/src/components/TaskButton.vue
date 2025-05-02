<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  msg: string,
  path: string,
  method: string,
}>()
</script>

<template>
  <RouterLink :to='{name: "Task Page", params: {
    action: "create",
    task_id: undefined
  }}' style="display: flex; justify-content: center;"><div class="beautiful">{{msg}}</div></RouterLink>
</template>

<style scoped>
.beautiful{
  width: 110px;
  height: 40px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
  border-radius: 10px;
  background: linear-gradient(-45deg, #bf19ed, #bd2fb5, #f286e2, #b235cc);
  animation: beautiful 10s ease infinite;
  background-size: 400% 400%;
}

@keyframes beautiful {

  0% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>

