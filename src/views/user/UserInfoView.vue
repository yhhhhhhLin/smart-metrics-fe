<template>
  <div class="user-info">
    <div class="user-info-main">
      <div class="user-info-main-left">
        <div class="info-main-left-header">
          欢迎使用指标管理平台！
        </div>
        <div class="info-main-left-title">
          个人信息
        </div>
        <div class="user-avatar-section">
          <div class="avatar-wrapper">
            <div class="avatar-container">
              <a-avatar :size="120" :image-url="form.userAvatar">
                <template #icon><icon-user /></template>
              </a-avatar>
              <div class="avatar-mask">
                <a-upload
                  :custom-request="handleAvatarUpload"
                  :show-file-list="false"
                  accept="image/*"
                >
                  <a-button type="text" class="upload-btn">
                    <icon-camera />
                    <span>更换头像</span>
                  </a-button>
                </a-upload>
              </div>
            </div>
            <div class="user-basic-info">
              <h2 class="user-name">{{ form.userName }}</h2>
              <p class="user-account">{{ form.userAccount }}</p>
            </div>
          </div>
        </div>
        <div class="info-main-left-form">
          <a-form :model="form" @submit="handleSubmit" layout="vertical">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item field="userName" label="用户名" validate-trigger="blur" :rules="[{ required: true, message: '请输入用户名' }]">
                  <a-input v-model="form.userName" placeholder="请输入用户名">
                    <template #prefix>
                      <icon-user />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="userAccount" label="账号" validate-trigger="blur" :rules="[{ required: true, message: '请输入账号' }]">
                  <a-input v-model="form.userAccount" placeholder="请输入账号" disabled>
                    <template #prefix>
                      <icon-idcard />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item field="userEmail" label="邮箱" validate-trigger="blur" :rules="[{ required: true, message: '请输入邮箱' }]">
                  <a-input v-model="form.userEmail" placeholder="请输入邮箱">
                    <template #prefix>
                      <icon-email />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="gender" label="性别">
                  <a-radio-group v-model="form.gender" type="button">
                    <a-radio :value="0">
                      <template #icon><icon-male /></template>
                      男
                    </a-radio>
                    <a-radio :value="1">
                      <template #icon><icon-female /></template>
                      女
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
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
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { getUserInfo, updateUserInfo } from '../../services/user/user';
import type { UploadRequest, RequestOption } from '@arco-design/web-vue';

const router = useRouter();

const form = reactive<API.UserInfo>({
  userName: '',
  userAccount: '',
  userAvatar: '',
  userEmail: '',
  gender: 0
});

const loadUserInfo = async () => {
  try {
    const res = await getUserInfo();
    if (res.code === 0) {
      Object.assign(form, res.data);
    } else {
      Message.error(res.message || '获取用户信息失败');
    }
  } catch (error) {
    Message.error('获取用户信息失败');
  }
};

const handleSubmit = async () => {
  try {
    const res = await updateUserInfo(form);
    if (res.code === 0) {
      Message.success('个人信息修改成功');
      router.back();
    } else {
      Message.error(res.message || '个人信息修改失败');
    }
  } catch (error) {
    Message.error('个人信息修改失败');
  }
};

const handleCancel = () => {
  router.back();
};

const handleAvatarUpload = (option: RequestOption): UploadRequest => {
  try {
    // TODO: 实现头像上传逻辑
    Message.success('头像上传成功');
    return {
      abort: () => {},
      status: 'success',
      response: ''
    };
  } catch (error) {
    Message.error('头像上传失败');
    return {
      abort: () => {},
      status: 'error',
      response: ''
    };
  }
};

onMounted(() => {
  loadUserInfo();
});
</script>

<style scoped>
.user-info {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f8fa;
  font-family: 'Arial', sans-serif;
}

.user-info-main {
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

.user-info-main:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.user-info-main-left {
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

.user-avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-container {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-container:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.avatar-container:hover .avatar-mask {
  opacity: 1;
}

.upload-btn {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 4px 12px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.user-basic-info {
  text-align: center;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1d2129;
}

.user-account {
  font-size: 14px;
  margin: 0;
  color: #86909c;
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

:deep(.arco-radio-group) {
  display: flex;
  gap: 16px;
}

:deep(.arco-radio-button) {
  padding: 0 16px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

:deep(.arco-radio-button:hover) {
  transform: translateY(-1px);
}

:deep(.arco-avatar) {
  background-color: #f7f8fa;
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  .user-info-main {
    width: 90%;
    height: auto;
    max-height: 90%;
  }

  .user-info-main-left {
    padding: 20px;
  }

  .info-main-left-title {
    font-size: 2rem;
  }
}
</style> 