<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'"
             :left-menu-selected="'/project/index-management/index-develop'" :sidebarType="1">
    <template #content>
      <div class="index-add-or-update-content">
        <div class="step-bar">
          <a-steps :current="currentStep" :small="true">
            <a-step>表信息设置</a-step>
            <a-step>选择维度</a-step>
            <a-step>选择度量</a-step>
            <a-step>计算逻辑编写</a-step>
            <a-step>基本信息编写</a-step>
            <a-step>加工信息编写</a-step>
          </a-steps>
        </div>
        <a-divider/>

        <div class="step-content">
          <div v-if="currentStep === 1">
            <div class="add-index-first-content">
              <div class="add-index-first-content-database-table-select">
                <div class="add-index-first-content-database-select">
                  <div>请选择数据库</div>
                  <a-select v-model="indexForm.mainDatabaseName" :style="{width:'420px'}" placeholder="请选择数据库"
                            :options="databasesOptions" @change="onDatabaseChange"></a-select>
                </div>

                <div class="add-index-first-content-database-select">
                  <div>请选择表</div>
                  <a-select v-model="indexForm.mainTableName" :style="{width:'420px'}" placeholder="请选择数据库"
                            :options="tableOptions"></a-select>
                </div>
              </div>

              <div class="add-index-first-content-add-rel-table-btn">
                <a-link @click="clickAddRelTable">
                  <template #icon>
                    <icon-plus-circle/>
                  </template>
                  添加关联表
                </a-link>
              </div>

              <div class="add-index-first-content-rel-table-list">
                <a-table :columns="joinTableListColumns" :data="indexForm.joinConditions">
                  <template #optional="{ record }">
                    <a-button @click="delTableJoinCondition(record)">删除</a-button>
                  </template>
                </a-table>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 2" class="step-section">
<!--            tableFieldColumns-->
            <a-table row-key="key" :columns="indexDimChangeColumns" :data="fieldList" :pagination="false" bordered :row-selection="rowSelection"  v-model:selectedKeys="selectDimKeys">
              <template #attributeDesc="{ record, rowIndex }">
                <a-input v-model="record.attributeDesc" placeholder="请输入描述"/>
              </template>
              <template #relDimObject="{ record, rowIndex }">
                <a-select v-model="record.id" placeholder="请输入关联维度对象" :options="dimensionObjectOptions"></a-select>
              </template>
              <template #relDimAttr="{ record, rowIndex }">
                <a-select v-model="record.attrId" placeholder="请输入关联维度属性"  :options="dimensionAttrMap[record.id] || []" ></a-select>
              </template>
            </a-table>

          </div>

          <div v-if="currentStep === 3" class="step-section">
            <a-table row-key="key" :columns="indexMeasureChangeColumns" :data="fieldListExceptDim" :pagination="false" bordered :row-selection="rowSelection"  v-model:selectedKeys="selectMeasureKey">
              <template #attributeDesc="{ record, rowIndex }">
                <a-input v-model="record.attributeDesc" placeholder="请输入描述"/>
              </template>
              <template #relDimObject="{ record, rowIndex }">
                <a-select v-model="record.relDimObject" placeholder="请输入关联维度对象" :options="dimensionObjectOptions"></a-select>
              </template>
              <template #relDimAttr="{ record, rowIndex }">
                <a-select v-model="record.relDimAttr" placeholder="请输入关联维度属性"></a-select>
              </template>
            </a-table>
          </div>

          <div v-if="currentStep === 4" class="step-section">
            <div class="add-index-four-content">
              <div class="add-index-four-content-left">
                <div class="add-index-four-content-left-item">
                  <div class="add-index-four-content-left-item-title">度量字段</div>
                  <a-table row-key="columnName" :columns="indexDimAndMeasureSelectColumns" :data="indexForm.dimensions" :pagination="false" bordered></a-table>
                </div>
                <div class="add-index-four-content-left-item">
                  <div class="add-index-four-content-left-item-title">非度量字段</div>
                  <a-table row-key="columnName" :columns="indexDimAndMeasureSelectColumns" :data="indexForm.measures" :pagination="false" bordered></a-table>
                </div>

              </div>

              <div class="add-index-four-content-right">
                <div class="add-index-four-content-right-form">
                  <div class="add-index-four-content-right-item">
                    <div class="add-index-four-content-right-item-title">
                      指标名称
                    </div>
                    <a-input placeholder="请输入指标名称" v-model="indexForm.indexName"></a-input>
                  </div>
                  <div class="add-index-four-content-right-item">
                    <div class="add-index-four-content-right-item-title">
                      指标标识
                    </div>
                    <a-input placeholder="请输入指标标识" v-model="indexForm.indexCode"></a-input>
                  </div>
                  <div class="add-index-four-content-right-item">
                    <div class="add-index-four-content-right-item-title">
                      指标描述
                    </div>
                    <a-input placeholder="请输入指标描述" v-model="indexForm.indexDesc"></a-input>
                  </div>
                  <div class="add-index-four-content-right-item">
                    <div class="add-index-four-content-right-item-title">
                      计算逻辑
                      <div class="add-index-four-content-right-item-title-btn">
                        <a-button size="mini">编写提示</a-button>
                        <a-button size="mini" type="primary">规范校验</a-button>
                      </div>
                    </div>
                    <a-textarea style="height: 120px;" v-model="indexForm.indexCalculation"></a-textarea>
                  </div>

                  <div class="add-index-four-content-right-item-x">
                    <div class="add-index-four-content-right-item-x-item">
                      <div class="add-index-four-content-right-item-title">
                        为空默认值
                      </div>
                      <a-input style="width: 100px" v-model="indexForm.nullValue"></a-input>

                    </div>
                    <div class="add-index-four-content-right-item-x-item">
                      <div class="add-index-four-content-right-item-title">
                        精度
                      </div>
                      <a-input style="width: 100px" v-model="indexForm.precision"></a-input>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 5" class="step-section">
            <a-form :model="indexForm" layout="vertical">
              <a-row :gutter="20">
                <!-- 派生维度 -->
                <a-col :span="11">
                  <a-form-item label="派生维度选择" name="derivedDimensions">
                    <a-input></a-input>
                  </a-form-item>
                </a-col>

                <!-- 时间维度 -->
                <a-col :span="11">
                  <a-form-item label="时间维度选择" name="timeDimension">
                    <a-input></a-input>
                  </a-form-item>
                </a-col>

                <!-- 统计周期 -->
                <a-col :span="11">
                  <a-form-item label="统计周期选择" name="statCycle">
                    <a-input></a-input>
                  </a-form-item>
                </a-col>

                <!-- 业务限定 -->
                <a-col :span="11">
                  <a-form-item label="业务限定选择" name="bizLimit">
                    <a-input></a-input>
                  </a-form-item>
                </a-col>

                <!-- 计量单位 -->
                <a-col :span="11">
                  <a-form-item label="计量单位选择" name="unit">
                    <a-input placeholder="请输入计量单位，如：个、次、元" />
                  </a-form-item>
                </a-col>

