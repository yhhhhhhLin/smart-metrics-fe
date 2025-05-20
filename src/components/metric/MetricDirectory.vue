<template>
  <div class="metric-directory">
    <div class="directory-header">
      <div class="directory-title">
        <div class="title-content">
          <icon-list class="title-icon"/>
          <span class="title-text">指标目录</span>
        </div>
        <a-button type="text" size="mini" class="add-dir-btn" @click="onAddDirClick(null)">
          <template #icon><icon-plus /></template>
        </a-button>
      </div>
      <div class="directory-search">
        <a-input-search
          v-model="searchKey"
          placeholder="搜索目录"
          allow-clear
          class="search-input"
          @input="onSearch"
        />
      </div>
    </div>

    <div class="directory-tree">
      <a-tree 
        :data="treeData" 
        :fieldNames="{ title: 'title', key: 'id', children: 'children' }"
        @rightClick="onRightClick"
        class="custom-tree"
      >
        <template #title="nodeData">
          <template v-if="searchKeyIndex = getMatchIndex(nodeData?.title), searchKeyIndex < 0">
            {{ nodeData?.title }}
          </template>
          <span v-else>
            {{ nodeData?.title?.substr(0, searchKeyIndex) }}
            <span class="highlight-text">
              {{ nodeData?.title?.substr(searchKeyIndex, searchKey.length) }}
            </span>
            {{ nodeData?.title?.substr(searchKeyIndex + searchKey.length) }}
          </span>
        </template>
        <template #extra="nodeData">
          <a-dropdown position="br">
            <IconMore class="more-icon"/>
            <template #content>
              <a-doption @click="onAddDirClick(nodeData?.id)">新建</a-doption>
              <a-doption @click="onEditDirClick(nodeData)">编辑</a-doption>
              <a-doption @click="onDeleteDirClick(nodeData?.id)">删除</a-doption>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>

    <!-- 新增/编辑目录模态框 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      @ok="handleModalOk"
      @cancel="resetModal"
      class="custom-modal"
    >
      <a-input 
        v-model="dirForm.name" 
        placeholder="请输入目录名称" 
        class="modal-input"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { addMetricDir, delMetricDir, getMetricDirTree } from '../../services/metric/metric'
import { Notification } from '@arco-design/web-vue';

// 定义 props 和 emits
const props = defineProps({
  onSelect: {
    type: Function,
    default: undefined
  }
});

const emit = defineEmits(['update']);

// 搜索相关
const searchKey = ref('');
const searchKeyIndex = ref(-1);

// 目录树数据
const treeData = ref<any[]>([]);
const originTreeData = ref<any[]>([]);

// 模态框相关
const modalVisible = ref(false);
const modalTitle = ref('新增目录');
const dirForm = ref({
  name: '',
  parentId: null as number | null,
  editId: null as number | null,
});

// 获取目录树数据
const fetchTreeData = async () => {
  try {
    const resp = await getMetricDirTree();
    originTreeData.value = resp.data;
    treeData.value = resp.data;
  } catch (error) {
    console.error('获取目录树失败:', error);
    Notification.error({
      title: '获取目录树失败',
      content: '请稍后重试',
    });
  }
};

// 搜索处理
const onSearch = () => {
  if (!searchKey.value) {
    treeData.value = originTreeData.value;
    return;
  }
  treeData.value = searchData(searchKey.value);
};

const searchData = (keyword: string) => {
  const loop = (data: any[]) => {
    return data
      .map((item) => {
        const match = item.title.toLowerCase().includes(keyword.toLowerCase());
        if (match) return { ...item };
        if (item.children) {
          const children = loop(item.children);
          if (children.length) return { ...item, children };
        }
        return null;
      })
      .filter(Boolean);
  };
  return loop(originTreeData.value);
};

const getMatchIndex = (title: string) => {
  if (!searchKey.value) return -1;
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
};

// 目录操作处理
const onAddDirClick = (parentId: number | null) => {
  modalTitle.value = '新增目录';
  dirForm.value = { name: '', parentId, editId: null };
  modalVisible.value = true;
};

const onEditDirClick = (node: any) => {
  modalTitle.value = '编辑目录';
  dirForm.value = { 
    name: node.title, 
    parentId: node.parentId, 
    editId: node.id 
  };
  modalVisible.value = true;
};

const onDeleteDirClick = async (nodeId: number) => {
  try {
    await delMetricDir(nodeId);
    Notification.success({
      title: '删除成功',
      content: '目录已删除',
    });
    await fetchTreeData();
    emit('update');
  } catch (error) {
    console.error('删除目录失败:', error);
    Notification.error({
      title: '删除失败',
      content: '请稍后重试',
    });
  }
};

const handleModalOk = async () => {
  if (!dirForm.value.name) {
    Notification.warning({
      title: '提示',
      content: '请输入目录名称',
    });
    return;
  }

  try {
    await addMetricDir({
      name: dirForm.value.name,
      parentId: dirForm.value.parentId,
      id: dirForm.value.editId,
    });
    
    Notification.success({
      title: '操作成功',
      content: dirForm.value.editId ? '目录已更新' : '目录已创建',
    });
    
    await fetchTreeData();
    emit('update');
    resetModal();
  } catch (error) {
    console.error('操作失败:', error);
    Notification.error({
      title: '操作失败',
      content: '请稍后重试',
    });
  }
};

const resetModal = () => {
  modalVisible.value = false;
  dirForm.value = { name: '', parentId: null, editId: null };
};

const onRightClick = (info: any) => {
  const node = info.node;
  onAddDirClick(node.id);
};

// 初始化
fetchTreeData();
</script>

<style scoped>
.metric-directory {
  background-color: #FFFFFF;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: slideInLeft 0.5s ease-out;
  height: 100%;
  width: 100%; /* 让组件自适应容器宽度 */
}

.directory-header {
  padding: 20px;
  border-bottom: 1px solid #f2f3f5;
}

.directory-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 20px;
  color: #1e80ff;
  animation: iconPulse 2s infinite;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

.directory-search {
  margin-top: 16px;
}

.search-input {
  width: 100%;
}

.directory-tree {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.highlight-text {
  color: var(--color-primary-light-4);
  font-weight: 500;
}

.more-icon {
  position: absolute;
  right: 8px;
  font-size: 12px;
  top: 10px;
  color: #3370ff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(.arco-tree-node:hover) .more-icon {
  opacity: 1;
}

:deep(.arco-tree-node) {
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 2px 0;
}

:deep(.arco-tree-node:hover) {
  background-color: #f2f3f5;
  transform: translateX(4px);
}

:deep(.arco-tree-node-selected) {
  background-color: #e8f3ff;
  color: #1e80ff;
}

/* 动画效果 */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes iconPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 滚动条美化 */
:deep(.arco-scrollbar) {
  width: 6px;
}

:deep(.arco-scrollbar-thumb) {
  background-color: #c9cdd4;
  border-radius: 3px;
}

:deep(.arco-scrollbar-thumb:hover) {
  background-color: #86909c;
}

/* 响应式调整 */
@media screen and (max-width: 1400px) {
  .metric-directory {
    min-width: 240px; /* 设置最小宽度 */
  }
}

@media screen and (max-width: 1200px) {
  .metric-directory {
    min-width: 220px;
  }
}

@media screen and (max-width: 768px) {
  .metric-directory {
    min-width: 100%;
    margin-bottom: 16px;
  }
}
</style> 