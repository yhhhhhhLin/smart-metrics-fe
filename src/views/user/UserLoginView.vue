<template>
  <div class="user-login">
    <div class="user-login-main">
      <div class="user-login-main-left">
        <div class="login-main-left-header">
          欢迎使用指标管理平台！
        </div>
        <div class="login-main-left-title">
          登录
        </div>
        <div class="login-main-left-login-form">
          <a-input
              placeholder="请输入账号或邮箱"
              v-model="userLoginForm.userAccount"
              allow-clear>
            <template #prefix>
              <icon-user/>
            </template>
          </a-input>

          <a-input-password
              v-model:visibility="passwordVisibility"
              v-model="userLoginForm.password"
              placeholder="请输入密码"
              :defaultVisibility="false"
              allow-clear>
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input-password>
        </div>
        <div class="login-main-left-utils">
          <a-checkbox>自动登录</a-checkbox>
          <a-link class="register-link" @click="toRegisterPage">注册账号</a-link>
        </div>
        <div class="login-main-left-login-button">
          <a-button type="primary" block @click="onClickLogin">
            登录
          </a-button>
        </div>
      </div>

      <div class="user-login-main-right">
        <img
            src="../../assets/images/LoginRightImage.png"
            alt="右侧图片"
            class="login-main-right-image"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import router from "../../router";
import {userLogin} from "../../services/user/user.ts";
import {Notification} from "@arco-design/web-vue";
import {useUserInfoStore} from "../../store/userInfo.ts";

const passwordVisibility = ref(false);
const userLoginForm: API.UserLoginForm = reactive({
  userAccount: '',
  password: '',
  code: '',

})

const toRegisterPage = () => {
  router.push("/user/register")

}

const onClickLogin = async () => {
  userLogin(userLoginForm).then((resp) => {
    if (resp.code === 0) {
      Notification.success({
        title: '系统提示',
        content: '登陆成功！',
        closable: true
      })
      const token = resp.data
      localStorage.setItem('token', token)
      const userInfoStore = useUserInfoStore()
      userInfoStore.storeGetUserInfo()
      router.push('/')
    }

  }).catch((error) => {
    console.log(error)
    Notification.error(error)

  })

}

</script>

<style scoped>
.user-login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #646cff, #3f3dff);
  font-family: 'Arial', sans-serif;
}

.user-login-main {
  width: 65%;
  height: 70%;
  display: flex;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  transition: box-shadow 0.3s;
}

.user-login-main:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.user-login-main-left {
  width: 40%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f5f7fa;
}

.login-main-left-header {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #4a4aff;
}

.login-main-left-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.login-main-left-login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-main-left-utils {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  margin-top: 15px;
  color: #7d7d7d;
}

.register-link {
  color: #4a4aff;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.register-link:hover {
  color: #2c2cff;
}

.login-main-left-login-button {
  margin-top: 25px;
}

.user-login-main-right {
  width: 60%;
  position: relative;
  background: linear-gradient(135deg, #2c3e50, #1c2938);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-main-right-image {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  transition: transform 0.5s, opacity 0.5s;
}

@media (max-width: 768px) {
  .user-login-main {
    flex-direction: column;
    width: 90%;
    height: auto;
  }

  .user-login-main-left,
  .user-login-main-right {
    width: 100%;
  }

  .user-login-main-right {
    height: 200px;
  }

  .login-main-left-title {
    font-size: 1.8rem;
  }

  .login-main-right-image {
    border-radius: 0;
  }
}
</style>
