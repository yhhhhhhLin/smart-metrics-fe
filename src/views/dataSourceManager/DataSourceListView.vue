<template>
  <container :top-menu-type="3" :top-menu-selected="'/datasource/list'">
    <template #content>
      <div class="datasource-list">
        <div class="datasource-list-header">
          <div class="select-forms">
            <div class="select-forms-item">
              <div class="select-form-item-label">名称</div>
              <div class="select-form-item-label-input">
                <a-input-search
                    v-model="pageQuery.dscName"
                    :style="{width: '220px'}"
                    placeholder="按数据源名称查询"
                    @search="fetchData"
                />
              </div>
            </div>

            <div class="select-forms-item">
              <div class="select-form-item-label">类型</div>
              <div class="select-form-item-label-input">
                <a-select
                    v-model="pageQuery.dscTypeCode"
                    :style="{width: '320px'}"
                    placeholder="按数据源描述查询"
                    allow-clear
                    @change="fetchData"
                >
                  <div v-for="dscType in dscTypes">
                    <a-option :value="dscType">{{dscCodeMap[dscType]}}</a-option>
                  </div>
                </a-select>
              </div>
            </div>

            <div class="select-forms-item">
              <div class="select-form-item-label">描述</div>
              <div class="select-form-item-label-input">
                <a-input-search
                    v-model="pageQuery.dscDesc"
                    :style="{width: '220px'}"
                    placeholder="请输入数据源描述"
                    @search="fetchData"
                />
              </div>
            </div>

            <div class="select-forms-item">
              <div class="select-form-item-label">状态</div>
              <div class="select-form-item-label-input">
                <a-select
                    v-model="pageQuery.dscStatus"
                    :style="{width: '320px'}"
                    placeholder="请输入数据源状态"
                    allow-clear
                    @change="fetchData"
                >
                  <a-option value="1">可用</a-option>
                  <a-option value="0">不可用</a-option>
                </a-select>
              </div>
            </div>
          </div>

          <div class="select-forms-button">
            <a-button @click="toAlarmDataSourcePath">告警配置</a-button>
            <a-button type="primary" @click="toAddDataSourcePath">新增数据源</a-button>
          </div>
        </div>

        <div class="datasource-items">
          <a-table
              :columns="columns"
              :data="dscPageDate"
              :sticky-header="60"
              :scroll="scroll"
              :pagination="pagination"
              @change="handleTableChange"
          >
            <template #optional="{ record }">
              <div class="dsc_info_optional_buttons">
                <a-button type="primary" @click="$modal.info({ title:'edit', content: record.dscName })">编辑</a-button>
                <a-button @click="$modal.info({ title:'del', content: record.dscName })">删除</a-button>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </template>
  </container>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import router from '../../router';
import {pageDataSource} from '../../services/datasource/datasource.ts';
import Container from "../../components/Container.vue";
import { dscCodeMap } from '../../utils/DscCodeMap';

const statusMap:Record<number, string> = {
  1: '可用',
  0: '不可用',
};



// 分页查询条件
const pageQuery = reactive<API.DatasourcePage>({
  currentPage: 1,
  pageSize: 10,
  dscName: null,
  dscTypeCode: null,
  dscDesc: null,
  dscStatus: null,
});

const dscTypes = ref<number[]>([])

// 表格数据
const dscPageDate = reactive<any[]>([]);

// 表格列配置
const columns = [
  {title: '数据源名称', dataIndex: 'dscName',width: 250},
  {title: '数据源类型', dataIndex: 'dscType',width: 150,render:({record})=>dscCodeMap[record.dscType]},
  {title: '描述', dataIndex: 'dscDesc', width: 350},
  {title: '状态', dataIndex: 'dscStatus',width: 150,render: ({record}) => statusMap[record.dscStatus]},
  {title: '连接信息', dataIndex: 'username', width: 350},
  {title: '负责人名称', dataIndex: 'createdUserName', width: 300},
  {title: '创建时间', dataIndex: 'createdTime', width: 300},
  {title: '更新时间', dataIndex: 'updatedTime',width: 300},
  {
    title: '操作',
    fixed: 'right',
    slotName: 'optional',
    width: 200,
  },
];

// 表格滚动配置
const scroll = {x: 2000, y: 200};

// 分页配置
const pagination = {
  current: pageQuery.currentPage,
  pageSize: pageQuery.pageSize,
  total: 0,
  showTotal: (total: number) => `总共 ${total} 条数据`,
};

// 获取数据的函数
const fetchData = () => {
  pageDataSource(pageQuery)
      .then((resp) => {
        const dscInfos = resp.data.records;

        dscPageDate.splice(0, dscPageDate.length, ...dscInfos);
        pagination.total = resp.data.total;

        // 将里面所有数据源类型获取出来
        dscTypes.value = [...new Set(dscInfos.map(item => item.dscType))];
      })
      .catch((err) => {
        console.error(err);
      });
};
// 初始化加载数据
onMounted(() => {
  fetchData();
});

// 处理分页和排序变化
const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  pageQuery.currentPage = pagination.current;
  pageQuery.pageSize = pagination.pageSize;
  fetchData();
};

// 路由跳转
const toAddDataSourcePath = () => {
  router.push('/datasource/add');
};

const toAlarmDataSourcePath = () => {
  router.push('/datasource/alarm');
};
</script>

<style scoped>
.datasource-list {
  background-color: #FFFFFF;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.datasource-list-header {
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.select-forms {
  display: flex;
  gap: 25px;
}

.select-forms-item {
  display: flex;
  gap: 10px;
}

.select-form-item-label {
  margin-top: 5px;
}

.select-forms-button {
  display: flex;
  gap: 10px;
}

.datasource-items {
  flex-grow: 1;
}

.dsc_info_optional_buttons{
  display: flex;
  gap: 5px;
}
</style>
