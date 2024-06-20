import { mockMode } from '../../config'
import type {
  SaveDashboardFolder,
  DeleteDashboardFolder,
  MoveDashboardFolder,
  LoadDashboardFolderList,
  LoadDashboardList,
  PublishDashboard,
  LoadDashboard,
  SaveDashboard,
  LoadDataset,
  LoadField,
  LoadData,
  UploadImage
} from '../../types/interface'
import {
  getDashboardListMockData,
  getDashboardMockData,
  setDashboardMockData,
  dataSetMockData,
  fieldMockData,
  loadMockData
} from './mock'

type ApiStore = {
  saveDashboardFolder: SaveDashboardFolder
  deleteDashboardFolder: DeleteDashboardFolder
  moveDashboardFolder: MoveDashboardFolder
  loadDashboardFolderList: LoadDashboardFolderList
  loadDashboardList: LoadDashboardList

  publishDashboard: PublishDashboard
  loadDashboard: LoadDashboard
  saveDashboard: SaveDashboard

  loadDataset: LoadDataset
  loadField: LoadField

  loadData: LoadData

  uploadImage: UploadImage
}
const apiStore: ApiStore = {
  saveDashboardFolder: () => Promise.resolve(false),
  deleteDashboardFolder: () => Promise.resolve(false),
  moveDashboardFolder: () => Promise.resolve(false),
  loadDashboardFolderList: () => Promise.resolve([]),
  loadDashboardList: ({ pid }) => Promise.resolve(getDashboardListMockData(pid)),

  publishDashboard: () => Promise.resolve(false),
  loadDashboard: () => Promise.resolve(getDashboardMockData()),
  saveDashboard: (data) => Promise.resolve(setDashboardMockData(data)),

  loadDataset: () => Promise.resolve(dataSetMockData),
  loadField: () => Promise.resolve(fieldMockData),
  loadData: ({ fields }) => Promise.resolve(loadMockData(fields)),

  uploadImage: () => Promise.resolve(false)
}

export class DashboardApi {
  static get publishDashboard() {
    return apiStore.publishDashboard
  }

  static get loadDashboardFolderList() {
    return apiStore.loadDashboardFolderList
  }

  static get moveDashboardFolder() {
    return apiStore.moveDashboardFolder
  }

  static get saveDashboardFolder() {
    return apiStore.saveDashboardFolder
  }

  static get deleteDashboardFolder() {
    return apiStore.deleteDashboardFolder
  }

  static get loadDashboardList() {
    return apiStore.loadDashboardList
  }

  static get loadDashboard() {
    return apiStore.loadDashboard
  }

  static get saveDashboard() {
    return apiStore.saveDashboard
  }

  static get loadData() {
    return apiStore.loadData
  }

  static get loadDataset() {
    return apiStore.loadDataset
  }

  static get loadField() {
    return apiStore.loadField
  }

  static get uploadImage() {
    return apiStore.uploadImage
  }

  static bindApi(api: Partial<ApiStore>) {
    if (mockMode) {
      return
    }
    Object.assign(apiStore, api)
  }
}
