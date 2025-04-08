<template>
  <!-- 指标中心左侧菜单栏 -->
  <a-menu
      @menu-item-click="clickMenu"
      :selected-keys="selectedKeys"
  >
    <div v-for="route in indexManagementRoutes.filter(c => !c.meta?.hidden)" :key="route.path">
      <!-- 有子路由情况 -->
      <a-sub-menu v-if="route.children" :key="route.path">
        <template #title>
          <component :is="route.meta?.icon" v-if="route.meta?.icon" class="menu-icon" />
          {{ route.name }}
        </template>
        <a-menu-item
            v-for="child in route.children.filter(c => !c.meta?.hidden)"
            :key="getFullPath(route.path, child.path)"
            @click="clickMenu(getFullPath(route.path, child.path))"
        >
          <component :is="child?.meta?.icon" v-if="child.meta?.icon" class="menu-icon" />
          {{ child.name }}
        </a-menu-item>
      </a-sub-menu>

      <!-- 没有子路由 -->
      <a-menu-item
          v-else
          :key="getFullPath(route.path)"
          @click="clickMenu(getFullPath(route.path))"
      >
        <component :is="route.meta?.icon" v-if="route.meta?.icon" class="menu-icon" />
        {{ route.name }}
      </a-menu-item>
    </div>
  </a-menu>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, watch } from "vue";
import { indexManagementRoutes, indexManagerRootPath, projectRootPath } from "../../router";

const router = useRouter();
const route = useRoute();

const selectedKeys = ref<string[]>([route.path]);

const getFullPath = (parentPath: string, childPath?: string) => {
  if (childPath) {
    return `${projectRootPath}/${indexManagerRootPath}/${parentPath}/${childPath}`;
  }
  return `${projectRootPath}/${indexManagerRootPath}/${parentPath}`;
};

watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath];
});

const clickMenu = (path: string) => {
  selectedKeys.value = [path];
  router.push(path);
};
</script>

<style>


.arco-menu{
  font-size: 16px;
}


</style>
