<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <div class="header-container">
      <div class="header-container-left-logo">
        <img :src="systemLogo" alt="系统LOGO" class="system-logo-img" />
      </div>

      <div class="header-mid">
        <div class="header-drop-down-box" v-if="props.needDropDown">
          这是下拉框（参数控制是否展示）
        </div>

        <div class="header-menu">
          <div v-if="props.topMenuType === 1">
            <project-manager-top-menu :default="props.topMenuSelected"></project-manager-top-menu>
          </div>
          <div v-else-if="props.topMenuType === 2">
            <project-detail-top-menu :default="props.topMenuSelected"></project-detail-top-menu>
          </div>
          <div v-else-if="props.topMenuType === 3">
            <data-source-manager-top-menu :default="props.topMenuSelected"></data-source-manager-top-menu>
          </div>
        </div>
      </div>

      <div class="header-right-box">
        <user-top-info></user-top-info>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="main-container">
      <!-- 侧边栏 -->
      <div class="left-menu-container" v-if="props.sidebarType !== -1">
        <div class="sidebar">
          <div v-if="props.sidebarType === 1">
            <index-manager-left-menu :default="props.leftMenuSelected"></index-manager-left-menu>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div
          class="content-container"
          :class="{ 'full-width': props.sidebarType === -1 }"
      >
        <slot name="content"></slot>
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer-container">这是footer</div>
  </div>
</template>

<script setup lang="ts">
import ProjectManagerTopMenu from "./menu/ProjectManagerTopMenu.vue";
import ProjectDetailTopMenu from "./menu/ProjectDetailTopMenu.vue";
import DataSourceManagerTopMenu from "./menu/DataSourceManagerTopMenu.vue";
import UserTopInfo from "./userinfo/UserTopInfo.vue";
import IndexManagerLeftMenu from "./menu/IndexManagerLeftMenu.vue";

const systemLogo = "https://cdn.jsdelivr.net/gh/bytebase/bytebase@main/docs/static/img/logo.svg";

const props = defineProps({
  navbarDefault: String,
  needDropDown: {type: Boolean, default: false},
  topMenuType: {type: Number, default: 1},
  topMenuSelected: {type: String, default: "0"},
  leftMenuSelected: {type: String, default: "0"},
  sidebarType: {type: Number, default: -1},
});
</script>

<style scoped>
/* 页面全局布局 */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 顶部导航栏 */
.header-container {
  height: 64px;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 1px solid #e0e4e8;
}

.header-container-left-logo {
  width: 240px;
  height: 64px;
  background-color: #349fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.system-logo-img {
  height: 40px;
  max-width: 180px;
  object-fit: contain;
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
  background-color: #ffffff;
}

.header-right-box {
  width: 200px;
  height: 64px;
}

.main-container {
  display: flex;
  height: calc(100vh - 64px - 30px);
  margin-top: 64px;
}

.left-menu-container {
  width: 240px;
  height: calc(100vh - 64px);
  position: fixed;
  top: 64px;
  left: 0;
  background-color: #FFFFFF;
  border-right: 1px solid #e0e4e8;
}

/* 主内容区域 */
.content-container {
  flex-grow: 1;
  padding: 16px;
  background-color: #f1f6fb;
  overflow-y: auto;
  height: calc(100vh - 64px - 30px);
  margin-left: 240px;
}

/* 如果没有侧边栏，则主内容区域占满整个页面 */
.content-container.full-width {
  margin-left: 0;
  width: 100%;
}

/* 底部 */
.footer-container {
  height: 30px;
  background-color: #f2f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
