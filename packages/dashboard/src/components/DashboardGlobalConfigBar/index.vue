<template>
  <b-i-side-bar
    class="bi-dashboard-global-config-bar"
    :title="barInstance.title"
    :tabs="barInstance.tabs"
    v-model="barInstance.opened"
  >
    <template v-slot:[`content-${BAR_TAB.THEME}`]>
      <b-i-styles-config-panel
        :configs="barInstance.config.theme"
        v-model="barInstance.configData.theme"
      ></b-i-styles-config-panel>
    </template>
    <template v-slot:[`content-${BAR_TAB.ADVANCE}`]>
      <b-i-styles-config-panel
        :configs="barInstance.config.advance"
        v-model="barInstance.configData.advance"
      ></b-i-styles-config-panel>
    </template>
  </b-i-side-bar>
</template>

<script setup lang="ts">
import { genComponentName } from '../../utils'

import BISideBar from '../SideBar'
import { BIStylesConfigPanel } from '../DashboardConfigurations'
import { useBar } from '../composables'

import { DashboardGlobalConfigBar, BAR_TAB } from './dashboard-global-config-bar'
import { useThemeConfig } from './composables'

defineOptions({
  name: genComponentName('DashboardGlobalConfigBar')
})

// bar config
const { barInstance } = useBar(DashboardGlobalConfigBar, 'DashboardGlobalConfigBar')

useThemeConfig(barInstance.configData, () => {
  if (barInstance.themeChageBecauseInject) {
    barInstance.themeChageBecauseInject = false
    return false
  }

  return true
})

defineExpose({
  instance: barInstance
})
</script>

<style lang="scss">
.bi-dashboard-global-config-bar {
  --bi-side-bar-width: 420px;
}
</style>
