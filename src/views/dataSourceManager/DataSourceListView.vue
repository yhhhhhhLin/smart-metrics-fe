<template>
  <container :top-menu-type="3" :top-menu-selected="'/datasource/list'">
    <template #content>
      <div class="datasource-list">
        <div class="datasource-list-header">
          <div class="select-forms">
            <div class="select-forms-item">
              <div class="select-form-item-label">
                名称

              </div>
              <div class="select-form-item-label-input">
                <a-input-search :style="{width:'220px'}" placeholder="按数据源名称查询"/>

              </div>
            </div>
            <div class="select-forms-item">
              <div class="select-form-item-label">
                类型
              </div>
              <div class="select-form-item-label-input">
                <a-select :style="{width:'320px'}" v-model="value" placeholder="按数据源描述查询" allow-clear>
                  <a-option>Beijing</a-option>
                  <a-option>Shanghai</a-option>
                  <a-option>Guangzhou</a-option>
                  <a-option disabled>Disabled</a-option>
                </a-select>
              </div>
            </div>

            <div class="select-forms-item">
              <div class="select-form-item-label">
                描述

              </div>
              <div class="select-form-item-label-input">
                <a-input-search :style="{width:'220px'}" placeholder="Please enter something"/>

              </div>
            </div>

            <div class="select-forms-item">
              <div class="select-form-item-label">
                状态

              </div>
              <div class="select-form-item-label-input">

                <a-select :style="{width:'320px'}" v-model="value2" placeholder="Please select ..." allow-clear>
                  <a-option>可用</a-option>
                  <a-option>不可用</a-option>
                </a-select>

              </div>
            </div>
          </div>

          <div class="select-forms-button">
            <a-button @click="toAlarmDataSourcePath">告警配置</a-button>
            <a-button type="primary" @click="toAddDataSourcePath">新增数据源</a-button>
          </div>

        </div>
        <div class="datasource-items">

          <a-table :columns="columns" :data="data" :sticky-header="60" :scroll="scroll"/>
        </div>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import {reactive, ref} from "vue";
import router from "../../router";


const value = ref('Shanghai');
const value2 = ref('可用');

const columns = [
  {
    title: '数据源名称',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'salary',
  },
  {
    title: '描述',
    dataIndex: 'address',
    width: 350
  },
  {
    title: '状态',
    dataIndex: 'email',
  },
  {
    title: '连接信息',
    dataIndex: 'email',
    width: 500
  },
  {
    title: '负责人名称',
    dataIndex: 'email',
    width: 300
  },
  {
    title: '创建时间',
    dataIndex: 'email',
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'email',
  },
];
const data = reactive([{
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

const scroll = {
  x: 2000,
  y: 200
}

const toAddDataSourcePath = () => {
  router.push('/datasource/add')
}

const toAlarmDataSourcePath = () =>{
  router.push('/datasource/alarm')
}


</script>

<style scoped>
.datasource-list {
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 5px;
  overflow-y: auto;
  padding: 20px 20px;

}

.datasource-list-header {
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.select-forms {
  display: flex;
  gap: 25px;

}

.select-forms-item {
  display: flex;
  gap: 10px;
}

.select-form-item-label {
  margin-top: 5px;
}

.select-forms-button {
  display: flex;
  gap: 10px;
}

.datasource-items {
  flex-grow: 1;
}


</style>
