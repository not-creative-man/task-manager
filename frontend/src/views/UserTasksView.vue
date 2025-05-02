<script setup lang="ts">
import { useRoute } from 'vue-router';
import TaskTable from '@/components/TaskTable.vue'
import { useUserData } from '@/stores/userStore.ts'
import { onMounted } from 'vue'

const route = useRoute();
const userStore = useUserData();

onMounted(() => userStore.logOut())
</script>

<template>
  <div>User ID: {{ userStore.getUserId() }}</div>
  <h1>That's your tasks!</h1>
  <TaskTable :userId=userStore.getUserId() />
</template>

<style scoped>

</style>