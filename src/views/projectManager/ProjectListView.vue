<template>
  <container :top-menu-type="1" :top-menu-selected="'/projectManager/projectList'">
    <template #content>
      <div class="project-list-content">
        <div class="project-list-operate">
          <div class="project-list-operate-project-name-search">
            <a-input-search :style="{width:'320px'}" placeholder="请输入项目名称"/>
          </div>
          <div class="project-list-operate-create-project-btn">
            <a-button type="primary" @click="clickAddProject">新建项目</a-button>
          </div>
        </div>
        这是项目列表
      </div>

      <a-modal v-model:visible="projectAddVisible" title="新建项目" @cancel="handleCancelProjectAdd"
               :align-center="false"
               top="15%" @before-ok="handleBeforeOkProjectAdd">
        <a-form :model="projectAddForm">
          <a-form-item field="projectName" label="项目名称">
            <a-input placeholder="请输入项目名称" v-model="projectAddForm.projectName"/>
          </a-form-item>

          <a-form-item field="projectNameEn" label="项目标识">
            <a-input placeholder="请输入项目标识" v-model="projectAddForm.projectNameEn"/>
          </a-form-item>

          <a-form-item field="projectDesc" label="项目描述">
            <a-textarea v-model="projectAddForm.projectDesc" placeholder="请输入项目描述" allow-clear/>
          </a-form-item>

          <a-form-item field="dsc" label="请选择数据源">
            <a-select placeholder="请选择数据源" v-model="projectAddForm.dscId">
              <a-option value="1">数据源mock1</a-option>
              <a-option value="2">数据源mock2</a-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-alert
                message="提示"
                type="info"
                show-icon
                style="margin-top: 16px; font-size: 14px; background-color: #f0f5ff; border-color: #91d5ff;"
            >
              新建项目时，会在对应数据源中自动创建一个新的database，格式为 xxx，将用于保存一些临时表等数据。
            </a-alert>
          </a-form-item>

        </a-form>
      </a-modal>
    </template>
  </container>
</template>
<script setup lang="ts">

import Container from "../../components/Container.vue";
import {reactive, ref} from "vue";

const projectAddForm = reactive<API.projectAddDto>({projectName: '', projectNameEn: '', projectDesc: '', dscId: null});
const projectAddVisible = ref(false)

const clickAddProject = ()=>{
  // TODO 获取所有数据源
  initProjectAddForm()
  projectAddVisible.value = true
}

const handleCancelProjectAdd = ()=>{
  initProjectAddForm()
  projectAddVisible.value = false
}

const handleBeforeOkProjectAdd = ()=>{
  // 发送创建项目请求
  console.log(projectAddForm)

  projectAddVisible.value = false
}

const initProjectAddForm = ()=>{
  projectAddForm.dscId = undefined;
  projectAddForm.projectNameEn = undefined;
  projectAddForm.projectName = undefined
  projectAddForm.projectDesc = undefined;
}
</script>

<style scoped>
.project-list-content {
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-list-operate {
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 20px;

}

</style>