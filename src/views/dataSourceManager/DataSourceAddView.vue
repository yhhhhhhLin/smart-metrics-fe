<template>
  <container :top-menu-type="3" :top-menu-selected="'/datasource/list'">
    <template #content>
      <div class="add-datasource">

        <div class="add-datasource-breadcrumb">
          <a-breadcrumb :routes="route">
            <template #item-render="{route, paths}">
              <div v-if="paths.length === 2">
                {{ route.label }}
              </div>
              <div v-else>
                <a-link :href="getFullPath(paths)">
                  {{ route.label }}
                </a-link>
              </div>
            </template>
          </a-breadcrumb>
        </div>
        <div class="add-datasource-content">

          <div class="add-datasource-steps">
            <a-steps :current="currentStep" :small="true">
              <a-step>选择数据源类型</a-step>
              <a-step>配置连接信息</a-step>
            </a-steps>
          </div>
          <a-divider/>
          <div class="add-datasource-detail">
            <div v-if="currentStep===1" class="add-datasource-select-datasource">
              <div class="add-datasource-header">
                <a-input-search :style="{width:'320px'}" placeholder="Please enter something"/>
              </div>
              <div class="add-datasource-content-list">
                <div v-for="datasource in datasourceList" class="datasource-item"
                     @click="clickDatasource(datasource)">
                  <div class="datasource-card">
                    <img :src="datasource.image" :alt="datasource.name" class="card-image"/>
                  </div>
                  <div class="datasource-name">
                    {{ datasource.name }}

                  </div>
                </div>
              </div>

              <div class="one-step-button">
                <a-button @click="cancelAddDatasource">取消</a-button>

              </div>
            </div>
            <div v-else-if="currentStep === 2" class="add-datasource-config">
              <div class="datasource-config-items">
                <div class="datasource-config-item">
                  <div class="datasource-config-label">版本</div>
                  <div class="datasource-config-input">
                    <a-select :style="{width:'620px'}" placeholder="选择版本号" v-model="datasourceConfigForm.version">
                      <a-option v-for="version in selectedDatasource.versions">
                        {{ version }}
                      </a-option>
                    </a-select>
                  </div>
                </div>

                <div class="datasource-config-item">
                  <div class="datasource-config-label">
                    数据源名称
                  </div>
                  <div>
                    <a-input :style="{width:'620px'}" placeholder="请输入数据源名称" v-model="datasourceConfigForm.name"
                             allow-clear/>
                  </div>
                </div>

                <div class="datasource-config-item">
                  <div class="datasource-config-label">
                    数据源描述
                  </div>
                  <div>
                    <a-textarea v-model="datasourceConfigForm.description" placeholder="请输入数据源描述" allow-clear/>
                  </div>
                </div>

                <div class="datasource-config-item">
                  <div class="datasource-config-label">
                    jdbcUrl
                  </div>
                  <div>
                    <a-input :style="{width:'620px'}" v-model="datasourceConfigForm.jdbcUrl"
                             placeholder="请输入数据源链接地址" allow-clear/>
                  </div>
                </div>

                <div class="datasource-config-item">
                  <div class="datasource-config-label">
                    用户名
                  </div>
                  <div>
                    <a-input :style="{width:'620px'}" placeholder="请输入连接用户名"
                             v-model="datasourceConfigForm.username" allow-clear/>
                  </div>
                </div>

                <div class="datasource-config-item">
                  <div class="datasource-config-label">
                    密码
                  </div>
                  <div>
                    <a-input :style="{width:'620px'}" placeholder="请输入连接密码"
                             v-model="datasourceConfigForm.password" allow-clear/>
                  </div>
                </div>

              </div>

              <a-divider/>
              <div class="step2-button">
                <a-button type="primary" @click="connectTest">连通性测试</a-button>
                <a-button @click="previous">上一步</a-button>
                <a-button type="primary" @click="submitDatasourceAdd">确定</a-button>
              </div>

            </div>


          </div>

        </div>

      </div>


    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import {reactive, ref} from "vue";
import imagess from '../../assets/images/AdminManager.png'
import router from "../../router";
import {addDatasource, testConnect} from "../../services/datasource/datasource.ts";
import {Notification} from "@arco-design/web-vue";

const currentStep = ref(1)
const connectionTest = reactive({
  isSend: false,
  isConnectionSuccess: false
})
let selectedDatasource = reactive({});

const datasourceConfigForm = reactive({
  version: '',
  name: '',
  description: '',
  jdbcUrl: '',
  username: '',
  password: '',

})

// 定义路由信息
const route = reactive([
  {
    path: 'list',
    label: '数据源中心',
  },
  {
    path: '/add',
    label: '添加数据源',
  },
]);

