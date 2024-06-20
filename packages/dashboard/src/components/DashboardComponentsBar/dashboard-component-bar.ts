import { type DashboardContainer, DashboardContainerBar } from '../../blocks/Dashboard'
import type { Key } from '../../types/common'
import type { DashboardChartComponent } from '../../types/component'

import type { DashboardGridCanvas } from '../DashboardGridCanvas/dashboard-grid-canvas'

export class DashboardComponentsBar extends DashboardContainerBar {
  constructor(key: Key) {
    super(key)
  }

  protected callbackWithCanvas(callback: (canvas: DashboardGridCanvas) => any) {
    const canvas = this.getContext()?.content
    if (canvas) {
      callback(canvas)
    }
  }

  private mouseHovered = false

  onMouseenter() {
    this.mouseHovered = true
  }

  onMouseleave() {
    this.mouseHovered = false
  }

  onDragComponentStart(component: DashboardChartComponent) {
    this.callbackWithCanvas((canvas) => {
      canvas.prepareForReceivingComponent(component)
    })
  }

  onDragComponentEnd() {
    this.callbackWithCanvas((canvas) => {
      canvas.cancelReceivingComponent()
    })

    console.log(this.mouseHovered)

    if (!this.mouseHovered) {
      this.callWithContext((context) => {
        context.hideBar('componentsBar')
      })
    }
  }

  callWithContext(callback?: (context: DashboardContainer) => void) {
    const context = this.getContext() as DashboardContainer
    if (context) {
      callback && callback(context)
    }
  }

  fixedComponentsPanel() {
    this.callWithContext((context) => {
      context.componentsPanelFixed = !context.componentsPanelFixed
    })
  }
}
