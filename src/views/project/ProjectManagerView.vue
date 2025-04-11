<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/projectManager'">
    <template #content>
      这是项目管理页面
    </template>
  </container>
</template>

<script setup lang="ts">
import {onMounted} from "vue"
import Container from "../../components/Container.vue"

onMounted(() => {
  console.log("当前项目ID：", sessionStorage.getItem("projectId"))
})
</script>

<style scoped>
</style>
