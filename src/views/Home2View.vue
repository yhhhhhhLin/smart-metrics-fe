<template>
  <container>
    <template #content>
      <div class="home-view">
        这是内容
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
