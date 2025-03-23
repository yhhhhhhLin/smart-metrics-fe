<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'" :left-menu-selected="'/project/index-management/index-develop'" :sidebarType = "1">
    <template #content>
      <div class="index-manager-container">
        <div class="index-manager-directory">
          <a-input-search
              style="margin-bottom: 8px; max-width: 240px"
              v-model="metricDirSearchKey"
          />
          <a-tree :data="treeData">
            <template #title="nodeData">
              <template v-if="metricsDirSearchKeyIndex = getMatchIndex(nodeData?.title), metricsDirSearchKeyIndex < 0">{{ nodeData?.title }}</template>
              <span v-else>
          {{ nodeData?.title?.substr(0, metricsDirSearchKeyIndex) }}
          <span style="color: var(--color-primary-light-4);">
            {{ nodeData?.title?.substr(metricsDirSearchKeyIndex, metricDirSearchKey.length) }}
          </span>{{ nodeData?.title?.substr(metricsDirSearchKeyIndex + metricDirSearchKey.length) }}
        </span>
            </template>
          </a-tree>
        </div>
        <div class="index-manager-content">
          这里是指标中心
        </div>
      </div>
    </template>

  </container>
</template>

<script setup lang="ts">

import Container from "../../components/Container.vue";
import {computed, onMounted, ref} from "vue";
import {getMetricDirTree} from "../../services/metric/metric.ts";

const metricDirSearchKey = ref('')
const metricsDirSearchKeyIndex = ref()

onMounted(()=>{
  // 获取目录数据
  fetchMetricDirTree()
})

const fetchMetricDirTree = () =>{
  getMetricDirTree().then((resp) => {
    originMetricDirTreeData = resp.data

  }).catch((error)=>{
    console.log(error)
  })
}

const treeData = computed(() => {
  if (!metricDirSearchKey.value) return originMetricDirTreeData;
  return searchData(metricDirSearchKey.value);
})

const searchData = (keyword)=> {
  const loop = (data) => {
    const result = [];
    data.forEach(item => {
      if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({...item});
      } else if (item.children) {
        const filterData = loop(item.children);
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result;
  }

  return loop(originMetricDirTreeData);
}

const getMatchIndex = (title) => {
  if (!metricDirSearchKey.value) return -1;
  return title.toLowerCase().indexOf(metricDirSearchKey.value.toLowerCase());
}

let originMetricDirTreeData = [];

</script>

<style>

.index-manager-container{
  background-color: #f1f6fb;
  display: flex;
  flex-grow: 1;
  border-radius: 5px;
  height: calc(100vh - 120px);
}

.index-manager-directory {
  background-color: #FFFFFF;
  width: 250px;
  height: 100%;
  border-radius: 5px;
  padding: 20px;
}

.index-manager-content {
  background-color: #FFFFFF;
  height: 100%;
  width: 100%;
  margin-left: 10px;
  border-radius: 5px;
  padding: 20px;
}
</style>
