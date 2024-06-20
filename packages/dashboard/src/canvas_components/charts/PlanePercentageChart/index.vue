<template>
  <div :id="containerID" :style="containerStyle"></div>
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
  type ChartStore
} from '../../shortcut'

import {
  componentID,
  setChartConfigData,
  chartConfigKey,
  dataTagConfigStyleWrapperKey,
  tooltipConfigStyleTextStyleWrapperKey
} from './config'

defineOptions({
  name: ChartName.PLANE_PERCENTAGE
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
  transform: [
    {
      type: 'overlapHide'
    }
  ]
}
const yValueKey = ref()
const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    onCreated: (chart) => {
      chart
        .area()
        .encode('shape', 'smooth')
        .transform([{ type: 'stackY' }, { type: 'normalizeY' }])
        .style('fillOpacity', 0.3)
        .axis('x', { title: false })
        .axis('y', { title: false, labelFormatter: '.0%' })
        .tooltip({ channel: 'y0', valueFormatter: '.0%' })
      chart.line().tooltip(false)
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
            calculatedSum: true,
            calculatedPercent: true,
            stringNumberConvert: true
          }
        )
        yValueKey.value = valueKey
        const area = chart.getNodeByType('area') as any
        const line = chart.getNodeByType('line') as any

        area.encode('x', classKey).encode('y', yValueKey.value).encode('color', colorKey)
        area.changeData(chartData)
      }
    },
    onConfigUpdated: (store, chart) => {
      const area = chart.getNodeByType('area') as any

      getLabelData(store)
      getTooltipConfigData(tooltipConfigStyleTextStyleWrapperKey, store.styles, area)
      setChartConfigData(area, store)
    }
  }
})

const getLabelData = (store: Partial<ChartStore>) => {
  const dataTagSwitch = store.styles?.[chartConfigKey.dataTagSwitchKey]
  if (dataTagSwitch) {
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
  } else {
    label.text = ''
  }
}
</script>
<style lang="scss"></style>
