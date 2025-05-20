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
          <a-form-item
              v-for="field in dynamicFields"
              :key="field.name"
              :label="field.label"
          >
            <component
                :is="field.type === 'date' ? 'a-date-picker' : 'a-input'"
                v-model="searchForm[field.name]"
                :placeholder="'请输入' + field.label"
                allow-clear
            />
          </a-form-item>
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
import { ref, computed, onMounted, nextTick } from "vue";
import { Message } from "@arco-design/web-vue";
import {getMetricDimFields, pageMetric} from "../../services/metric/metric.ts";
import {log} from "echarts/types/src/util/log";

interface MetricItem {
  id: number;
  metricName: string;
  metricCode: string;
}

// 所有指标
const dimDataList = ref<MetricItem[]>([]);

// 当前搜索使用的指标
const selectedMetricId = ref<number | null>(null);

// 动态搜索框字段（由后端维度接口返回）
const dynamicFields = ref<{ name: string; label: string; type: string }[]>([]);

// 搜索表单数据
const searchForm = ref<Record<string, any>>({});

// 表格展示数据
const tableData = ref<any[]>([]);

const searchVisible = ref(false);

// 表格列（简化）
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

// 点击打开搜索框
const openSearchModal = async (item: MetricItem) => {
  selectedMetricId.value = item.id;
  searchForm.value = {};
  tableData.value = [];

  try {
    // 获取该指标的维度字段
    getMetricDimFields(item.id).then(resp=>{
      console.log(resp)
      // dynamicFields.value = resp.data || [];
      searchVisible.value = true;

    }).catch(error=>{
      console.log(error)
    })
  } catch (e) {
    console.log("失败"+e)
    Message.error("加载搜索条件失败");
  }
};

// 点击查询按钮
const doSearch = async () => {
  try {
    // const res = await queryMetricData({
    //   metricId: selectedMetricId.value,
    //   filters: searchForm.value
    // });
    tableData.value = res.data || [];
  } catch (e) {
    Message.error("查询失败");
  }
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
</style>
