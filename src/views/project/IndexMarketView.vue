<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-market'">
    <template #content>
      <div class="page">
        <a-card
            v-for="item in dimDataList"
            :key="item.id"
            class="metric-card"
            hoverable
        >
          <template #extra>
            <a-button type="primary" size="small" @click="openSearchModal(item)">搜索</a-button>
          </template>
          <a-space direction="vertical" size="mini">
            <a-typography-title
                :heading="6"
                class="clickable-title"
                @click="openChartModal(item)"
            >
              {{ item.metricName }}
            </a-typography-title>
            <a-typography-text type="secondary">
              指标标识：{{ item.metricCode }}
            </a-typography-text>
          </a-space>
        </a-card>
      </div>

      <!-- 搜索模态框 -->
      <a-modal v-model:visible="searchVisible" title="数据查询" :width="800">
        <a-form :model="searchForm" layout="inline" @submit.prevent>
          <a-form-item label="时间区间">
            <a-range-picker
              v-model="searchForm.dateRange"
              format="YYYY-MM-DD"
              :placeholder="['开始日期', '结束日期']"
              allow-clear
              style="width: 320px;"
              value-format="YYYY-MM-DD"
            />
          </a-form-item>
          <a-divider style="margin: 12px 0" />
          <template v-for="field in dynamicFields" :key="field.columnName">
            <a-form-item :label="field.description">
              <a-input
                v-model="searchForm[field.columnName]"
                :placeholder="'请输入' + field.description"
                allow-clear
              />
            </a-form-item>
          </template>
          <a-form-item>
            <a-button type="primary" @click="doSearch">查询</a-button>
          </a-form-item>
        </a-form>
        <a-divider />
        <a-table
            :data="tableData"
            :columns="tableColumns"
            row-key="key"
            size="small"
            bordered
        />
      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import { ref, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { getMetricDimFields, pageMetric } from "../../services/metric/metric.ts";
import dayjs from 'dayjs';
import {query} from "../../services/metric/metricMarket.ts";

interface MetricItem {
  id: number;
  metricName: string;
  metricCode: string;
}

interface SearchFormData {
  dateRange: [string, string] | null;
  [key: string]: any;
}

// 定义查询参数接口
interface MetricQueryParams {
  metricId: number;
  startDate: string | null;
  endDate: string | null;
  dimensions: Array<{
    field: string;      // 格式: tableAlias_columnName
    value: string;      // 查询值
    description: string; // 字段描述
    type: string;       // 数据类型
  }>;
}

// 所有指标
const dimDataList = ref<MetricItem[]>([]);

// 当前搜索使用的指标
const selectedMetricId = ref<number | null>(null);

// 动态搜索框字段
const dynamicFields = ref<Array<{
  databaseName: string;
  description: string;
  dataType: string;
  columnName: string;
  tableAlias: string;
}>>([]);

// 搜索表单数据
const searchForm = ref<SearchFormData>({
  dateRange: null
});

// 表格展示数据
const tableData = ref<any[]>([]);

const searchVisible = ref(false);

// 表格列
const tableColumns = [
  { title: "日期", dataIndex: "t1_order_date", key: "date" },
  { title: "名称", dataIndex: "t0_product_name", key: "name" },
  { title: "销售额", dataIndex: "fruit_daily_sales", key: "sales" }
];

// 加载所有指标
onMounted(() => {
  pageMetric({ currentPage: 1, pageSize: 10 })
    .then(res => {
      dimDataList.value = res.data.records;
    })
    .catch(console.error);
});

// 打开搜索模态框
const openSearchModal = async (item: MetricItem) => {
  selectedMetricId.value = item.id;
  // 重置表单
  searchForm.value = {
    dateRange: null
  };
  tableData.value = [];

  try {
    const resp = await getMetricDimFields(item.id);
    dynamicFields.value = resp.data || [];
    // 初始化动态字段
    dynamicFields.value.forEach(field => {
      searchForm.value[field.columnName] = '';
    });
    searchVisible.value = true;
  } catch (error) {
    console.error("加载搜索条件失败:", error);
    Message.error("加载搜索条件失败");
  }
};

// 执行搜索
const doSearch = async () => {
  try {
    // 构建查询参数
    const queryParams: MetricQueryParams = {
      metricId: selectedMetricId.value!,
      startDate: searchForm.value.dateRange?.[0] || null,
      endDate: searchForm.value.dateRange?.[1] || null,
      dimensions: dynamicFields.value
        .filter(field => searchForm.value[field.columnName])
        .map(field => ({
          field: `${field.tableAlias}_${field.columnName}`,
          value: searchForm.value[field.columnName],
          description: field.description,
          type: field.dataType
        }))
    };

    // 打印查询参数
    console.log('发送到后端的查询参数:', JSON.stringify(queryParams, null, 2));

    // TODO: 调用后端接口
    query(queryParams).then(resp=>{
      console.log(resp)

    }).catch(error=>{
      console.log(error)
    })
    // const res = await queryMetricData(queryParams);
    // if (res.code === 0) {
    //   tableData.value = res.data || [];
    // } else {
    //   Message.error(res.message || '查询失败');
    // }

  } catch (e) {
    console.error("查询失败:", e);
    Message.error("查询失败");
  }
};

// 打开图表模态框（如果需要的话）
const openChartModal = (item: MetricItem) => {
  // 实现图表展示逻辑
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f7f8fa;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.metric-card {
  width: 100%;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.clickable-title {
  cursor: pointer;
  color: var(--color-primary);
  transition: color 0.3s;
}

.clickable-title:hover {
  color: var(--color-primary-hover);
}

/* 搜索表单样式 */
:deep(.arco-form-item) {
  margin-bottom: 16px;
}

:deep(.arco-form-item-label) {
  font-weight: 500;
}

:deep(.arco-input-wrapper) {
  width: 240px;
}
</style>
