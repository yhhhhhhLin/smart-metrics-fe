<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/overview'">
    <template #content>
      <div class="projectOverview">
        <div class="overview-header">
          <div class="header-content">
            <div class="header-title">
              <span class="title-icon">📊</span>
              <span class="title-text">项目概览</span>
            </div>
            <div class="header-actions">
              <a-button type="primary" class="refresh-btn">
                <template #icon><icon-refresh /></template>
                刷新数据
              </a-button>
            </div>
          </div>
          <div class="header-divider"></div>
        </div>

        <div class="overview-cards">
          <a-card v-for="(item, index) in cardList" 
                 :key="item.title" 
                 class="overview-card" 
                 hoverable
                 :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="card-content">
              <div class="card-icon" :style="{ backgroundColor: `${item.color}15` }">
                <span class="icon-text">{{ getCardIcon(item.title) }}</span>
              </div>
              <div class="card-info">
                <a-statistic
                    :title="item.title"
                    :value="item.value"
                    :value-style="{ color: item.color }"
                >
                  <template #suffix>
                    <span class="trend-icon" v-if="item.trend">
                      <icon-rise v-if="item.trend > 0" style="color: #00b42a" />
                      <icon-down v-else style="color: #f53f3f" />
                    </span>
                  </template>
                </a-statistic>
                <div class="card-footer" v-if="item.subtitle">
                  <span class="subtitle">{{ item.subtitle }}</span>
                </div>
              </div>
            </div>
          </a-card>
        </div>

        <div class="overview-charts">
          <div class="chart-container">
            <a-card class="chart-card" title="指标趋势">
              <div class="chart-placeholder">
                <icon-line-chart style="font-size: 48px; color: var(--primary-6)" />
                <span>指标趋势图表</span>
              </div>
            </a-card>
          </div>
          <div class="chart-container">
            <a-card class="chart-card" title="调度状态">
              <div class="chart-placeholder">
                <icon-pie-chart style="font-size: 48px; color: var(--primary-6)" />
                <span>调度状态图表</span>
              </div>
            </a-card>
          </div>
        </div>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import Container from "../../components/Container.vue"
import { 
  IconRefresh,
  IconDown,
} from '@arco-design/web-vue/es/icon'

const cardList = ref([
  {title: "指标总数", value: 5, color: "#1e80ff", trend: 2, subtitle: "较上月增长 2 个", icon: "📈"},
  {title: "普通指标数量", value: 4, color: "#00b42a", trend: 1, subtitle: "较上月增长 1 个", icon: "📊"},
  {title: "复合指标数量", value: 1, color: "#722ed1", trend: 0, subtitle: "较上月持平", icon: "🔗"},
  {title: "已发布指标", value: 5, color: "#165dff", trend: 2, subtitle: "较上月增长 2 个", icon: "🚀"},
  {title: "运行中调度", value: 5, color: "#ff7d00", trend: -1, subtitle: "较上月减少 1 个", icon: "⚡"},
  {title: "失败调度", value: 0, color: "#f53f3f", trend: -2, subtitle: "较上月减少 2 个", icon: "⚠️"},
])

const getCardIcon = (title: string) => {
  const iconMap: { [key: string]: string } = {
    "指标总数": "📈",
    "普通指标数量": "📊",
    "复合指标数量": "🔗",
    "已发布指标": "🚀",
    "运行中调度": "⚡",
    "失败调度": "⚠️"
  }
  return iconMap[title] || "📊"
}

onMounted(() => {
  console.log("当前项目ID：", sessionStorage.getItem("projectId"))
})
</script>

<style scoped>
.projectOverview {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.6s ease-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.overview-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 24px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.title-text {
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #1e80ff, #165dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.header-divider {
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(30, 128, 255, 0.1) 0%,
    rgba(30, 128, 255, 0.3) 50%,
    rgba(30, 128, 255, 0.1) 100%
  );
  border-radius: 2px;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.refresh-btn {
  animation: fadeInRight 0.5s ease-out;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.overview-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: cardFadeIn 0.5s ease-out both;
  overflow: hidden;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.overview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-text {
  font-size: 24px;
}

.card-info {
  flex: 1;
}

.card-footer {
  margin-top: 8px;
  font-size: 12px;
  color: #86909c;
}

.trend-icon {
  margin-left: 4px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.overview-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.chart-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #86909c;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f5ff 100%);
  border-radius: 12px;
  animation: shimmer 2s infinite;
}

:deep(.arco-card-header) {
  border-bottom: 2px solid #f2f3f5;
  padding: 16px 20px;
}

:deep(.arco-card-header-title) {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

:deep(.arco-statistic) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.arco-statistic-title) {
  font-size: 14px;
  color: #4e5969;
}

:deep(.arco-statistic-value) {
  font-size: 24px;
  font-weight: 600;
}

:deep(.arco-btn-primary) {
  background: linear-gradient(135deg, #1e80ff, #165dff);
  border: none;
  transition: all 0.3s ease;
}

:deep(.arco-btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 128, 255, 0.2);
}

:deep(.arco-btn-primary:active) {
  transform: translateY(0);
}

/* 响应式布局优化 */
@media screen and (max-width: 1200px) {
  .overview-charts {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
