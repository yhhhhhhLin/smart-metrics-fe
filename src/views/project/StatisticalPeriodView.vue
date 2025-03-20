<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'" :sidebarType = "1">
    <template #content>
      <div class="statistical-period-container">
        这是统计周期页面
      </div>
    </template>

  </container>
</template>

<script setup lang="ts">

import Container from "../../components/Container.vue";
</script>

<style>
.statistical-period-container{
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
