import type { DatasetTree, FieldTree, Field } from './dataset'
import type { Dashboard, DashboardData, DashboardStatus } from './app/dashboard'

type API<P extends Record<string, any>, R> = (param: P) => Promise<R | false>

/**
 * dashboard
 */
export type SaveDashboardFolder = API<
  {
    id?: number
    pid?: number
    name: string
  },
  {
    id: number
  }
>

export type DeleteDashboardFolder = API<
  {
    id: number
  },
  boolean
>

export type MoveDashboardFolder = API<
  {
    id: number
    targetId: number
  },
  boolean
>

type DashboardFolder = {
  id: number
  name: string
  children?: Array<DashboardFolder>
}
export type LoadDashboardFolderList = API<{}, Array<DashboardFolder>>

export type PublishDashboard = API<
  {
    id: number
    status: DashboardStatus
  },
  boolean
>

export type LoadDashboardList = API<
  {
    keywords?: string
    pid?: number
  },
  Array<Dashboard>
>

export type SaveDashboard = API<
  Omit<DashboardData, 'id' | 'status' | 'updateTime'> & {
    id?: number
  },
  number
>

export type LoadDashboard = API<
  {
    id: number
  },
  DashboardData
>

/**
 * dataset
 */
export type LoadDataset = API<
  {
    keywords?: string
  },
  DatasetTree
>

export type LoadField = API<
  {
    datasetId: number | string
  },
  FieldTree
>

/**
 * data
 */
export type LoadData = API<
  {
    datasetId: number
    fields: Array<Field>
    fieldFilters?: Array<Field>
  },
  Array<Record<string, string | number>>
>

/**
 * general
 */
export type UploadImage = API<
  {
    file: File
  },
  string
>
