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

            <!-- 查询字段设置 -->
            <div class="field-select">
              <div class="field-select-header">
                <span style="width: 5.5%">查询字段设置：</span>

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
              <div class="field-select-list">
                <span > 已选择字段: </span>

                <div v-for="(field, index) in simpleQuery.selectColumns" :key="'select_' + index">
                  {{field}}
                  <a-button type="text" status="danger" @click="removeField(index, false)" style="padding-left: 10px;">删除</a-button>
                </div>

                <!-- 展示聚合字段 computedExpressions -->
                <div v-for="expression in simpleQuery.computedExpressions" :key="'computed_' + expression">
                  <span>{{expression}}</span>
                  <a-button type="text" status="danger" @click="removeField(expression, true)" style="padding-left: 10px;">删除</a-button>
                </div>

              </div>

            </div>

            <!-- 条件设置 -->
            <div class="conditions">
              <div class="condition-header">
                <span style="width: 6%">条件设置：</span>

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
                <span style="width: 4%">分组设置：</span>

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
                <div> 已选择分组字段: </div>
                <div v-for="field in simpleQuery.groupByColumns">
                  {{field}}
                  <a-button type="text" status="danger" @click="removeCondition(key)" style="padding-left: 10px;">删除</a-button>
                </div>

              </div>

            </div>

            <!-- 排序规则 -->

            <!-- 条件设置 -->
            <div class="order-by">
              <div class="order-by-header">
                <span style="width: 4%">排序设置：</span>

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

              </div>
              <div class="order-by-list">
                <div> 已选择排序字段: </div>

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
          <div class="advanced-query-main-table-select">
            <span>请选择主表</span>
            <a-select v-model="advancedQuery.mainTableName" placeholder="请选择主表" :options="tableOptions"
                      @change="onTableChange"/>
          </div>

          <div class="advanced-query-sub-table-add">
            <a-link @click="clickAddSubTable">
              <template #icon>
                <icon-plus-circle />
              </template>
              添加关联表
            </a-link>

          </div>

          <div class="advanced-query-join-table-list">
            <a-table :columns="joinTableListColumns" :data="advancedQuery.joinConditions" >
              <template #optional="{ record }">
                <a-button @click="delTableJoinCondition(record)">删除</a-button>
              </template>
            </a-table>
          </div>

          <div class="advanced-query-selected-field">
            <span>查询字段</span>

          </div>

          <div class="advanced-query-group-by">
            <span>分组设置</span>

          </div>

          <div class="advanced-query-order-by">
            <span>排序设置</span>

          </div>

          <div class="advanced-query-page">
            <span>排序设置</span>
          </div>



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

      <a-modal v-model:visible="addSubTableModalVisible" @ok="handleOkAddSubTable"
               @cancel="handleCancelAddSubTable">
        <template #title>
          添加关联表
        </template>
        <div class="add_sub_table_modal">

          <div class="add_sub_table_modal_item">
            <span>选择左表</span>
            <a-select v-model="tempLeftTable" placeholder="左表" :options="leftTable"
                      @change="onChangeLeftTable"/>
          </div>
          <div class="add_sub_table_modal_item">
            <span>关联关系</span>
            <a-select placeholder="请选择关联关系" v-model="tempJoinType" :options = "tableJoinType">

            </a-select>

          </div>

          <div class="add_sub_table_modal_item">
            <span>选择数据库</span>
            <a-select v-model="tempJoinTableDB" :options="databasesOptions" placeholder="选择数据库" @change="onChangeJoinTableDatabase"></a-select>
          </div>

          <div class="add_sub_table_modal_item">
            <span>选择关联表</span>
            <div style="display: flex;gap: 5px;align-items: center">
              <a-select v-model="tempJoinTable" placeholder="请选择关联表" :options="joinTableOptions"
                        @change="onChangeRightTable"/>
              <span>AS</span>
              <a-input v-model="tempJoinTableAlias" placeholder="请输入别名" @change="onChangeJoinTableAlias"></a-input>

            </div>
          </div>

          <div class="add_sub_table_modal_item">
            <span>关联键设置</span>
            <div style="display: flex;align-items: center;gap: 5px">
              <a-select :options="joinTableModalLeftColumns" placeholder="选择左表" v-model="tempJoinTableModelLeftTableColumn"></a-select>
              <span>=</span>
              <a-select :options="joinTableModalRightColumns" placeholder="选择右表" v-model="tempJoinTableModelRightTableColumn"></a-select>
            </div>


          </div>


        </div>

      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import Container from "../../components/Container.vue";
import {
  addDatasource,
  columns,
  dbs,
  getDataSource,
  simpleSearch,
  tables
} from "../../services/datasource/datasource.ts";
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

const tempJoinTableModelLeftTableColumn = ref('')
const tempJoinTableModelRightTableColumn = ref('')

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

const advancedQuery = ref({
  dscId: null,
  dbName: "",
  mainTableName: "",
  mainTableAlias: "t0",
  selectColumns: [],
  computedExpressions: [],
  whereConditions: new Map<string, API.whereCondition>(),
  joinConditions: <Array<API.JoinCondition>>[],
  orderBy: new Map<string, string>(),
  pageNum: 1,
  pageSize: 10,
});

