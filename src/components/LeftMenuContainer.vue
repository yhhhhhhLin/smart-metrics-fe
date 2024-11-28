<!--有顶部菜单和左侧菜单-->
<template>
  <div class="container">
    <div class="header-container">
      <div class="header-container-left-logo">
        这是logo图片位置
      </div>

      <div class="header-mid">
        <div class="header-drop-down-box" v-if="props.needDropDown">
          这是下拉框（参数控制是否展示）
        </div>

        <div class="header-menu">
          <project-detail-top-menu></project-detail-top-menu>
        </div>
      </div>

      <div class="header-right-box">
        用户信息什么的
      </div>
    </div>

    <div class="mid-container">
      <div class="mid-container-left">

        <a-menu
            :style="{ width: '200px', height: '100%' }"
            :default-open-keys="['0']"
            :default-selected-keys="['0_2']"
            show-collapse-button
            breakpoint="xl"
            @collapse="onCollapse"
        >
          <a-sub-menu key="0">
            <template #icon><icon-apps></icon-apps></template>
            <template #title>Navigation 1</template>
            <a-menu-item key="0_0">Menu 1</a-menu-item>
            <a-menu-item key="0_1">Menu 2</a-menu-item>
            <a-menu-item key="0_2">Menu 3</a-menu-item>
            <a-menu-item key="0_3">Menu 4</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="1">
            <template #icon><icon-bug></icon-bug></template>
            <template #title>Navigation 2</template>
            <a-menu-item key="1_0">Menu 1</a-menu-item>
            <a-menu-item key="1_1">Menu 2</a-menu-item>
            <a-menu-item key="1_2">Menu 3</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="2">
            <template #icon><icon-bulb></icon-bulb></template>
            <template #title>Navigation 3</template>
            <a-menu-item key="2_0">Menu 1</a-menu-item>
            <a-menu-item key="2_1">Menu 2</a-menu-item>
            <a-sub-menu key="2_2" title="Navigation 4">
              <a-menu-item key="2_2_0">Menu 1</a-menu-item>
              <a-menu-item key="2_2_1">Menu 2</a-menu-item>
            </a-sub-menu>
          </a-sub-menu>
        </a-menu>
      </div>

      <div class="mid-container-content">
        <slot name="content"></slot>
      </div>
    </div>

    <div class="footer-container">
      这是footer
    </div>

  </div>
</template>

<script setup lang="ts">

import {Message} from "@arco-design/web-vue";

const props = defineProps({
  navbarDefault: String,
  needDropDown: {
    type: Boolean,
    default: false
  },
  topMenuType: String,
  leftMenuType: String
})

import {
  IconMenuFold,
  IconMenuUnfold,
  IconApps,
  IconBug,
  IconBulb,
} from '@arco-design/web-vue/es/icon';
import ProjectDetailTopMenu from "./menu/ProjectDetailTopMenu.vue";

function onCollapse(val:any, type:any) {
  const content = type === 'responsive' ? '触发响应式收缩' : '点击触发收缩';
  Message.info({
    content,
    duration: 2000,
  });
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #F2F7FA;
}

.header-container {
  height: 6.5%;
  min-height: 64px;
  background-color: #FFFFFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  overflow: hidden;
}

.header-container-left-logo {
  width: 240px;
  height: 64px;
  background-color: #349FFF;
}

.header-mid {
  flex-grow: 1;
  display: flex;
  gap: 10px;
}

.header-drop-down-box {
  width: 228px;
  height: 64px;
  background-color: #747bff;
}

.header-menu {
  flex-grow: 1;
  height: 64px;
  background-color: #FFFFFF;
}

.header-right-box {
  width: 200px;
  height: 64px;
  background-color: #1a1a1a;
}

.mid-container {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
}

.mid-container-left{
  width: 180px;
  background-color: #FFFFFF;
  position: fixed;
  height: calc(100vh - 6.5%);
}

.mid-container-content{
  flex-grow: 1;
  padding: 16px;
  margin-left: 200px;
}

.footer-container {
  height: 3%;
  min-height: 30px;
  background-color: #F2F7FA;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}
</style>
