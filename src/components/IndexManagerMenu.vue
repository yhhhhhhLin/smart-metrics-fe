<template>
  <!--指标管理页面菜单栏-->
<!--  顶部菜单栏-->
  <project-manager-top-menu></project-manager-top-menu>
<!--  左侧菜单栏-->
  <a-menu mode="horizontal" :default-selected-keys="[props.default]">
    <div v-for="route in routes" :key="route.path">
      <a-menu-item :key=getFullPath(route.path)>{{ route.name }}</a-menu-item>
    </div>
  </a-menu>


</template>
<script setup lang="ts">
import ProjectManagerTopMenu from "./menu/ProjectManagerTopMenu.vue";
import {routes} from "../router";
</script>