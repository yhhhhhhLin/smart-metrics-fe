<template>
  <left-menu-container>
    <template #content>
      <div class="home-view">
        这是内容
      </div>

    </template>

  </left-menu-container>
</template>

<script setup lang="ts">

import LeftMenuContainer from "../components/LeftMenuContainer.vue";
</script>

<style scoped>

.home-view {
  background-color: #FFFFFF;
  height: 1000px;
  border-radius: 5px;
}

</style>