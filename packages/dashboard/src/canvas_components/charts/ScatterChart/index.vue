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
  type Field,
  getTooltipConfigData
} from '../../shortcut'

import { componentID, setChartConfigData, tooltipConfigStyleTextStyleWrapperKey } from './config'

defineOptions({
  name: ChartName.PIE_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    initChart: (chart) => {
      chart.options({
        autoFit: true,
        padding: 'auto',
        data: []
      })
      chart.render()
      return chart.point()
    },
    updateChart: async (mark, store) => {
      const xAxis = store?.fields?.xAxis as Field[]
      const yAxis = store?.fields?.yAxis as Field[]
      const tooltips = store?.fields?.tooltips as Field[]
      const category = store?.fields?.category as Field[]
      const color = store?.fields?.color as Field[]
      if (xAxis?.length && yAxis?.length) {
        const originChartData = await loadData(xAxis.concat(yAxis, tooltips, color, category))
        const { classKey, valueKey, colorKey, chartData } = groupChartDataByFields(
          originChartData,
          xAxis,
          yAxis,
          color,
          {
            stringNumberConvert: true
          }
        )
        mark
          .encode('x', classKey)
          .encode('y', valueKey)
          .encode('color', colorKey)
          .encode('shape', 'point')
        mark.changeData(chartData)
        provideData(originChartData)
      }
    },
    updateStore: (mark, store) => {
      getTooltipConfigData(tooltipConfigStyleTextStyleWrapperKey, store.styles, mark)

      setChartConfigData(mark, store)
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
