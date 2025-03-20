<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'" :left-menu-selected="'/project/index-management/index-develop'" :sidebarType = "1">
    <template #content>
      <div class="index-manager-container">
        <div class="index-manager-directory">
          这里是指标目录
        </div>
        <div class="index-manager-content">
          这里是指标中心
        </div>
      </div>
    </template>

  </container>
</template>

<script setup lang="ts">

import Container from "../../components/Container.vue";
</script>

<style>

.index-manager-container{
  background-color: #f1f6fb;
  display: flex;
  flex-grow: 1;
  border-radius: 5px;
  height: calc(100vh - 120px);
}

.index-manager-directory {
  background-color: #FFFFFF;
  width: 250px;
  height: 100%;
  border-radius: 5px;
  padding: 20px;
}

.index-manager-content {
  background-color: #FFFFFF;
  flex-grow: 1;
  margin-left: 10px;
  border-radius: 5px;
  padding: 20px;
}
</style>
