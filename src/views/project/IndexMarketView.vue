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
          <a-space direction="vertical" size="mini">
            <a-typography-title
                :heading="6"
                class="clickable-title"
                @click="handleClick(item)"
            >
              {{ item.metricName }}
            </a-typography-title>
            <a-typography-text type="secondary">
              指标标识：{{ item.metricCode }}
            </a-typography-text>
          </a-space>
          <template #extra>
            <a-button type="primary" size="small" @click="handleSearch(item)">搜索</a-button>
          </template>
        </a-card>
      </div>

      <!-- 点状图 Modal -->
      <a-modal v-model:visible="visible" title="水果销售额趋势" :width="800" @afterOpen="renderChart">
        <div ref="chartRef" style="width: 100%; height: 400px" />
      </a-modal>

      <!-- 搜索 Modal -->
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
import { onMounted, ref, nextTick, watch, computed } from "vue";
import * as echarts from "echarts";
import { pageMetric } from "../../services/metric/metric.ts";

const dimDataList = ref<any[]>([])
const visible = ref(false)
const searchVisible = ref(false)
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts

const searchForm = ref({
  date: null,
  fruitName: ''
})
const filteredData = ref<any[]>([])

watch(visible, async (val) => {
  if (val) {
    await nextTick()
    renderChart()
  }
})

const mockData = [
  {
    "t1_order_date": "2025-04-10",
    data: [
      { fruit_daily_sales: 5, t0_product_name: "香蕉" },
      { fruit_daily_sales: 6, t0_product_name: "橙子" },
      { fruit_daily_sales: 7, t0_product_name: "牛奶" },
    ]
  },
  {
    "t1_order_date": "2025-04-09",
    data: [
      { fruit_daily_sales: 8, t0_product_name: "面包" },
    ]
  },
  {
    "t1_order_date": "2025-04-08",
    data: [
      { fruit_daily_sales: 6, t0_product_name: "橙子" },
      { fruit_daily_sales: 21, t0_product_name: "牛奶" },
      { fruit_daily_sales: 8, t0_product_name: "面包" },
    ]
  },
  {
    "t1_order_date": "2025-04-07",
    data: [
      { fruit_daily_sales: 5, t0_product_name: "香蕉" },
      { fruit_daily_sales: 7, t0_product_name: "牛奶" },
    ]
  },
  {
    "t1_order_date": "2025-04-06",
    data: [
      { fruit_daily_sales: 5, t0_product_name: "香蕉" },
      { fruit_daily_sales: 6, t0_product_name: "橙子" },
    ]
  }
]

onMounted(() => {
  pageMetric({ currentPage: 1, pageSize: 10 }).then((res) => {
    dimDataList.value = res.data.records;
  }).catch(err => {
    console.error(err)
  });
})

const handleClick = (item: any) => {
  if (item.metricName === "水果每天销售额1") {
    visible.value = true
  }
}

const handleSearch = (item: any) => {
  if (item.metricName === "水果每天销售额1") {
    searchVisible.value = true
    filteredData.value = mockData
  }
}

const doSearch = () => {
  const { date, fruitName } = searchForm.value
  filteredData.value = mockData.filter(group => {
    const dateMatch = !date || group.t1_order_date === date
    const fruitMatch = group.data.some(d =>
        !fruitName || d.t0_product_name.includes(fruitName)
    )
    return dateMatch && fruitMatch
  })
}

const flattenedTableData = computed(() =>
    filteredData.value.flatMap(group =>
        group.data
            .filter(d =>
                !searchForm.value.fruitName || d.t0_product_name.includes(searchForm.value.fruitName)
            )
            .map(item => ({
              key: `${group.t1_order_date}-${item.t0_product_name}`,
              date: group.t1_order_date,
              name: item.t0_product_name,
              sales: item.fruit_daily_sales
            }))
    )
)

const tableColumns = [
  { title: "日期", dataIndex: "date", key: "date" },
  { title: "水果名称", dataIndex: "name", key: "name" },
  { title: "销售额", dataIndex: "sales", key: "sales" }
]

const renderChart = async () => {
  await nextTick()
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  } else {
    chartInstance.clear()
  }

  const seriesData: any[] = []
  mockData.forEach(group => {
    group.data.forEach((item: any) => {
      seriesData.push({
        name: item.t0_product_name,
        value: [group.t1_order_date, item.fruit_daily_sales]
      })
    })
  })

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) =>
          `${params.name}<br/>日期: ${params.value[0]}<br/>销售额: ${params.value[1]}`,
    },
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
    series: [
      {
        type: 'scatter',
        symbolSize: 20,
        data: seriesData
      }
    ]
  }

  chartInstance.setOption(option)
  chartInstance.resize()
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f7f8fa;
  padding: 20px;
  height: 100%;
}
.metric-card {
  width: 100%;
}
.clickable-title {
  cursor: pointer;
  color: var(--color-primary);
}
</style>
