import { DashboardContainerBar } from '../../blocks/Dashboard'
import type { ContainerToolBarInterface } from '../../types/container'
import type { Nullable } from '../../types/common'
import { callFunc } from '../../utils'

import type { DashboardGridCanvas } from '../DashboardGridCanvas/dashboard-grid-canvas'

export class DashboardToolBar extends DashboardContainerBar implements ContainerToolBarInterface {
  override inject(): void {}

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
}
