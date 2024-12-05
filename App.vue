<template>
  <div class="app">
    <h1>中国农历日历</h1>
    <Calendar 
      @select="onSelect"
      @change="onChange"
      @init="onInit"
    />
  </div>
</template>

<script setup lang="ts">
import Calendar from './components/Calendar.vue'

const onSelect = (date: any) => {
  console.log('选中日期:', date)
}

const onChange = (date: any) => {
  console.log('月份切换:', date)
}

const onInit = (date: any) => {
  console.log('日历初始化:', date)
}
</script> 