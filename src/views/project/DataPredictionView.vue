<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/data-prediction'">
    <template #content>
      <div class="data-prediction-container">
        <div class="title-container">
          <h2>数据预测</h2>
          <a-tooltip content="预测将根据最新指标调度结果表数据进行分析，如果指标尚未调度，则预测可能失败。" position="top">
            <div class="prediction-tip">
              <icon-info-circle />
              <span>提示</span>
            </div>
          </a-tooltip>
        </div>
        <div v-if="metricsId" class="metrics-id">指标ID：{{ metricsId }}</div>
        <div class="prediction-options">
          <a-radio-group v-model="period" type="button">
            <a-radio value="week">预测后面一周</a-radio>
            <a-radio value="month">预测后面一个月</a-radio>
          </a-radio-group>
        </div>
        <div class="prediction-action">
          <a-button type="primary" @click="handlePredict">开始预测</a-button>
        </div>
        <div v-if="showResult" class="prediction-result">
          <h3>预测结果（mock数据）</h3>
          <a-table :columns="columns" :data="mockResult" :pagination="false" />
        </div>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from '../../components/Container.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { IconInfoCircle } from '@arco-design/web-vue/es/icon';
import {metricPredict} from "../../services/metric/metric.ts";

const route = useRoute();
const metricsId = ref<string>(route.query.metricsId as string || '');
const period = ref('week');
const showResult = ref(false);

const columns = [
  { title: '日期', dataIndex: 'date' },
  { title: '预测值', dataIndex: 'value' },
];

const mockResult = ref([
  { date: '2024-06-10', value: 120 },
  { date: '2024-06-11', value: 130 },
  { date: '2024-06-12', value: 128 },
  { date: '2024-06-13', value: 140 },
  { date: '2024-06-14', value: 135 },
  { date: '2024-06-15', value: 138 },
  { date: '2024-06-16', value: 142 },
]);

const handlePredict = () => {
  // 组装要发送给后端的数据
  const data = {
    metricId: metricsId.value,
    period: period.value
  };
  metricPredict(data).then(resp=>{
    console.log(resp)
  }).catch(error=>{
    console.log(error)
  })
  console.log('发送给后端的数据:', data);
  // 你可以在这里调用你的接口，例如：await api.predict(data)
  showResult.value = true;
};

onMounted(() => {
  console.log('当前指标ID:', metricsId.value);
});
</script>

<style scoped>
.data-prediction-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 32px 24px 24px 24px;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 10px;
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

.prediction-action {
  text-align: center;
  margin-bottom: 32px;
}

.prediction-result {
  margin-top: 32px;
}
</style> 