import { DashboardContainerBar } from '../../blocks/Dashboard'
import type { Key } from '../../types/common'
import type { DashboardGlobalConfig, DashboardGlobalConfigStore } from '../../types/app/dashboard'
import { deepAssign } from '../../utils'

import { defineGlobalConfig, initGlobalConfigData } from './config'

export const enum BAR_TAB {
  THEME = 'THEME',
  ADVANCE = 'ADVANCE'
}

export class DashboardGlobalConfigBar extends DashboardContainerBar {
  opened: boolean = false
  title = '全局配置'
  readonly tabs = [
    {
      name: BAR_TAB.THEME,
      label: '主题'
    },
    {
      name: BAR_TAB.ADVANCE,
      label: '高级'
    }
  ]

  config: DashboardGlobalConfig = defineGlobalConfig()
  configData: DashboardGlobalConfigStore = initGlobalConfigData()

  themeChageBecauseInject = false

  constructor(key: Key) {
    super(key)
  }

  override inject(data: { configData: DashboardGlobalConfigStore }): void {
    this.themeChageBecauseInject = true
    Object.assign(this.configData, deepAssign(initGlobalConfigData(this.config), data.configData))
  }
}
