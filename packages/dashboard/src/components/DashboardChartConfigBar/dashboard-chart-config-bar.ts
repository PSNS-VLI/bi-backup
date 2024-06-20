import { DashboardContainerBar } from '../../blocks/Dashboard'
import type { Key } from '../../types/common'
import type { ChartConfig, ChartConfigStore } from '../../types/configuration'

export const enum BAR_TAB {
  FIELDS = 'FIELDS',
  STYLES = 'STYLES',
  ANALYSES = 'ANALYSES'
}

export class DashboardChartConfigBar extends DashboardContainerBar {
  opened: boolean = true
  title = ''
  readonly tabs = [
    {
      name: BAR_TAB.FIELDS,
      label: '字段'
    },
    {
      name: BAR_TAB.STYLES,
      label: '样式'
    },
    {
      name: BAR_TAB.ANALYSES,
      label: '分析'
    }
  ]
  activeTabName: BAR_TAB | '' = ''

  chartData: Array<any> = []
  focusedChartKey = ''
  private setFocusedChartKey() {
    const canvas = this.getContext()?.content
    if (canvas) {
      const element = canvas.elements.find((element) => element.focused)
      if (element) {
        this.focusedChartKey = element.key
      } else {
        this.focusedChartKey = ''
      }
    }
  }

  private getEmptyConfig() {
    return {
      fields: [],
      styles: [],
      analyses: []
    }
  }
  private getEmptyConfigData() {
    return { fields: {}, styles: {}, analyses: {} }
  }
  config: ChartConfig = this.getEmptyConfig()
  configData: ChartConfigStore = this.getEmptyConfigData()

  constructor(key: Key) {
    super(key)
  }

  override inject(data: {
    title: string
    config: ChartConfig
    configData: ChartConfigStore
  }): void {
    this.setFocusedChartKey()
    this.title = data.title
    this.activeTabName = BAR_TAB.FIELDS

    this.config = this.getEmptyConfig()
    this.configData = this.getEmptyConfigData()

    this.configData = data.configData
    this.config = data.config
  }
}
