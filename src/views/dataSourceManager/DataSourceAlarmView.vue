<template>
  <container :top-menu-type="3" :top-menu-selected="'/datasource/list'">
    <template #content>
      <div class="alarm-page">
        <div class="alarm-page-breadcrumb">
          <a-breadcrumb :routes="route">
            <template #item-render="{route, paths}">
              <div v-if="paths.length === 2">
                {{ route.label }}
              </div>
              <div v-else>
                <a-link :href="getFullPath(paths)">
                  {{ route.label }}
                </a-link>
              </div>
            </template>
          </a-breadcrumb>
        </div>

        <div class="alarm-page-content">
          <div class="alarm-page-content-header">

            <div class="alarm-page-header-search">
              <a-input-search :style="{width:'320px'}" placeholder="按照告警名称查询"/>
            </div>
            <div class="alarm-page-header-button">
              <a-button type="primary" @click="handleClick">添加告警规则</a-button>
            </div>

          </div>
          <div class="alarm-page-content-content">
            <a-table :columns="columns" :data="data">
              <template #optional="{ record }">
                <a-button type="primary" @click="$modal.info({ title:'Name', content:record.name })">使用</a-button>
                <a-button @click="$modal.info({ title:'Name', content:record.name })">删除</a-button>
              </template>
            </a-table>
          </div>
        </div>

      </div>
      <div>
        <a-modal v-model:visible="visible" :ok-loading="false" @ok="handleOk" @cancel="handleCancel" :align-center="false">
          <template #title>
            添加告警规则
          </template>
          <div class="alarm-form-items">
            <div class="alarm-form-item">
              <div class="alarm-form-item-label">
                告警名称
              </div>
              <div class="alarm-form-item-label-input">
                <a-input placeholder="Please enter something" v-model="alarmForm.alarmName" allow-clear/>
              </div>
            </div>

            <div class="alarm-form-item">
              <div class="alarm-form-item-label">
                告警数据源名称
              </div>
              <div class="alarm-form-item-label-input">
                <a-select placeholder="Please select ..." v-model="alarmForm.datasourceId">
                  <a-option v-for="datasource in datasourceList" :value="datasource.id">{{ datasource.name }}</a-option>
                </a-select>
              </div>
            </div>

            <div class="alarm-form-item">
              <div class="alarm-form-item-label">
                告警触发方式
              </div>
              <div class="alarm-form-item-label-input">
                <a-radio-group v-model="alarmForm.alarmMethod">
                  <a-radio value="0">短信</a-radio>
                  <a-radio value="1">邮箱</a-radio>
                </a-radio-group>
              </div>
            </div>

            <div class="alarm-form-item">
              <div class="alarm-form-item-label">
                接收人
              </div>
              <div class="alarm-form-item-label-input">
                <a-radio-group v-model="alarmForm.recipientType">
                  <a-radio value="0">数据源创建用户</a-radio>
                  <a-radio value="1">告警规则创建用户</a-radio>
                  <a-radio value="2">其他用户</a-radio>
                </a-radio-group>
              </div>
            </div>

            <div class="alarm-form-item" v-if="alarmForm.recipientType==2">
              <div class="alarm-form-item-label">
                其他用户选择
              </div>
              <div class="alarm-form-item-label-input">

                <a-select placeholder="Please select ..." v-model="alarmForm.recipientId">
                  <a-option v-for="user in allUserList" :value="user.id">{{ user.username }}</a-option>
                </a-select>
              </div>
            </div>

          </div>
        </a-modal>
      </div>
    </template>
  </container>

</template>

<script setup lang="ts">

import container from "../../components/Container.vue";
import {reactive, ref} from "vue";

// 确定后端后改为ts
const alarmForm = reactive({
  alarmName: '',
  datasourceId: '',
  triggerMode: '',
  alarmMethod: '',
  recipientType: undefined,
  recipientId: undefined,
})

const allUserList = reactive([
  {
    id: 0,
    username: 'mock用户1'
  },
  {
    id: 1,
    username: 'mock用户2'
  }
])

const datasourceList = reactive([
  {
    id: 0,
    name: '数据源1'
  },
  {
    id: 1,
    name: '数据源2'
  }
])


const route = reactive([
  {
    path: 'list',
    label: '数据源中心',
  },
  {
    path: '/alarm',
    label: '数据源告警',
  },
]);

const columns = [{
  title: '告警名称',
  dataIndex: 'name',
},
  {
    title: '绑定数据源',
    dataIndex: 'salary',
  },
  {
    title: '告警方式',
    dataIndex: 'address',
  },
  {
    title: '状态',
    dataIndex: 'email',
  },
  {
    title: '告警接收人',
    dataIndex: 'email',
  },
  {
    title: '告警创建人',
    dataIndex: 'email',
  },
  {
    title: '创建时间',
    dataIndex: 'email',
  },
  {
    title: 'Optional',
    slotName: 'optional'
  }];
const data = [{
  key: '1',
  name: 'Jane Doe',
  first: 'Jane',
  last: 'Doe',
  salary: 23000,
  address: '32 Park Road, London',
  email: 'jane.doe@example.com'
}, {
  key: '2',
  name: 'Alisa Ross',
  first: 'Alisa',
  last: 'Ross',
  salary: 25000,
  address: '35 Park Road, London',
  email: 'alisa.ross@example.com'
}, {
  key: '3',
  name: 'Kevin Sandra',
  first: 'Kevin',
  last: 'Sandra',
  salary: 22000,
  address: '31 Park Road, London',
  email: 'kevin.sandra@example.com'
}, {
  key: '4',
  name: 'Ed Hellen',
  first: 'Ed',
  last: 'Hellen',
  salary: 17000,
  address: '42 Park Road, London',
  email: 'ed.hellen@example.com'
}, {
  key: '5',
  name: 'William Smith',
  first: 'William',
  last: 'Smith',
  salary: 27000,
  address: '62 Park Road, London',
  email: 'william.smith@example.com'
}];
const visible = ref(false);

// TODO 改名字
const handleClick = () => {
  initAlarmForm()

  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
  console.log(alarmForm)
};
const handleCancel = () => {
  visible.value = false;
}

const getFullPath = (paths: string[]) => {
  return paths.join('/').split('.').slice(paths.length - 1).join('/');
};

const initAlarmForm = ()=>{
  alarmForm.datasourceId = ''
  alarmForm.recipientType = undefined
  alarmForm.alarmName = ''
  alarmForm.alarmMethod = ''
  alarmForm.recipientId = undefined
  alarmForm.triggerMode = ''


}


</script>

<style scoped>
.alarm-page {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
}

.alarm-page-breadcrumb {
  height: 5%;
  margin-top: -4px;
  display: flex;
  justify-content: start;
}

.alarm-page-content {
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.alarm-page-content-header {
  height: 10%;
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
}

.alarm-page-content-content {
  margin-top: -20px;
  height: 90%;
}

.alarm-form-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alarm-form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;

}

</style>