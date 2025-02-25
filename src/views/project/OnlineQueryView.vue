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

            <!-- 展示选择的字段 -->
            <div class="selected-fields">
              <p>已选择字段：</p>

              <!-- 展示普通字段 selectColumns -->
              <div v-for="(field, index) in simpleQuery.selectColumns" :key="'select_' + index" class="selected-field">
                <span v-html="formatFieldLabel(field)"></span>
                <a-button type="text" status="danger" @click="removeField(index, false)" style="padding-left: 10px;">删除</a-button>
              </div>

              <!-- 展示聚合字段 computedExpressions -->
              <div v-for="expression in simpleQuery.computedExpressions" :key="'computed_' + index" class="selected-field">
                <span>{{expression}}</span>
                <a-button type="text" status="danger" @click="removeField(index, true)" style="padding-left: 10px;">删除</a-button>
              </div>
            </div>

            <!-- 条件设置 -->
            <div class="conditions">
              <div class="condition-header">
                <span style="width: 7%">条件设置：</span>

                <a-select
                    v-model="tempCondition1"
                    placeholder="请选择字段"
                    :options="fieldOptions"
                    style="width: 150px"
                />
                <!-- 聚合字段选择 -->
                <a-select
                    placeholder="条件"
                    :options="operatorOptions"
                    v-model="tempConditionOperator"
                    style="width: 120px; margin-left: 10px"
                />
                <a-select
                    v-model="tempConditionValueType"
                    :options="valueTypeOptions"
                    class="value-type-selector"
                    style="width: 80px"
                />
                <!-- 动态输入组件 -->
                <template v-if="tempConditionValueType === 'value'">
                  <a-input
                      v-model="tempConditionValue"
                      placeholder="输入值"
                      class="value-input"
                  />
                </template>
                <template v-else>
                  <a-select
                      v-model="tempConditionValue"
                      :options="fieldOptions"
                      placeholder="选择字段"
                      class="field-select"
                  />
                </template>
                <a-button type="primary" @click="addCondition">添加条件</a-button>
                <a-button type="primary" @click="addCustCondition">添加自定义条件</a-button>
              </div>
              <div class="condition-list">
                <span> 已选择条件: </span>
                <div v-for="[key,value] in simpleQuery.whereConditions">
                  {{key}} {{value.operator}} {{value.value}}
                  <a-button type="text" status="danger" @click="removeCondition(key)" style="padding-left: 10px;">删除</a-button>
                </div>

              </div>

            </div>

            <!-- 条件设置 -->
            <div class="group-by">
              <div class="group-by-header">
                <span style="width: 5%">分组设置：</span>

                <a-select
                    v-model="tempGroupByField"
                    placeholder="请选择字段"
                    :options="fieldOptions"
                    allow-create
                    style="width: 150px"
                />
                <a-button type="primary" @click="addGroupBy">添加分组条件</a-button>
              </div>
              <div class="group-by-list">
                <span> 已选择分组字段: </span>
                <div v-for="field in simpleQuery.groupByColumns">
                  {{field}}
                  <a-button type="text" status="danger" @click="removeCondition(key)" style="padding-left: 10px;">删除</a-button>
                </div>

              </div>

            </div>

            <!-- 排序规则 -->
            <div class="order-by">

              <a-form-item label="排序">
                <a-select
                    v-model="tempOrderField"
                    placeholder="选择排序字段"
                    :options="fieldOptions"
                    style="width: 150px"
                    allow-create
                />
                <a-radio-group v-model="tempOrderMethod" style="margin-left: 10px">
                  <a-radio value="ASC">升序</a-radio>
                  <a-radio value="DESC">降序</a-radio>
                </a-radio-group>
                <a-button type="primary" @click="addOrder">添加规则</a-button>

              </a-form-item>

              <div class="selected-fields">
                <p>已添加排序条件：</p>

                <div v-for="[orderField, orderMethod] in simpleQuery.orderBy" :key="'order_' + orderField" class="selected-field">
                  <span>{{ orderField }}: {{ orderMethod }}</span>
                  <a-button type="text" status="danger" @click="removeOrderField(orderField)" style="padding-left: 10px;">删除</a-button>
                </div>
              </div>
            </div>


            <!-- 分页设置 -->
            <a-form-item label="分页设置">
              <a-input-number v-model="simpleQuery.pageNum" placeholder="页码" style="width: 100px"/>
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
<!--          <a-button @click="clearQuery">清空</a-button>-->
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
      <a-modal v-model:visible="addCustomizedFieldModalVisible" @ok="handleOkAddCusField"
               @cancel="handleCancelAddCustFieldModal">
        <template #title>
          添加自定义查询字段
        </template>
        <div>自定义字段,比如CONCAT(field1, ' ', field2)这种格式</div>
        <a-input v-model="customField"></a-input>
      </a-modal>

      <a-modal v-model:visible="addCustomizedConditionModalVisible" @ok="handleOkAddCusCondition"
               @cancel="handleCancelAddCustConditionModal">
        <template #title>
          添加自定义条件
        </template>
        <div>自定义条件,比如CONCAT(field1, ' ', field2)这种格式</div>
        <div style="display: flex;flex-direction:column;gap: 10px;margin-top: 20px">
          <a-input placeholder="自定义条件" v-model="tempCondition1"></a-input>
          <a-select
              placeholder="条件"
              :options="operatorOptions"
              style="width: 120px; margin-left: 10px"
              v-model="tempConditionOperator"
          />

          <a-input placeholder="自定义条件" v-model="tempConditionValue"></a-input>

        </div>

      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Container from "../../components/Container.vue";
