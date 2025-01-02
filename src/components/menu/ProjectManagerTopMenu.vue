<template>
  <a-menu mode="horizontal" :default-selected-keys="[props.default]">
    <div v-for="route in routes" :key="route.path">
      <a-menu-item :key=getFullPath(route.path)>{{ route.name }}</a-menu-item>
    </div>
  </a-menu>
</template>

<script setup lang="ts">

import {reactive} from "vue";
import {projectManagerIndexViewRoutes, projectManagerRootPath} from "../../router";


const routes = reactive(projectManagerIndexViewRoutes)

const props = defineProps({
  default: {
    type: String,
    default: '0'
  },
  onCollapse: Function
});

const getFullPath = (path: string) => {
  return projectManagerRootPath + '/' + path

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
