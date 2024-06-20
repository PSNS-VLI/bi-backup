import { componentsMap } from './router-config'
import { getDashboardView } from '@bi/dashboard'

/**
 * Static Routes
 * @type {*[]}
 */
const staticRouterMap = [
  {
    path: '/data-analyse',
    redirect: '/data-analyse/dashboard',
    name: 'DataAnalyse',
    meta: {
      title: '数据分析',
      icon: 'icon-icon_jc'
    },
    component: componentsMap.RouterView,
    children: getDashboardView({ prefix: '/data-analyse' })
  },
  {
    path: '/data-structure',
    redirect: '/data-structure/data-source',
    name: 'DataStructure',
    meta: {
      title: '数据构建',
      icon: 'icon-icon_sj'
    },
    component: componentsMap.RouterView,
    children: [
      {
        path: '/data-structure/data-source',
        redirect: '/data-structure/data-source/list',
        name: 'DataSource',
        meta: {
          title: '数据源',
          hideChildren: true
        },
        component: componentsMap.RouterView,
        children: [
          {
            path: '/data-structure/data-source/list',
            name: 'DataSourceList',
            meta: {
              title: '数据源列表'
            },
            component: componentsMap.DataSourceList
          },
          {
            path: '/data-structure/data-source/create',
            name: 'DataSourceCreateSource',
            meta: {
              title: '创建数据源'
            },
            component: componentsMap.DataSourceCreateSource
          },
          {
            path: '/data-structure/data-source/update',
            name: 'DataSourceUpdateSource',
            meta: {
              title: '修改数据源'
            },
            component: componentsMap.DataSourceUpdateSource
          },
          {
            path: '/data-structure/data-source/blocks/step-success',
            name: 'DataSourceStepSuccess',
            meta: {
              title: '成功跳转'
            },
            component: componentsMap.DataSourceStepSuccess
          }
        ]
      },
      {
        path: '/data-structure/data-set',
        redirect: '/data-structure/data-set/list',
        name: 'DataSet',
        meta: {
          title: '数据集',
          hideChildren: true
        },
        component: componentsMap.RouterView,
        children: [
          {
            path: '/data-structure/data-set/list',
            name: 'DataSetList',
            meta: {
              title: '数据集列表'
            },
            component: componentsMap.DataSetList
          },
          {
            path: '/data-structure/data-set/create',
            name: 'DataSetCreate',
            meta: {
              title: '新建数据集',
              outRoot: true,
              newWindow: true
            },
            // component: componentsMap.DataSetCreate
            component: () => import('@/views/DataStructure/DataSet/Create.vue')
          },
          {
            path: '/data-structure/data-set/update',
            name: 'DataSetUpdate',
            meta: {
              title: '修改数据集',
              outRoot: true,
              newWindow: true
            },
            component: componentsMap.DataSetUpdate
          }
        ]
      }
    ]
  }
  // {
  //   path: '/system-set',
  //   redirect: '/system-set/user-management',
  //   name: 'SystemSet',
  //   meta: {
  //     title: '系统设置',
  //     icon: 'icon-xitong'
  //   },
  //   component: componentsMap.RouterView,
  //   children: [
  //     {
  //       path: '/system-set/user-management',
  //       redirect: '/system-set/user-management/list',
  //       name: 'UserManagement',
  //       meta: {
  //         title: '用户管理'
  //       },
  //       component: componentsMap.RouterView
  //     }
  //   ]
  // }
]

export default staticRouterMap
export { staticRouterMap }
