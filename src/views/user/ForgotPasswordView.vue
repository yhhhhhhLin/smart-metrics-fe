<template>
  <div class="forgot-password">
    <div class="forgot-password-main">
      <div class="forgot-password-main-left">
        <div class="info-main-left-header">
          欢迎使用指标管理平台！
        </div>
        <div class="info-main-left-title">
          找回密码
        </div>
        <div class="info-main-left-form">
          <a-form :model="form" @submit="handleSubmit" layout="vertical">
            <a-form-item field="email" label="邮箱" validate-trigger="blur" :rules="[{ required: true, message: '请输入邮箱' }]">
              <a-input v-model="form.email" placeholder="请输入注册邮箱">
                <template #prefix>
                  <icon-email />
                </template>
              </a-input>
            </a-form-item>
            <div class="verification-code">
              <a-form-item field="code" label="验证码" validate-trigger="blur" :rules="[{ required: true, message: '请输入验证码' }]">
                <a-input v-model="form.code" placeholder="请输入验证码">
                  <template #prefix>
                    <icon-safe />
                  </template>
                </a-input>
              </a-form-item>
              <a-button
                  type="primary"
                  class="send-code-button"
                  :disabled="isCounting"
                  @click="sendVerificationCode"
              >
                {{ isCounting ? `${count}s后重试` : "获取验证码" }}
              </a-button>
            </div>
            <a-form-item field="newPassword" label="新密码" validate-trigger="blur" :rules="[{ required: true, message: '请输入新密码' }]">
              <a-input-password v-model="form.newPassword" placeholder="请输入新密码">
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item field="confirmPassword" label="确认密码" validate-trigger="blur" :rules="[{ required: true, message: '请确认新密码' }]">
              <a-input-password v-model="form.confirmPassword" placeholder="请确认新密码">
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>
            <div class="form-actions">
              <a-space>
                <a-button type="primary" html-type="submit">
                  <template #icon><icon-save /></template>
                  重置密码
                </a-button>
                <a-button @click="handleCancel">
                  <template #icon><icon-close /></template>
                  取消
                </a-button>
              </a-space>
            </div>
          </a-form>
        </div>
      </div>

      <div class="forgot-password-main-right">
        <img
            src="../../assets/images/LoginRightImage.png"
            alt="右侧图片"
            class="forgot-password-main-right-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { getEmailMsg, resetPassword } from '../../services/user/user';

const router = useRouter();

const form = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
});

const count = ref(0);
const isCounting = ref(false);

const sendVerificationCode = () => {
  if (isCounting.value) return;

  if (form.email === '') {
    Message.warning({ title: '系统提示', content: '请先填写邮箱' });
    return;
  }

  getEmailMsg(form.email).then((response) => {
    if (response.code === 0) {
      Message.success({ title: '系统提示', content: '验证码发送成功！' });
    }
  }).catch((error) => {
    console.log(error);
  });

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

const handleSubmit = async () => {
  if (form.newPassword !== form.confirmPassword) {
    Message.error('两次输入的密码不一致');
    return;
  }

  try {
    const res = await resetPassword(form);
    if (res.code === 0) {
      Message.success('密码重置成功');
      router.push('/user/login');
    } else {
      Message.error(res.message || '密码重置失败');
    }
  } catch (error) {
    Message.error('密码重置失败');
  }
};

const handleCancel = () => {
  router.push('/user/login');
};
</script>

<style scoped>
.forgot-password {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #646cff, #3f3dff);
  font-family: 'Arial', sans-serif;
}

.forgot-password-main {
  width: 65%;
  height: 70%;
  display: flex;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  transition: box-shadow 0.3s;
}

.forgot-password-main:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.forgot-password-main-left {
  width: 40%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f5f7fa;
}

.info-main-left-header {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #4a4aff;
}

.info-main-left-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.info-main-left-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.verification-code {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.send-code-button {
  flex-shrink: 0;
  margin-bottom: 24px;
}

.form-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.forgot-password-main-right {
  width: 60%;
  position: relative;
  background: linear-gradient(135deg, #2c3e50, #1c2938);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.forgot-password-main-right-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  transition: transform 0.5s, opacity 0.5s;
}

:deep(.arco-form-item-label) {
  font-weight: 500;
  color: #1d2129;
}

:deep(.arco-input-wrapper) {
  background-color: #fff;
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.arco-input-wrapper:hover) {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.arco-input-wrapper:focus-within) {
  background-color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 0 0 2px rgba(30, 128, 255, 0.1);
}

:deep(.arco-btn-primary) {
  background: linear-gradient(135deg, #1e80ff, #165dff);
  border: none;
  transition: all 0.3s ease;
}

:deep(.arco-btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 128, 255, 0.2);
}

:deep(.arco-btn-primary:active) {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .forgot-password-main {
    flex-direction: column;
    width: 90%;
    height: auto;
  }

  .forgot-password-main-left,
  .forgot-password-main-right {
    width: 100%;
  }

  .forgot-password-main-right {
    height: 200px;
  }

  .info-main-left-title {
    font-size: 1.8rem;
  }

  .forgot-password-main-right-image {
    border-radius: 0;
  }
}
</style> 