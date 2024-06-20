<!-- 仪表盘 -->
<template>
  <div class="indicator-chart">
    <div :id="containerID" :style="containerStyle"></div>
    <div class="label">
      <span :style="nameStyle">{{ labelName }}</span>
      <span :style="valueStyle">{{ percentage ? proportion : dataValue.target }}</span>
      <span :style="subLabelStyle" v-if="percentage">实际：{{ dataValue.target }}</span>
      <span :style="subLabelStyle" v-else>占比：{{ proportion }}</span>
    </div>
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
  getTextConfigData,
  getTooltipConfigData,
  customToolTip
} from '../../shortcut'

import {
  componentID,
  setChartConfigData,
  chartConfigKey,
  subLabelTextKey,
  nameKey,
  valueKey
} from './config'

defineOptions({
  name: ChartName.INDICATOR_DASHBOARD
})
const props = withDefaults(defineProps<ChartProps>(), {})
let dataValue = {
  target: null,
  total: null,
  percent: null,
  thresholds: [],
  name: 'score'
}
const percentage = ref(true)
const proportion = ref('')
const nameStyle = ref('')
const valueStyle = ref('')
const valueData = ref()
const subLabelStyle = ref('')
const labelName = ref('')

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    initChart: (chart) => {
      const mark = chart.gauge()
      mark.style('textContent', (target, total) => '').legend(false)
      chart.render()
      return mark
    },
    updateChart: async (mark, store) => {
      const measurements = store?.fields?.measurements as Field[]
      if (measurements?.length) {
        const originChartData = await loadData(measurements)
        const { classKey, valueKey, colorKey, chartData } = groupChartDataByFields(
          originChartData,
          [],
          measurements,
          []
        )
        labelName.value = chartData[0][colorKey]
        valueData.value = Number(chartData[0][valueKey])
        dataValue.target = Number(chartData[0][valueKey])
        dataValue.total = Number(chartData[0][valueKey]) * 3
        mark.data({
          value: dataValue
        })
        instrumentStyleChange(mark, store)
        dataLabelChange(store)
      }
    },
    updateStore: (mark, store) => {
      setChartConfigData(mark, store)
      instrumentStyleChange(mark, store)
      dataLabelChange(store)
    }
  }
})

// 仪表样式
const instrumentStyleChange = (mark, store) => {
  const instrumentStyle = store.styles?.[chartConfigKey.instrumentStyle]
  const instrumentScaleLines = instrumentStyle?.[chartConfigKey.instrumentScaleLines]
  const instrumentScaleLineType = instrumentScaleLines?.[chartConfigKey.instrumentScaleLineType]
  if (instrumentScaleLineType === 'percentage') {
    dataValue.percent = Number((dataValue.target / dataValue.total).toFixed(2))
    mark.axis('y', {
      // tickCount: 4,
      labelFormatter: '0.0%'
    })
  } else {
    dataValue.percent = null
    mark.axis('y', {
      labelFormatter: ''
    })
  }

  const intervalColor = instrumentStyle?.[chartConfigKey.intervalColor]
  const intervalColorShow = intervalColor?.[chartConfigKey.intervalColorShow]
  const intervalNumber = intervalColor?.[chartConfigKey.intervalNumber]
  const generateIntervals = (value, num) => {
    let arr = []
    let interval = value / num
    let start = 0
    for (let i = 0; i < num; i++) {
      let end = i === num - 1 ? value : Math.round(start + interval)
      if (i === num - 1 && end < value) {
        end = value
      }
      arr.push(end)
      start = end
    }
    return arr
  }
  if (intervalColorShow) {
    dataValue.percent = null
    mark.axis('y', {
      labelFormatter: ''
    })
    dataValue.thresholds = generateIntervals(valueData.value * 3, intervalNumber)
  } else {
    dataValue.thresholds = []
  }
}

// 数据标签
const dataLabelChange = (store) => {
  const dataLabel = store.styles?.[chartConfigKey.dataLabel]
  const mainLabel = dataLabel?.[chartConfigKey.mainLabel]
  const subLabel = dataLabel?.[chartConfigKey.subLabel]
  // 标签样式
  const mainLabelStyle = mainLabel?.[chartConfigKey.mainLabelStyle]
  if (mainLabelStyle === 'percentage') {
    percentage.value = true
  } else {
    percentage.value = false
  }
  // 文本样式
  const mainTextStyle = mainLabel?.[chartConfigKey.mainTextStyle]
  // 名称
  const {
    color: color1,
    fontSize: fontSize1,
    fontWeight: fontWeight1,
    fontStyle: fontStyle1
  } = getTextConfigData(nameKey, mainTextStyle)
  nameStyle.value = `color: ${color1}; font-size: ${fontSize1}px;font-weight: ${fontWeight1};font-style: ${fontStyle1};`
  // 数值
  const {
    color: color2,
    fontSize: fontSize2,
    fontWeight: fontWeight2,
    fontStyle: fontStyle2
  } = getTextConfigData(valueKey, mainTextStyle)
  valueStyle.value = `color: ${color2}; font-size: ${fontSize2}px;font-weight: ${fontWeight2};font-style: ${fontStyle2};`
  // 占比值小数位数
  const mainLabelDecimalPlaces = mainLabel?.[chartConfigKey.mainLabelDecimalPlaces]
  proportion.value =
    ((dataValue.target / dataValue.total) * 100).toFixed(mainLabelDecimalPlaces) + '%'

  // 副样式
  const { color, fontSize, fontWeight, fontStyle } = getTextConfigData(subLabelTextKey, subLabel)
  subLabelStyle.value = `color: ${color}; font-size: ${fontSize}px;font-weight: ${fontWeight};font-style: ${fontStyle};`
}
</script>

<style lang="scss" scoped>
.indicator-chart {
  position: relative;
  .label {
    position: absolute;
    bottom: size(30);
    left: 50%;
    margin-left: size(-40);
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.5;
  }
}
</style>