const resultColumns = ref([]);
const resultData = ref([]);
const pagination = ref({total: 0, current: 1, pageSize: 10});
const addSubTableModalVisible = ref(false);

const tableJoinType = ref([
  {label: "left join", value: "left join"},
  {label: "right join", value: "right join"},
  {label: "inner join", value: "inner join"},
]);

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

const databasesOptions = ref([
  {label: "dbname", value: "dbname"},
])

const joinTableOptions = ref([
  {label: "用户表", value: "users"},
]);

const joinTableListColumns =  [
  {
    title: '表别名',
    dataIndex: 'joinTableAlias',
  },
  {
    title: '数据库',
    dataIndex: 'joinTableDB',
  },
  {
    title: '表名',
    dataIndex: 'joinTable',
  },
  {
    title: '关联类型',
    dataIndex: 'joinType',
  },
  {
    title: '关联条件',
    dataIndex: 'onCondition',
  },
  {
    title: '操作',
    slotName: 'optional'
  }
];

const fieldOptions = ref([]);
const tempField = ref({field: "", aggregate: "normal"});
const projectId = ref('');
const projectDscId = ref('')
const tempLeftTable = ref('')
const tempLeftTableAlias = ref('')
const tempLeftTableDB = ref('')
const tempJoinType = ref('')
const tempJoinTable = ref('')
const tempJoinTableAlias = ref('')
const tempJoinTableDB = ref('')
const joinTableModalLeftColumns = ref([{label: '',value: ''}])
const joinTableModalRightColumns = ref([{label: '',value: ''}])

const leftTable = computed(()=>{
  // 将主表和关联表添加进来，格式label:表名（别名） value:别名
  const tables = [
    {
      label: `${advancedQuery.value.mainTableName} (${advancedQuery.value.mainTableAlias})`,
      value: advancedQuery.value.mainTableName,
    }
  ];

  // 遍历 joinConditions，构造关联表信息
  advancedQuery.value.joinConditions.forEach(condition => {
    tables.push({
      label: `${condition.joinTable} (${condition.joinTableAlias})`,
      value: condition.joinTable
    });
  });

  return tables;
})

onMounted(()=>{
  projectId.value = sessionStorage.getItem('projectId')||'1'
  projectDscId.value = sessionStorage.getItem('projectDscId') || '1'
  simpleQuery.value.dscId = projectDscId.value
  // 获取所有表
  fetchDscInfo()
  fetchTables()
})

const fetchDscInfo = () => {
  getDataSource(projectDscId.value).then((resp) => {
    advancedQuery.value.dbName = resp.data.databaseName
    simpleQuery.value.dbName = resp.data.databaseName
  }).catch((error)=>{
    console.log(error)
  })
}

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

