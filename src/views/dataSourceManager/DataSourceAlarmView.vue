<template>
  <container :top-menu-type="3" :top-menu-selected="'/datasource/list'">
    <template #content>
      <div class="alarm-page">
        <div class="alarm-page-breadcrumb">
          <a-breadcrumb :routes="route" separator=">">
            <template #item-render="{ route, paths }">
              <div v-if="paths.length === 2">{{ route.label }}</div>
              <div v-else>
                <a-link :href="getFullPath(paths)">{{ route.label }}</a-link>
              </div>
            </template>
          </a-breadcrumb>
        </div>

        <div class="alarm-page-content">
          <div class="alarm-page-content-header">
            <div class="alarm-page-header-search">
              <a-input-search
                  v-model:value="alertRulePageQuery.alertRuleName"
                  :style="{ width: '320px' }"
                  placeholder="按照告警名称查询"
                  @search="fetchData"
                  allow-clear
              />
            </div>
            <div class="alarm-page-header-button">
              <a-button type="primary" @click="handleClick">添加告警规则</a-button>
            </div>
          </div>

          <div class="alarm-page-content-content">
            <a-table
                :columns="columns"
                :pagination="pagination"
                :data="dscPageData"
                @change="handleTableChange"
            >
              <template #optional="{ record }">
                <a-button type="primary" @click="updateStatus(record)">
                  {{ record.isEnabled == 1 ? '禁用' : '使用' }}
                </a-button>
                <a-button @click="$modal.info({ title: 'Name', content: record.name })">删除</a-button>
              </template>
            </a-table>
          </div>
        </div>
      </div>

      <a-modal v-model:visible="visible" :ok-loading="false" @ok="handleOk" @cancel="handleCancel"
               :align-center="false">
        <template #title>添加告警规则</template>
        <div class="alarm-form-items">
          <div class="alarm-form-item">
            <div class="alarm-form-item-label">告警名称</div>
            <a-input v-model="alarmForm.ruleName" placeholder="请输入告警名称" allow-clear/>
          </div>

          <div class="alarm-form-item">
            <div class="alarm-form-item-label">告警触发方式</div>
            <a-radio-group v-model="alarmForm.ruleType">
              <a-radio :value="1">每日首次连接失败</a-radio>
              <a-radio :value="2">每次发现连接失败</a-radio>
            </a-radio-group>
          </div>

          <div class="alarm-form-item">
            <div class="alarm-form-item-label">告警数据源名称</div>
            <a-select v-model="alarmForm.dscId" placeholder="请选择告警的数据源">
              <a-option v-for="datasource in datasourceList" :key="datasource.id" :value="datasource.id">
                {{ datasource.dscName }}
              </a-option>
            </a-select>
          </div>

          <div class="alarm-form-item">
            <div class="alarm-form-item-label">告警方式</div>
            <a-radio-group v-model="alarmForm.notifyChannel">
              <a-radio :value="1">短信</a-radio>
              <a-radio :value="2">邮箱</a-radio>
            </a-radio-group>
          </div>

          <div class="alarm-form-item">
            <div class="alarm-form-item-label">接收人</div>
            <a-radio-group v-model="alarmForm.notifyRecipientsType">
              <a-radio :value="1">数据源创建用户</a-radio>
              <a-radio :value="2">告警规则创建用户</a-radio>
              <a-radio :value="3">其他用户</a-radio>
            </a-radio-group>
          </div>

          <div v-if="alarmForm.notifyRecipientsType == 3" class="alarm-form-item">
            <a-select v-model="alarmForm.notifyRecipients" placeholder="请选择用户">
              <a-option v-for="(name, id) in allUserList" :key="id" :value="id">
                {{ name }}
              </a-option>
            </a-select>
          </div>
        </div>
      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import container from "../../components/Container.vue";
import {onMounted, reactive, ref} from "vue";
import {
  addAlertRule,
  listDataSource,
  pageDataSourceAlertRule,
  updateAlertRuleStatus
} from "../../services/datasource/datasource.ts";
import {alertRuleTypeMap, notifyChannelMap, statusMap} from "../../utils/DataRelationalMap.ts";
import {listUserIdAndNameMap} from "../../services/user/user.ts";
import {Notification} from "@arco-design/web-vue";

