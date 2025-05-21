<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/offline-management'" :sidebarType="1">
    <template #content>
      <div class="offline-management-container">
        <div class="content-header">
          <div class="header-left">
            <a-input-search 
              v-model="searchQuery" 
              placeholder="请输入任务名称"
              @search="handleSearch"
              class="task-search"
              allow-clear
            />
          </div>
          <div class="header-right">
            <a-button type="primary" class="add-task-btn" @click="handleNew">
              <template #icon><icon-plus /></template>
              新建任务
            </a-button>
          </div>
        </div>

        <div class="stats-cards">
          <div class="stat-card">
            <h3>门店产品每日销售额</h3>
            <p>{{ mockData.dailySales }} 元</p>
          </div>
          <div class="stat-card">
            <h3>香蕉每周销售额</h3>
            <p>{{ mockData.weeklyBananaSales }} 元</p>
          </div>
          <div class="stat-card">
            <h3>水果每日销量</h3>
            <p>{{ mockData.dailyFruitSales }} 个</p>
          </div>
        </div>

        <div class="content-body">
          <a-table 
            :scroll="scrollPercent" 
            :scrollbar="true" 
            :columns="taskTableColumns" 
            :data="mockData.tasks"
            :pagination="{
              total: mockData.tasks.length,
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              showPageSize: true
            }"
            class="task-table"
            :bordered="false"
            :stripe="true"
          >
            <template #optional="{ record }">
              <div class="task-list-optional">
                <a-button type="text" @click="handleEditTask(record)">编辑</a-button>
                <a-button type="text" @click="handleDeleteTask(record)">删除</a-button>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import { ref } from 'vue';

const searchQuery = ref('');
const mockData = ref({
  dailySales: 10000,
  weeklyBananaSales: 5000,
  dailyFruitSales: 200,
  tasks: [
    { id: 1, name: '门店产品每日销售额', status: '进行中' },
    { id: 2, name: '香蕉每周销售额', status: '已完成' },
    { id: 3, name: '水果每日销量', status: '未开始' }
  ]
});

const handleSearch = () => {
  alert(`搜索任务: ${searchQuery.value}`);
};

const handleNew = () => {
  alert('新建任务');
};

const handleEditTask = (task: any) => {
  alert(`编辑任务: ${task.name}`);
};

const handleDeleteTask = (task: any) => {
  alert(`删除任务: ${task.name}`);
};

const taskTableColumns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    fixed: 'left' as const,
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right' as const,
    width: 120,
  }
];

const scrollPercent = {
  x: '120%',
};
</script>

<style scoped>
.offline-management-container {
  padding: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.task-search {
  width: 300px;
}

.stats-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
  flex: 1;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
}

.task-table th, .task-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.task-table th {
  background-color: #f2f2f2;
}

.task-list-optional {
  display: flex;
  gap: 10px;
}
</style>
