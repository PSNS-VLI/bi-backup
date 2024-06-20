import { DashboardContainerBar } from '../../blocks/Dashboard'
import type { Key } from '../../types/common'

export class DashboardDatasetBar extends DashboardContainerBar {
  opened: boolean = true
  data: Record<string, any> = {}

  constructor(key: Key) {
    super(key)
  }

  override inject(data: { configData: Record<string, any> }): void {
    this.data = data.configData
  }
}