const alertRulePageQuery = reactive<API.AlertRulePage>({
  currentPage: 1,
  pageSize: 10,
  alertRuleName: null
});
const username = ref<string>('');
const dscName = ref<string>('');
const dscPageData = reactive<any[]>([]);
const visible = ref(false);
const alarmForm = reactive<API.AlertRuleAddOrUpdateDto>({
  ruleName: null,
  dscId: undefined,
  notifyChannel: undefined,
  notifyRecipientsType: undefined,
  notifyRecipients: undefined,
  ruleType: undefined
});

const pagination = {
  current: alertRulePageQuery.currentPage,
  pageSize: alertRulePageQuery.pageSize,
  total: 0,
  showTotal: (total: number) => `总共 ${total} 条数据`,
};


const columns = [
  {title: "告警名称", dataIndex: "ruleName"},
  {title: "数据源名称", dataIndex: "dscName"},
  {
    title: "告警方式",
    dataIndex: "ruleType",
    render: ({record}) => alertRuleTypeMap[record.ruleType]
  },
  {
    title: "状态",
    dataIndex: "isEnabled",
    render: ({record}) => statusMap[record.isEnabled]
  },
  {
    title: "通知方式",
    dataIndex: "notifyChannel",
    render: ({record}) => notifyChannelMap[record.notifyChannel]
  },
  {title: "告警接收人姓名", dataIndex: "notifyRecipientName"},
  {title: "告警创建人姓名", dataIndex: "createdUserName"},
  {title: "创建时间", dataIndex: "createdTime"},
  {
    title: '操作',
    fixed: 'right',
    slotName: 'optional',
    width: 200,
  },
];

const allUserList = ref<Map<number, string>>();
const datasourceList = ref<any[]>([]);

const route = reactive([
  {path: "list", label: "数据源中心"},
  {path: "/alarm", label: "数据源告警"}
]);


const handleTableChange = () => {

}

const updateStatus = (alertRule: API.DscAlertRuleVO) => {
  // 更新对应告警状态
  const updatedStatus = alertRule.isEnabled === 0 ? 1 : 0;
  const id = alertRule.id
  updateAlertRuleStatus({id: id, status: updatedStatus})
      .then((resp => {
        // 重新获取数据
        if (resp.code === 0) {
          Notification.success({
            title: '系统提示',
            content: '更新成功',
            closable: true
          })
          fetchData()
        }
      })).catch((error) => {
    console.log(error)
  })


}

const fetchData = () => {
  pageDataSourceAlertRule(alertRulePageQuery)
      .then((res) => {
        dscPageData.splice(0, dscPageData.length, ...res.data.records);
        pagination.total = res.data.total;
      })
      .catch((error) => {
        console.error(error);
      });
};

const fetchUsers = () => {
  listUserIdAndNameMap(username.value).then((res) => {
    allUserList.value = res.data;
    console.log(res.data)
  }).catch((error) => {
    console.error(error);
  });
};

const fetchDataSources = () => {
  listDataSource({dscName: dscName.value}).then((res) => {
    datasourceList.value = res.data;
    console.log(datasourceList.value)
  }).catch((error) => {
    console.error(error);
  });
};

const initAlarmForm = () => {
  alarmForm.dscId = undefined;
  alarmForm.notifyRecipientsType = undefined;
  alarmForm.ruleName = "";
  alarmForm.notifyChannel = undefined;
  alarmForm.notifyRecipients = undefined;
  alarmForm.ruleType = undefined;
};

const handleClick = () => {
  fetchUsers();
  fetchDataSources();
  initAlarmForm();
  visible.value = true;
};

const handleOk = () => {
  visible.value = false;
  addAlertRule(alarmForm).then((resp) => {
    if (resp.code == 0) {
      Notification.success({
        title: '系统提示',
        content: '添加成功',
        closable: true
      })
      fetchData()
    }
  }).catch((error) => {
    console.log(error)
  })

  console.log(alarmForm);
};

const handleCancel = () => {
  visible.value = false;
};

const getFullPath = (paths: string[]) => {
  return paths.join("/").split(".").slice(paths.length - 1).join("/");
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.alarm-page {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
}

.alarm-page-breadcrumb {
  height: 5%;
  margin-top: -4px;
  display: flex;
  justify-content: start;
}

.alarm-page-content {
  background-color: #ffffff;
  flex-grow: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.alarm-page-content-header {
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
}

.alarm-page-content-content {
  margin-top: 20px;
  height: 100%;
}

.alarm-form-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.alarm-form-item {
  display: flex;
  flex-direction: column;
}

.alarm-form-item-label {
  font-weight: 500;
}

.alarm-form-item-label-input {
  display: flex;
  align-items: center;
}
</style>
