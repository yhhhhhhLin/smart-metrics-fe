<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/projectManager'">
    <template #content>
      <div class="project-manager">
        <div class="manager-header">
          <div class="header-content">
            <div class="header-title">
              <span class="title-icon">📋</span>
              <span class="title-text">项目管理</span>
            </div>
            <div class="header-actions">
              <a-input-search
                v-model="searchForm.projectName"
                placeholder="请输入项目名称"
                allow-clear
                @search="handleSearch"
                class="search-input"
              />
              <a-button type="primary" class="create-btn" @click="showCreateModal = true">
                <template #icon><icon-plus /></template>
                创建项目
              </a-button>
            </div>
          </div>
          <div class="header-divider"></div>
        </div>

        <div class="project-list">
          <a-card v-for="(project, index) in projectList" 
                 :key="project.id" 
                 class="project-card"
                 :style="{ animationDelay: `${index * 0.1}s` }"
                 hoverable>
            <div class="card-content">
              <div class="project-info">
                <div class="project-header">
                  <a-typography-title :heading="5" class="project-name">
                    {{ project.projectName }}
                  </a-typography-title>
                  <a-tag :color="getStatusColor(project.status)" class="status-tag">
                    {{ getStatusText(project.status) }}
                  </a-tag>
                </div>
                <div class="project-desc">{{ project.description || '暂无描述' }}</div>
                <div class="project-meta">
                  <div class="meta-item">
                    <icon-user />
                    <span>负责人：{{ project.owner }}</span>
                  </div>
                  <div class="meta-item">
                    <icon-calendar />
                    <span>创建时间：{{ project.createTime }}</span>
                  </div>
                  <div class="meta-item">
                    <icon-database />
                    <span>数据源：{{ project.dataSourceCount }}个</span>
                  </div>
                </div>
              </div>
              <div class="project-actions">
                <a-button-group>
                  <a-button type="primary" @click="handleEdit(project)">
                    <template #icon><icon-edit /></template>
                    编辑
                  </a-button>
                  <a-button status="danger" @click="handleDelete(project)">
                    <template #icon><icon-delete /></template>
                    删除
                  </a-button>
                </a-button-group>
              </div>
            </div>
          </a-card>
        </div>

        <!-- 创建项目模态框 -->
        <a-modal
          v-model:visible="showCreateModal"
          title="创建项目"
          @ok="handleCreate"
          @cancel="resetCreateForm"
          :mask-closable="false"
        >
          <a-form :model="createForm" layout="vertical">
            <a-form-item field="projectName" label="项目名称" validate-trigger="blur" required>
              <a-input v-model="createForm.projectName" placeholder="请输入项目名称" allow-clear />
            </a-form-item>
            <a-form-item field="projectCode" label="项目标识" validate-trigger="blur" required>
              <a-input v-model="createForm.projectCode" placeholder="请输入项目标识" allow-clear />
            </a-form-item>
            <a-form-item field="description" label="项目描述">
              <a-textarea v-model="createForm.description" placeholder="请输入项目描述" allow-clear />
            </a-form-item>
            <a-form-item field="owner" label="负责人" required>
              <a-input v-model="createForm.owner" placeholder="请输入负责人" allow-clear />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue"
import Container from "../../components/Container.vue"
import { 
  IconPlus, 
  IconEdit, 
  IconDelete, 
  IconUser, 
  IconCalendar, 
} from '@arco-design/web-vue/es/icon'
import { Message, Modal } from '@arco-design/web-vue'

// 搜索表单
const searchForm = reactive({
  projectName: ''
})

// 创建表单
const createForm = reactive({
  projectName: '',
  projectCode: '',
  description: '',
  owner: ''
})

