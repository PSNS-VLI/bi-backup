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
  getTooltipConfigData,
  customToolTip
} from '../../shortcut'

import {
  componentID,
  setChartConfigData,
  dataTagConfigStyleWrapperKey,
  tooltipConfigStyleTextStyleWrapperKey
} from './config'

defineOptions({
  name: ChartName.LINE_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})

const label = {
  text: '',
  fontWeight: 'normal',
  fontSize: 12,
  fill: '',
  style: {
    dx: -10,
    dy: -12
  },
  transform: [
    {
      type: 'overlapHide'
    }
  ]
}
const computedData = ref()
const yValueKey = ref()
const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    initChart: (chart) => {
      chart.options({
        type: 'interval',
        autoFit: true,
        padding: 'auto',
        data: []
      })
      chart.render()
      const mark = chart.line()
      mark.label(label)

      return mark
    },
    updateChart: async (mark, store, chart) => {
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
        yValueKey.value = valueKey
        mark
          .encode('x', classKey)
          .encode('y', valueKey)
          .encode('color', colorKey)
          .encode('shape', 'smooth')
          .scale('x', {
            range: [0, 1]
          })
          .scale('y', {
            domainMin: 0,
            nice: true
          })

        mark.changeData(chartData)
        provideData(originChartData)
      }
    },
    updateStore: (mark, store) => {
      if (store.styles?.dataTagSwitchKey) {
        label.text = yValueKey.value
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
      }
      const { tooltipDisplayContent } = getTooltipConfigData(
        tooltipConfigStyleTextStyleWrapperKey,
        store.styles,
        mark
      )

      customToolTip(mark, store, computedData.value, tooltipDisplayContent)
      setChartConfigData(mark, store)
    }
  }
})
</script>
<style lang="scss"></style>
