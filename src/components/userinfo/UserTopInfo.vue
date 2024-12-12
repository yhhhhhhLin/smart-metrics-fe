<template>
  <div v-if="token == null" class="user-top-info">
    <div class="user-info-login-button">
      <button style="background-color: #FFFFFF" @click="toLoginPage">登陆</button>
    </div>
  </div>
  <div v-else class="user-top-info">
    <a-dropdown @select="handleSelect">
      <a-button>{{ userinfoStore.user.userName }}</a-button>
      <template #content>
        <a-doption :value="1">个人信息</a-doption>
        <a-doption :value="2">修改密码</a-doption>
        <a-doption :value="3">退出登陆</a-doption>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import router from "../../router";
import {useUserInfoStore} from "../../store/userInfo.ts";
import { Notification } from "@arco-design/web-vue"

let token = ref()
const userinfoStore = useUserInfoStore()

const handleSelect = (item:number) => {
  switch (item){
    case 1:
      console.log('111')
          break
    case 2:
      console.log('222')
          break
    case 3:
      logoutLogin()
  }

}

const logoutLogin = ()=>{
  localStorage.removeItem('token')
  Notification.success({
    title: '系统提示',
    content: '退出登陆成功',
    closable: true
  })
  router.push('/user/login')
}

onMounted(()=>{
  token.value = localStorage.getItem('token')
})

const toLoginPage = () => {
  router.push("/user/login");
}

</script>

<style scoped>
.user-top-info {
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
}
.arco-btn-secondary, .arco-btn-secondary[type='button'], .arco-btn-secondary[type='submit']{
  background-color: #FFFFFF;
}

button:focus, button:focus-visible {
  outline: none;
}
</style>
