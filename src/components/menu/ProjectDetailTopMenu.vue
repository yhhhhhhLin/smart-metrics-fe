<template>
  <a-menu mode="horizontal" :default-selected-keys="[props.default]" @menu-item-click="clickMenu">
    <div v-for="route in routes" :key="route.path">
      <a-menu-item v-if="!(route.meta && route.meta.hidden)" :key="getFullPath(route.path)">{{ route.name }}</a-menu-item>
    </div>
  </a-menu>
</template>

<script setup lang="ts">

import {reactive} from "vue";
import router, {projectRootPath, projectRoutes} from "../../router";


const routes = reactive(projectRoutes)

const props = defineProps({
  default: {
    type: String,
    default: '0'
  },
  onCollapse: Function
});


const getFullPath = (path: string) => {
  return projectRootPath + '/' + path

}


const clickMenu = (path: string) => {
  // 如果是指标管理页面，直接跳转到对应子路径第一个
  if (path === getFullPath("index-management")) {
    router.push(getFullPath("index-management/index-develop"));
  } else{
    router.push(path);
  }
}

</script>

<style scoped>

.arco-menu-horizontal .arco-menu-item, .arco-menu-horizontal .arco-menu-group-title, .arco-menu-horizontal .arco-menu-pop-header, .arco-menu-horizontal .arco-menu-inline-header {
  padding: 0 20px;
}

.arco-menu-light.arco-menu-horizontal .arco-menu-item.arco-menu-selected, .arco-menu-light.arco-menu-horizontal .arco-menu-group-title.arco-menu-selected, .arco-menu-light.arco-menu-horizontal .arco-menu-pop-header.arco-menu-selected, .arco-menu-light.arco-menu-horizontal .arco-menu-inline-header.arco-menu-selected {
  padding: 0 20px;
}

</style>