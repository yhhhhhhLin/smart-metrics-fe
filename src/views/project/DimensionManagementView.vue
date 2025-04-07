<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'"
             :left-menu-selected="'/project/index-management/data-management/dimension-management'" :sidebarType="1">
    <template #content>
      <div class="dim-manager-container">
        <div class="dim-manager-content">
          <div class="dim-manager-header">
            <a-input-search :style="{width:'260px'}" placeholder="请输入维度名称"/>

            <a-button type="primary" @click="toDimAddOrUpdate(0)"> 新增指标维度</a-button>

          </div>
          <div class="dim-manager-mid">
            <a-table :scroll="scrollPercent" :scrollbar="true" :columns="indexDimTableColumns" :data="indexData">
              <template #optional="{ record }">
                <div class="dim-list-optional">
                  <a-button type="text" @click="$modal.info({ title:'Name', content:record.name })">发布</a-button>
                  <a-button type="text" @click="$modal.info({ title:'Name', content:record.name })">编辑</a-button>
                </div>
              </template>
            </a-table>

          </div>
        </div>
      </div>



    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import {onMounted, reactive} from "vue";
import router from "../../router";


onMounted(() => {
  // 获取所有维度

});

const indexDimTableColumns = [
  {
    title: '维度名称',
    dataIndex: 'name',
    fixed: 'left',
    width: 200,
  },
  {
    title: '维度标识',
    dataIndex: 'salary',
    width: 150,
  },
  {
    title: '属性数量',
    dataIndex: 'address',
    width: 120,
  },
  {
    title: '维度描述',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '是否发布',
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
const toDimAddOrUpdate = (typeNum: number)=>{
  sessionStorage.setItem("dimAddOrUpdateStatus", typeNum)
  router.push({
    name: '维度新增或修改',
  });

}

</script>

<style>

.dim-manager-container {
  background-color: #f1f6fb;
  display: flex;
  flex-grow: 1;
  border-radius: 5px;
  height: calc(100vh - 120px);
}

.bus-manager-content {
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

.dim-manager-header {
  display: flex;
  justify-content: space-between;
  margin: 0 10px 10px 10px;
}

.dim-list-optional {
  gap: 5px;
  display: flex;
}
</style>
