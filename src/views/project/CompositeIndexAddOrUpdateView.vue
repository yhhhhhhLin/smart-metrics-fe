<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/index-management'"
             :left-menu-selected="'/project/index-management/index-develop'" :sidebarType="1">
    <template #content>
      <div class="index-add-or-update-content">
        <div class="step-bar">
          <a-steps :current="currentStep" :small="true">
            <a-step>维表信息设置</a-step>
            <a-step>维度属性设置</a-step>
          </a-steps>
        </div>
        <a-divider/>
        <div class="step-content">
          <div v-if="currentStep === 1" class="form-wrapper">
          </div>

          <div v-if="currentStep === 2" class="step-section">
          </div>
        </div>
        <a-divider/>

        <div class="step-button">
          <a-button v-if="currentStep === 1" @click="router.push({name: '指标开发'})">取消</a-button>
        </div>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import {onMounted, ref} from "vue";
import router from "../../router";

const currentStep = ref(1);

const projectId = ref()
const projectDscId = ref()
onMounted(() => {

  projectId.value = sessionStorage.getItem('projectId') || '1'
  projectDscId.value = sessionStorage.getItem('projectDscId') || '1'

});

</script>

<style scoped>
.index-add-or-update-content {
  background-color: #FFFFFF;
  height: 93%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 30px;
}

.step-button a-button {
  min-width: 100px;
}


.step-content {
  flex: 1;
  overflow-y: auto;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

</style>
