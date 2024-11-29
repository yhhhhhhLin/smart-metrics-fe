<template>
  <a-menu mode="horizontal" :default-selected-keys="[props.default]" @menu-item-click="clickMenu">
    <div v-for="route in routes" :key="route.path">
      <div v-if="!route.meta?.notFixedNav">
        <a-menu-item :key=getFullPath(route.path)>{{ route.name }}</a-menu-item>
      </div>
    </div>
  </a-menu>
</template>

<script setup lang="ts">

import {reactive} from "vue";
import router, {datasourceManagerIndexViewRoutes, dataSourceRootPath} from "../../router";


const routes = reactive(datasourceManagerIndexViewRoutes)

const props = defineProps({
  default: {
    type: String,
    default: '0'
  },
  onCollapse: Function
});

const getFullPath = (path: string) => {
  return dataSourceRootPath + '/' + path

}

const clickMenu = (path: string) => {
  router.push(path)
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
