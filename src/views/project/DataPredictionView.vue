<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/data-prediction'">
    <template #content>
      <div class="data-prediction-container">
        <div class="title-container">
          <h2>数据预测</h2>
          <a-tooltip content="预测将根据最新指标调度结果表数据进行分析，如果指标尚未调度，则预测可能失败。" position="top">
            <div class="prediction-tip">
              <icon-info-circle/>
              <span>提示</span>
            </div>
          </a-tooltip>
          <a-button type="primary" @click="ClickShowHistory" class="history-btn">历史预测</a-button>
        </div>
        <div v-if="metricsId" class="metrics-id">指标ID：{{ metricsId }}</div>
        <div class="prediction-options">
          <a-radio-group v-model="period" type="button">
            <a-radio value="week">预测后面一周</a-radio>
            <a-radio value="month">预测后面一个月</a-radio>
          </a-radio-group>
        </div>
        <div class="dim-fields">
          <div v-for="field in dimFields" :key="field.columnName" class="dim-field">
            <span class="field-label">{{ field.description }}</span>
            <a-select v-model="field.value" :placeholder="field.description" style="width: 200px;">
              <a-option v-for="option in field.options" :key="option" :value="option">{{ option }}</a-option>
            </a-select>
          </div>
        </div>
        <div class="prediction-action">
          <a-button type="primary" @click="handlePredict" :disabled="isPredicting">开始预测</a-button>
        </div>
        <div v-if="showResult" class="prediction-result">
          <h3>预测结果（mock数据）</h3>
          <a-table :columns="columns" :data="mockResult" :pagination="false"/>
        </div>
      </div>

      <!-- 历史预测任务列表 -->
      <a-modal v-model:visible="showHistoryModal" title="历史预测任务" width="600px">
        <a-table :columns="historyColumns" :data="historyTasks" :pagination="false">
          <template #action="{ record }">
            <a-button type="text" @click="showTaskDetail(record)">查看详情</a-button>
          </template>
        </a-table>
      </a-modal>

      <!-- 详细预测结果 -->
      <a-modal v-model:visible="showDetailModal" title="详细预测结果" width="800px">
        <div v-if="selectedTask">
          <div class="task-field" v-if="selectedTask.taskField">
            <h4>任务字段</h4>
            <p>{{ selectedTask.taskField }}</p>
          </div>
          <h3>趋势分析</h3>
          <p>{{ selectedTask.trendAnalysis }}</p>
          <h3>预测结果</h3>
          <a-tabs>
            <a-tab-pane key="weekly" title="周预测">
              <a-table :columns="detailColumns" :data="selectedTask.weeklyPrediction" :pagination="false"/>
            </a-tab-pane>
            <a-tab-pane key="monthly" title="月预测">
              <a-table :columns="detailColumns" :data="selectedTask.monthlyPrediction" :pagination="false"/>
            </a-tab-pane>
          </a-tabs>
          <h3>建议</h3>
          <ul class="suggestions-list">
            <li v-for="(suggestion, index) in selectedTask.suggestions" :key="index">{{ suggestion }}</li>
          </ul>
        </div>
      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from '../../components/Container.vue';
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {IconInfoCircle} from '@arco-design/web-vue/es/icon';
import {getFieldValue, getMetricDimFields, metricPredict, taskList} from "../../services/metric/metric.ts";
import {Notification} from "@arco-design/web-vue";

const route = useRoute();
const metricsId = ref<string>(route.query.metricsId as string || '');
const period = ref('week');
const showResult = ref(false);
const isPredicting = ref(false);
const showHistoryModal = ref(false);
const showDetailModal = ref(false);

interface PredictionTask {
  taskId: string;
  createTime: string;
  trendAnalysis?: string;
  weeklyPrediction?: Array<{ date: string; value: number }>;
  monthlyPrediction?: Array<{ date: string; value: number }>;
  suggestions?: string[];
  taskField?: string;
  gptDataAnalyzeResult: {
    trendAnalysis: string;
    weeklyPrediction: Array<{ date: string; value: number }>;
    monthlyPrediction: Array<{ date: string; value: number }>;
    suggestions: string[];
  };
}

const selectedTask = ref<PredictionTask | null>(null);

const columns = [
  {title: '日期', dataIndex: 'date'},
  {title: '预测值', dataIndex: 'value'},
];

const mockResult = ref([
  {date: '2024-06-10', value: 120},
  {date: '2024-06-11', value: 130},
  {date: '2024-06-12', value: 128},
  {date: '2024-06-13', value: 140},
  {date: '2024-06-14', value: 135},
  {date: '2024-06-15', value: 138},
  {date: '2024-06-16', value: 142},
]);

