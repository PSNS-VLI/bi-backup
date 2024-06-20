import { LOCAL_INTERFACE_MOCK_DASHBAORD } from '../../../config'
import type { Dashboard, DashboardData } from '../../../types/app/dashboard'
import { DashboardType, DashboardStatus } from '../../../types/app/dashboard'

export const getDashboardListMockData = (pid: number = -1): Array<Dashboard> => {
  return Array.from({ length: 20 }).map((_, index) => {
    const res: Dashboard = {
      id: new Date().getTime() + index,
      pid,
      name: 'name',
      type: index % 2 === 0 ? DashboardType.FOLDER : DashboardType.DASHBOARD,
      status: DashboardStatus.PUBLISH,
      createBy: 'creater',
      updateBy: 'updater',
      updateTime: 'updateTime'
    }

    return res
  })
}

export const getDashboardMockData = () => {
  const mockData = localStorage.getItem(LOCAL_INTERFACE_MOCK_DASHBAORD)

  if (mockData) {
    return JSON.parse(mockData) as DashboardData
  }

  return false
}

export const setDashboardMockData = (
  data: Omit<DashboardData, 'id' | 'status' | 'updateTime'> & {
    id?: number
  }
) => {
  localStorage.setItem(LOCAL_INTERFACE_MOCK_DASHBAORD, JSON.stringify(data))

  return data.id ?? 121212
}
