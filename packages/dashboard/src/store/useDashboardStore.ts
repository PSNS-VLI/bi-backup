import { LOCAL_INTERFACE_MOCK_DASHBAORD } from '../config'

class DashbaordManager {
  private pidKey = LOCAL_INTERFACE_MOCK_DASHBAORD

  get pid(): number | undefined {
    const pid = localStorage.getItem(this.pidKey)
    if (pid) {
      return Number(pid)
    }
    return
  }

  set pid(val: number | undefined) {
    if (val !== undefined) {
      localStorage.setItem(this.pidKey, String(val))
    } else {
      localStorage.removeItem(this.pidKey)
    }
  }
}

const dashboardManager = new DashbaordManager()
export const useDashboardStore = () => dashboardManager
