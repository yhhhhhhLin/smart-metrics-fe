<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/overview'">
    <template #content>
      <div class="projectOverview">
        <div class="overview-header">项目概览</div>

        <div class="overview-cards">
          <a-card v-for="item in cardList" :key="item.title" class="overview-card" hoverable>
            <a-statistic
                :title="item.title"
                :value="item.value"
                :value-style="{ color: item.color }"
            />
          </a-card>
        </div>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import Container from "../../components/Container.vue"

const cardList = ref([
  {title: "指标总数", value: 5, color: "#1e80ff"},
  {title: "普通指标数量", value: 4, color: "#00b42a"},
  {title: "复合指标数量", value: 1, color: "#722ed1"},
  {title: "已发布指标", value: 5, color: "#165dff"},
  {title: "运行中调度", value: 5, color: "#ff7d00"},
  {title: "失败调度", value: 0, color: "#f53f3f"},
])

onMounted(() => {
  console.log("当前项目ID：", sessionStorage.getItem("projectId"))
})
</script>

<style scoped>
.projectOverview {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.overview-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.overview-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>
