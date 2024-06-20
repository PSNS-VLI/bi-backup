import { type Component } from 'vue'
import { type RouteRecordRaw, type RouteComponent } from 'vue-router'

import { type DashboardBlock, DashboardBlockName, DashboardBlockMap } from '../blocks'

type DashboardView = DashboardBlock

export const DashboardViewName: Record<DashboardView, string> = DashboardBlockName
const DashboardViewMap: Record<DashboardView, RouteComponent> = DashboardBlockMap

export const getDashboardView = (
  param: {
    prefix?: string
    routerView?: Component
    meta?: Record<DashboardView, any>
  } = {}
) => {
  const { prefix = '', routerView, meta } = param

  const getPath = (path: string) => {
    return `${prefix}/${path}`
  }

  const getMeta = (view: DashboardView) => {
    const sourceMeta = meta && meta[view]
    let localMeta

    switch (view) {
      case 'Dashboard':
        localMeta = {
          title: '应用服务',
          hideChildren: true
        }
        break
      case 'DashboardList':
        localMeta = {
          title: '应用服务列表'
        }
        break
      case 'DashboardWorkspace':
        localMeta = { title: '新建应用服务', outRoot: true, newWindow: true }
        break
      case 'DashboardView':
        localMeta = { title: '应用服务详情', outRoot: true, newWindow: true }
        break
    }

    return sourceMeta || localMeta || {}
  }

  return [
    {
      path: getPath('dashboard'),
      redirect: getPath('dashboard/list'),
      name: DashboardViewName.Dashboard,
      meta: getMeta('Dashboard'),
      component: routerView || DashboardViewMap.Dashboard,
      children: [
        {
          path: getPath('dashboard/list'),
          name: DashboardViewName.DashboardList,
          meta: getMeta('DashboardList'),
          component: DashboardViewMap.DashboardList
        },
        {
          path: getPath('dashboard/workspace'),
          name: DashboardViewName.DashboardWorkspace,
          meta: getMeta('DashboardWorkspace'),
          component: DashboardViewMap.DashboardWorkspace
        },
        {
          path: getPath('dashboard/view'),
          name: DashboardViewName.DashboardView,
          meta: getMeta('DashboardView'),
          component: DashboardViewMap.DashboardView
        }
      ]
    }
  ] as RouteRecordRaw[]
}
