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
              <a-select v-model="simpleQuery.tableName" placeholder="请选择表" :options="tableOptions" @change="onTableChange" />
            </a-form-item>

            <!-- 字段选择 -->
            <a-form-item label="选择字段">
              <a-select
                  v-model="simpleQuery.fields"
                  mode="multiple"
                  placeholder="请选择字段"
                  :options="fieldOptions"
              />
              <a-select
                  v-model="simpleQuery.aggregateFields"
                  mode="multiple"
                  placeholder="选择聚合字段（如 avg, sum 等）"
                  :options="aggregateFieldOptions"
                  style="margin-top: 10px"
              />
            </a-form-item>

            <!-- 条件设置 -->
            <div class="conditions">
              <a-button type="primary" @click="addCondition">添加条件</a-button>
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
                <a-input v-model="condition.value" placeholder="值" style="width: 150px" />
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
              <a-input-number v-model="simpleQuery.page" placeholder="页码" style="width: 100px" />
              <a-input-number v-model="simpleQuery.pageSize" placeholder="每页条数" style="width: 100px; margin-left: 10px" />
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
    </template>
  </container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Container from "../../components/Container.vue";

// 查询模式
const queryMode = ref("simple");

// 简单查询表单数据
const simpleQuery = ref({
  tableName: "",
  fields: [],
  aggregateFields: [],
  conditions: [],
  orderBy: "",
  order: "ASC",
  page: 1,
  pageSize: 10,
});

// 高级查询表单数据
const advancedQuery = ref({
  sql: "",
});

// 查询结果数据
const resultColumns = ref([]);
const resultData = ref([]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});

// 表和字段选项
const tableOptions = ref([
  { label: "用户表", value: "users" },
  { label: "订单表", value: "orders" },
  { label: "产品表", value: "products" },
]);
const fieldOptions = ref([]);
const aggregateFieldOptions = ref([
  { label: "AVG", value: "avg" },
  { label: "SUM", value: "sum" },
  { label: "MAX", value: "max" },
  { label: "MIN", value: "min" },
]);
const operatorOptions = ref([
  { label: "=", value: "=" },
  { label: ">", value: ">" },
  { label: "<", value: "<" },
  { label: "LIKE", value: "LIKE" },
]);

// 动态加载字段
const onTableChange = (tableName: string) => {
  // 根据选择的表名加载字段信息
  fieldOptions.value = [
    { label: `${tableName}_字段1`, value: `${tableName}_field1` },
    { label: `${tableName}_字段2`, value: `${tableName}_field2` },
    { label: `${tableName}_字段3`, value: `${tableName}_field3` },
  ];
};

// 添加条件
const addCondition = () => {
  simpleQuery.value.conditions.push({ field: "", operator: "=", value: "" });
};

// 删除条件
const removeCondition = (index: number) => {
  simpleQuery.value.conditions.splice(index, 1);
};

// 运行查询
const runQuery = () => {
  if (queryMode.value === "simple") {
    console.log("运行简单查询", simpleQuery.value);
  } else {
    console.log("运行高级SQL查询", advancedQuery.value.sql);
  }
};

// 清空查询
const clearQuery = () => {
  if (queryMode.value === "simple") {
    simpleQuery.value = {
      tableName: "",
      fields: [],
      aggregateFields: [],
      conditions: [],
      orderBy: "",
      order: "ASC",
      page: 1,
      pageSize: 10,
    };
  } else {
    advancedQuery.value.sql = "";
  }
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

.simple-query .conditions {
  margin-top: 10px;
}

.condition-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.results {
  margin-top: 20px;
}
</style>
