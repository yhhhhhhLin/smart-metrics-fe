<!--只有顶部菜单-->
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
          这是菜单栏（参数控制展示哪些菜单选项）
        </div>
      </div>

      <div class="header-right-box">
        这是右侧固定用户信息什么的
      </div>
    </div>

    <div class="content-container">
      <slot name="content"></slot>
    </div>

    <div class="footer-container">
      这是footer
    </div>

  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  navbarDefault: String,
  needDropDown: {
    type: Boolean,
    default: false
  },
  topMenuType: String,
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
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
  background-color: aquamarine;
}

.header-right-box {
  width: 200px;
  height: 64px;
  background-color: #1a1a1a;
}

.content-container {
  flex-grow: 1;
  padding: 16px;
  background-color: #F1F6FB;
  overflow-y: auto;
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
