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

      <a-modal v-model:visible="chartVisible" title="水果销售额趋势" :width="800" @afterOpen="renderChart">
        <div ref="chartRef" class="chart-container" />
      </a-modal>

      <a-modal v-model:visible="searchVisible" title="水果销售额查询" :width="800">
        <a-form :model="searchForm" layout="inline" @submit.prevent>
          <a-form-item label="日期">
            <a-date-picker v-model="searchForm.date" placeholder="请选择日期" format="YYYY-MM-DD" />
          </a-form-item>
          <a-form-item label="水果名称">
            <a-input v-model="searchForm.fruitName" placeholder="输入水果名" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="doSearch">查询</a-button>
          </a-form-item>
        </a-form>
        <a-divider />
        <a-table
            :data="flattenedTableData"
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
import { ref, computed, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";
import { pageMetric } from "../../services/metric/metric.ts";

interface MetricItem {
  id: number;
  metricName: string;
  metricCode: string;
}

interface SalesDataItem {
  t0_product_name: string;
  fruit_daily_sales: number;
}

interface ChartDataGroup {
  t1_order_date: string;
  data: SalesDataItem[];
}

const dimDataList = ref<MetricItem[]>([]);
const chartVisible = ref(false);
const searchVisible = ref(false);
const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const searchForm = ref({
  date: null as string | null,
  fruitName: ''
});

const filteredData = ref<ChartDataGroup[]>([]);

// mock 数据
const mockData: ChartDataGroup[] = [
  { t1_order_date: "2025-04-10", data: [{ fruit_daily_sales: 5, t0_product_name: "香蕉" }, { fruit_daily_sales: 6, t0_product_name: "橙子" }, { fruit_daily_sales: 7, t0_product_name: "牛奶" }] },
  { t1_order_date: "2025-04-09", data: [{ fruit_daily_sales: 8, t0_product_name: "面包" }] },
  { t1_order_date: "2025-04-08", data: [{ fruit_daily_sales: 6, t0_product_name: "橙子" }, { fruit_daily_sales: 21, t0_product_name: "牛奶" }, { fruit_daily_sales: 8, t0_product_name: "面包" }] },
  { t1_order_date: "2025-04-07", data: [{ fruit_daily_sales: 5, t0_product_name: "香蕉" }, { fruit_daily_sales: 7, t0_product_name: "牛奶" }] },
  { t1_order_date: "2025-04-06", data: [{ fruit_daily_sales: 5, t0_product_name: "香蕉" }, { fruit_daily_sales: 6, t0_product_name: "橙子" }] }
];

// 加载维度数据
onMounted(() => {
  pageMetric({ currentPage: 1, pageSize: 10 })
      .then(res => {
        dimDataList.value = res.data.records;
      })
      .catch(console.error);
});

// 监听图表 modal 打开自动绘图
watch(chartVisible, async (val) => {
  if (val) {
    await nextTick();
    renderChart();
  }
});

// 打开图表 modal
const openChartModal = (item: MetricItem) => {
  if (item.metricName === "水果每天销售额1") {
    chartVisible.value = true;
  }
};

// 打开搜索 modal
const openSearchModal = (item: MetricItem) => {
  if (item.metricName === "水果每天销售额1") {
    searchVisible.value = true;
    filteredData.value = mockData;
  }
};

// 搜索过滤数据
const doSearch = () => {
  const { date, fruitName } = searchForm.value;

  filteredData.value = mockData.filter(group => {
    const dateMatch = !date || group.t1_order_date === date;
    const fruitMatch = group.data.some(d => !fruitName || d.t0_product_name.includes(fruitName));
    return dateMatch && fruitMatch;
  });
};

// 表格数据展开处理
const flattenedTableData = computed(() =>
    filteredData.value.flatMap(group =>
        group.data
            .filter(item => !searchForm.value.fruitName || item.t0_product_name.includes(searchForm.value.fruitName))
            .map(item => ({
              key: `${group.t1_order_date}-${item.t0_product_name}`,
              date: group.t1_order_date,
              name: item.t0_product_name,
              sales: item.fruit_daily_sales
            }))
    )
);

// 表格列定义
const tableColumns = [
  { title: "日期", dataIndex: "date", key: "date" },
  { title: "水果名称", dataIndex: "name", key: "name" },
  { title: "销售额", dataIndex: "sales", key: "sales" }
];

// 绘制 echarts 图表
const renderChart = async () => {
  await nextTick();
  if (!chartRef.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  } else {
    chartInstance.clear();
  }

  const groupedData: Record<string, any[]> = {};
  mockData.forEach(group => {
    group.data.forEach(item => {
      const name = item.t0_product_name;
      if (!groupedData[name]) groupedData[name] = [];
      groupedData[name].push([group.t1_order_date, item.fruit_daily_sales]);
    });
  });

  const series = Object.entries(groupedData).map(([name, data]) => ({
    name,
    type: 'scatter',
    symbolSize: 20,
    data
  }));

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) =>
          `${params.seriesName}<br/>日期: ${params.value[0]}<br/>销售额: ${params.value[1]}`
    },
    legend: { top: 10 },
    xAxis: {
      type: 'category',
      name: '日期',
      nameLocation: 'middle',
      nameGap: 25,
      axisLabel: { rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name: '销售额'
    },
    series
  };

  chartInstance.setOption(option);
  chartInstance.resize();
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

.chart-container {
  width: 100%;
  height: 400px;
}
</style>
