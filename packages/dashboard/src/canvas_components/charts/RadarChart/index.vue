<template>
  <div class="table-crosstab">
    <div :id="containerID" :style="containerStyle"></div>
  </div>
</template>

<script setup lang="ts">
import {
  ChartName,
  useChart,
  type ChartProps,
  type Field,
  groupChartDataByFields,
  getDataTagConfigData,
  getTooltipConfigData
} from '../../shortcut'

import {
  componentID,
  setChartConfigData,
  chartConfigKey,
  dataTagConfigStyleWrapperKey,
  tooltipConfigStyleTextStyleWrapperKey
} from './config'

defineOptions({
  name: ChartName.RADAR_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})

const label = {
  text: '',
  fill: '#000',
  fontWeight: 'normal',
  fontSize: 12
}
const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    onCreated: (chart) => {
      chart
        .scale('x', { padding: 0.5, align: 0 })
        .axis('x', {
          grid: true,
          gridLineWidth: 1,
          tick: false,
          gridLineDash: [0, 0]
        })
        .axis('y', {
          zIndex: 1,
          title: false,
          gridConnect: 'line',
          gridLineWidth: 1,
          gridLineDash: [0, 0]
        })
        .interaction('tooltip', { crosshairsLineDash: [4, 4] })
        .coordinate({ type: 'polar' })
      chart.area().style('fillOpacity', 0.5)
      chart.line().style('lineWidth', 2)
      chart.point().encode('shape', 'point').encode('size', 3).tooltip(null)
    },
    onDataRequested: async (store, chart) => {
      const dimensions = store?.fields?.dimensions as Field[]
      const measurements = store?.fields?.measurements as Field[]
      if (dimensions?.length && measurements?.length) {
        const originChartData = await loadData(dimensions.concat(measurements))
        const { classKey, valueKey, colorKey, chartData } = groupChartDataByFields(
          originChartData,
          dimensions,
          measurements,
          [],
          {
            stringNumberConvert: true
          }
        )
        chart
        const area = chart.getNodeByType('area') as any
        const point = chart.getNodeByType('point') as any
        const line = chart.getNodeByType('line') as any

        area.encode('x', classKey).encode('y', valueKey).encode('color', colorKey)

        line.encode('x', classKey).encode('y', valueKey).encode('color', colorKey)

        point.encode('x', classKey).encode('y', valueKey).encode('color', colorKey)
        const getValue = chartData.map((item) => item[valueKey])
        const maxValue = roundUpToNextOrder(getValue)
        chart.scale('y', { tickCount: 5, domainMax: maxValue })

        label.text = valueKey
        chart.changeData(chartData)
      }
    },
    onConfigUpdated: (store, chart) => {
      const area = chart.getNodeByType('area') as any

      const isShowLabel = store.styles?.[chartConfigKey.labelSwitch]
      if (isShowLabel) {
        const { fontWeight, fontSize, fill } = getDataTagConfigData(
          dataTagConfigStyleWrapperKey,
          store.styles
        )
        label.fontWeight = fontWeight
        label.fontSize = fontSize
        label.fill = fill ? fill : '#000'
      }
      getTooltipConfigData(tooltipConfigStyleTextStyleWrapperKey, store.styles, area)
      setChartConfigData(area, store)
    }
  }
})
const roundUpToNextOrder = (array) => {
  const max = Math.ceil(Math.max(...array))
  const maxStr = max.toString()
  const length = maxStr.length
  let base
  if (length <= 2) {
    base = 10 // 十位
  } else if (length <= 3) {
    base = 100 // 百位
  } else if (length <= 4) {
    base = 1000 // 千位
  } else if (length <= 5) {
    base = 10000 // 万位
  } else {
    base = 100000 // 十万位
  }

  const roundedMax = Math.ceil(max / base) * base

  return roundedMax
}
</script>
