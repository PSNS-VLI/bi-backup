<template>
  <div class="table-crosstab">
    <div v-if="isShowTotal">
      <span class="total-text" :style="totalStyle">{{ total.totalTitle }}：</span>
      <span class="total-number">{{ total.totalValue }}</span>
    </div>
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
  type Field,
  getDataTagConfigData,
  getTextConfigData,
  getTooltipConfigData
} from '../../shortcut'

import {
  componentID,
  setChartConfigData,
  chartConfigKey,
  dataTagConfigStyleWrapperKey,
  totalConfigStyleTitleWrapperKey,
  tooltipConfigStyleTextStyleWrapperKey
} from './config'

defineOptions({
  name: ChartName.PIE_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})
const isShowTotal = ref()
const total = ref({
  totalTitle: '总计',
  totalValue: 0
})
const totalStyle = ref()
const label = {
  text: (data: any) => {},
  position: 'outside',
  fontWeight: '',
  fontSize: 12,
  fill: ''
}
const calculatedChartData = ref()
const getLabelData = (store: any) => {
  const labelConfig = getDataTagConfigData(dataTagConfigStyleWrapperKey, store.styles)
  const { fontWeight, fontSize, fill, content, digit } = labelConfig
  // 整理数据
  let sum = 0
  calculatedChartData.value?.chartData?.forEach((item: any) => {
    sum += item[calculatedChartData.value.valueKey]
  })
  total.value.totalValue = Number(sum.toFixed(2))
  calculatedChartData.value?.chartData?.forEach((item: any) => {
    if (digit === 'zero') {
      item.percent = ((item[calculatedChartData.value.valueKey] / sum) * 100).toFixed(0) + '%'
    } else if (digit === 'one') {
      item.percent = ((item[calculatedChartData.value.valueKey] / sum) * 100).toFixed(1) + '%'
    } else {
      item.percent = ((item[calculatedChartData.value.valueKey] / sum) * 100).toFixed(2) + '%'
    }
  })
  label.fontWeight = fontWeight
  label.fontSize = fontSize
  label.fill = fill

  label.text = (data) => {
    const dimensionality = content.includes('dimensionality')
      ? `${data[calculatedChartData.value.classKey]}`
      : ''
    const measurement = content.includes('measurement')
      ? `${data[calculatedChartData.value.valueKey]}`
      : ''
    const isShowColon =
      content.includes('dimensionality') && content.includes('measurement') ? ': ' : ''
    const proportion = content.includes('measurement')
      ? content.includes('proportion')
        ? `(${data.percent})`
        : ''
      : content.includes('proportion')
        ? `${data.percent}`
        : ''

    if (!content.length) return ''
    return `${dimensionality}${isShowColon}${measurement}${proportion}`
  }
}
const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    initChart: (chart) => {
      chart.options({
        type: 'interval',
        padding: 'auto',
        data: []
      })
      chart.render()
      const mark = chart.interval()
      mark.label(label)
      return mark
    },
    updateChart: async (mark, store) => {
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
            stringNumberConvert: true,
            calculatedPercent: true
          }
        )
        calculatedChartData.value = { classKey, valueKey, chartData }
        getLabelData(store)
        // 设置为极坐标系
        mark.coordinate({ type: 'theta', outerRadius: 0.8 })
        mark.transform({ type: 'stackY' }).encode('y', valueKey).encode('color', classKey)
        label.text = (data) => {
          return `${data[classKey]}：${data[valueKey]}(${data.percent})`
        }
        mark.changeData(chartData)
        provideData(originChartData)
      }
    },
    updateStore: (mark, store) => {
      getLabelData(store)
      const totalName =
        store.styles?.[chartConfigKey.totalConfig]?.[chartConfigKey.totalConfigTitle]
      if (totalName) {
        total.value.totalTitle = totalName
      } else {
        total.value.totalTitle = '总计'
      }
      const { color, fontSize, fontWeight } = getTextConfigData(
        totalConfigStyleTitleWrapperKey,
        store.styles?.[chartConfigKey.totalConfig]
      )
      totalStyle.value = `color: ${color}; font-size: ${fontSize}px;font-weight: ${fontWeight}`
      getTooltipConfigData(tooltipConfigStyleTextStyleWrapperKey, store.styles, mark)
      isShowTotal.value = store.styles?.[chartConfigKey.totalSwitch]
      setChartConfigData(mark, store)
    }
  }
})
</script>
<style lang="scss" scoped>
.total-text,
.total-number {
  font-size: size(12);
}
</style>
