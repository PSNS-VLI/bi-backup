<template>
  <div class="table-crosstab">
    <div :id="containerID" :style="containerStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  ChartName,
  useChart,
  type ChartProps,
  type Field,
  getDataTagConfigData,
  groupChartDataByFields,
  customToolTip,
  getTooltipConfigData
} from '../../shortcut'

import {
  componentID,
  setChartConfigData,
  dataTagConfigStyleWrapperKey,
  tooltipConfigStyleTextStyleWrapperKey
} from './config'

defineOptions({
  name: ChartName.PIE_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})

const label = {
  text: '',
  fontWeight: 'normal',
  fontSize: '12',
  fill: '',
  style: {
    dx: -10,
    dy: -12
  },
  transform: [{ type: 'overlapHide' }]
}
const computedData = ref()

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    onCreated: (chart) => {
      chart
        .area()
        .transform([{ type: 'stackY' }])
        .encode('shape', 'smooth')
        .style('fillOpacity', 0.3)
        .label(label)

      chart
        .line()
        .transform([{ type: 'stackY' }])
        .encode('shape', 'smooth')
        .style('strokeWidth', 2)
        .tooltip(false)
    },
    onConfigUpdated: (store, chart) => {
      const area = chart.getNodeByType('area') as any

      const { position, fontWeight, fontSize, fill } = getDataTagConfigData(
        dataTagConfigStyleWrapperKey,
        store.styles
      )
      label.fontWeight = fontWeight
      label.fontSize = fontSize
      label.fill = fill
      if (position === 'top' || position === 'auto') {
        label.style.dy = -12
      } else {
        label.style.dy = 12
      }
      const { tooltipDisplayContent } = getTooltipConfigData(
        tooltipConfigStyleTextStyleWrapperKey,
        store.styles,
        area
      )
      customToolTip(area, store, computedData.value, tooltipDisplayContent)
      setChartConfigData(area, store)
    },
    onDataRequested: async (store, chart) => {
      const dimensions = store?.fields?.dimensions as Field[]
      const measurements = store?.fields?.measurements as Field[]
      const legends = store?.fields?.legends as Field[]
      const tooltips = store?.fields?.tooltips as Field[]

      if (dimensions?.length && measurements?.length) {
        const originChartData = await loadData(dimensions.concat(measurements, legends, tooltips))
        const { classKey, valueKey, colorKey, chartData } = groupChartDataByFields(
          originChartData,
          dimensions,
          measurements,
          legends,
          {
            stringNumberConvert: true,
            calculatedPercent: true
          }
        )

        computedData.value = chartData

        const area = chart.getNodeByType('area') as any
        const line = chart.getNodeByType('line') as any

        area.encode('x', classKey).encode('y', valueKey).encode('color', colorKey)
        line.encode('x', classKey).encode('y', valueKey).encode('color', colorKey)

        provideData(originChartData)
        // chart.changeData(chartData)
        chart.changeData(chartData)
      }
    }
  }
})
</script>
<style lang="scss"></style>
