<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'" :left-menu-selected="'/project/index-management/index-develop'" :sidebarType="1">
    <template #content>
      <div class="index-manager-container">
        <div class="index-manager-directory">
          <div class="index-dir-header">
            <div class="index-dir-header-title">
              <div class="index-dir-header-title-left">
                <icon-list />
                <span>指标目录</span>
              </div>
              <a-button type="text" size="mini" @click="onAddDirClick(null)">+</a-button>
            </div>
            <a-input-search
                style="margin-bottom: 8px; max-width: 300px"
                v-model="metricDirSearchKey"
            />
          </div>

          <a-tree :data="treeData" :fieldNames="{ title: 'title', key: 'id', children: 'children' }" @rightClick="onRightClick">
            <template #title="nodeData">
              <template v-if="metricsDirSearchKeyIndex = getMatchIndex(nodeData?.title), metricsDirSearchKeyIndex < 0">{{ nodeData?.title }}</template>
              <span v-else>
                {{ nodeData?.title?.substr(0, metricsDirSearchKeyIndex) }}
                <span style="color: var(--color-primary-light-4);">
                  {{ nodeData?.title?.substr(metricsDirSearchKeyIndex, metricDirSearchKey.length) }}
                </span>
                {{ nodeData?.title?.substr(metricsDirSearchKeyIndex + metricDirSearchKey.length) }}
              </span>
            </template>
            <template #extra="nodeData">
              <a-dropdown position="br">
                <IconMore
                    style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff;"
                />
                <template #content>
                  <a-doption @click="onAddDirClick(nodeData?.id)">新建</a-doption>
                  <a-doption @click="clickDirEdit">编辑</a-doption>
                  <a-doption @click="clickDirDel(nodeData?.id)">删除</a-doption>
                </template>
              </a-dropdown>
            </template>
          </a-tree>
        </div>
        <div class="index-manager-content">
          <div class="index-manager-header">
            <a-input-search :style="{width:'260px'}" placeholder="请输入指标名称"/>

            <a-button type="primary" @click="showIndexTypeDialog = true"> 新增指标 </a-button>

          </div>
          <div class="index-manager-mid">
            <a-table :scroll="scrollPercent" :scrollbar="true" :columns="indexTableColumns" :data="indexData" >
              <template #optional="{ record }">
                <div class="index-list-optional">
                  <a-button type="text" @click="$modal.info({ title:'Name', content:record.name })">发布</a-button>
                  <a-button type="text" @click="$modal.info({ title:'Name', content:record.name })">编辑</a-button>
                </div>
              </template>
            </a-table>

          </div>
        </div>
      </div>

      <a-modal
          v-model:visible="addDirModalVisible"
          title="新增目录"
          @ok="handleAddDir"
          @cancel="resetAddDirModal"
      >
        <a-input v-model="addDirForm.name" placeholder="请输入目录名称" style="margin-bottom: 12px" />
      </a-modal>

      <a-modal
          :visible="showIndexTypeDialog"
          title="请选择指标类型"
          @cancel="showIndexTypeDialog = false"
          :footer="false"
      >
        <div class="index-type-options">
          <div class="index-type-button" @click="selectIndexType(0)">普通指标</div>
          <div class="index-type-button" @click="selectIndexType(1)">复合指标</div>
        </div>
      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {getMetricDirTree, addMetricDir, delMetricDir} from "../../services/metric/metric.ts";
import {Notification} from "@arco-design/web-vue";
import router from "../../router";

const metricDirSearchKey = ref('');
const metricsDirSearchKeyIndex = ref(-1);

const showIndexTypeDialog = ref(false)

let originMetricDirTreeData = ref<any[]>([]);

const addDirModalVisible = ref(false);
const addDirForm = ref({
  name: '',
  parentId: null as null | number,
});

const onAddDirClick = (parentId: number | null) => {
  addDirForm.value = { name: '', parentId };
  addDirModalVisible.value = true;
};

const handleAddDir = async () => {
  if (!addDirForm.value.name) return;

  try {
    const res = await addMetricDir({
      name: addDirForm.value.name,
      parentId: addDirForm.value.parentId,
    });

    if (res.data) {
      await fetchMetricDirTree();
    }
  } catch (e) {
    console.error(e);
  } finally {
    resetAddDirModal();
  }
};

