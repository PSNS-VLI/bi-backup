<!-- 排行榜 图表 -->
<template>
  <el-scrollbar>
    <RankingList
      :chartData="rankingData"
      :categoryName="categoryName"
      :valueName="valueName"
      :indicator="indicator"
      :columnHead="columnHead"
      :serialNum="serialNum"
    />
  </el-scrollbar>
  <div :id="containerID" :style="containerStyle" style="display: none"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ChartName,
  useChart,
  groupChartDataByFields,
  getTextConfigData,
  type ChartProps,
  type Field
} from '../../shortcut'
import {
  componentID,
  chartConfigKey,
  indicatorDataParallelTxtKey,
  columnHeadingTxtKey
} from './config'
import RankingList from './RankingList'

defineOptions({
  name: ChartName.COLUMN_STACKING
})
const props = withDefaults(defineProps<ChartProps>(), {})

// 排行榜数据
const rankingData = ref(null)

// 类别名
const categoryName = ref('name')
// 值名
const valueName = ref('id')

// 指标数据
const indicator = ref({
  targetValue: undefined, // 目标值
  displayMethod: '', // 数据显示方式
  displayLocation: '', // 数值显示位置
  // 数据条颜色
  barColorJust: '', // 正值
  barColorNegative: '', // 负值
  barColorBackground: '', // 背景色
  barFillet: null, // 数据条圆角
  barHeight: null, // 数据条高度
  lineSpace: null, // 行间距
  // 数据相同时并列处理
  parallelRank: '', // 排名
  // 文本
  parallelTxtColor: undefined, // Color
  parallelTxtSize: null, // px
  parallelFontWeight: undefined,
  parallelFontStyle: undefined,
  mobileDisplayBarNum: null // 移动端默认显示条数
})

// 列标题                       默认选中不生效    defaultCheckbox: true,
const columnHead = ref({
  // 是否显示 列标题
  columnHeadShow: undefined,
  // 列标题 文本
  columnHeadTxtColor: undefined, // Color
  columnHeadTxtSize: null, // px
  columnHeadFontWeight: undefined,
  columnHeadFontStyle: undefined
})

// 序号
const serialNum = ref({
  serialNumName: '', // 排序列名称
  serialNumTOP3: '' // TOP 3 样式
})

// 指标数据
const indicatorData = (store) => {
  const indicatorData = store.styles?.[chartConfigKey.indicatorData]
  const barColor = indicatorData?.[chartConfigKey.indicatorDataBarColor]
  const parallel = indicatorData?.[chartConfigKey.indicatorDataParallel]
  const { color, fontSize, fontWeight, fontStyle } = getTextConfigData(
    indicatorDataParallelTxtKey,
    indicatorData
  )
  indicator.value = {
    targetValue: indicatorData?.[chartConfigKey.indicatorDataTargetValue],
    displayMethod: indicatorData?.[chartConfigKey.indicatorDataDisplayMethod],
    displayLocation: indicatorData?.[chartConfigKey.indicatorDataDisplayLocation],
    barColorJust: barColor?.[chartConfigKey.indicatorDataBarColorJust],
    barColorNegative: barColor?.[chartConfigKey.indicatorDataBarColorNegative],
    barColorBackground: barColor?.[chartConfigKey.indicatorDataBarColorBackground],
    barFillet: indicatorData?.[chartConfigKey.indicatorDataBarFillet],
    barHeight: indicatorData?.[chartConfigKey.indicatorDataBarHeight],
    lineSpace: indicatorData?.[chartConfigKey.indicatorDataLineSpace],
    parallelRank: parallel?.[chartConfigKey.indicatorDataParallelRank],
    parallelTxtColor: color,
    parallelTxtSize: fontSize,
    parallelFontWeight: fontWeight,
    parallelFontStyle: fontStyle,
    mobileDisplayBarNum: indicatorData?.[chartConfigKey.indicatorDataMobileDisplayBarNum]
  }
}

// 列标题
const columnHeadings = (store) => {
  const columnHeadings = store.styles?.[chartConfigKey.columnHeadings]
  const columnHeadWrapper = columnHeadings?.[chartConfigKey.columnHeadingsWrapper]
  const { color, fontSize, fontWeight, fontStyle } = getTextConfigData(
    columnHeadingTxtKey,
    columnHeadWrapper
  )
  columnHead.value = {
    columnHeadShow: columnHeadWrapper?.[chartConfigKey.columnHeadingsShow],
    columnHeadTxtColor: color,
    columnHeadTxtSize: fontSize,
    columnHeadFontWeight: fontWeight,
    columnHeadFontStyle: fontStyle
  }
}

// 序号
const serialNumber = (store) => {
  const serialNumber = store.styles?.[chartConfigKey.serialNumber]
  serialNum.value = {
    serialNumName: serialNumber?.[chartConfigKey.serialNumberName],
    serialNumTOP3: serialNumber?.[chartConfigKey.serialNumberTOP3Style]
  }
}

// 条件格式   先不做
const conditionalFormat = (store) => {}

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    // 更新图表和配置
    updateChartWithoutDom: async (store) => {
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
            calculatedPercent: true,
            stringNumberConvert: true
          }
        )
        rankingData.value = chartData
        categoryName.value = classKey
        valueName.value = valueKey
      }
    },
    // 更新图表数据
    updateStoreWithoutDom: (store) => {
      // 指标数据
      indicatorData(store)
      // 列标题
      columnHeadings(store)
      // 序号
      serialNumber(store)
    },
    // 载入数据
    loadChartWithoutDom: (store) => {}
  }
})
</script>

<style lang="scss" scoped></style>
