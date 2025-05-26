<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-market'">
    <template #content>
      <div class="index-market">
        <!-- 搜索和筛选区域 -->
        <div class="market-header">
          <div class="search-area">
            <a-input-search
              v-model="searchKeyword"
              placeholder="搜索指标名称或编码"
              allow-clear
              @search="handleSearch"
              style="width: 300px"
            />
          </div>
          <div class="filter-area">
            <a-space>
              <a-select
                v-model="filterType"
                placeholder="指标类型"
                allow-clear
                style="width: 120px"
                @change="handleFilter"
              >
                <a-option value="normal">普通指标</a-option>
                <a-option value="composite">复合指标</a-option>
              </a-select>
            </a-space>
          </div>
        </div>

        <!-- 指标卡片网格 -->
        <div class="metric-grid">
          <a-card
            v-for="item in filteredMetrics"
            :key="item.id"
            class="metric-card"
            :bordered="false"
            hoverable
          >
            <template #cover>
              <div class="metric-card-cover">
                <icon-data-analysis class="metric-icon" />
              </div>
            </template>
            <template #actions>
              <a-button type="text" @click="openSearchModal(item)">
                <template #icon><icon-search /></template>
                查询
              </a-button>
            </template>
            <a-card-meta>
              <template #title>
                <div class="metric-title">
                  {{ item.metricName }}
                </div>
              </template>
              <template #description>
                <div class="metric-info">
                  <div class="metric-code">
                    <icon-code /> {{ item.metricCode }}
                  </div>
                  <div class="metric-tags">
                    <a-tag color="arcoblue" size="small">
                      {{ item.metricType === 'normal' ? '普通指标' : '复合指标' }}
                    </a-tag>
                    <a-tag color="green" size="small">已启用</a-tag>
                  </div>
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </div>

        <!-- 分页器 -->
        <div class="pagination-container">
          <a-pagination
            v-model:current="currentPage"
            :total="totalMetrics"
            :page-size="pageSize"
            show-total
            show-jumper
            show-page-size
            @change="handlePageChange"
          />
        </div>

        <!-- 搜索模态框 -->
        <a-modal v-model:visible="searchVisible" title="数据查询" :width="1000">
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
          <div class="table-container">
            <a-table
              :data="tableData"
              :columns="tableColumns"
              :pagination="{
                total: tableData.length,
                pageSize: 10,
                showTotal: true,
                showJumper: true,
                showPageSize: true
              }"
              :bordered="false"
              :stripe="true"
              :scroll="{ x: '100%', y: '500px' }"
              size="middle"
              class="metric-table"
            >
              <template #empty>
                <div class="empty-data">
                  <icon-empty />
                  <span>暂无数据</span>
                </div>
              </template>
            </a-table>
          </div>
        </a-modal>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import { ref, onMounted, computed } from "vue";
import { Message } from "@arco-design/web-vue";
import { getMetricDimFields, pageMetric } from "../../services/metric/metric.ts";
import {query} from "../../services/metric/metricMarket.ts";
import { IconSearch, IconCode } from '@arco-design/web-vue/es/icon';

interface MetricItem {
  id: number;
  metricName: string;
  metricCode: string;
  metricType: string;
  status: string;
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

// 搜索和筛选状态
const searchKeyword = ref('');
const filterType = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);
const totalMetrics = ref(0);

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

// 定义表格列配置
const tableColumns = [
  {
    title: '日期',
    dataIndex: 't0_order_date',
    width: 120,
    render: ({ record }) => {
      try {
        const date = record.t0_order_date?.value;
        if (!date) return '-';
        // 处理ISO格式的日期字符串
        return date.split('T')[0];
      } catch (e) {
        console.error('日期格式化错误:', e);
        return '-';
      }
    }
  },
  {
    title: '商品名称',
    dataIndex: 't0_product_name',
    width: 120,
  },
  {
    title: '门店名称',
    dataIndex: 't0_store_name',
    width: 120,
  },
  {
    title: '销售额',
    dataIndex: 'daily_sales_stores',
    width: 120,
    align: 'right',
    render: ({ record }) => {
      try {
        const value = record.daily_sales_stores;
        if (value == null) return '-';
        return Number(value).toLocaleString('zh-CN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      } catch (e) {
        console.error('数值格式化错误:', e);
        return '-';
      }
    }
  }
];

// 过滤后的指标列表
const filteredMetrics = computed(() => {
  let result = [...dimDataList.value];
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(item => 
      item.metricName.toLowerCase().includes(keyword) ||
      item.metricCode.toLowerCase().includes(keyword)
    );
  }
  
  // 类型筛选
  if (filterType.value) {
    result = result.filter(item => item.metricType === filterType.value);
  }
  
  return result;
});

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  // 可以在这里添加额外的搜索逻辑
};

// 处理筛选
const handleFilter = () => {
  currentPage.value = 1;
  // 可以在这里添加额外的筛选逻辑
};

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 可以在这里添加分页加载逻辑
};

// 加载所有指标
onMounted(async () => {
  try {
    const res = await pageMetric({ 
      currentPage: currentPage.value, 
      pageSize: pageSize.value 
    });
    dimDataList.value = res.data.records.map(item => ({
      ...item,
      status: 'active'
    }));
    totalMetrics.value = res.data.total;
  } catch (error) {
    console.error('加载指标列表失败:', error);
    Message.error('加载指标列表失败');
  }
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

    // 调用后端接口
    const res = await query(queryParams);
    if (res.code === 0 && res.data.success) {
      tableData.value = res.data.data;
      // 显示总数据量
      Message.success(`查询成功，共 ${res.data.totalCount} 条数据`);
    } else {
      Message.error(res.data.errorMessage || '查询失败');
    }
  } catch (e) {
    console.error("查询失败:", e);
    Message.error("查询失败");
  }
};
</script>

<style scoped>
.index-market {
  padding: 20px;
  background-color: #f7f8fa;
  min-height: 100%;
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  transition: all 0.3s ease;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.metric-card-cover {
  height: 120px;
  background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary));
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon {
  font-size: 48px;
  color: #fff;
  opacity: 0.9;
}

.metric-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 8px;
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-code {
  color: var(--color-text-3);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 响应式调整 */
@media screen and (max-width: 1400px) {
  .metric-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media screen and (max-width: 768px) {
  .market-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .search-area {
    width: 100%;
  }
  
  .search-area :deep(.arco-input-wrapper) {
    width: 100%;
  }
  
  .metric-grid {
    grid-template-columns: 1fr;
  }
}

/* 保持原有的模态框样式 */
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

.table-container {
  margin-top: 16px;
  background: #fff;
  border-radius: 4px;
}

.metric-table {
  --border-radius: 8px;
}

:deep(.arco-table-th) {
  background-color: #f7f8fa;
  font-weight: 600;
  color: #1d2129;
}

:deep(.arco-table-td) {
  color: #4e5969;
}

:deep(.arco-table-tr:hover) {
  background-color: #f2f3f5;
}

:deep(.arco-table-pagination) {
  margin-top: 16px;
  padding: 0 16px;
}

.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #86909c;
}

.empty-data .icon-empty {
  font-size: 48px;
  margin-bottom: 8px;
}

/* 响应式调整 */
@media screen and (max-width: 1200px) {
  .table-container {
    margin: 16px -16px;
    border-radius: 0;
  }
}
</style>
