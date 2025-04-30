<template>
  <div class="user-register">
    <div class="user-register-main">
      <div class="user-register-main-left">
        <div class="register-main-left-title">
          注册
        </div>
        <a-tabs centered default-active-key="1" @change="onChangeRegisterTabs">
          <a-tab-pane key='1'>
            <template #title>
              <icon-user/>
              账号密码注册
            </template>
            <div class="register-main-left-form">
              <a-input placeholder="请输入用户名" v-model="userRegisterForm.username" allow-clear>
                <template #prefix>
                  <icon-user-group/>
                </template>
              </a-input>
              <a-input placeholder="请输入账号" v-model="userRegisterForm.userAccount" allow-clear>
                <template #prefix>
                  <icon-user/>
                </template>
              </a-input>
              <a-input-password
                  v-model="userRegisterForm.password"
                  placeholder="请输入密码"
                  :default-visibility="false"
                  allow-clear
              >
                <template #prefix>
                  <icon-lock/>
                </template>
              </a-input-password>
              <a-input-password
                  v-model="userRegisterForm.checkPassword"
                  placeholder="确认密码"
                  :default-visibility="false"
                  allow-clear
              >
                <template #prefix>
                  <icon-lock/>
                </template>
              </a-input-password>
            </div>
          </a-tab-pane>

          <a-tab-pane key='2'>
            <template #title>
              <icon-email/>
              邮箱验证码注册
            </template>
            <div class="register-main-left-form">
              <a-input placeholder="请输入用户名" v-model="userRegisterForm.username" allow-clear>
                <template #prefix>
                  <icon-user-group/>
                </template>
              </a-input>
              <a-input placeholder="请输入邮箱地址" v-model="userRegisterForm.email" allow-clear>
                <template #prefix>
                  <icon-email/>
                </template>
              </a-input>
              <a-input-password
                  v-model="userRegisterForm.password"
                  placeholder="请输入密码"
                  :default-visibility="false"
                  allow-clear
              >
                <template #prefix>
                  <icon-lock/>
                </template>
              </a-input-password>
              <a-input-password
                  v-model="userRegisterForm.checkPassword"
                  placeholder="确认密码"
                  :default-visibility="false"
                  allow-clear
              >
                <template #prefix>
                  <icon-lock/>
                </template>
              </a-input-password>
              <div class="register-verification">
                <a-input
                    placeholder="请输入验证码"
                    v-model="userRegisterForm.code"
                    allow-clear
                    style="flex: 1"
                >
                  <template #prefix>
                    <icon-safe/>
                  </template>
                </a-input>
                <a-button
                    type="primary"
                    class="send-code-button"
                    :disabled="isCounting"
                    @click="sendVerificationCode"
                >
                  {{ isCounting ? `${count}s后重试` : "获取验证码" }}
                </a-button>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>

        <div class="register-main-left-utils">
          <a-checkbox>我已阅读并同意
            <a-link class="terms-link">服务条款</a-link>
          </a-checkbox>
        </div>
        <div class="register-main-left-register-button">
          <a-button type="primary" block @click="onClickRegister">
            注册
          </a-button>
        </div>
        <div class="register-main-left-login-link">
          已有账号？
          <a-link class="login-link" @click="toLoginPage">立即登录</a-link>
        </div>
      </div>

      <div class="user-register-main-right">
        <img

            src="../../assets/images/LoginRightImage.png"
            alt="右侧图片"
            class="register-main-right-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {getEmailMsg, userRegister} from "../../services/user/user.ts";
import {Notification} from "@arco-design/web-vue";
import router from "../../router";

// 用户注册表单数据
const userRegisterForm = reactive({
  username: '',
  userAccount: '',
  password: '',
  checkPassword: '',
  registerType: '1',
  email: '',
  code: ''
});

const count = ref(0);
const isCounting = ref(false);

const sendVerificationCode = () => {
  if (isCounting.value) return;

  if (userRegisterForm.email == '') {
    Notification.warning({title: '系统提示', content: '请先填写邮箱'})
    return
  }

  getEmailMsg(userRegisterForm.email).then((response) => {
    if (response.code === 0) {
      Notification.success({title: '系统提示', content: '获取验证码成功！'})
    }
  }).catch((error) => {
    console.log(error)
  })

  count.value = 60;
  isCounting.value = true;

  const timer = setInterval(() => {
    count.value -= 1;
    if (count.value <= 0) {
      clearInterval(timer);
      isCounting.value = false;
    }
  }, 1000);
};

const onChangeRegisterTabs = () => {
  userRegisterForm.registerType = userRegisterForm.registerType === '1' ? '2' : '1';
}

const onClickRegister = async () => {
  console.log('注册方式:', userRegisterForm.registerType === '1' ? '账号密码注册' : '邮箱验证码注册');
  console.log('提交的注册信息:', userRegisterForm);

  try {
    const response = await userRegister(userRegisterForm);
    if (response.code == 0) {
      console.log('注册成功')
      Notification.success({
        title: '系统提示',
        content: '注册成功！'
      })
      toLoginPage()
    } else {

      Notification.error({
        title: '系统提示',
        content: '注册失败，原因为:' + response.message
      })
    }
    console.log('注册结果:', response);
  } catch (error: any) {
    Notification.error({
      title: '系统提示',
      content: '注册失败，原因为:' + error
    })
  }
};

const toLoginPage = () => {
  router.push("/user/login")
}

</script>

<style scoped>
.user-register {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #42a5f5, #478ed1);
  font-family: 'Arial', sans-serif;
}

.user-register-main {
  width: 65%;
  height: 75%;
  display: flex;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  transition: box-shadow 0.3s;
}

.user-register-main-left {
  width: 40%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f9fafb;
}

.register-main-left-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.register-main-left-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.register-verification {
  display: flex;
  align-items: center;
  gap: 10px;
}

.send-code-button {
  flex-shrink: 0;
}

.register-main-left-utils {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #7d7d7d;
}

.terms-link {
  color: #1976d2;
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}

.terms-link:hover {
  color: #125ba1;
}

.register-main-left-register-button {
  margin-top: 25px;
}

.register-main-left-login-link {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: #7d7d7d;
}

.login-link {
  color: #1976d2;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

.user-register-main-right {
  width: 60%;
  position: relative;
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.register-main-right-image {
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
  .user-register-main {
    flex-direction: column;
    width: 90%;
    height: auto;
  }

  .user-register-main-left,
  .user-register-main-right {
    width: 100%;
  }

  .user-register-main-right {
    height: 200px;
  }

  .register-main-left-title {
    font-size: 1.8rem;
  }

  .register-main-right-image {
    border-radius: 0;
  }
}
</style>
