<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/online'">
    <template #content>
      <div class="query-page">
        <!-- 标题和模式切换 -->
        <div class="header">
          <h2>数据库查询工具</h2>
          <a-radio-group type="button" v-model="queryMode">
            <a-radio value="simple">简单查询</a-radio>
            <a-radio value="advanced">高级SQL查询</a-radio>
          </a-radio-group>
        </div>

        <!-- 简单查询模式 -->
        <div v-if="queryMode === 'simple'" class="simple-query">
          <p>简单查询只能单表查询</p>
          <a-form :model="simpleQuery" layout="vertical">
            <!-- 表选择 -->
            <a-form-item label="选择表">
              <a-select v-model="simpleQuery.tableName" placeholder="请选择表" :options="tableOptions"
                        @change="onTableChange"/>
            </a-form-item>

            <!-- 查询字段管理 -->
            <a-form-item label="查询字段">
              <div class="fields-container">
                <!-- 普通字段选择 -->
                <a-select
                    v-model="tempField.field"
                    placeholder="请选择普通字段"
                    :options="fieldOptions"
                    style="width: 150px"
                />
                <!-- 聚合字段选择 -->
                <a-select
                    v-model="tempField.aggregate"
                    placeholder="选择聚合函数"
                    :options="aggregateFieldOptions"
                    style="width: 120px; margin-left: 10px"
                />
                <a-button type="primary" @click="addField" style="margin-left: 10px">添加字段</a-button>
                <a-button type="primary" @click="addCustomizedField" style="margin-left: 10px">添加自定义字段</a-button>
              </div>
            </a-form-item>

            <div class="selected-fields">
              <p>已选择字段：</p>
              <div v-for="(field, index) in simpleQuery.fields" :key="index" class="selected-field">
                <span>{{ formatFieldLabel(field) }}</span>
                <a-button type="text" status="danger" @click="removeField(index)">删除</a-button>
              </div>
            </div>

            <!-- 条件设置 -->
            <div class="conditions">
              <div class="condition-header">
                <span>条件设置：</span>
                <a-button type="primary" @click="addCondition">添加条件</a-button>
              </div>
              <div v-for="(condition, index) in simpleQuery.conditions" :key="index" class="condition-row">
                <a-select
                    v-model="condition.field"
                    placeholder="字段"
                    :options="fieldOptions"
                    style="width: 150px"
                />
                <a-select
                    v-model="condition.operator"
                    placeholder="操作符"
                    :options="operatorOptions"
                    style="width: 120px"
                />
                <a-input v-model="condition.value" placeholder="值" style="width: 150px"/>
                <a-button type="text" status="danger" @click="removeCondition(index)">删除</a-button>
              </div>
            </div>

            <!-- 排序规则 -->
            <a-form-item label="排序">
              <a-select
                  v-model="simpleQuery.orderBy"
                  placeholder="选择排序字段"
                  :options="fieldOptions"
                  style="width: 150px"
              />
              <a-radio-group v-model="simpleQuery.order" style="margin-left: 10px">
                <a-radio value="ASC">升序</a-radio>
                <a-radio value="DESC">降序</a-radio>
              </a-radio-group>
            </a-form-item>

            <!-- 分页设置 -->
            <a-form-item label="分页设置">
              <a-input-number v-model="simpleQuery.page" placeholder="页码" style="width: 100px"/>
              <a-input-number v-model="simpleQuery.pageSize" placeholder="每页条数"
                              style="width: 100px; margin-left: 10px"/>
            </a-form-item>
          </a-form>
        </div>

        <!-- 高级查询模式 -->
        <div v-else class="advanced-query">
          <p>高级查询支持 SQL 语句及多表连接查询</p>
          <a-textarea
              v-model="advancedQuery.sql"
              rows="8"
              placeholder="请输入 SQL 查询语句"
              style="width: 100%"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <a-button type="primary" @click="runQuery">运行查询</a-button>
          <a-button @click="clearQuery">清空</a-button>
        </div>

        <!-- 查询结果 -->
        <div class="results">
          <a-table
              :columns="resultColumns"
              :data="resultData"
              :pagination="pagination"
              style="margin-top: 20px"
          />
        </div>
      </div>

      <a-modal v-model:visible="addCustomizedFieldModalVisible" @ok="handleOkAddCusField" @cancel="handleCancelAddCustFieldModal">
        <template #title>
          添加自定义查询字段
        </template>
        <div>自定义字段,比如CONCAT(field1, ' ', field2)这种格式</div>
        <a-input v-model="customField"></a-input>
      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Container from "../../components/Container.vue";

