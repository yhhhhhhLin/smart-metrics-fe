import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import Home2View from "../views/Home2View.vue";
import ProjectIndexView from "../views/project/ProjectIndexView.vue";
import OverviewView from "../views/project/OverviewView.vue";
import OnlineQueryView from "../views/project/OnlineQueryView.vue";
import IndexMarketView from "../views/project/IndexMarketView.vue";
import OfflineManagementView from "../views/project/OfflineManagementView.vue";
import IndexApplicationView from "../views/project/IndexApplicationView.vue";
import ProjectManagerView from "../views/project/ProjectManagerView.vue";
import ProjectManagerIndexView from "../views/projectManager/ProjectManagerIndexView.vue";
import ProjectListView from "../views/projectManager/ProjectListView.vue";
import HomeView3 from "../views/HomeView3.vue";
import DataSourceListView from "../views/dataSourceManager/DataSourceListView.vue";
import DataSourceManagerIndexView from "../views/dataSourceManager/DataSourceManagerIndexView.vue";
import DataSourceAddView from "../views/dataSourceManager/DataSourceAddView.vue";
import DataSourceAlarmView from "../views/dataSourceManager/DataSourceAlarmView.vue";
import DataSourceAlarmListView from "../views/dataSourceManager/DataSourceAlarmListView.vue";

export const dataSourceRootPath = '/datasource'

// 选择详细目录后的菜单列表
export const projectRoutes = [
    {
        index: '0',
        path: '/overview',
        name: '概述',
        component: OverviewView
    },
    {
        index: '1',
        path: 'online',
        name: '在线查询',
        component: OnlineQueryView
    },
    {
        index: '2',
        path: 'index-market',
        name: '指标市场',
        component: IndexMarketView
    },
    {
        index: '3',
        path: 'offline-management',
        name: '运维中心',
        component: OfflineManagementView
    },
    {
        index: '4',
        path: 'index-application',
        name: '其他应用',
        component: IndexApplicationView
    },
    {
        index: '5',
        path: 'projectManager',
        name: '项目管理',
        component: ProjectManagerView
    }
]

// 没选择详细项目前的路由列表
export const projectManagerIndexViewRoutes = [
    {
        index: '0',
        path: 'project-list',
        name: '项目列表',
        component: ProjectListView
    },
]

export const datasourceManagerIndexViewRoutes = [
    {
        index: '0',
        path: 'list',
        name: '数据源列表',
        component: DataSourceListView
    },
    {
        index: '1',
        path: 'add',
        name: '数据源新增',
        component: DataSourceAddView,
        meta: {
            // 如果为true那么就不展示在菜单列表
            notFixedNav: true
        }
    },
    {
        index: '2',
        path: 'alarm',
        name: '新增数据源告警',
        component: DataSourceAlarmView,
        meta: {
            notFixedNav: true
        }
    },
    {
        index: '3',
        path: 'alarm-list',
        name: '数据源告警记录',
        component: DataSourceAlarmListView,
    }
]

export const routes: any = [
    {
        path: '/',
        name: '首页',
        component: HomeView,
    },
    {
        path: '/2',
        component: Home2View,
    },
    {
        path: '/3',
        component: HomeView3,
    },
    {
        path: '/project',
        name: '项目详细',
        component: ProjectIndexView,
        children: projectRoutes
    },
    {
        path: '/projectManager',
        name: '项目管理',
        component: ProjectManagerIndexView,
        children: projectManagerIndexViewRoutes
    },
    {
        path: dataSourceRootPath,
        name: '数据源管理',
        component: DataSourceManagerIndexView,
        children: datasourceManagerIndexViewRoutes
    }
]



const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
