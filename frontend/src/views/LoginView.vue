<script setup lang="ts">
import { ref } from 'vue'
import UserForm from '@/components/UserForm.vue'
import UserServices from '@/services/UserServices.ts'
import { useRouter } from 'vue-router'
import { useUserData } from '@/stores/userStore.ts'

const router = useRouter()
const userStore = useUserData()

const dataList = ref([
  { type: 'email', label: 'Email', value: 'email' },
  { type: 'password', label: 'Password', value: 'password' }
])

async function login(event: Event) {
  event.preventDefault()
  const data = dataList.value

  const response = await UserServices.login(data[0].value, data[1].value)
  if (response.error) {
    alert(response.error)
  } else if (response) {
    userStore.setUserId(response)
    await router.push(`/user`)
  }
}
</script>
<template>
  <UserForm header="Log in" text="Let's go deeper!" :dataList="dataList" button-text="Log into task-manager"
            :handleSubmit="login" />
</template>