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
                  <a-input v-model:value="dimForm.dimensionName" placeholder="请输入维度对象名称"/>
                </a-form-item>
                <a-form-item label="维度对象标识">
                  <a-input v-model:value="dimForm.dimensionCode" placeholder="请输入维度对象标识"/>
                </a-form-item>
                <a-form-item label="维度对象描述">
                  <a-textarea v-model:value="dimForm.dimensionDesc" placeholder="请输入维度对象描述" rows="3"/>
                </a-form-item>
              </a-form>
            </div>

            <a-divider/>

            <div class="step-section">
              <div class="step-content-title">主维表信息</div>
              <a-form layout="vertical" class="form-section">
                <a-form-item label="选择数据库">
                  <a-select v-model:value="dimForm.database" placeholder="请选择数据库">
                    <a-select-option value="db1">数据库1</a-select-option>
                    <a-select-option value="db2">数据库2</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="选择表">
                  <a-select v-model:value="dimForm.table" placeholder="请选择表">
                    <a-select-option value="table1">表1</a-select-option>
                    <a-select-option value="table2">表2</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </div>
          </div>

          <div v-if="currentStep === 2" class="step-section">
            <div class="step-content-title">维度属性设置</div>

            <a-table :columns="tableFieldColumns" :dataSource="fieldFormList" :pagination="false" bordered>
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'fieldName'">
                  <span>{{ record.fieldName }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'attributeName'">
                  <a-input v-model:value="record.attributeName" placeholder="请输入属性名称"/>
                </template>
                <template v-else-if="column.dataIndex === 'attributeCode'">
                  <a-input v-model:value="record.attributeCode" placeholder="请输入属性标识"/>
                </template>
                <template v-else-if="column.dataIndex === 'fieldType'">
                  <span>{{ record.fieldType }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'attributeDesc'">
                  <a-input v-model:value="record.attributeDesc" placeholder="请输入属性描述"/>
                </template>
              </template>
            </a-table>
          </div>
        </div>

        <a-divider/>

        <div class="step-button">
          <a-button v-if="currentStep === 1" @click="toNextStep">下一步</a-button>
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

const currentStep = ref(1);

const dimForm = ref({
  dimensionName: '',
  dimensionCode: '',
  dimensionDesc: '',
  database: '',
  table: ''
});

const tableFields = ref([
  {fieldName: 'id', fieldType: 'int'},
  {fieldName: 'name', fieldType: 'varchar'},
  {fieldName: 'created_at', fieldType: 'timestamp'},
  {fieldName: 'created_at', fieldType: 'timestamp'},
  {fieldName: 'created_at', fieldType: 'timestamp'},
  {fieldName: 'created_at', fieldType: 'timestamp'}
])

const fieldFormList = ref(tableFields.value.map(f => ({
  fieldName: f.fieldName,
  fieldType: f.fieldType,
  attributeName: '',
  attributeCode: '',
  attributeDesc: ''
})))

const tableFieldColumns = [
  {title: '字段名称', dataIndex: 'fieldName'},
  {title: '属性名称', dataIndex: 'attributeName'},
  {title: '属性标识', dataIndex: 'attributeCode'},
  {title: '字段类型', dataIndex: 'fieldType'},
  {title: '属性描述', dataIndex: 'attributeDesc'},
]

onMounted(() => {
  const dimAddOrUpdateStatus = sessionStorage.getItem("dimAddOrUpdateStatus");
  console.log("新增或修改指标维度状态码", +dimAddOrUpdateStatus);
  // 获取这个数据源所有数据库
});

const toNextStep = () => {
  currentStep.value = 2;
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
