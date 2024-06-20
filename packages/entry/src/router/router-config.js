import { RouterView } from 'vue-router'

const componentsMap = {
  RouterView: RouterView,
  404: () => import('@/views/404.vue'),
  BasicLayout: () => import('@/layouts/BILayout'),
  DataSetCreate: () => import('@/views/DataStructure/DataSet/Create.vue'),
  DataSetUpdate: () => import('@/views/DataStructure/DataSet/Update.vue'),
  DataSourceList: () => import('@/views/DataStructure/DataSource/List.vue'),
  DataSourceCreateSource: () => import('@/views/DataStructure/DataSource/Create.vue'),
  DataSourceUpdateSource: () => import('@/views/DataStructure/DataSource/Update.vue'),
  DataSourceStepSuccess: () => import('@/views/DataStructure/DataSource/blocks/StepSuccess.vue'),
  DataSetList: () => import('@/views/DataStructure/DataSet/List.vue')
}

export const rootRouter = {
  path: '/',
  name: 'RootRouter',
  redirect: '',
  meta: { hide: true },
  component: componentsMap.BasicLayout,
  children: []
}

const notFoundRouter = {
  path: '/404',
  name: '404',
  meta: { hide: true },
  component: componentsMap['404']
}
const globRouter = {
  path: '/:w+',
  name: '*',
  meta: { hide: true },
  redirect: '/404'
}
const loginRouter = {
  path: '/login',
  name: 'Login',
  meta: { hide: true },
  component: componentsMap.Login
}

const whiteList = [notFoundRouter.name, loginRouter.name]

/**
 * Basic Routes
 * @type { *[] }
 */
const basicRouterMapInRoot = [notFoundRouter]

const basicRouterMapOutRoot = [loginRouter, notFoundRouter, globRouter]

const getRootRouter = () => ({
  path: '/',
  name: 'RootRouter',
  redirect: '',
  meta: { hide: true },
  component: componentsMap.BasicLayout,
  children: basicRouterMapInRoot
})

export {
  componentsMap,
  loginRouter,
  notFoundRouter,
  whiteList,
  basicRouterMapInRoot,
  basicRouterMapOutRoot,
  getRootRouter
}
