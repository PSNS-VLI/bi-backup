import { DashboardContainerBar } from '../../blocks/Dashboard'
import type { ContainerMenuBarInterface } from '../../types/container'
import type { Nullable } from '../../types/common'
import type { DashboardData } from '../../types/app/dashboard'
import { callFunc } from '../../utils'

import type { DashboardGridCanvas } from '../DashboardGridCanvas/dashboard-grid-canvas'

type DashbaordDataInMenuBar = Partial<Omit<DashboardData, 'content'>>
export class DashboardMenuBar extends DashboardContainerBar implements ContainerMenuBarInterface {
  dashboardData: DashbaordDataInMenuBar = {}
  get previewMode() {
    return this._previewMode
  }

  set previewMode(val: boolean) {
    const context = this.getContext()
    if (context) {
      this._previewMode = val
      context.mode = val ? 'PREVIEW' : context.mode === 'PRODUCT' ? 'PRODUCT' : 'DEVELOPMENT'
    }
  }

  private _previewMode = false

  getDashboardCanvas(
    callback?: (context: DashboardGridCanvas) => void
  ): Nullable<DashboardGridCanvas> {
    const context = this.getContext()

    if (context) {
      const canvas = context.content as DashboardGridCanvas
      canvas && callFunc(callback)(canvas)
      return canvas
    }
  }

  override inject(data: { dashboardData?: DashbaordDataInMenuBar; previewMode?: boolean }): void {
    const { dashboardData, previewMode } = data

    if (dashboardData) {
      this.dashboardData = dashboardData
    }

    if (previewMode !== undefined) {
      this.previewMode = previewMode
    }
  }
}