const queryMode = ref("simple");
const simpleQuery = ref({
  tableName: "",
  fields: [],
  conditions: [],
  orderBy: "",
  order: "ASC",
  page: 1,
  pageSize: 10,
});
const advancedQuery = ref({sql: ""});
const resultColumns = ref([]);
const resultData = ref([]);
const pagination = ref({total: 0, current: 1, pageSize: 10});
const addCustomizedFieldModalVisible = ref(false)
const customField = ref('')

const tableOptions = ref([
  {label: "用户表", value: "users"},
  {label: "订单表", value: "orders"},
  {label: "产品表", value: "products"},
]);
const fieldOptions = ref([]);
const aggregateFieldOptions = ref([
  {label: "普通字段", value: "normal"},
  {label: "AVG", value: "avg"},
  {label: "SUM", value: "sum"},
  {label: "MAX", value: "max"},
  {label: "MIN", value: "min"},
]);
const operatorOptions = ref([
  {label: "=", value: "="},
  {label: ">", value: ">"},
  {label: "<", value: "<"},
  {label: "LIKE", value: "LIKE"},
]);

const tempField = ref({field: "", aggregate: ""});

const onTableChange = (tableName: string) => {
  fieldOptions.value = [
    {label: `${tableName}_字段1`, value: `${tableName}_field1`},
    {label: `${tableName}_字段2`, value: `${tableName}_field2`},
    {label: `${tableName}_字段3`, value: `${tableName}_field3`},
  ];
};

const addField = () => {
  if (tempField.value.field || tempField.value.aggregate) {
    // TODO fields 格式应该是{fieldName:"",aggregate}
    simpleQuery.value.fields.push({...tempField.value});
    tempField.value = {field: "", aggregate: ""};
  }
};

const removeField = (index: number) => {
  simpleQuery.value.fields.splice(index, 1);
};

const formatFieldLabel = (field: { field: string; aggregate: string }) => {
  return field.aggregate
      ? `${field.aggregate.toUpperCase()}(${field.field})`
      : field.field;
};

const addCondition = () => {
  simpleQuery.value.conditions.push({field: "", operator: "=", value: ""});
};

const removeCondition = (index: number) => {
  simpleQuery.value.conditions.splice(index, 1);
};

const runQuery = () => {
  console.log("运行查询", queryMode.value === "simple" ? simpleQuery.value : advancedQuery.value.sql);
};

const clearQuery = () => {
  if (queryMode.value === "simple") {
    Object.assign(simpleQuery.value, {
      tableName: "",
      fields: [],
      conditions: [],
      orderBy: "",
      order: "ASC",
      page: 1,
      pageSize: 10,
    });
  } else {
    advancedQuery.value.sql = "";
  }
};

const addCustomizedField = ()=>{
  customField.value=''
  addCustomizedFieldModalVisible.value=true

}

const handleOkAddCusField = ()=>{
  customField.value=''
  simpleQuery.value.fields.push({...tempField.value});
}


const handleCancelAddCustFieldModal = ()=>{
  customField.value=''
  addCustomizedFieldModalVisible.value = false
}
</script>

<style scoped>
.query-page {
  background-color: #ffffff;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fields-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-fields {
  margin-top: 10px;
  display: flex;
  justify-content: start;
}

.selected-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.conditions {
  margin-top: 20px;
}

.condition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.condition-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.results {
  margin-top: 20px;
}
</style>
