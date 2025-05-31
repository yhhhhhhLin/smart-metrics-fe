<template>
  <div class="update-password">
    <div class="update-password-main">
      <div class="update-password-main-left">
        <div class="info-main-left-header">
          欢迎使用指标管理平台！
        </div>
        <div class="info-main-left-title">
          修改密码
        </div>
        <div class="info-main-left-form">
          <a-form :model="form" @submit="handleSubmit" layout="vertical">
            <a-form-item field="oldPassword" label="原密码" validate-trigger="blur" :rules="[{ required: true, message: '请输入原密码' }]">
              <a-input-password v-model="form.oldPassword" placeholder="请输入原密码">
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>
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
                  保存修改
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { updatePassword } from '../../services/user/user';

const router = useRouter();

const form = reactive<API.UpdatePasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const handleSubmit = async () => {
  if (form.newPassword !== form.confirmPassword) {
    Message.error('两次输入的密码不一致');
    return;
  }
  
  try {
    const res = await updatePassword(form);
    if (res.code === 0) {
      Message.success('密码修改成功');
      router.push('/user/login');
    } else {
      Message.error(res.message || '密码修改失败');
    }
  } catch (error) {
    Message.error('密码修改失败');
  }
};

const handleCancel = () => {
  router.back();
};
</script>

<style scoped>
.update-password {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f8fa;
  font-family: 'Arial', sans-serif;
}

.update-password-main {
  width: 65%;
  height: auto;
  max-height: 90%;
  display: flex;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.update-password-main:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.update-password-main-left {
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow-y: auto;
}

.info-main-left-header {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1e80ff;
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.info-main-left-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #1d2129;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #1e80ff, #165dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: slideInLeft 0.5s ease-out 0.2s both;
}

.info-main-left-form {
  flex: 1;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.form-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
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

:deep(.arco-btn) {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

:deep(.arco-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.arco-btn::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

:deep(.arco-btn:active::after) {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .update-password-main {
    width: 90%;
    height: auto;
    max-height: 90%;
  }

  .update-password-main-left {
    padding: 20px;
  }

  .info-main-left-title {
    font-size: 2rem;
  }
}
</style> 