const datasourceList = reactive([
  {
    id: 1,
    name: 'mysql',
    versions: ['5.7', '8.0'],
    image: imagess,
  },
  {
    id: 2,
    name: 'redis',
    versions: ['6.0'],
    image: imagess,
  }
])
const dscTypeCodeMapping: Record<string, Record<string, number>> = {
  mysql: {
    '5.7': 1,
    '8.0': 2,
  },
  redis: {
    '6.0': 3,
  },
};

const clickDatasource = (datasource: any) => {
  currentStep.value = 2
  selectedDatasource = datasource
  initDatasourceForm()
  console.log(datasource)
}

const initDatasourceForm = () => {
  datasourceConfigForm.jdbcUrl = ''
  datasourceConfigForm.username = ''
  datasourceConfigForm.name = ''
  datasourceConfigForm.description = ''
  datasourceConfigForm.password = ''
  datasourceConfigForm.version = ''
}

const cancelAddDatasource = () => {
  router.push('/datasource/list')
}

const previous = () => {
  currentStep.value = 1
}

const getDscTypeCode = (dscName: string, version: string) => {
  return dscTypeCodeMapping[dscName]?.[version] || null;
}

const connectTest = async () => {
  connectionTest.isSend = true;
  console.log(datasourceConfigForm);

  const version = datasourceConfigForm.version;
  const dscName = selectedDatasource.name;

  const datasourceTypeCode = getDscTypeCode(dscName, version);
  const url = datasourceConfigForm.jdbcUrl;
  const username = datasourceConfigForm.username;
  const password = datasourceConfigForm.password;

  try {
    const resp = await testConnect({ url, username, password, datasourceTypeCode });
    if (resp.data) {
      connectionTest.isConnectionSuccess = true;
      Notification.success({
        title: '系统提示',
        content: '连接成功',
        closable: true
      });
    } else {
      connectionTest.isSend = false;
    }
  } catch (error) {
    connectionTest.isSend = false;
    console.error(error);
    Notification.error({
      title: '系统提示',
      content: '连接测试失败',
      closable: true
    });
  }
};


const submitDatasourceAdd = async () => {
  // 先判断连接成功后才可以发送新增请求
  if (!connectionTest.isSend) {
    // 如果没发送过，那么先测试
    await connectTest();
  }

  if (connectionTest.isConnectionSuccess) {
    const datasourceName = datasourceConfigForm.name;
    const datasourceDesc = datasourceConfigForm.description;
    const url = datasourceConfigForm.jdbcUrl;
    const username = datasourceConfigForm.username;
    const password = datasourceConfigForm.password;

    const version = datasourceConfigForm.version;
    const dscName = selectedDatasource.name;

    const datasourceTypeCode = getDscTypeCode(dscName, version);

    try {
      const resp = await addDatasource({
        datasourceName,
        datasourceDesc,
        url,
        username,
        password,
        datasourceTypeCode
      });

      if (resp.data) {
        Notification.success({
          title: '系统提示',
          content: '添加成功！',
          closable: true
        });

        // 添加成功后跳转到 /datasource/list
        router.push('/datasource/list');
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        title: '系统提示',
        content: '添加失败！',
        closable: true
      });
    }
  } else {
    Notification.warning({
      title: '系统提示',
      content: '数据源无法连接！',
      closable: true
    });
  }

  console.log(datasourceConfigForm);
};

// 函数：根据传入的路径数组拼接完整路径
const getFullPath = (paths: string[]) => {
  return paths.join('/').split('.').slice(paths.length - 1).join('/');
};
</script>

<style scoped>
.add-datasource {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
}

.add-datasource-breadcrumb {
  height: 5%;
  margin-top: -4px;
  display: flex;
  justify-content: start;
}

.add-datasource-content {
  height: 95%;
  border-radius: 5px;
  background-color: #FFFFFF;
  padding: 20px 0 0 0;
}

.add-datasource-detail {
  height: 88%;
}

.add-datasource-steps {
  margin: 0 25%;
  height: 3%;
}


.add-datasource-select-datasource {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.add-datasource-header {
  height: 5%;
  display: flex;
  justify-content: start;
  margin-left: 40px;
}

.add-datasource-content-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: flex-start;
  margin-left: 40px;
}

.datasource-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  margin: 10px 0;
}

.datasource-item:hover {
  cursor: pointer;
  border: 1px solid #007bff;
}


.datasource-card {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.datasource-name {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
}

.add-datasource-config {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.datasource-config-items {
  height: 97%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.datasource-config-item {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.datasource-config-label {
  display: flex;
  justify-content: start;
  margin-left: 5px;
}

.step2-button {
  height: 3%;
  display: flex;
  gap: 10px;
}

</style>