<!--                还要新增一些比如指标目录 负责人-->

              </a-row>
            </a-form>
          </div>

          <div v-if="currentStep === 5" class="step-section">
            加工信息填写，这里还要预览创建的指标表信息和插入表sql等等
          </div>


        </div>
        <a-divider/>

        <div class="step-button">
          <a-button v-if="currentStep === 1" @click="router.push({name: '指标开发'})">取消</a-button>
          <a-button v-if="currentStep >=2" @click="currentStep--">上一步</a-button>
          <a-button v-if="currentStep != 10" type="primary" @click="currentStepAdd">下一步</a-button>
        </div>
      </div>

      <a-modal v-model:visible="addRelTableModalVisible" @ok="handleOkAddRelTable"
               @cancel="addRelTableModalVisible = false">
        <template #title>
          添加关联表
        </template>
        <div class="add_sub_table_modal">

          <div class="add_sub_table_modal_item">
            <span>选择左表</span>
            <a-select v-model="tempLeftTable" placeholder="左表" :options="addRelTableLeftTable"
                      @change="onChangeRelLeftTable"/>
          </div>
          <div class="add_sub_table_modal_item">
            <span>关联关系</span>
            <a-select placeholder="请选择关联关系" v-model="tempJoinType" :options="tableJoinType">

            </a-select>

          </div>

          <div class="add_sub_table_modal_item">
            <span>选择数据库</span>
            <a-select v-model="tempJoinTableDB" :options="databasesOptions" placeholder="选择数据库"
                      @change="onChangeJoinTableDatabase"></a-select>
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
              <a-select :options="joinTableModalLeftColumns" placeholder="选择左表"
                        v-model="tempJoinTableModelLeftTableColumn"></a-select>
              <span>=</span>
              <a-select :options="joinTableModalRightColumns" placeholder="选择右表"
                        v-model="tempJoinTableModelRightTableColumn"></a-select>
            </div>
          </div>
        </div>
      </a-modal>


    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import {computed, onMounted, reactive, ref} from "vue";
