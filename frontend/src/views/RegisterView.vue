<script setup lang="ts">
import { ref } from 'vue'
import UserForm from '@/components/UserForm.vue';
import UserServices from '@/services/UserServices.ts';
import {useRouter} from 'vue-router'
import { useUserData } from '@/stores/userStore.ts'

const router = useRouter();
const userStore = useUserData();

async function register(event: Event) {
  event.preventDefault();
  const data = dataList.value;
  const response = await UserServices.register(data[0].value, data[1].value, data[2].value);
  if (response.error){
    alert(response.error);
  } else if (response.userId){
    userStore.setUserId(response.userId);
    await router.push(`/user`);
  }
}

const dataList = ref([
  {type: "login", label: "Login", value: "login"},
  {type: "password", label: "Password", value: "password"},
  {type: "email", label: "Email", value: "email"},
])
</script>
<template>
  <UserForm header="Register" text="Let's go deeper and register!" :dataList="dataList" button-text="Reg into task-manager" :handleSubmit="register" />
</template>