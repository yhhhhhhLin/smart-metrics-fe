<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/metric-permission'">
    <template #content>
      <div class="metric-permission-container">
        <div class="header">
          <h2>指标权限管理</h2>
          <a-button type="primary" @click="showAddPermissionModal">
            <template #icon><icon-plus /></template>
            添加权限
          </a-button>
        </div>

        <!-- 权限列表 -->
        <div class="permission-list">
          <a-table :columns="columns" :data="permissionList" :pagination="false">
            <template #metric="{ record }">
              <div class="metric-info">
                <span class="metric-name">{{ record.metricName }}</span>
                <a-tag size="small" :color="record.metricType === 'normal' ? 'arcoblue' : 'green'">
                  {{ record.metricType === 'normal' ? '普通指标' : '复合指标' }}
                </a-tag>
              </div>
            </template>
            <template #permissions="{ record }">
              <div class="permission-tags">
                <a-tag v-for="perm in record.permissions" 
                       :key="perm.type" 
                       :color="getPermissionColor(perm.type)">
                  {{ getPermissionLabel(perm.type) }}
                </a-tag>
              </div>
            </template>
            <template #action="{ record }">
              <div class="action-buttons">
                <a-button type="text" @click="editPermission(record)">
                  <template #icon><icon-edit /></template>
                  编辑
                </a-button>
                <a-popconfirm
                  content="确定要删除这条权限记录吗？"
                  @ok="deletePermission(record)"
                >
                  <a-button type="text" status="danger">
                    <template #icon><icon-delete /></template>
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
        </div>

        <!-- 添加/编辑权限弹窗 -->
        <a-modal
          v-model:visible="permissionModalVisible"
          :title="isEdit ? '编辑权限' : '添加权限'"
          @ok="handlePermissionSubmit"
          @cancel="closePermissionModal"
        >
          <a-form :model="permissionForm" layout="vertical">
            <a-form-item field="metricId" label="选择指标" required>
              <a-select
                v-model="permissionForm.metricId"
                placeholder="请选择指标"
                allow-search
                :filter-option="filterMetricOption"
              >
                <a-option
                  v-for="metric in metricList"
                  :key="metric.id"
                  :value="metric.id"
                >
                  <div class="metric-option">
                    <span>{{ metric.name }}</span>
                    <a-tag size="small" :color="metric.type === 'normal' ? 'arcoblue' : 'green'">
                      {{ metric.type === 'normal' ? '普通指标' : '复合指标' }}
                    </a-tag>
                  </div>
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="permissions" label="权限设置" required>
              <a-checkbox-group v-model="permissionForm.permissions">
                <a-checkbox value="view">查看</a-checkbox>
                <a-checkbox value="delete">删除</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item field="users" label="用户" required>
              <a-select
                v-model="permissionForm.users"
                placeholder="请选择用户"
                multiple
                allow-search
                :filter-option="filterUserOption"
              >
                <a-option
                  v-for="user in userList"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Container from '../../components/Container.vue';
import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';
import { Message, Notification } from '@arco-design/web-vue';
import {
  addMetricPermission,
  updateMetricPermission,
  deleteMetricPermission,
  pageMetric
} from '../../services/metric/metric';

interface Metric {
  id: number;
  name: string;
  type: 'normal' | 'composite';
}

interface User {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  metricId: number;
  metricName: string;
  metricType: 'normal' | 'composite';
  permissions: Array<{ type: string; label: string }>;
  users: string[];
}

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

interface PageResponse<T> {
  list: T[];
  total: number;
}

// 表格列定义
const columns = [
  {
    title: '指标',
    dataIndex: 'metric',
    slotName: 'metric',
  },
  {
    title: '权限',
    dataIndex: 'permissions',
    slotName: 'permissions',
  },
  {
    title: '用户',
    dataIndex: 'users',
  },
  {
    title: '操作',
    slotName: 'action',
    width: 200,
  },
];

// 权限列表数据
const permissionList = ref<Permission[]>([]);

// 指标列表
const metricList = ref<Metric[]>([]);

// 用户列表
const userList = ref<User[]>([]);

// 权限表单
const permissionForm = reactive({
  metricId: '',
  permissions: [] as string[],
  users: [] as number[],
});

// 弹窗控制
const permissionModalVisible = ref(false);
const isEdit = ref(false);
const currentEditId = ref<number | null>(null);

// 模拟用户数据
const mockUsers: User[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
  { id: 5, name: '钱七' }
];

// 模拟权限数据
const mockPermissions: Permission[] = [
  {
    id: 1,
    metricId: 1,
    metricName: '香蕉销售额',
    metricType: 'normal',
    permissions: [
      { type: 'view', label: '查看' },
      { type: 'delete', label: '删除' }
    ],
    users: ['张三', '李四']
  },
  {
    id: 2,
    metricId: 2,
    metricName: '门店销售情况',
    metricType: 'composite',
    permissions: [
      { type: 'view', label: '查看' },
      { type: 'delete', label: '删除' }
    ],
    users: ['王五', '赵六']
  }
];

