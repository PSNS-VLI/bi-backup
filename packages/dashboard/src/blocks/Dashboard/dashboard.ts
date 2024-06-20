import { Container, ContainerBar } from '../../components/Container'
import type { DashboardMenuBar } from '../../components/DashboardMenuBar'
import type { DashboardToolBar } from '../../components/DashboardToolBar'
import type { DashboardGlobalConfigBar } from '../../components/DashboardGlobalConfigBar'
import { DashboardChartConfigBar } from '../../components/DashboardChartConfigBar'
import type { DashboardDatasetBar } from '../../components/DashboardDatasetBar'
import type { DashboardGridCanvas } from '../../components/DashboardGridCanvas/dashboard-grid-canvas'
import type { Key, Nullable } from '../../types/common'
import type { ContainerBarType } from '../../types/container'

type DashboardBarType =
  | Exclude<ContainerBarType, 'statusBar' | 'sideBars'>
  | 'globalConfigBar'
  | 'chartConfigBar'
  | 'datasetBar'
  | 'componentsBar'

type DashboardBarsStatus = Record<Exclude<DashboardBarType, 'sideBars'>, boolean>
type DashboardMode = 'PREVIEW' | 'DEVELOPMENT' | 'PRODUCT'
export class DashboardContainer extends Container<DashboardGridCanvas> {
  menuBar: Nullable<DashboardMenuBar> = undefined
  toolBar: Nullable<DashboardToolBar> = undefined

  globalConfigBarKey: Key = ''
  chartConfigBarKey: Key = ''
  datasetBarKey: Key = ''

  get globalConfigBar() {
    return this.findBar(this.globalConfigBarKey, 'sideBars') as Nullable<DashboardGlobalConfigBar>
  }

  get chartConfigBar() {
    return this.findBar(this.chartConfigBarKey, 'sideBars') as Nullable<DashboardChartConfigBar>
  }

  get datasetBar() {
    return this.findBar(this.datasetBarKey, 'sideBars') as Nullable<DashboardDatasetBar>
  }

  barsDisplayStatus: DashboardBarsStatus = this.getBarsDisplayStatus('DEVELOPMENT')
  componentsPanelFixed = false

  get mode() {
    return this._mode
  }

  set mode(val: DashboardMode) {
    this._mode = val
    this.barsDisplayStatus = this.getBarsDisplayStatus(val)
    this.lockCanvas()
  }

  private _mode: DashboardMode = 'PRODUCT'

  constructor(mode: DashboardMode = 'DEVELOPMENT') {
    super()
    this.mode = mode
  }

  hideBar(barType?: DashboardBarType, exclude: boolean = false) {
    this.setBarsDisplayStatus(barType, exclude, false)
  }

  showBar(barType?: DashboardBarType, exclude: boolean = false) {
    this.setBarsDisplayStatus(barType, exclude, true)
  }

  private getBarsDisplayStatus(mode: DashboardMode): DashboardBarsStatus {
    switch (mode) {
      case 'PREVIEW':
        return {
          menuBar: true,
          toolBar: false,
          globalConfigBar: false,
          chartConfigBar: false,
          datasetBar: false,
          componentsBar: false
        }
      case 'PRODUCT':
        return {
          menuBar: false,
          toolBar: false,
          globalConfigBar: false,
          chartConfigBar: false,
          datasetBar: false,
          componentsBar: false
        }
      default:
        return {
          menuBar: true,
          toolBar: true,
          globalConfigBar: true,
          chartConfigBar: false,
          datasetBar: false,
          componentsBar: false
        }
    }
  }

  private setBarsDisplayStatus(
    barType?: DashboardBarType,
    exclude: boolean = false,
    value: boolean = true
  ) {
    Object.keys(this.barsDisplayStatus)
      .filter((key) => (barType ? (exclude ? barType !== key : barType === key) : true))
      .forEach((key) => (this.barsDisplayStatus[key as DashboardBarType] = value))
  }

  private lockCanvas() {
    if (this.content) {
      this.mode === 'DEVELOPMENT' ? this.content.unlock() : this.content.lock()
    }
  }

  override setContent(content: any): void {
    super.setContent(content)
    this.lockCanvas()
  }
}

export class DashboardContainerBar extends ContainerBar<DashboardContainer> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inject(...args: any[]): void {}
}
