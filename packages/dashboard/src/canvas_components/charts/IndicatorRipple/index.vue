<template>
  <div class="liquid">
    <div class="chart" :id="containerID" :style="containerStyle"></div>
    <div class="text">
      <span :style="liquidProportionStyle">{{ liquidProportion }}</span>
      <span :style="liquidNameStyle">{{ liquidName }}</span>
    </div>
    <div v-if="currentTargetSwitchShow" class="label" :style="labelStyle">
      <span>{{ actualLabel }}：{{ actual }}</span>
      <span>{{ targetLabel }}：{{ target }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  ChartName,
  useChart,
  groupChartDataByFields,
  type ChartProps,
  type Field
} from '../../shortcut'

import { componentID, getChartConfigData } from './config'

defineOptions({
  name: ChartName.INDICATOR_RIPPLE
})
const props = withDefaults(defineProps<ChartProps>(), {})

const liquidName = ref('')
const actual = ref()
const target = ref()

const liquidProportion = ref('')
const liquidProportionStyle = ref('')
const liquidNameStyle = ref('')

const currentTargetSwitchShow = ref(false)
const labelStyle = ref('')
const actualLabel = ref()
const targetLabel = ref()

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    onCreated: (chart) => {
      chart.liquid()
    },

    onConfigUpdated: (store, chart) => {
      const liquid = chart.getNodeByType('liquid') as any
      chartConfigChange(store, chart)
      const { proportionBarData } = getChartConfigData(store)

      liquid.style({
        contentText: '', // 文字
        outlineBorder: proportionBarData.proportionBarWidth, // 杯子边框粗细
        outlineStroke: '#ccc', // 杯子边框颜色
        outlineDistance: 4 // 水和杯子的间距
      })
      chart.render()
    },

    onDataRequested: async (store, chart) => {
      const measurements = store?.fields?.measurements as Field[]
      if (measurements?.length) {
        const originChartData = await loadData(measurements)
        const { classKey, valueKey, colorKey, chartData } = groupChartDataByFields(
          originChartData,
          [],
          measurements,
          []
        )
        // actual.value = Number(chartData[0][valueKey])
        actual.value = 32
        target.value = 100
        liquidName.value = chartData[0][colorKey]

        chartConfigChange(store, chart)

        chart.changeData({
          value: target.value ? actual.value / target.value : 0
        })
        // provideData(originChartData)
      }
    }
  }
})

const chartConfigChange = (store, chart) => {
  const { indicatorContentData, currentTargetData } = getChartConfigData(store)
  const {
    mainIndicatorsName: { color, fontSize, fontWeight, fontStyle },
    mainIndicatorsProportion: { color1, fontSize1, fontWeight1, fontStyle1 },
    mainLabelDecimalPlaces,
    proportionCalculationMethod // 完成占比计算方式
  } = indicatorContentData
  const {
    currentTargetValueSwitch,
    currentValueLabel,
    targetValueLabel,
    currentTargetText: { color2, fontSize2, fontWeight2, fontStyle2 },
    targetValueType,
    targetValue
  } = currentTargetData

  if (currentTargetValueSwitch) {
    currentTargetSwitchShow.value = true
    actualLabel.value = currentValueLabel
    targetLabel.value = targetValueLabel
    labelStyle.value = `color: ${color2}; font-size: ${fontSize2}px;font-weight: ${fontWeight2};font-style: ${fontStyle2};`
    target.value = targetValueType === 'dynamic' ? 100 : Number(targetValue)

    chart.changeData({
      value: target.value ? actual.value / target.value : 0
    })
  } else {
    currentTargetSwitchShow.value = false
    actualLabel.value = ''
    targetLabel.value = ''
    labelStyle.value = ''
    target.value = 100
  }

  liquidProportion.value = target.value
    ? ((actual.value / target.value) * 100).toFixed(mainLabelDecimalPlaces) + '%'
    : '0'

  liquidProportionStyle.value = `color: ${color1}; font-size: ${fontSize1}px;font-weight: ${fontWeight1};font-style: ${fontStyle1};`
  liquidNameStyle.value = `color: ${color}; font-size: ${fontSize}px;font-weight: ${fontWeight};font-style: ${fontStyle};`
}
</script>

<style lang="scss" scoped>
.liquid {
  position: relative;
  .chart {
    padding-bottom: 50px;
  }
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .label {
    position: absolute;
    bottom: size(6);
    left: 50%;
    transform: translate(-50%, 0);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
