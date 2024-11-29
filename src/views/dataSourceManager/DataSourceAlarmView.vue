<template>
  <container :top-menu-type="3" :top-menu-selected="'/datasource/list'">
    <template #content>
      <div class="alarm-page">
        <div class="alarm-page-breadcrumb">
          <a-breadcrumb :routes="route">
            <template #item-render="{route, paths}">
              <div v-if="paths.length === 2">
                {{ route.label }}
              </div>
              <div v-else>
                <a-link :href="getFullPath(paths)">
                  {{ route.label }}
                </a-link>
              </div>
            </template>
          </a-breadcrumb>
        </div>

        <div class="alarm-page-content">
          这是告警详细内容
        </div>

      </div>
    </template>
  </container>

</template>

<script setup lang="ts">

import container from "../../components/Container.vue";
import {reactive} from "vue";



const route = reactive([
  {
    path: 'list',
    label: '数据源中心',
  },
  {
    path: '/alarm',
    label: '数据源告警',
  },
]);

const getFullPath = (paths: string[]) => {
  return paths.join('/').split('.').slice(paths.length - 1).join('/');
};


</script>

<style scoped>
.alarm-page {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
}

.alarm-page-breadcrumb {
  height: 5%;
  margin-top: -4px;
  display: flex;
  justify-content: start;
}

.alarm-page-content{
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 5px;
}

</style>