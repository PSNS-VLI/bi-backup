<template>
  <div class="table-crosstab">
    <div :id="containerID" :style="containerStyle"></div>
  </div>
</template>

<script setup lang="ts">
import {
  ChartName,
  useChart,
  groupChartDataByFields,
  type ChartProps,
  getTooltipConfigData,
  type Field
} from '../../shortcut'

import { componentID, setChartConfigData, tooltipConfigStyleTextStyleWrapperKey } from './config'

defineOptions({
  name: ChartName.PIE_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    onCreated: (chart) => {
      chart.options({
        paddingTop: 20,
        paddingRight: 20
      })
      chart.point().encode('shape', 'point').scale('size', { rangeMax: 35 }).legend(false).style({
        stroke: 'black',
        strokeOpacity: 0.1,
        opacity: 0.8,
        lineWidth: 1
      })
    },
    onDataRequested: async (store, chart) => {
      const xAxis = store?.fields?.xAxis as Field[]
      const yAxis = store?.fields?.yAxis as Field[]
      const tooltips = store?.fields?.tooltips as Field[]

      if (xAxis?.length && yAxis?.length) {
        const originChartData = await loadData(xAxis.concat(yAxis, tooltips))
        const { classKey, valueKey, colorKey, chartData } = groupChartDataByFields(
          originChartData,
          xAxis,
          yAxis,
          [],
          {
            stringNumberConvert: true
          }
        )
        const point = chart.getNodeByType('point') as any
        point
          .encode('x', classKey)
          .encode('y', valueKey)
          .encode('size', valueKey)
          .encode('color', colorKey)

        point.changeData(chartData)
      }
    },
    onConfigUpdated: (store, chart) => {
      const point = chart.getNodeByType('point') as any

      getTooltipConfigData(tooltipConfigStyleTextStyleWrapperKey, store.styles, point)

      setChartConfigData(point, store)
    }
  }
})
</script>
<style lang="scss">
.tooltip {
  padding: size(12);
  background-color: rgba(255, 255, 255, 0.96);
  .tooltip-title {
    padding: 0;
    margin: 0;
  }
  .tooltip-content {
    display: flex;
    flex-direction: column;
    margin-top: size(10);
    .marker {
      display: inline-block;
      width: size(5);
      height: size(5);
      border-radius: 50%;
    }
  }
}
</style>
