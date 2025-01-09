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
              <a-button @click="$modal.info({ title: 'Name', content: record.name })">删除</a-button>
            </template>

            <template #projectName="{record}">
              <a-link href="javascript:void(0)" @click="goToProjectOverviewPage(record.id)">{{record.projectName}}</a-link>
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
  addDscProject,
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

const goToProjectOverviewPage = (projectId:number)=>{

  sessionStorage.setItem("projectId", projectId.toString());
  router.push({
        path: "/project/overview"
      }
  )
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

.project-page-content-content {
  height: 100%;
  padding: 20px;
}

</style>