import router from "../../router";
import {columns, dbs, tables} from "../../services/datasource/datasource.ts";
import {Notification} from "@arco-design/web-vue";
import {listDimensions} from "../../services/metric/metric.ts";

const currentStep = ref(1);

const projectId = ref()
const projectDscId = ref()

const databasesOptions = ref([])
const tableOptions = ref([])
const addRelTableModalVisible = ref(false);

const tempLeftTable = ref('')
const tempJoinType = ref('')
const tempJoinTable = ref('')
const tempJoinTableAlias = ref('')
const tempJoinTableDB = ref('')
const tempJoinTableModelLeftTableColumn = ref('')
const tempJoinTableModelRightTableColumn = ref('')
const tempLeftTableAlias = ref('')
const tempLeftTableDB = ref('')
const fieldList = ref([])
const fieldListExceptDim = ref([])

const joinTableModalLeftColumns = ref([{label: '', value: ''}])
const joinTableOptions = ref([
  {label: "用户表", value: "users"},
]);
const joinTableModalRightColumns = ref([{label: '', value: ''}])
const dimensionObjectOptions = ref([])
const dimensionAttrMap = ref({})
const selectDimKeys = ref([])
const selectMeasureKey = ref([])



const indexForm = ref({
  mainDatabaseName: '',
  mainTableName: '',
  mainTableAlias: 't0',
  joinConditions: <Array<API.JoinCondition>>[],
  dimensions: [],
  measures: [],
  indexName: '',
  indexCode: '',
  indexDesc: '',
  indexCalculation: '',
  nullValue: 0,
  precision: 0,
  derivedDimensions: [],
  timeDimension: '',
  statCycle: '',
  bizLimit: '',
  unit: ''

})


const indexDimChangeColumns = [
  {title: '字段名称', dataIndex: 'columnName'},
  {title: '描述', dataIndex: 'attributeDesc', slotName: 'attributeDesc'},
  {title: '关联维度对象', dataIndex: 'id',slotName: 'relDimObject'},
  {title: '关联维度属性', dataIndex: 'attrId', slotName: 'relDimAttr'},
  {title: '字段类型', dataIndex: 'dataType'},
  {title: '数据库', dataIndex: 'databaseName'},
  {title: '表', dataIndex: 'tableName'},
  {title: '表别名', dataIndex: 'tableAlias'},
]

const indexMeasureChangeColumns = [
  {title: '字段名称', dataIndex: 'columnName'},
  {title: '描述', dataIndex: 'attributeDesc', slotName: 'attributeDesc'},
  {title: '字段类型', dataIndex: 'dataType'},
  {title: '数据库', dataIndex: 'databaseName'},
  {title: '表', dataIndex: 'tableName'},
  {title: '表别名', dataIndex: 'tableAlias'},
]

const indexDimAndMeasureSelectColumns = [
  {title: '字段名称', dataIndex: 'columnName'},
  {title: '数据库', dataIndex: 'databaseName'},
  {title: '表', dataIndex: 'tableName'},
  {title: '表别名', dataIndex: 'tableAlias'},
  {title: '描述', dataIndex: 'attributeDesc'},
  {title: '字段类型', dataIndex: 'dataType'},
]

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});

const tableJoinType = ref([
  {label: "left join", value: "left join"},
  {label: "right join", value: "right join"},
  {label: "inner join", value: "inner join"},
]);

