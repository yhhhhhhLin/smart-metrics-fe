<template>

  <container :top-menu-type="2" :top-menu-selected="'/project/overview'">
    <template #content>
      <div class="projectOverview">
        这是项目概述
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import Container from "../../components/Container.vue";

onMounted(() => {
  console.log(sessionStorage.getItem("projectId"));
})

</script>

<style scoped>
.projectOverview {
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>