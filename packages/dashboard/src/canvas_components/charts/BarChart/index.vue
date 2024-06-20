<template>
  <div class="bar-chart">
    <div :id="containerID" :style="containerStyle"></div>
  </div>
</template>

<script setup lang="ts">
import {
  ChartName,
  useChart,
  groupChartDataByFields,
  type ChartProps,
  type Field
} from '../../shortcut'

import { componentID, setChartConfigData } from './config'

defineOptions({
  name: ChartName.BAR_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    initChart: (chart) => {
      chart.options({
        type: 'interval',
        padding: 'auto',
        data: []
      })
      chart.transform({ type: 'dodgeX' })
      chart.render()

      const mark = chart.interval()
      mark.interaction('elementHighlight', { background: true })

      return chart.interval()
    },
    updateStore: (mark, store) => {
      setChartConfigData(mark, store)
    },
    updateChart: async (mark, store) => {
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

        mark.encode({ x: classKey, y: valueKey, color: colorKey })
        mark.changeData(chartData)

        provideData(originChartData)
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