import {columns, simpleSearch, tables} from "../../services/datasource/datasource.ts";
import {Notification} from "@arco-design/web-vue";

const addCustomizedFieldModalVisible = ref(false);
const addCustomizedConditionModalVisible = ref(false)
const customField = ref("");

const tempCondition1 = ref('')
const tempConditionOperator = ref('')
const tempConditionValue = ref('')
const tempConditionValueType = ref('value')
const tempOrderField = ref('')
const tempOrderMethod = ref('ASC')

const tempGroupByField = ref('')

const queryMode = ref("simple");
const simpleQuery = ref({
  dscId: null,
  dbName: "",
  tableName: "",
  selectColumns: [],
  computedExpressions: [],
  // "whereConditions": {"price": { "operator": ">","valueType": "value", "value": 100 }},
  whereConditions: new Map<string, API.whereCondition>(),
  groupByColumns: [],
  // "orderBy": { "create_time": "DESC" },
  orderBy: new Map<string,string>(),
  pageNum: 1,
  pageSize: 10,
});

const advancedQuery = ref({sql: ""});
const resultColumns = ref([]);
const resultData = ref([]);
const pagination = ref({total: 0, current: 1, pageSize: 10});

const aggregateFieldOptions = ref([
  {label: "普通字段", value: "normal"},
  {label: "AVG", value: "avg"},
  {label: "SUM", value: "sum"},
  {label: "MAX", value: "max"},
  {label: "MIN", value: "min"},
]);

const valueTypeOptions = [
  { label: '值', value: 'value' },
  { label: '字段', value: 'field' }
]

// 常用条件查询
const operatorOptions = ref([
  { label: "=", value: "=" },
  { label: ">", value: ">" },
  { label: "<", value: "<" },
  { label: ">=", value: ">=" },
  { label: "<=", value: "<=" },
  { label: "!=", value: "!=" },
  { label: "LIKE", value: "LIKE" },
  { label: "IN", value: "IN" },
  { label: "BETWEEN", value: "BETWEEN" },
  { label: "IS NULL", value: "IS NULL" },
  { label: "IS NOT NULL", value: "IS NOT NULL" },
]);


const tableOptions = ref([
  {label: "用户表", value: "users"},
  {label: "订单表", value: "orders"},
  {label: "产品表", value: "products"},
]);

const fieldOptions = ref([]);
const tempField = ref({field: "", aggregate: "normal"});
const projectId = ref('');
const projectDscId = ref('')

onMounted(()=>{
  projectId.value = sessionStorage.getItem('projectId')||'1'
  projectDscId.value = sessionStorage.getItem('projectDscId') || '1'
  simpleQuery.value.dscId = projectDscId.value
  // 获取所有表
  fetchTables()
})

const fetchTables = () => {
  tableOptions.value = []
  tables({dscId: projectDscId.value}).then((resp) => {
    resp.data.forEach(item => {
      tableOptions.value.push({label: item.tableName, value: item.tableName})

    })
  }).catch((error) => {
    console.log(error)
  })

}

const onTableChange = (tableName: string) => {
  fetchTableColumns(tableName)
};

