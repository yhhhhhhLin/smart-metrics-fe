<template>
  <container :top-menu-type=-1 :top-menu-selected="'2'">
    <template #content>
      <div class="home-view">
        <div class="home-title">
          <div class="home-title-word">
            智能指标平台
          </div>
          <div class="home-title-image">
            <img src="../assets/images/HomeImage.png" alt="homeImage"/>
          </div>
        </div>
        <div class="home-options-other-message">
          <div class="home-options-other">
            <div class="home-options">
              <div class="home-options-title">
                功能模块
              </div>
              <div class="home-options-options">
                <div v-for="option in options" :key="option.key">
                  <div class="home-options-item" @click="clickOption(option.key)">
                    <div class="home-options-item-image">
                      <img :src="option.image" alt="homeImage"/>
                    </div>
                    <div class="home-options-item-title">
                      {{ option.title }}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="home-other">
              <div class="no-message">
                <div class="no-message__icon">📭</div>
                <h3 class="no-message__text">暂无任何消息</h3>
                <button class="no-message__button" @click="showAddMessageModal = true">
                  <span class="plus-icon"></span>
                  添加新消息
                </button>
              </div>

            </div>
          </div>
          <div class="home-message">
            <div class="message-header">系统公告</div>
            <div class="message-list">
              <div v-if="systemNotifies.length === 0" class="no-message">
                暂无系统公告
              </div>
              <div v-else v-for="notify in systemNotifies" :key="notify.id" class="message-item">
                <div class="message-title">{{ notify.title }}</div>
                <div class="message-content">{{ notify.content }}</div>
                <div class="message-footer">
                  <span class="message-time">{{ notify.createTime }}</span>
                  <span class="message-user">{{ notify.createUser }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 添加新消息模态框 -->
        <a-modal
            v-model:visible="showAddMessageModal"
            title="添加新消息"
            @ok="handleAddMessage"
            @cancel="handleCancelAddMessage"
            :mask-closable="false"
        >
          <a-form :model="messageForm" layout="vertical">
            <a-form-item field="title" label="消息标题" validate-trigger="blur" required>
              <a-input v-model="messageForm.title" placeholder="请输入消息标题" allow-clear/>
            </a-form-item>
            <a-form-item field="content" label="消息内容" validate-trigger="blur" required>
              <a-textarea
                  v-model="messageForm.content"
                  placeholder="请输入消息内容"
                  allow-clear
                  :auto-size="{ minRows: 3, maxRows: 6 }"
              />
            </a-form-item>
            <a-form-item field="type" label="消息类型">
              <a-select v-model="messageForm.type" placeholder="请选择消息类型">
                <a-option value="notice">系统通知</a-option>
                <a-option value="warning">警告信息</a-option>
                <a-option value="update">更新公告</a-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </template>

  </container>
</template>

<script setup lang="ts">

import Container from "../components/Container.vue";
import router from "../router";
import ProjectManagerPng from '../assets/images/ProjectManager.png'
import DataSourceManagerPng from '../assets/images/DataSourceManager.png'
import UserManagerPng from '../assets/images/UserManager.png'
import AdminManagerPng from '../assets/images/AdminManager.png'
import {onMounted, reactive, ref} from 'vue'
import {Message} from '@arco-design/web-vue'
import {addNotify, listNotifies} from '../services/user/notify'

interface MessageForm {
  title: string;
  content: string;
  type: 'notice' | 'warning' | 'update';
}

const options = [
  {key: 1, image: ProjectManagerPng, title: '项目管理'},
  {key: 2, image: DataSourceManagerPng, title: '数据源管理'},
  {key: 3, image: UserManagerPng, title: '用户管理'},
  {key: 4, image: AdminManagerPng, title: '管理员模块'},
];

const clickOption = (optionKey: number) => {
  // 根据点击的key跳转到对应的页面
  switch (optionKey) {
    case 1:
      router.push('/projectManager/projectList');
      break;
    case 2:
      router.push('/datasource/list')
      break;
    case 3:
      router.push('/3');
      break;
    case 4:
      break;
    default:
      console.log('未知选项');
  }

  console.log('点击++' + optionKey)

}

// 新消息相关
const showAddMessageModal = ref(false)
const messageForm = reactive<MessageForm>({
  title: '',
  content: '',
  type: 'notice'
})

// 消息类型映射
const messageTypeMap = {
  'notice': 1,
  'warning': 2,
  'update': 3
}

// 消息列表
const systemNotifies = ref<API.NotifyVO[]>([])

// 获取系统消息列表
const fetchSystemNotifies = async () => {
  try {
    // 1 表示系统通知
    const res = await listNotifies(1)
    systemNotifies.value = res.data
  } catch (error) {
    console.error('获取系统消息失败:', error)
  }
}

const handleAddMessage = async () => {
  if (!messageForm.title || !messageForm.content) {
    Message.error('请填写完整的消息信息')
    return
  }

  try {
    const notifyDto: API.AddNotifyDto = {
      title: messageForm.title,
      content: messageForm.content,
      type: messageTypeMap[messageForm.type]
    }

    const res = await addNotify(notifyDto)
    if (res.data) {
      Message.success('消息添加成功')
      // 重新获取消息列表
      await fetchSystemNotifies()
    }
  } catch (error) {
    console.error('添加消息失败:', error)
    Message.error('添加消息失败')
  }

  // 清空表单并关闭模态框
  messageForm.title = ''
  messageForm.content = ''
  messageForm.type = 'notice'
  showAddMessageModal.value = false
}

const handleCancelAddMessage = () => {
  // 清空表单
  messageForm.title = ''
  messageForm.content = ''
  messageForm.type = 'notice'
  showAddMessageModal.value = false
}

// 在组件挂载时获取系统消息
onMounted(() => {
  fetchSystemNotifies()
})
</script>

<style scoped>

.home-view {
  height: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.home-options-other-message {
  flex-grow: 1;
  width: 100%;
  display: flex;
  gap: 15px;
}

.home-options-other {
  display: flex;
  flex-direction: column;
  width: 79%;
  gap: 15px;
}

.home-title {
  height: 300px;
  background-color: #329CFF;
  border-radius: 5px;
  display: flex;
}

.home-title-word {
  width: 1000px;
  font-size: 48px;
  margin-top: 100px;
  color: #fff;
  font-weight: bold;
}


.home-title-image {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.home-options {
  background-color: #FFFFFF;
  height: 220px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-options-title {
  height: 20%;
  display: flex;
  justify-content: start;
  margin-top: 10px;
  margin-left: 20px;
}

.home-options-options {
  display: flex;
  gap: 10px;
  width: 100%;
  overflow: hidden;
}

.home-options-item {
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 130px;
  cursor: pointer;
}

.home-options-item-image {
  height: 80%;
}

.home-options-item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.home-options-item-title {
  height: 20%;
}

.home-other {
  background-color: #FFFFFF;
  height: 280px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-message {
  background-color: #FFFFFF;
  width: 21%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.message-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #1d2129;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  padding: 12px;
  border-bottom: 1px solid #f2f3f5;
  margin-bottom: 10px;
}

.message-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.message-title {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
  margin-bottom: 8px;
}

.message-content {
  font-size: 13px;
  color: #4e5969;
  margin-bottom: 8px;
  line-height: 1.5;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #86909c;
}

.no-message {
  text-align: center;
  color: #86909c;
  padding: 20px 0;
}

.no-message__icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.no-message__text {
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.no-message__button {
  background: #0d6efd;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-message__button:hover {
  background: #0b5ed7;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.plus-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
}

.plus-icon::before,
.plus-icon::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 2px;
}

.plus-icon::before {
  width: 100%;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
}

.plus-icon::after {
  width: 2px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}


</style>