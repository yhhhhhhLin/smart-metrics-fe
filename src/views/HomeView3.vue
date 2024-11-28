<template>
  <container :top-menu-type = 2 :top-menu-selected = "'2'">
    <template #content>
      <div class="home-view">
        这是首页
      </div>
    </template>

  </container>
</template>

<script setup lang="ts">

import Container from "../components/Container.vue";
</script>

<style scoped>

.home-view {
  background-color: #FFFFFF;
  height: 1000px;
  border-radius: 5px;
}

</style>