const historyColumns = [
  {title: '任务ID', dataIndex: 'taskId'},
  {title: '任务字段', dataIndex: 'taskField'},
  {title: '操作', slotName: 'action'},
];

const historyTasks = ref<PredictionTask[]>([]);

const detailColumns = [
  {title: '日期', dataIndex: 'date'},
  {title: '预测值', dataIndex: 'value'},
];

const dimensions = ref([
  {id: 1, name: '维度1'},
  {id: 2, name: '维度2'},
  {id: 3, name: '维度3'},
]);

const selectedDimension = ref<string | number>();

interface DimField {
  columnName: string;
  description: string;
  dataType: string;
  isTimeDim: boolean;
  isMeasure: boolean | null;
  attrId: string | null;
  tableAlias: string;
  options?: string[];
}

const dimFields = ref<Array<{ columnName: string; description: string; value: string; options?: string[] }>>([]);

const handlePredict = () => {
  if (isPredicting.value) return;
  isPredicting.value = true;
  const filters: Record<string, string> = {};
  dimFields.value.forEach(field => {
    if (field.value) {
      filters[field.columnName] = field.value;
    }
  });
  const data = {
    metricId: Number(metricsId.value),
    period: period.value,
    filters: filters
  };
  console.log('发送给后端的数据:', data);
  metricPredict(data)
    .then(resp => {
      console.log(resp);
      if (resp.data) {

        Notification.success({
          title: '系统提示',
          content: '成功，等待一会可在预测历史中获取结果',
          closable: true
        })
      }
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      setTimeout(() => {
        isPredicting.value = false;
      }, 20000);
    });
};

const showTaskDetail = (task: PredictionTask) => {
  selectedTask.value = {
    taskId: task.taskId,
    taskField: task.taskField,
    trendAnalysis: task.gptDataAnalyzeResult.trendAnalysis,
    weeklyPrediction: task.gptDataAnalyzeResult.weeklyPrediction,
    monthlyPrediction: task.gptDataAnalyzeResult.monthlyPrediction,
    suggestions: task.gptDataAnalyzeResult.suggestions
  };
  showDetailModal.value = true;
};

onMounted(()=>{
  getMetricDimFields(metricsId.value).then((resp: any) => {
    dimFields.value = resp.data
      .filter((field: DimField) => field.isMeasure !== true)
      .map((field: DimField) => ({ columnName: field.tableAlias+"_"+ field.columnName, description: field.description, value: '', options: [] }));
    
    // 获取每个字段的options数据
    dimFields.value.forEach(field => {
      getFieldValue({ metricId: Number(metricsId.value), fieldName: field.columnName })
        .then(res => {
          field.options = res.data as string[];
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    
    console.log(resp);
  }).catch((error: Error) => {
    console.log(error);
  });
});

const ClickShowHistory = () => {
  showHistoryModal.value = true;
  taskList().then((resp) => {
    if (resp.code === 0 && resp.data) {
      historyTasks.value = resp.data.map((task: any) => ({
        taskId: task.taskId,
        taskField: task.taskField,
        gptDataAnalyzeResult: task.gptDataAnalyzeResult
      }));
    }
  }).catch(error => {
    console.log(error);
    Notification.error({
      title: '获取历史预测失败',
      content: error.message || '请稍后重试'
    });
  });
};
</script>

<style scoped>
.data-prediction-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 32px 24px 24px 24px;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.metrics-id {
  color: #409eff;
  font-size: 15px;
  margin-bottom: 18px;
  font-weight: 500;
}

.prediction-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff9800;
  font-size: 14px;
  cursor: pointer;
}

.prediction-options {
  margin: 24px 0 32px 0;
  text-align: center;
}

.dim-fields {
  margin-bottom: 24px;
}

.dim-field {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.field-label {
  min-width: 100px;
  text-align: right;
}

.prediction-action {
  text-align: center;
  margin-bottom: 32px;
}

.prediction-result {
  margin-top: 32px;
}

.history-btn {
  margin-left: auto;
}

.task-field {
  margin-bottom: 20px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.task-field h4 {
  margin: 0 0 8px 0;
  color: #1d2129;
  font-size: 14px;
}

.task-field p {
  margin: 0;
  color: #4e5969;
  font-size: 13px;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  padding: 8px 12px;
  margin-bottom: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #4e5969;
}

.suggestions-list li:last-child {
  margin-bottom: 0;
}
</style> 