// 加载数据
const loadData = async () => {
  try {
    const metricsRes = await pageMetric({ pageSize: 1000, currentPage: 1, metricName: '' });

    if (metricsRes.code === 0) {
      metricList.value = metricsRes.data.records.map((item: any) => ({
        id: item.id,
        name: item.metricName,
        type: item.metricType === '1' ? 'normal' : 'composite'
      }));
    }
    // 使用模拟数据
    permissionList.value = mockPermissions;
    userList.value = mockUsers;
  } catch (error) {
    console.error('加载数据失败:', error);
    Notification.error({
      title: '加载失败',
      content: '获取数据失败，请稍后重试'
    });
  }
};

// 显示添加权限弹窗
const showAddPermissionModal = () => {
  isEdit.value = false;
  currentEditId.value = null;
  permissionForm.metricId = '';
  permissionForm.permissions = [];
  permissionForm.users = [];
  permissionModalVisible.value = true;
};

// 编辑权限
const editPermission = (record: any) => {
  isEdit.value = true;
  currentEditId.value = record.id;
  permissionForm.metricId = record.metricId;
  permissionForm.permissions = record.permissions.map((p: any) => p.type);
  permissionForm.users = record.users;
  permissionModalVisible.value = true;
};

// 删除权限
const deletePermission = async (record: any) => {
  try {
    // 模拟删除操作
    permissionList.value = permissionList.value.filter(p => p.id !== record.id);
    Message.success('删除成功');
  } catch (error) {
    console.error('删除失败:', error);
    Message.error('删除失败，请稍后重试');
  }
};

// 提交权限表单
const handlePermissionSubmit = async () => {
  try {
    const data = {
      metricId: Number(permissionForm.metricId),
      permissions: permissionForm.permissions,
      users: permissionForm.users
    };

    if (isEdit.value && currentEditId.value) {
      // 模拟更新操作
      const index = permissionList.value.findIndex(p => p.id === currentEditId.value);
      if (index !== -1) {
        const metric = metricList.value.find(m => m.id === data.metricId);
        if (metric) {
          permissionList.value[index] = {
            id: currentEditId.value,
            metricId: data.metricId,
            metricName: metric.name,
            metricType: metric.type,
            permissions: data.permissions.map(p => ({ type: p, label: getPermissionLabel(p) })),
            users: data.users.map(id => mockUsers.find(u => u.id === id)?.name || '')
          };
        }
      }
    } else {
      // 模拟添加操作
      const metric = metricList.value.find(m => m.id === data.metricId);
      if (metric) {
        const newPermission: Permission = {
          id: Math.max(...permissionList.value.map(p => p.id)) + 1,
          metricId: data.metricId,
          metricName: metric.name,
          metricType: metric.type,
          permissions: data.permissions.map(p => ({ type: p, label: getPermissionLabel(p) })),
          users: data.users.map(id => mockUsers.find(u => u.id === id)?.name || '')
        };
        permissionList.value.push(newPermission);
      }
    }

    Message.success(isEdit.value ? '编辑成功' : '添加成功');
    closePermissionModal();
  } catch (error) {
    console.error('提交失败:', error);
    Message.error('操作失败，请稍后重试');
  }
};

// 关闭权限弹窗
const closePermissionModal = () => {
  permissionModalVisible.value = false;
};

// 获取权限标签颜色
const getPermissionColor = (type: string) => {
  const colorMap: Record<string, string> = {
    view: 'arcoblue',
    delete: 'red',
  };
  return colorMap[type] || 'arcoblue';
};

// 获取权限标签文本
const getPermissionLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    view: '查看',
    delete: '删除',
  };
  return labelMap[type] || type;
};

// 指标搜索过滤
const filterMetricOption = (inputValue: string, option: any) => {
  return option.value.name.toLowerCase().includes(inputValue.toLowerCase());
};

// 用户搜索过滤
const filterUserOption = (inputValue: string, option: any) => {
  return option.value.name.toLowerCase().includes(inputValue.toLowerCase());
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.metric-permission-container {
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  min-height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  color: #1d2129;
}

.permission-list {
  margin-top: 24px;
}

.metric-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-name {
  font-weight: 500;
}

.permission-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.metric-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.arco-table-th) {
  background-color: #f7f8fa;
  font-weight: 600;
}

:deep(.arco-table-td) {
  padding: 16px;
}

:deep(.arco-form-item-label) {
  font-weight: 500;
}

:deep(.arco-select-view) {
  width: 100%;
}
</style> 