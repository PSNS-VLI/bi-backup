<!-- 堆积柱图 -->
<template>
  <div>
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
  getDataTagConfigKeyMap,
  getDataTagConfigData,
  getTooltipConfigData,
  getTextConfigData,
  customToolTip,
  type Field
} from '../../shortcut'

import {
  componentID,
  setChartConfigData,
  chartConfigKey,
  seriesConfigTextKey,
  tooltipConfigStyleTextStyleWrapperKey
} from './config'

defineOptions({
  name: ChartName.BAR_STACKING
})
const props = withDefaults(defineProps<ChartProps>(), {})

const valueY = ref('')
const computedData = ref()
const measurementsLength = ref()
let transformY = { type: 'stackY' }
let labelValue = {
  text: (data) => {},
  transform: [{ type: 'overflowHide' }],
  textBaseline: undefined
}
let labelTotal = { text: (data) => {}, textBaseline: 'bottom' }

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    // 初始化图表
    initChart: (chart) => {
      chart.render()
      const mark = chart.interval()
      // mark.transform(transformY)
      mark.transform({ type: 'stackY' }).label([labelValue, labelTotal]).data([])
      return mark
    },

    // 渲染图表（点更新按钮）
    updateChart: async (mark, store) => {
      const dimensions = store?.fields?.dimensions as Field[]
      const measurements = store?.fields?.measurements as Field[]
      const legends = store?.fields?.legends as Field[]
      const tooltips = store?.fields?.tooltips as Field[]
      measurementsLength.value = measurements?.length

      if (dimensions?.length && measurements?.length) {
        const originChartData = await loadData(dimensions.concat(measurements, legends, tooltips))
        const { classKey, valueKey, colorKey, chartData } = groupChartDataByFields(
          originChartData,
          dimensions,
          measurements,
          legends,
          {
            calculatedPercent: true,
            stringNumberConvert: true,
            percentPrecision: 0
          }
        )
        valueY.value = valueKey
        computedData.value = chartData
        mark.encode({ x: classKey, y: valueKey, color: colorKey }).changeData(chartData)
        provideData(originChartData)
      }
    },

    // 更新图表数据（配置样式）
    updateStore: (mark, store) => {
      setChartConfigData(mark, store)
      drawConfigChange(mark, store)
      dataTagConfigChange(store)
      tooltipConfigChange(mark, store)
      seriesConfigChange(store)
    }
  }
})

// 绘图区域
const drawConfigChange = (mark, store) => {
  const drawConfig = store.styles?.[chartConfigKey.drawConfig]
  // 可视化图表切换
  const drawConfigChartType = drawConfig?.[chartConfigKey.drawConfigChartType]
  // 复选框 堆积
  const drawConfigStacking = drawConfig?.[chartConfigKey.drawConfigStacking]
  // 复选框 百分比堆积
  const drawConfigPercentage = drawConfig?.[chartConfigKey.drawConfigPercentage]

  // 可视化图表切换
  if (drawConfigPercentage || drawConfigChartType === 'percentage') {
    // 百分比堆积
    transformY.type = 'normalizeY'
    mark.axis('y', { labelFormatter: '.0%' })
    // if (drawConfig)
    //   Object.assign(drawConfig, {
    //     [chartConfigKey.drawConfigPercentage]: true
    //   })
  } else if (drawConfigStacking || drawConfigChartType === 'stacking') {
    // 堆积
    transformY.type = 'stackY'
  } else {
    // 柱状图
    transformY.type = 'dodgeX'
  }
}

// 数据标签
const dataTagConfigChange = (store) => {
  const dataTagConfigKey = getDataTagConfigKeyMap('dataTagConfigStyle')

  // 数据标签 - 内容
  const dataTagContent =
    store.styles?.['dataTagConfigStyle']?.[dataTagConfigKey.dataTagConfigContent]
  const labelConfig = getDataTagConfigData('dataTagConfigStyle', store.styles)

  const { position, ...rest } = labelConfig
  Object.assign(labelValue, labelConfig)
  Object.assign(labelTotal, rest)

  // y 轴 度量     百分比
  if (dataTagContent?.includes('measurement') && dataTagContent?.includes('proportion')) {
    labelValue.text = (data) => `${data[valueY.value]} \n ${data['__BI_PERCENT_STR_VALUE_KEY__']}`
  } else if (dataTagContent?.includes('proportion')) {
    labelValue.text = (data) => data['__BI_PERCENT_STR_VALUE_KEY__']
  } else if (dataTagContent?.includes('measurement')) {
    labelValue.text = (data) => data[valueY.value]
  } else {
    labelValue.text = (data) => ''
  }
  console.log(labelValue)

  // 总计
  if (dataTagContent?.includes('total')) {
    labelTotal.text = (data) =>
      data.__BI_COLOR_KEY__ === computedData.value[measurementsLength.value - 1].__BI_COLOR_KEY__
        ? data.__BI_TOTAL_VALUE_KEY__
        : ''
  } else {
    labelTotal.text = (data) => ''
  }

  // 全量显示
  // 修改 .transform =  []    放在 if 判断里 修改了但不生效
  // 修改 .text =  ''         就不会
  const dataTagFullDisplay =
    store.styles?.['dataTagConfigStyle']?.[dataTagConfigKey.dataTagConfigFullDisplay]
  // labelValue.transform = !dataTagFullDisplay ? [{ type: 'overflowHide' }] : []
}

// 工具提示
const tooltipConfigChange = (mark, store) => {
  const { tooltipDisplayContent } = getTooltipConfigData(
    tooltipConfigStyleTextStyleWrapperKey,
    store.styles,
    mark
  )
  customToolTip(mark, store, computedData.value, tooltipDisplayContent)
}

// 系列设置
const seriesConfigChange = (store) => {
  const seriesConfig = store.styles?.[chartConfigKey.seriesConfig]
  // 系列设置-数据标签
  const seriesConfigLabel = seriesConfig?.['keymap_wrapper']
  const seriesLabel = seriesConfigLabel?.[Object.keys(seriesConfigLabel)[0]]
  // 数据标签
  const seriesConfigDataTag = seriesLabel?.[chartConfigKey.seriesConfigDataTag]
  // 显示
  const seriesConfigShowDataTag = seriesConfigDataTag?.[chartConfigKey.seriesConfigShowDataTag]
  // 位置
  const seriesPosition = seriesConfigDataTag?.[chartConfigKey.seriesConfigDataTagPosition]
  // 文本
  const { color, fontSize, fontWeight, fontStyle } = getTextConfigData(
    seriesConfigTextKey,
    seriesConfigDataTag
  )
  // 总计
  if (seriesConfigShowDataTag) {
    labelValue['fill'] = color
    labelValue['fontSize'] = fontSize
    labelValue['position'] = seriesPosition
    labelValue['fontWeight'] = fontWeight
    labelValue['fontStyle'] = fontStyle

    if (seriesPosition === 'top-out') {
      labelValue['position'] = undefined
      labelValue.textBaseline = 'bottom'
    } else {
      labelValue['position'] = seriesPosition
      labelValue.textBaseline = undefined
    }

    labelValue.text = (data) => {
      if (data.__BI_COLOR_KEY__ === Object.keys(seriesConfigLabel)[0]) {
        return data[valueY.value]
      } else {
        return ''
      }
    }
  }
  // 切换标签 清空之前的 ？
}
</script>

<style lang="scss" scoped></style>
