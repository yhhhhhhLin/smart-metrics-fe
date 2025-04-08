<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'"
             :left-menu-selected="'/project/index-management/data-management/dimension-management'" :sidebarType="1">
    <template #content>
      <div class="dim-add-or-update-content">
        <div class="step-bar">
          <a-steps :current="currentStep" :small="true">
            <a-step>维表信息设置</a-step>
            <a-step>维度属性设置</a-step>
          </a-steps>
        </div>
        <a-divider/>

        <div class="step-content">
          <div v-if="currentStep === 1" class="form-wrapper">
            <div class="step-section">
              <div class="step-content-title">基础信息</div>
              <a-form layout="vertical" class="form-section">
                <a-form-item label="维度对象名称">
                  <a-input v-model="dimForm.name" placeholder="请输入维度对象名称"/>
                </a-form-item>
                <a-form-item label="维度对象标识">
                  <a-input v-model="dimForm.code" placeholder="请输入维度对象标识"/>
                </a-form-item>
                <a-form-item label="维度对象描述">
                  <a-textarea v-model="dimForm.description" placeholder="请输入维度对象描述" rows="3"/>
                </a-form-item>
              </a-form>
            </div>

            <a-divider/>

            <div class="step-section">
              <div class="step-content-title">主维表信息</div>
              <a-form layout='vertical'>
                <a-form-item label="选择数据库">
                  <a-select v-model="dimForm.database" placeholder="请选择数据库" :options="projectDatabasesOptions" @change="onDatabaseChange"/>
                </a-form-item>
                <a-form-item label="选择表">
                  <a-select v-model="dimForm.table" placeholder="请选择表" :options="projectTablesOptions" />
                </a-form-item>
              </a-form>
            </div>
          </div>

          <div v-if="currentStep === 2" class="step-section">
            <div class="step-content-title">维度属性设置</div>

            <a-table :columns="tableFieldColumns" :data="fieldFormList" :pagination="false" bordered>
              <template #attributeName="{ record, rowIndex }">
                <a-input v-model="record.attributeName" placeholder="请输入属性名称"/>
              </template>
              <template #attributeCode="{ record, rowIndex }">
                <a-input v-model="record.columnName" placeholder="请输入属性标识"/>
              </template>
              <template #attributeDesc="{ record, rowIndex }">
                <a-input v-model="record.attributeDesc" placeholder="请输入属性描述" />
              </template>
            </a-table>
          </div>
        </div>
        <a-divider/>

        <div class="step-button">
          <a-button v-if="currentStep === 1" @click="router.push({name: '维度管理'})">取消</a-button>
          <a-button v-if="currentStep === 2" @click="currentStep = 1">上一步</a-button>
          <a-button type="primary" v-if="currentStep === 1" @click="toNextStep">下一步</a-button>
          <a-button type="primary" v-if="currentStep === 2">完成</a-button>
        </div>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import {onMounted, ref} from "vue";
import {columns, dbs, tables} from "../../services/datasource/datasource.ts";
import router from "../../router";

const currentStep = ref(1);

const projectId = ref()
const projectDscId = ref()
const projectDatabasesOptions = ref([])
const projectTablesOptions = ref([])

const dimForm = ref({
  name: '',
  code: '',
  description: '',
  database: '',
  table: ''
});


const fieldFormList = ref()

const tableFieldColumns = [
  {title: '字段名称', dataIndex: 'columnName'},
  {title: '属性名称', dataIndex: 'attributeName',slotName: 'attributeName'},
  {title: '属性标识', dataIndex: 'attributeCode', slotName: 'attributeCode'},
  {title: '字段类型', dataIndex: 'dataType'},
  {title: '属性描述', dataIndex: 'attributeDesc', slotName: 'attributeDesc'},
]

onMounted(() => {

  projectId.value = sessionStorage.getItem('projectId') || '1'
  projectDscId.value = sessionStorage.getItem('projectDscId') || '1'

  // 获取所有数据库
  fetchDbs()


});

const fetchDbs = () =>{
  dbs({dscId: projectDscId.value}).then(resp=>{
    projectDatabasesOptions.value = []
    resp.data.forEach((database) => {
      projectDatabasesOptions.value.push({label: database.dbName, value: database.dbName})

    })

  }).catch((error)=>{
    console.log(error)
  })

}

const onDatabaseChange = () =>{

  projectTablesOptions.value = []
  tables({dscId: projectDscId.value,dbName:dimForm.value.database}).then((resp)=>{
    resp.data.forEach((table) => {
      projectTablesOptions.value.push({label: table.tableName, value: table.tableName})
    })
  }).catch((error)=>{
    console.log(error)
  })

}


const toNextStep = () => {
  currentStep.value = 2;

  // 根据当前的数据库和表获取表中所有字段
  columns({dscId: projectDscId.value,dbName:dimForm.value.database,tableName:dimForm.value.table})
      .then((resp) => {
        const fields = resp.data
        fieldFormList.value = fields.map(field => ({
          columnName: field.columnName,
          dataType: field.dataType,
          attributeName: '',
          attributeCode: '',
          attributeDesc: field.columnComment || ''
        }));

      }).catch((error)=>{
        console.log(error)
      })

}
</script>

<style scoped>
.dim-add-or-update-content {
  background-color: #FFFFFF;
  height: 93%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 30px;
}

.step-bar {
  width: 70%;
  margin: 0 auto;
  margin-bottom: 20px;
}

.step-content {
  flex: 1;
  overflow-y: auto;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-button {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.step-content-title {
  font-size: 16px;
  font-weight: 550;
  color: #333;
}

.step-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  margin-top: 10px;
}

.step-button a-button {
  min-width: 100px;
}
</style>