const fetchTablesByDbName = (dbName: string) => {
  joinTableOptions.value = []
  tables({dscId: projectDscId.value,dbName:dbName}).then((resp) => {
    resp.data.forEach(item => {
      joinTableOptions.value.push({label: item.tableName, value: item.tableName})

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

const addField = () => {
  if (!tempField.value.field) return;
  if (tempField.value.aggregate === "normal") {
    simpleQuery.value.selectColumns.push(tempField.value.field);
  } else {
    simpleQuery.value.computedExpressions.push(`${tempField.value.aggregate}(${tempField.value.field})` );
  }

  tempField.value.field = ''
  tempField.value.aggregate = ''

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
    // resultColumns
    // resultData
    resultData.value = resp.data.data;
    resultColumns.value = resp.data.columnNames.map(col => ({
      title: col.replace(/_/g, ' '),
      dataIndex: col,
      key: col
    }));

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

const clearQuery = ()=>{
  simpleQuery.value.tableName = ''
  simpleQuery.value.selectColumns = []
  simpleQuery.value.computedExpressions = []
  simpleQuery.value.whereConditions = new Map()
  simpleQuery.value.groupByColumns = []
  simpleQuery.value.orderBy = new Map()
  simpleQuery.value.pageNum = 1
  simpleQuery.value.pageSize = 10
}

const clickAddSubTable = ()=>{
  // 校验是否选择主表
  if(advancedQuery.value.mainTableName == ''){
    Notification.warning({
      title: '系统提示',
      content: '请先选择主表',
      closable: true
    })
  }else{
    fetchDatabases()
    addSubTableModalVisible.value = true
    tempLeftTable.value = ''
    tempJoinType.value = ''
    tempJoinTableDB.value = ''
    tempJoinTable.value = ''
    tempJoinTableAlias.value = ''
    tempJoinTableModelLeftTableColumn.value = ''
    tempJoinTableModelRightTableColumn.value = ''
  }
}

const fetchDatabases = ()=>{
  databasesOptions.value = []
  dbs({dscId:projectDscId.value}).then((resp) => {
    resp.data.forEach(item => {
      databasesOptions.value.push({label: item.dbName, value: item.dbName})
    })
  }).catch((error)=>{
    console.log(error)
  })
}

const handleOkAddSubTable = ()=>{
  // 添加关联表
  // 添加到高级查询参数中
  const joinCondition:API.JoinCondition = {
    joinTableDB: tempJoinTableDB.value,
    joinTable : tempJoinTable.value,
    joinTableAlias: tempJoinTableAlias.value,
    joinType: tempJoinType.value,
    onCondition: `${tempLeftTableAlias.value}.${tempJoinTableModelLeftTableColumn.value} = ${tempJoinTableAlias.value}.${tempJoinTableModelRightTableColumn.value}`
  }
  advancedQuery.value.joinConditions.push(joinCondition)

  // 初始化
  tempLeftTableAlias.value = ''
  tempJoinType.value = ''
  tempJoinTableDB.value = ''
  tempJoinTable.value = ''
  tempJoinTableAlias.value = ''
  tempJoinTableModelLeftTableColumn.value = ''
  tempJoinTableModelRightTableColumn.value = ''
}

const handleCancelAddSubTable = ()=>{
  // 初始化
}

const onChangeLeftTable = async () =>{
  tempLeftTableAlias.value = getTableAlias(tempLeftTable.value)

  tempLeftTableDB.value = getTableDB(tempLeftTableAlias.value, tempLeftTable.value)

  // 根据左表获取所有columns
  // tempLeftTable.value.value
  // TODO 需要把对应数据也发过去
  const cols = await fetchColumns(tempLeftTableDB.value, tempLeftTable.value)

  joinTableModalLeftColumns.value = [];
  cols.forEach(item => {
    joinTableModalLeftColumns.value.push({label: item.columnName, value: item.columnName})
  })
}

const getTableDB = (tableAlias,tableName):string => {
  if(tableAlias == 't0'){
    return advancedQuery.value.dbName
  }

  const joinCondition = advancedQuery.value.joinConditions.find((joinCondition) =>
    joinCondition.joinTableAlias == tableAlias && joinCondition.joinTable == tableName
  )

  return joinCondition?joinCondition.joinTableDB:''
}


const getTableAlias = (tableName):string=>{
  // TODO 判断是否主表,可能有不同数据库相同表名情况
  if(advancedQuery.value.mainTableName == tableName){
    return advancedQuery.value.mainTableAlias
  }

  const joinCondition = advancedQuery.value.joinConditions.find(
      (joinCondition) => joinCondition.joinTable === tableName
  )

  // 如果找到了，返回别名；否则返回表名
  return joinCondition ? joinCondition.joinTableAlias : tableName

}

const onChangeRightTable = async () => {
  const cols = await fetchColumns(tempJoinTableDB.value, tempJoinTable.value)

  joinTableModalRightColumns.value = [];
  cols.forEach(item => {
    joinTableModalRightColumns.value.push({label: item.columnName, value: item.columnName})
  })

}

const fetchColumns = async (dbName: string, tableName: string): Promise<API.SearchColumnsDto[]>=>{
  try {
    const resp = await columns({ dscId: projectDscId.value, dbName, tableName });
    if (resp.code === 0) {
      return resp.data;
    } else {
      console.error(`获取列信息失败，错误码: ${resp.code}, 消息: ${resp.message}`);
      return [];
    }
  } catch (error) {
    console.error('获取列信息时发生异常:', error);
    return [];
  }

}

const onChangeJoinTableDatabase = () =>{
  fetchTablesByDbName(tempJoinTableDB.value);
}

const onChangeJoinTableAlias = () =>{
  // 判断别名不能重复
  // tempJoinTableAlias
  let needNotification = false
  if(tempJoinTableAlias.value == 't0'){
    needNotification = true
  }
  const joinCondition = advancedQuery.value.joinConditions.find((joinCondition)=> joinCondition.joinTableAlias == tempJoinTableAlias.value)

  if(needNotification || joinCondition){
    Notification.warning({
      title: '系统提示',
      content: '别名不能重复',
      closable: true
    })
  }
}

const delTableJoinCondition = (joinCondition: API.JoinCondition) => {
  // 根据对应的表别名删除对应条件
  const index = advancedQuery.value.joinConditions.findIndex(
      (condition) => joinCondition.joinTableAlias == condition.joinTableAlias
  )

  if (index !== -1) {
    advancedQuery.value.joinConditions.splice(index, 1)
    Notification.success({
      title: '系统提示',
      content: '删除成功',
      closable: true
    })
  }

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
  align-items: center;
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
  align-items: center;
  gap: 10px;
}

.order-by{
  margin-top: 10px;
}

.field-select {
  margin-top: 10px;

}

.field-select-header {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
  margin-bottom: 10px;
}

.field-select-list{
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.order-by {
  margin-top: 10px;
  margin-bottom: 10px;

}

.order-by-header {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
  margin-bottom: 10px;
}

.order-by-list{
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}


.results {
  margin-bottom: 20px;
}

.advanced-query{
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.advanced-query-main-table-select{
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
}

.advanced-query-sub-table-add{
  display: flex;
  justify-content: start;
}

.add_sub_table_modal {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add_sub_table_modal_item {
  display: flex;
  flex-direction: column;
}

.advanced-query-join-table-list {

}

</style>
