<template>
  <b-i-side-bar
    class="bi-dashboard-chart-config-bar"
    title="title"
    :tabs="barInstance.tabs"
    v-model:active-tab-name="barInstance.activeTabName"
    v-model="barInstance.opened"
  >
    <template v-slot:[`content-${BAR_TAB.FIELDS}`]>
      <b-i-fields-config-panel
        v-model="barInstance.configData.fields"
        v-model:request-config-data="barInstance.configData[CHART_CONFIG_KEY]"
        :configs="barInstance.config.fields"
        :on-field-data-drop-hook="onFieldDataDropHook"
        @update-data="hanldeClickUpdateData"
      >
        <template #field="{ fieldData, deleteField, updateField }">
          <b-i-field
            :field="fieldData"
            @update:field="updateField"
            @delete-field="deleteField()"
          ></b-i-field>
        </template>
      </b-i-fields-config-panel>
    </template>
    <template v-slot:[`content-${BAR_TAB.STYLES}`]>
      <b-i-styles-config-panel
        v-model="barInstance.configData.styles"
        :configs="barInstance.config.styles"
      >
      </b-i-styles-config-panel>
    </template>
    <template v-slot:[`content-${BAR_TAB.ANALYSES}`]></template>
  </b-i-side-bar>
</template>

<script setup lang="ts">
import { provide, toRef, type Ref, watch, type WatchStopHandle } from 'vue'
import { ElMessage } from 'element-plus'

import { FieldClass, type Field } from '../../types/dataset'
import type { FieldConfig, ChartConfigStore } from '../../types/configuration'
import { genComponentName } from '../../utils'
import {
  CHART_CONFIG_KEY,
  CHART_CONFIG_BAR_PROVIDE_CHART_CONFIG_STORE,
  CHART_CONFIG_BAR_PROVIDE_CHART_DATA
} from '../../constants/app/dashboard'
import { useChartDataStore } from '../../store'

import BISideBar from '../SideBar'
import { useBar } from '../composables'
import { BIFieldsConfigPanel, BIStylesConfigPanel } from '../DashboardConfigurations'
import { BIField } from '../DashboardDatasetComponents'

import { DashboardChartConfigBar, BAR_TAB } from './dashboard-chart-config-bar'

defineOptions({
  name: genComponentName('DashboardChartConfigBar')
})

/**
 * tab panel
 */
// [tab panel] fields
const onFieldDataDropHook = (event: DragEvent, fieldConfig: FieldConfig) => {
  const data = event.dataTransfer?.getData('text/html')
  if (data) {
    const res = JSON.parse(data) as Field
    if (fieldConfig.fieldClass && fieldConfig.fieldClass !== res.class) {
      ElMessage.warning(
        `不支持添加${res.class === FieldClass.DIMENSION ? '维度' : '度量'}到[${fieldConfig.label}]`
      )
      return
    }
    return res
  }
}
const hanldeClickUpdateData = () => {
  barInstance.configData[CHART_CONFIG_KEY].updateRequestId = new Date().getTime()
}

// bar config
const { barInstance } = useBar(DashboardChartConfigBar, 'DashboardChartConfigBar')
provide(
  CHART_CONFIG_BAR_PROVIDE_CHART_CONFIG_STORE,
  toRef(barInstance, 'configData') as Ref<ChartConfigStore>
)
provide(CHART_CONFIG_BAR_PROVIDE_CHART_DATA, toRef(barInstance, 'chartData'))

const chartDataStore = useChartDataStore()
let watchStopHandle: WatchStopHandle | null = null
watch(
  () => barInstance.focusedChartKey,
  (key) => {
    if (key) {
      watchStopHandle && watchStopHandle()
      watchStopHandle = chartDataStore.watch(key, (chartData) => {
        barInstance.chartData = chartData
      })
    } else {
      watchStopHandle && watchStopHandle()
    }
  },
  {
    immediate: true
  }
)

defineExpose({
  instance: barInstance
})
</script>

<style lang="scss"></style>
