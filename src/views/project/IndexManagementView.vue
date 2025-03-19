<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'" :sidebarType = "1">
    <template #content>
      <div class="index-manager-container">
        这里是指标中心
      </div>
    </template>

  </container>
  <div>
    这是指标开发页面
  </div>
</template>

<script setup lang="ts">

import Container from "../../components/Container.vue";
</script>

<style>
.index-manager-container{
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
