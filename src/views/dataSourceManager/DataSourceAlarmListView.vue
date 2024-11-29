<template>
  <container :top-menu-type="3" :top-menu-selected="'/datasource/alarm-list'">
    <template #content>
      <div class="alarm-page">
        <div class="alarm-page-content">
          这是告警详细内容
        </div>

      </div>
    </template>
  </container>

</template>

<script setup lang="ts">

import container from "../../components/Container.vue";



</script>

<style scoped>
.alarm-page {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
}

.alarm-page-content{
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

</style>