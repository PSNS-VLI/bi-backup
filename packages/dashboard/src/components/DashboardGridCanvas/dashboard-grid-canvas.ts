import { DashboardContainer } from '../../blocks/Dashboard'
import type { CanvasComponent } from '../../types/canvas'
import type { Nullable } from '../../types/common'
import type { DashboardChartComponent } from '../../types/component'
import type { ContainerInterface } from '../../types/container'
import { getDashboardChartComponentByID } from '../../utils'
import { CANVAS_CONFIG_KEY } from '../../constants/app/dashboard'

import { GridCanvas, GridCanvasElement } from '../GridCanvas'
import { IfUnlock } from '../Canvas'

export class DashboardGridCanvas extends GridCanvas<GridCanvasElement<DashboardChartComponent>> {
  private context: DashboardContainer | undefined

  private callComponentHook(elKey: string, funcName: 'onClick' | 'onResolve' | 'afterLoad') {
    this.getElement(elKey, (element) => {
      const component = element?.source
      const func = component?.[funcName]?.bind(component)
      if (this.context && element && typeof func === 'function') {
        func(this.context, element.store)
      }
    })
  }

  @IfUnlock
  override onClickElement(event: MouseEvent, elKey: string): void {
    super.onClickElement(event, elKey)

    this.context?.hideBar('globalConfigBar')
    this.callComponentHook(elKey, 'onClick')
  }

  override onDragElementDrop(event: DragEvent): void {
    const elKey = this.getTemp(this.receivedComponentKey)
    super.onDragElementDrop(event)

    this.context?.hideBar('globalConfigBar')
    this.callComponentHook(elKey, 'onResolve')
  }

  @IfUnlock
  protected override onClickContainer(event: MouseEvent): void {
    super.onClickContainer(event)
    if (this.context) {
      this.context.hideBar('datasetBar')
      this.context.hideBar('chartConfigBar')
      this.context.showBar('globalConfigBar')
    }
  }

  protected override async importElementSource(
    sourceData: Record<string, any>
  ): Promise<Nullable<CanvasComponent>> {
    if (sourceData.id) {
      return await getDashboardChartComponentByID(sourceData.id)
    }
  }

  protected override afterLoadElement(
    element: GridCanvasElement<DashboardChartComponent<ContainerInterface<any>>>
  ): void {
    super.afterLoadElement(element)
    this.callComponentHook(element.key, 'afterLoad')
    Object.assign(element.store, {
      [CANVAS_CONFIG_KEY]: {
        elementLoaded: true
      }
    })
  }

  injectContext(container: DashboardContainer) {
    this.context = container
  }
}
