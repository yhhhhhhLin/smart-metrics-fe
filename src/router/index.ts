import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProjectIndexView from "../views/project/ProjectIndexView.vue";
import OverviewView from "../views/project/OverviewView.vue";
import OnlineQueryView from "../views/project/OnlineQueryView.vue";
import IndexMarketView from "../views/project/IndexMarketView.vue";
import OfflineManagementView from "../views/project/OfflineManagementView.vue";
import IndexApplicationView from "../views/project/IndexApplicationView.vue";
import ProjectManagerView from "../views/project/ProjectManagerView.vue";
import ProjectManagerIndexView from "../views/projectManager/ProjectManagerIndexView.vue";
import ProjectListView from "../views/projectManager/ProjectListView.vue";
import DataSourceListView from "../views/dataSourceManager/DataSourceListView.vue";
import DataSourceManagerIndexView from "../views/dataSourceManager/DataSourceManagerIndexView.vue";
import DataSourceAddView from "../views/dataSourceManager/DataSourceAddView.vue";
import DataSourceAlarmView from "../views/dataSourceManager/DataSourceAlarmView.vue";
import DataSourceAlarmListView from "../views/dataSourceManager/DataSourceAlarmListView.vue";
import UserIndex from "../views/user/UserIndex.vue";
import UserLoginView from "../views/user/UserLoginView.vue";
import UserRegisterView from "../views/user/UserRegisterView.vue";
import IndexManagerIndexView from "../views/project/IndexManagerIndexView.vue";
import IndexManagementView from "../views/project/IndexManagementView.vue";
import DataManagementIndexView from "../views/project/DataManagementIndexView.vue";
import DimensionManagementView from "../views/project/DimensionManagementView.vue";
import StatisticalPeriodView from "../views/project/StatisticalPeriodView.vue";
import BusinessManagementView from "../views/project/BusinessManagementView.vue";
import DimensionAddOrUpdateView from "../views/project/DimensionAddOrUpdateView.vue";
import IndexAddOrUpdateView from "../views/project/NormalIndexAddOrUpdateView.vue";
import normalIndexAddOrUpdateView from "../views/project/NormalIndexAddOrUpdateView.vue";
import NormalIndexAddOrUpdateView from "../views/project/NormalIndexAddOrUpdateView.vue";
import CompositeIndexAddOrUpdateView from "../views/project/CompositeIndexAddOrUpdateView.vue";
import ProjectAIView from "../views/project/ProjectAIView.vue";

export const dataSourceRootPath = '/datasource'
export const projectManagerRootPath = '/projectManager'
export const projectRootPath = '/project'
export const indexManagerRootPath = 'index-management'

export const indexManagementRoutes = [
    {
        path: "index-develop",
        name: "指标开发",
        component: IndexManagementView,
        meta: {
            icon: 'icon-home',
        },
    },
    {
        path: "index-develop/normal-index-add-or-update",
        name: "普通指标创建或修改",
        component: NormalIndexAddOrUpdateView,
        meta: {
            hidden: true,
        }
    },
    {
        path: "index-develop/com-index-add-or-update",
        name: "复合指标创建或修改",
        component: CompositeIndexAddOrUpdateView,
        meta: {
            hidden: true,
        }
    },
    {
        path: "data-management",
        name: "数据管理",
        component: DataManagementIndexView,
        meta: {
            icon: 'icon-bar-chart',
        },
        children: [
            {
                path: "dimension-management",
                name: "维度管理",
                component: DimensionManagementView,
            },
            {
                path: "dimension-management/dim-add-or-update",
                name: "维度新增或修改",
                component: DimensionAddOrUpdateView,
                meta: {
                    hidden: true,
                }
            },
            {
                path: "business-management",
                name: "业务限定",
                component: BusinessManagementView,
                meta: {
                    hidden: true,
                }
            },
            {
                path: "statistical-period",
                name: "统计周期",
                component: StatisticalPeriodView,
            },
        ],
    },
];

// 选择详细目录后的菜单列表
export const projectRoutes = [
    {
        index: '0',
        path: 'overview',
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
        path: 'index-management',
        name: '指标中心',
        component: IndexManagerIndexView,
        children: indexManagementRoutes,
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
    },
    {
        index: '6',
        path: 'projectAI',
        name: '平台ai助手',
        component: ProjectAIView
    }
]

// 没选择详细项目前的路由列表
export const projectManagerIndexViewRoutes = [
    {
        index: '0',
        path: 'projectList',
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
        path: '/user',
        component: UserIndex,
        children: [
            {
                path: 'login',
                name: '登陆',
                component: UserLoginView
            },
            {
                path: 'register',
                name: '注册',
                component: UserRegisterView
            },
        ]
    },
    {
        path: '/project/projectManager',
        name: '项目管理',
        component: ProjectManagerView
    },
    {
        path: projectRootPath,
        name: '项目详细',
        component: ProjectIndexView,
        children: projectRoutes
    },
    {
        path: projectManagerRootPath,
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
