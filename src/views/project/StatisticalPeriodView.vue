<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'"
             :left-menu-selected="'/project/index-management/data-management/statistical-period'" :sidebarType="1">
    <template #content>
      <div class="statistical-period-container">
        <div class="statistical-period-content">
          <div class="statistical-period-manager-header">
            <a-input :style="{width:'260px'}" v-model="pageDimensionForm.dimObjectName" @press-enter="fetchDimension"
                     placeholder="请输入统计周期"/>

          </div>
          <div class="statistical-period-mid">
            <a-table :columns="indexSPColumns" :data="sPData">
              <template #optional="{ record }">
                <div class="statistical-period-optional">
                  <a-button type="text" @click="$modal.info({ title:'error', content:record.name })">编辑</a-button>
                  <a-button type="text" @click="$modal.info({ title:'error', content:'后端异常，错误代码：500' })">删除
                  </a-button>
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
import {onMounted, ref} from "vue";
import router from "../../router";
import {listISP} from "../../services/metric/metric.ts";

const projectId = ref()
const projectDscId = ref()

const pageDimensionForm = ref({"pageSize": 10, currentPage: 1, dimObjectName: ''})

onMounted(() => {
  projectId.value = sessionStorage.getItem('projectId') || '1'
  projectDscId.value = sessionStorage.getItem('projectDscId') || '1'
  // TODO 获取所有维度
  fetchSP()
});

const fetchSP = () => {
  listISP().then(resp => {
    sPData.value = []
    resp.data.forEach(record => {
      sPData.value.push(record)
    })
  }).catch(err => {
    console.log(err)
  })

}

const indexSPColumns = [
  {
    title: '统计周期名称',
    dataIndex: 'name',
    width: '100'
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: '200'
  },
  {
    title: '统计周期标识',
    dataIndex: 'statCycle',
    width: '100'
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: '200'
  },
  {
    title: '操作',
    slotName: 'optional',
    width: '100'
  }
];

const sPData = ref([])


const scrollPercent = {
  x: '120%',
  y: '100%'
};

// 0为新增指标 1为编辑指标
const toDimAddOrUpdate = (typeNum: number) => {
  sessionStorage.setItem("dimAddOrUpdateStatus", typeNum)
  router.push({
    name: '维度新增或修改',
  });

}

</script>

<style>

.statistical-period-container {
  background-color: #f1f6fb;
  display: flex;
  flex-grow: 1;
  border-radius: 5px;
  height: calc(100vh - 120px);
}

.statistical-period-content {
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

.statistical-period-manager-header {
  display: flex;
  justify-content: space-between;
  margin: 0 10px 10px 10px;
}

.statistical-period-optional {
  gap: 5px;
  display: flex;
}
</style>