const resetAddDirModal = () => {
  addDirModalVisible.value = false;
  addDirForm.value = { name: '', parentId: null };
};

const onRightClick = (info) => {
  const node = info.node;
  onAddDirClick(node.id);
};

const fetchMetricDirTree = async () => {
  try {
    const resp = await getMetricDirTree();
    originMetricDirTreeData.value = resp.data;
  } catch (error) {
    console.error(error);
  }
};

const treeData = computed(() => {
  if (!metricDirSearchKey.value) return originMetricDirTreeData.value;
  return searchData(metricDirSearchKey.value);
});

const searchData = (keyword: string) => {
  const loop = (data) => {
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
  return loop(originMetricDirTreeData.value);
};

const getMatchIndex = (title: string) => {
  if (!metricDirSearchKey.value) return -1;
  return title.toLowerCase().indexOf(metricDirSearchKey.value.toLowerCase());
};

onMounted(() => {
  fetchMetricDirTree();
  // TODO 获取所有指标
});

const clickDirEdit = ()=>{

}

const clickDirDel = async (nodeDirId)=>{
  const resp = await delMetricDir(nodeDirId)

  if(!resp.code){
    Notification.success({
      title: '系统提示',
      content: '删除成功',
      closable: true
    })
  }

  await fetchMetricDirTree();

}

const indexTableColumns = [
  {
    title: '指标名称',
    dataIndex: 'name',
    fixed: 'left',
    width: 200,
  },
  {
    title: '指标标识',
    dataIndex: 'salary',
    width: 150,
  },
  {
    title: '指标目录',
    dataIndex: 'address',
    width: 120,
  },
  {
    title: '指标类型',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '是否发布',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '操作状态',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '负责人',
    dataIndex: 'email',
    width: 150,
  },
  {
    title: '更新人',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '更新时间',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right',
    width: 120,
  }
];
const indexData = reactive([{
  key: '1',
  name: 'Jane Doe',
  salary: 23000,
  address: '32 Park Road, London',
  email: 'jane.doe@example.com'
}, {
  key: '2',
  name: 'Alisa Ross',
  salary: 25000,
  address: '35 Park Road, London',
  email: 'alisa.ross@example.com'
}, {
  key: '3',
  name: 'Kevin Sandra',
  salary: 22000,
  address: '31 Park Road, London',
  email: 'kevin.sandra@example.com'
}, {
  key: '4',
  name: 'Ed Hellen',
  salary: 17000,
  address: '42 Park Road, London',
  email: 'ed.hellen@example.com'
}, {
  key: '5',
  name: 'William Smith',
  salary: 27000,
  address: '62 Park Road, London',
  email: 'william.smith@example.com'
}]);

const scrollPercent = {
  x: '120%',
  y: '100%'
};

// 0为新增指标 1为编辑指标
const toIndexAddOrUpdate = (typeNum: number)=>{
  sessionStorage.setItem("dimAddOrUpdateStatus", typeNum)
  router.push({
    name: '指标新增或修改',
  });

}

// 0普通指标 1复合指标
const selectIndexType = (type: number)=>{
  if(type == 0){
    router.push({name: '普通指标创建或修改'})
  }else{
    router.push({name: '复合指标创建或修改'})
  }

}

</script>

<style>

.index-manager-container{
  background-color: #f1f6fb;
  display: flex;
  flex-grow: 1;
  border-radius: 5px;
  height: calc(100vh - 120px);
}

.index-manager-directory {
  background-color: #FFFFFF;
  width: 250px;
  height: 100%;
  border-radius: 5px;
  padding: 20px;
}

.index-manager-content {
  background-color: #FFFFFF;
  height: 100%;
  width: 100%;
  margin-left: 10px;
  border-radius: 5px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.index-manager-header{
  display: flex;
  justify-content: space-between;
  margin: 0 10px 10px 10px;
}

.index-dir-header{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.index-dir-header-title{
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.index-dir-header-title-left{
  display: flex;
  align-items: center;
  gap: 5px;
}

.index-list-optional{
  gap: 5px;
  display: flex;
}

.index-type-options {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.index-type-button {
  width: 120px;
  height: 100px;
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.index-type-button:hover {
  border-color: #1890ff;
  background-color: #e6f7ff;
  color: #1890ff;
  box-shadow: 0 0 6px rgba(24, 144, 255, 0.3);
}
</style>
