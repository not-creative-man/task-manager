<script setup lang="ts">
defineProps<{
  header: string;
  text: string;
  dataList: {type: string, label: string, value: string}[];
  buttonText: string;
  handleSubmit: (event: Event) => void;
}>()
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="regForm">
      <h1>{{header}}</h1>
      <span>{{text}}</span>
      <div v-for="item in dataList" class="formInput" :key="item.label">
        <label :for="item.value">{{item.label}}: </label>
        <input :id="item.value" :type="item.type" :placeholder="item.value" v-model="item.value" value=""/>
      </div>
      <button class="beautiful">{{buttonText}}</button>
    </div>
  </form>
</template>

<style scoped>
.regForm{
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

.formInput{
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.formInput input{
  width: 200px;
  height: 30px;
}
</style>