<script setup lang="ts">
import RouterButton from '@/components/RouterButton.vue'
</script>

<template>
  <div class="welcome">
    <h1>How do you do, fellow kids?</h1>
    <span>Let's start our journey! &#127881;</span>
    <RouterButton msg="Log in" path="/login" />
    <span>Not already logged in? Let's <RouterLink to="/register">register</RouterLink> right now!</span>
  </div>
</template>

<style scoped>
.welcome {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>