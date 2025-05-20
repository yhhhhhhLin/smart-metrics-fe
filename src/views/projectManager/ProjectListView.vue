<template>
  <container :top-menu-type="1" :top-menu-selected="'/projectManager/projectList'">
    <template #content>
      <div class="project-list-content">
        <div class="project-list-operate">
          <div class="project-list-operate-project-name-search">
            <a-input-search :style="{width:'320px'}" placeholder="请输入项目名称"/>
          </div>
          <div class="project-list-operate-create-project-btn">
            <a-button type="primary" @click="clickAddProjectBtn">新建项目</a-button>
          </div>
        </div>
        <div class="project-page-content-content">
          <a-table
              :columns="columns"
              :pagination="pagination"
              :data="projects"
              @change="handleTableChange"
          >
            <template #optional="{ record }">
              <a-button type="primary" @click="updateStatus(record)">
                {{ record.isTop == 1 ? '取消置顶' : '置顶' }}
              </a-button>
              <a-button @click="deleteProject(record)">删除</a-button>
            </template>

            <template #projectName="{record}">
              <a-link href="javascript:void(0)" @click="goToProjectOverviewPage(record.id,record.dscId)">
                {{ record.projectName }}
              </a-link>
            </template>
          </a-table>
        </div>
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
              <a-option v-for="datasource in datasourceList" :key="datasource.id" :value="datasource.id">
                {{ datasource.dscName }}
              </a-option>
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
import {onMounted, reactive, ref} from "vue";
import {
  addDscProject, delProjectById,
  listDataSource,
  pageProject,
  updateProjectIsTopStatus
} from "../../services/datasource/datasource.ts";
import {Notification} from "@arco-design/web-vue";
import router from "../../router";

const projectAddForm = reactive<API.projectAddDto>({projectName: '', projectNameEn: '', projectDesc: '', dscId: null});
const projectAddVisible = ref(false)
const dscName = ref<string>('');
const total = ref(0)
const datasourceList = ref<any[]>([]);
const pageProjectParam = reactive<API.ProjectPageDto>({
  projectName: '',
  projectNameEn: '',
  pageSize: 10,
  currentPage: 1
});

const columns = [
  {title: "项目名称", slotName: 'projectName'},
  {title: "项目描述", dataIndex: "projectDesc"},
  {
    title: "项目创建人",
    dataIndex: "createUserName",
  },
  {title: "创建时间", dataIndex: "createdTime"},
  {
    title: '操作',
    fixed: 'right',
    slotName: 'optional',
    width: 200,
  },
];

const pagination = {
  current: pageProjectParam.currentPage,
  pageSize: pageProjectParam.pageSize,
  total: total.value,
  showTotal: (total: number) => `总共 ${total} 条数据`,
};

const projects = reactive<any[]>([])

onMounted(() => {
  fetchProject()
})

const fetchProject = () => {
  pageProject(pageProjectParam).then((resp) => {
    console.log(resp)
    projects?.splice(0, projects?.length, ...resp.data.records)
    total.value = resp.data.total
  }).catch((error) => {
    console.log(error)
  })

}

const fetchDataSources = () => {
  listDataSource({dscName: dscName.value}).then((res) => {
    datasourceList.value = res.data;
    console.log(datasourceList.value)
  }).catch((error) => {
    console.error(error);
  });
};


const clickAddProjectBtn = () => {
  initProjectAddForm()
  projectAddVisible.value = true
  fetchDataSources()
}

const onAddProject = () => {
  // 发送添加项目请求
  console.log(projectAddForm)
  addDscProject(projectAddForm)
      .then((resp) => {
        if (resp.code == 0) {
          Notification.success({
            title: '系统提示',
            content: '添加成功',
            closable: true
          })
        }
        fetchProject()
      }).catch((error) => {
    console.log(error)
  })
}

const handleCancelProjectAdd = () => {
  initProjectAddForm()
  projectAddVisible.value = false
}

const handleBeforeOkProjectAdd = () => {
  // 发送创建项目请求
  onAddProject()

  projectAddVisible.value = false

}

const initProjectAddForm = () => {
  projectAddForm.dscId = undefined;
  projectAddForm.projectNameEn = undefined;
  projectAddForm.projectName = undefined
  projectAddForm.projectDesc = undefined;
}

const handleTableChange = () => {

}

const updateStatus = (project: API.DscProjectVO) => {
  // 更新对应告警状态
  const updatedStatus = project.isTop === 0 ? 1 : 0;
  const id = project.id
  updateProjectIsTopStatus({id: id, status: updatedStatus})
      .then((resp => {
        // 重新获取数据
        if (resp.code === 0) {
          Notification.success({
            title: '系统提示',
            content: '更新成功',
            closable: true
          })
          fetchProject()
        }
      })).catch((error) => {
    console.log(error)
  })


}

