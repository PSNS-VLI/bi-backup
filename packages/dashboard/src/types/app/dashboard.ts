import type { StyleConfig } from '../configuration'
import type { Key } from '../common'

export const enum DashboardType {
  FOLDER = 'FOLDER',
  DASHBOARD = 'DASHBOARD'
}

export const enum DashboardStatus {
  PUBLISH = 'PUBLISH',
  OFF_LINE = 'OFF_LINE',
  SAVE_UNPUBLISHED = 'SAVE_UNPUBLISHED'
}

type DashboardBase = {
  id: number
  pid?: number
  name: string
  status: DashboardStatus
  updateTime: string
}

export type DashboardData = DashboardBase & {
  content: string
}

export type Dashboard = DashboardBase & {
  type: DashboardType
  createBy: string
  updateBy: string
}

export interface DashboardGlobalConfig {
  theme: Array<StyleConfig>
  advance: Array<StyleConfig>
}

export interface DashboardGlobalConfigStore {
  theme: Record<Key, any>
  advance: Record<Key, any>
  __BI_GLOBAL_CONFIG__?: {
    name?: string
  }
}
