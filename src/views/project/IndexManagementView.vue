<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'"
             :left-menu-selected="'/project/index-management/index-develop'" :sidebarType="1">
    <template #content>
      <div class="index-manager-container">
        <div class="index-manager-directory">
          <metric-directory @update="fetchMetricPage" />
        </div>

        <div class="index-manager-content">
          <div class="content-header">
            <div class="header-left">
              <a-input-search 
                v-model="pageMetricForm.metricName" 
                placeholder="请输入指标名称"
                @search="fetchMetricPage"
                class="metric-search"
                allow-clear
              />
            </div>
            <div class="header-right">
              <a-button type="primary" class="add-metric-btn" @click="showIndexTypeDialog = true">
                <template #icon><icon-plus /></template>
                新增指标
              </a-button>
            </div>
          </div>

          <div class="content-body">
            <a-table 
              :scroll="scrollPercent" 
              :scrollbar="true" 
              :columns="indexTableColumns" 
              :data="metricsData"
              :pagination="{
                total: metricsData.length,
                pageSize: 10,
                showTotal: true,
                showJumper: true,
                showPageSize: true
              }"
              class="metric-table"
              :bordered="false"
              :stripe="true"
            >
              <template #metricName="{record}">
                {{ record.metricName }}
                <button @click="onAIClick(record)" style="margin-left: 8px; cursor: pointer;">
                  🤖
                </button>
              </template>
              <template #metricStatus="{ record }">
                <div v-if="record.metricStatus == 0">
                  未发布
                </div>
                <div v-else-if="record.metricStatus == 1">
                  发布
                </div>
                <div v-else-if="record.metricStatus == 2">
                  异常
                </div>
              </template>
              <template #optional="{ record }">
                <div class="index-list-optional">
                  <a-button v-if="record.metricStatus==0" type="text"
                            @click="$modal.info({ title:'Name', content:record.name })">发布
                  </a-button>
                  <a-button v-else-if="record.metricStatus==1" type="text"
                            @click="$modal.info({ title:'Name', content:record.name })">下线
                  </a-button>
                  <a-button type="text" @click="$modal.info({ title:'Name', content:record.name })">编辑</a-button>
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </div>

      <a-modal
        :visible="showIndexTypeDialog"
        title="请选择指标类型"
        @cancel="showIndexTypeDialog = false"
        :footer="false"
        class="custom-modal type-select-modal"
      >
        <div class="index-type-options">
          <div class="type-option" @click="selectIndexType(0)">
            <icon-file class="type-icon" />
            <span class="type-name">普通指标</span>
            <span class="type-desc">基于单一数据源的指标</span>
          </div>
          <div class="type-option" @click="selectIndexType(1)">
            <icon-branch class="type-icon" />
            <span class="type-name">复合指标</span>
            <span class="type-desc">基于多个数据源的指标</span>
          </div>
        </div>
      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import MetricDirectory from "../../components/metric/MetricDirectory.vue";
import { ref } from "vue";
import { pageMetric } from "../../services/metric/metric";
import router from "../../router";

const showIndexTypeDialog = ref(false);
const pageMetricForm = ref({pageSize: 10, currentPage: 1, metricName: ''});
const metricsData = ref([]);

const fetchMetricPage = () => {
  pageMetric(pageMetricForm.value).then(resp => {
    metricsData.value = resp.data.records;
  }).catch(error => {
    console.error('获取指标列表失败:', error);
  });
};

// 0普通指标 1复合指标
const selectIndexType = (type: number) => {
  if (type == 0) {
    router.push({name: '普通指标创建或修改'});
  } else {
    router.push({name: '复合指标创建或修改'});
  }
};

const onAIClick = (record) => {
  router.push({
    name: '平台ai助手',
    query: {
      metricsId: record.id,
    }
  });
};

// 表格列定义
const indexTableColumns = [
  {
    title: '指标名称',
    dataIndex: 'metricName',
    fixed: 'left',
    slotName: 'metricName',
    width: 200,
  },
  {
    title: '指标标识',
    dataIndex: 'metricCode',
    width: 150,
  },
  {
    title: '指标目录',
    dataIndex: 'metricDirName',
    width: 120,
  },
  {
    title: '指标类型',
    dataIndex: 'metricType',
    width: 120,
  },
  {
    title: '是否发布',
    dataIndex: 'metricStatus',
    slotName: 'metricStatus',
    width: 120,
  },
  {
    title: '操作状态',
    dataIndex: 'metricStatus',
    slotName: 'metricStatus',
    width: 120,
  },
  {
    title: '负责人',
    dataIndex: 'dutyUserName',
    width: 150,
  },
  {
    title: '更新人',
    dataIndex: 'updateUserName',
    width: 120,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 120,
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right',
    width: 120,
  }
];

const scrollPercent = {
  x: '120%',
  y: '100%'
};

// 初始化
fetchMetricPage();
</script>

<style>
.index-manager-container {
  background-color: #f7f8fa;
  display: flex;
  gap: 16px;
  padding: 16px;
  margin: -8px;
  min-height: calc(100vh - 120px);
  animation: containerFadeIn 0.6s ease-out;
}

.index-manager-directory {
  width: 260px; /* 固定宽度 */
  flex-shrink: 0; /* 防止压缩 */
}

.index-manager-content {
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: slideInRight 0.5s ease-out;
  min-width: 0;
}

.content-header {
  padding: 20px;
  border-bottom: 1px solid #f2f3f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-left {
  flex: 1;
  max-width: 400px;
}

.metric-search {
  width: 100%;
}

.content-body {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.metric-table {
  flex: 1;
  margin-top: 16px;
}

/* 指标类型选择模态框样式 */
.index-type-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 24px;
}

.type-option {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 2px solid transparent;
}

.type-option:hover {
  background: #e8f3ff;
  border-color: #1e80ff;
  transform: translateY(-2px);
}

.type-icon {
  font-size: 32px;
  color: #1e80ff;
}

.type-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

.type-desc {
  font-size: 14px;
  color: #86909c;
  text-align: center;
}

/* 表格样式优化 */
:deep(.arco-table) {
  border-radius: 12px;
}

:deep(.arco-table-th) {
  background-color: #f7f8fa;
  font-weight: 600;
  padding: 16px;
}

:deep(.arco-table-td) {
  padding: 16px;
}

:deep(.arco-table-tr:hover) {
  background-color: #f2f3f5;
}

/* 按钮样式 */
.add-metric-btn {
  min-width: 120px;
}

/* 动画效果 */
@keyframes containerFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式布局调整 */
@media screen and (max-width: 1400px) {
  .index-manager-directory {
    width: 240px;
  }
}

@media screen and (max-width: 1200px) {
  .index-manager-container {
    padding: 16px;
    gap: 16px;
  }
  
  .index-manager-directory {
    width: 220px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-left {
    max-width: none;
  }
}

@media screen and (max-width: 768px) {
  .index-manager-container {
    flex-direction: column;
  }
  
  .index-manager-directory {
    width: 100%;
  }
  
  .index-type-options {
    grid-template-columns: 1fr;
  }
}
</style>
