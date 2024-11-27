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
          这是菜单栏（参数控制展示哪些菜单选项）
        </div>
      </div>

      <div class="header-right-box">
        这是右侧固定用户信息什么的
      </div>
    </div>

    <div class="mid-container">
      <div class="mid-container-left">
        这是左侧menu
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

const props = defineProps({
  navbarDefault: String,
  needDropDown: {
    type: Boolean,
    default: false
  },
  topMenuType: String,
  leftMenuType: String
})
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
  margin-left: 180px;
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
