<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  msg: string,
  path: string,
  alt: string,
  route: number,
  action: string,
}>()
</script>

<template>
  <RouterLink :to="{name: path}" style="display: flex; justify-content: center;">
    <img :src="path" :alt="alt" />
  </RouterLink>
</template>

<style scoped>
img {
  height: 30px;
}
</style>