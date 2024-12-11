<template>
  <div v-if="token == null" class="user-top-info">
    <div class="user-info-login-button">
      <button style="background-color: #FFFFFF" @click="toLoginPage">登陆</button>
    </div>
  </div>
  <div v-else class="user-top-info">
    这里是用户名
  </div>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import router from "../../router";

let token = ref()

onMounted(()=>{
  token.value = localStorage.getItem("token")
})

const toLoginPage = ()=>{
  router.push("/user/login");
}

</script>

<style scoped>
.user-top-info{
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
}

</style>
