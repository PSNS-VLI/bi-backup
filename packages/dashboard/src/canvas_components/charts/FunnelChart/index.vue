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
  groupChartDataByFields,
  type ChartProps,
  type Field
} from '../../shortcut'

import { componentID, setChartConfigData } from './config'

defineOptions({
  name: ChartName.PIE_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})
const getData = ref()
const rate = (start, end) => {
  return `${(((start - end) / start) * 100).toFixed(2)} %`
}
const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    onCreated: (chart) => {
      chart.options({
        paddingLeft: 100
      })
      chart
        .interval()
        .encode('shape', 'funnel')
        .transform({ type: 'symmetryY' })
        .scale('x', { padding: 0 })
        .animate('enter', { type: 'fadeIn' })
        .coordinate({ transform: [{ type: 'transpose' }] })
        .axis(false)
      // .legend({
      //   layout: 'grid'
      //   justifyContent: 'center',
      //   alignItems: 'center'
      // })
    },
    onConfigUpdated: (store, chart) => {
      const interval = chart.getNodeByType('interval') as any
      interval.label({
        text: getData.value.valueKey,
        position: 'inside',
        transform: [{ type: 'contrastReverse' }]
      })
      setChartConfigData(interval, store)
    },
    onDataRequested: async (store, chart) => {
      const dimensions = store?.fields?.dimensions as Field[]
      const measurements = store?.fields?.measurements as Field[]
      const tooltips = store?.fields?.tooltips as Field[]
      if (dimensions?.length && measurements?.length) {
        const originChartData = await loadData(dimensions.concat(measurements, tooltips))
        const { classKey, valueKey, chartData } = groupChartDataByFields(
          originChartData,
          dimensions,
          measurements,
          [],
          {
            stringNumberConvert: true
          }
        )
        getData.value = { classKey, valueKey, chartData }
        const interval = chart.getNodeByType('interval') as any
        interval.encode('x', classKey).encode('y', valueKey).encode('color', classKey)

        interval.changeData(chartData)
      }
    }
  }
})
</script>
<style lang="scss"></style>