// 项目列表数据
const projectList = ref([
  {
    id: 1,
    projectName: '智能营销分析平台',
    projectCode: 'SMART_MARKETING',
    description: '基于大数据分析的智能营销决策平台，提供全面的营销效果分析和优化建议。',
    owner: '张三',
    status: 1,
    createTime: '2024-03-15',
    dataSourceCount: 5
  },
  {
    id: 2,
    projectName: '用户行为分析系统',
    projectCode: 'USER_BEHAVIOR',
    description: '深入分析用户行为数据，提供用户画像和个性化推荐服务。',
    owner: '李四',
    status: 0,
    createTime: '2024-03-14',
    dataSourceCount: 3
  },
  {
    id: 3,
    projectName: '业务指标监控平台',
    projectCode: 'BI_MONITOR',
    description: '实时监控业务核心指标，提供预警和趋势分析功能。',
    owner: '王五',
    status: 2,
    createTime: '2024-03-13',
    dataSourceCount: 8
  }
])

const showCreateModal = ref(false)

// 获取状态颜色
const getStatusColor = (status: number) => {
  const colorMap = {
    0: 'orange',  // 未开始
    1: 'green',   // 进行中
    2: 'red'      // 异常
  }
  return colorMap[status] || 'blue'
}

// 获取状态文本
const getStatusText = (status: number) => {
  const textMap = {
    0: '未开始',
    1: '进行中',
    2: '异常'
  }
  return textMap[status] || '未知'
}

// 搜索处理
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索项目：', searchForm.projectName)
}

// 创建项目
const handleCreate = async () => {
  if (!createForm.projectName || !createForm.projectCode || !createForm.owner) {
    Message.error('请填写必填项')
    return
  }
  
  try {
    // TODO: 调用创建项目API
    console.log('创建项目：', createForm)
    Message.success('创建成功')
    showCreateModal.value = false
    resetCreateForm()
  } catch (error) {
    Message.error('创建失败')
  }
}

// 重置创建表单
const resetCreateForm = () => {
  createForm.projectName = ''
  createForm.projectCode = ''
  createForm.description = ''
  createForm.owner = ''
}

// 编辑项目
const handleEdit = (project: any) => {
  // TODO: 实现编辑逻辑
  console.log('编辑项目：', project)
}

// 删除项目
const handleDelete = (project: any) => {
  Modal.warning({
    title: '确认删除',
    content: `确定要删除项目"${project.projectName}"吗？此操作不可恢复。`,
    okText: '确认删除',
    cancelText: '取消',
    onOk: async () => {
      try {
        // TODO: 调用删除项目API
        console.log('删除项目：', project)
        Message.success('删除成功')
      } catch (error) {
        Message.error('删除失败')
      }
    }
  })
}

onMounted(() => {
  console.log("当前项目ID：", sessionStorage.getItem("projectId"))
})
</script>

<style scoped>
.project-manager {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.6s ease-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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

.manager-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 24px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.title-text {
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #1e80ff, #165dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  width: 240px;
  animation: fadeInRight 0.5s ease-out;
}

.create-btn {
  animation: fadeInRight 0.5s ease-out 0.1s both;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.header-divider {
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(30, 128, 255, 0.1) 0%,
    rgba(30, 128, 255, 0.3) 50%,
    rgba(30, 128, 255, 0.1) 100%
  );
  border-radius: 2px;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.project-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: cardFadeIn 0.5s ease-out both;
  overflow: hidden;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.project-name {
  margin: 0;
  color: #1d2129;
}

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.project-desc {
  color: #4e5969;
  font-size: 14px;
  line-height: 1.6;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #86909c;
  font-size: 13px;
}

.project-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
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

:deep(.arco-modal-header) {
  border-bottom: 2px solid #f2f3f5;
  padding: 16px 20px;
}

:deep(.arco-modal-title) {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

/* 响应式布局优化 */
@media screen and (max-width: 1200px) {
  .project-list {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media screen and (max-width: 768px) {
  .project-list {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
  
  .create-btn {
    width: 100%;
  }
}
</style>
