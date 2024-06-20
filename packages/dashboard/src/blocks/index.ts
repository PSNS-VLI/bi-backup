import { RouterView, type RouteComponent } from 'vue-router'

import { type DashboardBlock } from './types'

export const DashboardBlockMap: Record<DashboardBlock, RouteComponent> = {
  Dashboard: RouterView,
  DashboardList: () => import('./DashboardList/DashboardList.vue'),
  DashboardWorkspace: () => import('./Dashboard/Dashboard.vue'),
  DashboardView: () => import('./Dashboard/Dashboard.vue')
}

export * from './types'
export type * from './types'
