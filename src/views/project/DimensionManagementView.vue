<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'"
             :left-menu-selected="'/project/index-management/data-management/dimension-management'" :sidebarType="1">
    <template #content>
      <div class="dim-manager-container">
        <div class="dim-manager-content">
          <div class="dim-manager-header">
            <a-input :style="{width:'260px'}" v-model="pageDimensionForm.dimObjectName" @press-enter="fetchDimension"
                     placeholder="请输入维度名称"/>

            <a-button type="primary" @click="toDimAddOrUpdate(0)"> 新增指标维度</a-button>

          </div>
          <div class="dim-manager-mid">
            <a-table :scroll="scrollPercent" :scrollbar="true" :columns="indexDimTableColumns" :data="dimensionData">
              <template #optional="{ record }">
                <div class="dim-list-optional">
                  <a-button type="text" @click="$modal.info({ title:'error', content:record.name })">发布</a-button>
                  <a-button type="text" @click="$modal.info({ title:'error', content:'后端异常，错误代码：500' })">编辑
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
import {pageDimensions} from "../../services/metric/metric.ts";

const projectId = ref()
const projectDscId = ref()

const pageDimensionForm = ref({"pageSize": 10, currentPage: 1, dimObjectName: ''})

onMounted(() => {
  projectId.value = sessionStorage.getItem('projectId') || '1'
  projectDscId.value = sessionStorage.getItem('projectDscId') || '1'
  // TODO 获取所有维度
  fetchDimension()
});

const fetchDimension = () => {
  pageDimensions(pageDimensionForm.value).then(resp => {
    dimensionData.value = []
    resp.data.records.forEach(record => {
      dimensionData.value.push(record)
    })
  }).catch(err => {
    console.log(err)
  })


}

const indexDimTableColumns = [
  {
    title: '维度名称',
    dataIndex: 'dimensionObjectName',
    fixed: 'left',
  },
  {
    title: '维度标识',
    dataIndex: 'dimensionObjectId',
  },
  {
    title: '属性数量',
    dataIndex: 'dimAttrNum',
  },
  {
    title: '维度描述',
    dataIndex: 'dimensionObjectDesc',
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right',
  }
];

const dimensionData = ref([])


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