const goToProjectOverviewPage = (projectId: number, dscId: number) => {

  sessionStorage.setItem("projectId", projectId.toString());
  sessionStorage.setItem("projectDscId", dscId)
  router.push({
        path: "/project/overview"
      }
  )
}

const deleteProject = (record) =>{

  delProjectById(record).then((resp)=>{
    if(resp.data){
      fetchProject()
      Notification.success({
        title: '系统提示',
        content: '删除成功',
        closable: true
      })
    }else{
      console.log(resp)
    }

  }).catch((error)=>{
    console.log(error)
  })

}
</script>

<style scoped>
.project-list-content {
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fadeInUp 0.6s ease-out;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-list-operate {
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  animation: slideInDown 0.5s ease-out;
  position: relative;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-list-operate-project-name-search {
  animation: fadeInLeft 0.5s ease-out 0.2s both;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.project-list-operate-create-project-btn {
  animation: fadeInRight 0.5s ease-out 0.2s both;
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

/* 搜索框动画 */
:deep(.arco-input-search) {
  transition: all 0.3s ease;
}

:deep(.arco-input-search:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

:deep(.arco-input-search .arco-input) {
  transition: all 0.3s ease;
}

:deep(.arco-input-search .arco-input:focus) {
  transform: scale(1.01);
  box-shadow: 0 0 0 2px rgba(var(--primary-6), 0.1);
}

/* 新建项目按钮动画 */
:deep(.arco-btn-primary) {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.arco-btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-6), 0.2);
}

:deep(.arco-btn-primary::after) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

:deep(.arco-btn-primary:hover::after) {
  left: 100%;
}

.project-page-content-content {
  height: 100%;
  padding: 20px;
  animation: fadeIn 0.5s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 表格动画 */
:deep(.arco-table) {
  transition: all 0.3s ease;
}

:deep(.arco-table-tr) {
  transition: all 0.3s ease;
}

:deep(.arco-table-tr:hover) {
  transform: translateX(4px);
  background-color: rgba(var(--primary-6), 0.04);
}

:deep(.arco-table-td) {
  transition: all 0.3s ease;
}

/* 表格中的链接动画 */
:deep(.arco-link) {
  position: relative;
  transition: all 0.3s ease;
}

:deep(.arco-link::after) {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--primary-6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: right;
}

:deep(.arco-link:hover::after) {
  transform: scaleX(1);
  transform-origin: left;
}

/* 操作按钮动画 */
:deep(.arco-btn) {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

:deep(.arco-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.arco-btn::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

:deep(.arco-btn:active::after) {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

/* 弹窗动画优化 */
:deep(.arco-modal) {
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

:deep(.arco-modal-content) {
  animation: modalContentFadeIn 0.3s ease-out 0.1s both;
}

@keyframes modalContentFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单输入框动画 */
:deep(.arco-form-item) {
  transition: all 0.3s ease;
}

:deep(.arco-input-wrapper),
:deep(.arco-textarea-wrapper),
:deep(.arco-select-view) {
  transition: all 0.3s ease;
}

:deep(.arco-input-wrapper:hover),
:deep(.arco-textarea-wrapper:hover),
:deep(.arco-select-view:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.arco-input-wrapper:focus-within),
:deep(.arco-textarea-wrapper:focus-within),
:deep(.arco-select-view:focus-within) {
  transform: translateY(-1px);
  box-shadow: 0 0 0 2px rgba(var(--primary-6), 0.1);
}

/* 提示框动画 */
:deep(.arco-alert) {
  animation: alertFadeIn 0.3s ease-out;
  transition: all 0.3s ease;
}

@keyframes alertFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.arco-alert:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 分页器动画 */
:deep(.arco-pagination) {
  animation: fadeIn 0.5s ease-out 0.4s both;
}

:deep(.arco-pagination-item) {
  transition: all 0.3s ease;
}

:deep(.arco-pagination-item:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.arco-pagination-item-active) {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-6), 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(var(--primary-6), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-6), 0);
  }
}

/* 通知提示动画 */
:deep(.arco-notification) {
  animation: notificationSlideIn 0.3s ease-out;
}

@keyframes notificationSlideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

:deep(.arco-notification-close) {
  transition: all 0.3s ease;
}

:deep(.arco-notification-close:hover) {
  transform: rotate(90deg);
  color: var(--primary-6);
}
</style>