const fetchTableColumns = (tableName: string) => {
  columns({dscId: projectDscId.value,tableName: tableName}).then((resp) => {
    resp.data.forEach((column)=>{
      fieldOptions.value.push({label: column.columnName, value: column.columnName})

    })
    console.log(resp)
  })


}

const addCustomizedField = () => {
  customField.value = ''
  addCustomizedFieldModalVisible.value = true

}

const handleOkAddCusField = () => {
  if (customField.value.trim() != "") {
    simpleQuery.value.selectColumns.push(customField.value.trim());
    customField.value = "";
    addCustomizedFieldModalVisible.value = false;
  }
};

const handleCancelAddCustFieldModal = () => {
  customField.value = "";
  addCustomizedFieldModalVisible.value = false;
};

const formatFieldLabel = (field: string) => {
  return `<span>${field}</span>`;
};


const addField = () => {
  if (!tempField.value.field) return;
  if (tempField.value.aggregate === "normal") {
    simpleQuery.value.selectColumns.push(tempField.value.field);
  } else {
    simpleQuery.value.computedExpressions.push(`${tempField.value.aggregate}(${tempField.value.field})` );
  }
};

const removeField = (index: number, isComputed: boolean) => {
  if (isComputed) {
    simpleQuery.value.computedExpressions.splice(index, 1);
  } else {
    simpleQuery.value.selectColumns.splice(index, 1);
  }
};

// 添加条件
const addCondition = () => {
  simpleQuery.value.whereConditions.set(tempCondition1.value, {
    operator: tempConditionOperator.value,
    valueType: tempConditionValueType.value,
    value: tempConditionValue.value
  });

  tempCondition1.value = '';
  tempConditionOperator.value = '';
  tempConditionValueType.value = 'value';
  tempConditionValue.value = '';
};

const removeCondition = (field: string) => {
  simpleQuery.value.whereConditions.delete(field)
};

const updateCondition = (field: string, key: "operator" | "value", value: string) => {
  if (simpleQuery.value.whereConditions[field]) {
    simpleQuery.value.whereConditions[field][key] = value;
  }
};

/**
 * 添加普通分组字段
 */
const addGroupBy = () =>{
  if (tempGroupByField.value.trim() != "") {
    simpleQuery.value.groupByColumns.push(tempGroupByField.value.trim());
    tempGroupByField.value = "";
  }
}


const updateOrderBy = (field: string, order: "ASC" | "DESC") => {
  simpleQuery.value.orderBy = {[field]: order};
};

const addCustCondition  = () => {
  addCustomizedConditionModalVisible.value = true
}

const handleOkAddCusCondition = () =>{
  simpleQuery.value.whereConditions.set(tempCondition1.value, {
    operator: tempConditionOperator.value,
    valueType: tempConditionValueType.value,
    value: tempConditionValue.value
  });

  tempCondition1.value = '';
  tempConditionOperator.value = '';
  tempConditionValueType.value = 'value';
  tempConditionValue.value = '';
  addCustomizedConditionModalVisible.value = false
}


const handleCancelAddCustConditionModal = () => {
  addCustomizedConditionModalVisible.value = false
}

const addOrder = ()=>{
  simpleQuery.value.orderBy.set(tempOrderField.value,tempOrderMethod.value);
  tempOrderField.value = ''
  tempOrderMethod.value = 'ASC'
}

const removeOrderField = (removeOrderField: string) => {
  simpleQuery.value.orderBy.delete(removeOrderField);

}

const runQuery = () => {
  const payload = {
    ...simpleQuery.value,
    whereConditions: Object.fromEntries(simpleQuery.value.whereConditions),
    orderBy: Object.fromEntries(simpleQuery.value.orderBy)
  };

  simpleSearch(payload).then((resp) => {
    console.log(resp)
    Notification.success({
      title: '系统提示',
      content: '查询成功',
      closable: true
    })
  }).catch((error)=>{
    console.log(error)

  })
  console.log("运行查询", simpleQuery);
};
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
  align-items: center;
  justify-content: start;
  gap: 10px;
  margin-bottom: 10px;
}

.condition-list{
  display: flex;
  justify-content: start;
  margin-bottom: 10px;
  gap: 10px;
}

.group-by {
  margin-top: 20px;
}

.group-by-header {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
  margin-bottom: 10px;
}

.group-by-list{
  display: flex;
  justify-content: start;
  margin-bottom: 10px;
  gap: 10px;
}


.results {
  margin-top: 20px;
}
</style>