const joinTableListColumns = [
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
onMounted(() => {

  projectId.value = sessionStorage.getItem('projectId') || '1'
  projectDscId.value = sessionStorage.getItem('projectDscId') || '1'

  fetchDBs()

});

const fetchDBs = () => {
  dbs({dscId: projectDscId.value}).then(resp => {
    databasesOptions.value = []
    resp.data.forEach((database) => {
      databasesOptions.value.push({label: database.dbName, value: database.dbName})
    })

  }).catch((error) => {
    console.log(error)
  })

}


const onDatabaseChange = () => {

  tableOptions.value = []
  tables({dscId: projectDscId.value, dbName: indexForm.value.mainDatabaseName}).then((resp) => {
    resp.data.forEach((table) => {
      tableOptions.value.push({label: table.tableName, value: table.tableName})
    })
  }).catch((error) => {
    console.log(error)
  })

}


const clickAddRelTable = () => {
  // 校验是否选择主表
  if (indexForm.value.mainTableName == '') {
    Notification.warning({
      title: '系统提示',
      content: '请先选择主表',
      closable: true
    })
  } else {
    addRelTableModalVisible.value = true
    tempLeftTable.value = ''
    tempJoinType.value = ''
    tempJoinTableDB.value = ''
    tempJoinTable.value = ''
    tempJoinTableAlias.value = ''
    tempJoinTableModelLeftTableColumn.value = ''
    tempJoinTableModelRightTableColumn.value = ''
  }
}


const delTableJoinCondition = (joinCondition: API.JoinCondition) => {
  const index = indexForm.value.joinConditions.findIndex(
      (condition) => joinCondition.joinTableAlias == condition.joinTableAlias
  )

  if (index !== -1) {
    indexForm.value.joinConditions.splice(index, 1)
  }

}

const addRelTableLeftTable = computed(() => {
  // 将主表和关联表添加进来，格式label:表名（别名） value:别名
  const tables = [
    {
      label: `${indexForm.value.mainTableName} (${indexForm.value.mainTableAlias})`,
      value: indexForm.value.mainTableName,
    }
  ];

  // 遍历 joinConditions，构造关联表信息
  indexForm.value.joinConditions.forEach(condition => {
    tables.push({
      label: `${condition.joinTable} (${condition.joinTableAlias})`,
      value: condition.joinTable
    });
  });
  return tables;
})

const onChangeRelLeftTable = async () => {
  tempLeftTableAlias.value = getTableAlias(tempLeftTable.value)

  tempLeftTableDB.value = getTableDB(tempLeftTableAlias.value, tempLeftTable.value)

  // 根据左表获取所有columns
  const cols = await fetchColumns(tempLeftTableDB.value, tempLeftTable.value)

  joinTableModalLeftColumns.value = [];
  cols.forEach(item => {
    joinTableModalLeftColumns.value.push({label: item.columnName, value: item.columnName})
  })
}

const getTableAlias = (tableName): string => {
  // TODO 判断是否主表,可能有不同数据库相同表名情况
  if (indexForm.value.mainTableName == tableName) {
    return indexForm.value.mainTableAlias
  }
  const joinCondition = indexForm.value.joinConditions.find(
      (joinCondition) => joinCondition.joinTable === tableName
  )
  // 如果找到了，返回别名；否则返回表名
  return joinCondition ? joinCondition.joinTableAlias : tableName

}

const getTableDB = (tableAlias, tableName): string => {
  if (tableAlias == 't0') {
    return indexForm.value.mainDatabaseName
  }
  const joinCondition = indexForm.value.joinConditions.find((joinCondition) =>
      joinCondition.joinTableAlias == tableAlias && joinCondition.joinTable == tableName
  )
  return joinCondition ? joinCondition.joinTableDB : ''
}

const fetchColumns = async (dbName: string, tableName: string): Promise<API.DBTableColumnVO[]> => {
  try {
    const resp = await columns({dscId: projectDscId.value, dbName, tableName});
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

const onChangeJoinTableDatabase = () => {
  joinTableOptions.value = []
  tables({dscId: projectDscId.value, dbName: tempJoinTableDB.value}).then((resp) => {
    resp.data.forEach(item => {
      joinTableOptions.value.push({label: item.tableName, value: item.tableName})

    })
  }).catch((error) => {
    console.log(error)
  })
}


const onChangeRightTable = async () => {
  const cols = await fetchColumns(tempJoinTableDB.value, tempJoinTable.value)
  joinTableModalRightColumns.value = [];
  cols.forEach(item => {
    joinTableModalRightColumns.value.push({label: item.columnName, value: item.columnName})
  })
}

const onChangeJoinTableAlias = () => {
  // 判断别名不能重复
  // tempJoinTableAlias
  let needNotification = false
  if (tempJoinTableAlias.value == 't0') {
    needNotification = true
  }
  const joinCondition = indexForm.value.joinConditions.find((joinCondition) => joinCondition.joinTableAlias == tempJoinTableAlias.value)
  if (needNotification || joinCondition) {
    Notification.warning({
      title: '系统提示',
      content: '别名不能重复',
      closable: true
    })
  }
}

const handleOkAddRelTable = () => {
  // 添加关联表
  // 添加到高级查询参数中
  const joinCondition: API.JoinCondition = {
    joinTableDB: tempJoinTableDB.value,
    joinTable: tempJoinTable.value,
    joinTableAlias: tempJoinTableAlias.value,
    joinType: tempJoinType.value,
    onCondition: `${tempLeftTableAlias.value}.${tempJoinTableModelLeftTableColumn.value} = ${tempJoinTableAlias.value}.${tempJoinTableModelRightTableColumn.value}`
  }
  indexForm.value.joinConditions.push(joinCondition)

  // // TODO 将表添加到高级查询字段option中
  // addAdvTableSelectOption(tempJoinTable.value, tempJoinTableAlias.value)

  // 初始化
  tempLeftTableAlias.value = ''
  tempJoinType.value = ''
  tempJoinTableDB.value = ''
  tempJoinTable.value = ''
  tempJoinTableAlias.value = ''
  tempJoinTableModelLeftTableColumn.value = ''
  tempJoinTableModelRightTableColumn.value = ''
}

const currentStepAdd = () => {
  currentStep.value++;

  if (currentStep.value === 2) {
    // 获取前面步骤选择表的所有字段
    toStep2Action()
  }else if(currentStep.value === 3){
    toStep3Action()
  }else if(currentStep.value === 4){
    toStep4Action()
  }
};

const toStep2Action = async ()=>{
  const tables = [];
  tables.push({ dbName: indexForm.value.mainDatabaseName, tableName: indexForm.value.mainTableName, tableAlias: indexForm.value.mainTableAlias });
  indexForm.value.joinConditions.forEach(condition => {
    tables.push({ dbName: condition.joinTableDB, tableName: condition.joinTable, tableAlias: condition.joinTableAlias });
  });
  const newFieldList = [];
  for (const table of tables) {
    const cols = await fetchColumns(table.dbName, table.tableName);
    for (const col of cols) {
      newFieldList.push({
        key: col.dbName+"."+col.tableName+"."+col.columnName,
        columnName: col.columnName,
        attributeDesc: col.columnComment,
        dataType: col.dataType,
        databaseName: col.dbName,
        tableName: col.tableName,
        tableAlias: table.tableAlias,
        // 维度对象主键
        id: '',
        // 维度属性主键
        attrId: ''
      });
    }
  }
  fieldList.value = newFieldList;

  // 获取所有维度对象
  fetchDimObjectsAndAttr()

}

const fetchDimObjectsAndAttr = ()=>{
  listDimensions({}).then(resp=>{
    dimensionObjectOptions.value = []
    dimensionObjectOptions.value = resp.data.map(obj => ({
      label: obj.dimensionObjectName,
      value: obj.id,
    }));

    resp.data.forEach(obj => {
      dimensionAttrMap.value[obj.id] = obj.dimensionAttr.map(attr => ({
        label: attr.dimensionAttributeName,
        value: attr.attrId,
        desc: attr.dimensionAttributeDesc
      }));
    });

  }).catch((error)=>{
    console.log(error)
  })

}

const toStep3Action = ()=>{
  // 将选中的维度添加到form中
  indexForm.value.dimensions = []
  indexForm.value.dimensions = fieldList.value.filter(item => selectDimKeys.value.includes(item.key));

  // 需要将fieldList 去掉步骤二中选中selectDimKeys的其他字段获取出来
  fieldListExceptDim.value = fieldList.value.filter(item => !selectDimKeys.value.includes(item.key));
}

const toStep4Action = ()=>{
  // 将选中的度量添加到form中
  indexForm.value.measures = []
  indexForm.value.measures = fieldListExceptDim.value.filter(item => selectMeasureKey.value.includes(item.key));
}

</script>

<style scoped>
.index-add-or-update-content {
  background-color: #FFFFFF;
  height: 93%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 30px;
}

.step-button a-button {
  min-width: 100px;
}


.step-content {
  flex: 1;
}

.add-index-first-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.add-index-first-content-database-table-select {
  display: flex;
  gap: 100px;
}

.add-index-first-content-database-select {
  display: flex;
  gap: 10px;
  align-items: center;
}

.step-button {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.step-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-button a-button {
  min-width: 100px;
}

.add-index-first-content-add-rel-table-btn {
  display: flex;
}

.add-index-four-content{
  display: flex;
  gap: 10px;
}

.add-index-four-content-left{
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: 42%;
  height: 100%;
}
.add-index-four-content-left-item{
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.add-index-four-content-left-item-title{
  display: flex;
  justify-content: start;
}

.add-index-four-content-right{
  width: 58%;
  height: 100%;
}

.add-index-four-content-right-form{
  display: flex;
  flex-direction: column;
  gap: 15px;

  margin-top: 5%;
}

.add-index-four-content-right-item{
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.add-index-four-content-right-item-x{
  display: flex;
  gap: 5px;
}
.add-index-four-content-right-item-x-item{
  display: flex;
  gap: 5px;
  width: 25%;
}

.add-index-four-content-right-item-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-index-four-content-right-item-title-btn{
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
}
</style>
