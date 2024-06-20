<template>
  <Board
    :data="useData"
    :indicatorLayout="indicatorLayout"
    :indicatorContent="indicatorContent"
    :seriesSetting="seriesSetting"
  ></Board>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Board from './Board'
import {
  ChartName,
  useChart,
  type ChartProps,
  type Field,
  getTextConfigData,
  groupChartDataByFields
} from '../../shortcut'
import {
  componentID,
  chartConfigKey,
  dimensionStyleWrapperKey,
  indicatorPrimaryTextStyleWrapperKey,
  indicatorPrimaryNumberStyleWrapperKey
} from './config'
defineOptions({
  name: ChartName.PIE_CHART
})
const props = withDefaults(defineProps<ChartProps>(), {})

const useData = ref([])
// 指标布局
const indicatorLayout = ref({
  indicatorRelation: undefined, // 指标间关系
  indicatorDisplayMethod: '', // 指标间块组展示形式
  indicatorDisplayNumber: null, // 每行最多显示
  indicatorSegmentation: '', // 指标块分割
  indicatorSplitColor: '', // 分割线颜色
  indicatorMargin: '' // 指标块间距
})

// 指标内容
const indicatorContent = ref({
  indicatorContentPosition: '', // 内容在指标块中位置
  indicatorDataAlign: '', // 与指标对齐方式
  indicatorValueSpace: '', // 指标值行间距
  dimensionName: '', // 显示维度名称
  indicatorDisplayName: '', // 显示主指标名称
  // 字号设置
  // 维度
  dimensionColor: '',
  dimensionSize: '',
  dimensionWeight: '',
  dimensionStyle: '',
  // 主指标 - 名称
  indicatorPrimaryTextColor: '',
  indicatorPrimaryTextSize: '',
  indicatorPrimaryTextWeight: '',
  indicatorPrimaryTextStyle: '',

  // 主指标 - 数值
  indicatorPrimaryNumberColor: '',
  indicatorPrimaryNumberSize: '',
  indicatorPrimaryNumberWeight: '',
  indicatorPrimaryNumberStyle: '',

  // 副指标
  indicatorAssistantTextSizeStyle: '', // 副指标 - Size
  indicatorAssistantTextStyle: '', // 副指标 - Style
  indicatorAssistantName: '', // 副指标 - 名称 Color
  indicatorAssistantNumber: '', // 副指标 - 数值 Color

  // 指标
  indicatorTotalTextSizeStyle: '',
  indicatorTotalTextStyle: '',
  indicatorTotalName: '',
  indicatorTotalNumber: '',

  // 指标修饰符
  modifiedPosition: '',
  modifiedStyle: ''
})

// 系列设置
const seriesSetting = ref({
  seriesSelect: '', // 选择系列
  indicatorDataPrefix: '', // 指标数据值 前缀
  indicatorDataSuffix: '' // 指标数据值 后缀
})

// 指标布局
const getIndicatorLayout = (store: any) => {
  const indicatorLayoutData = store.styles?.[chartConfigKey.indicatorLayout]
  indicatorLayout.value = {
    indicatorRelation: indicatorLayoutData?.[chartConfigKey.indicatorRelation],
    indicatorDisplayMethod: indicatorLayoutData?.[chartConfigKey.indicatorDisplayMethod],
    indicatorDisplayNumber: indicatorLayoutData?.[chartConfigKey.indicatorDisplayNumber],
    indicatorSegmentation: indicatorLayoutData?.[chartConfigKey.indicatorSegmentation],
    indicatorSplitColor: indicatorLayoutData?.[chartConfigKey.indicatorSplitColor],
    indicatorMargin: indicatorLayoutData?.[chartConfigKey.indicatorMargin]
  }
}

// 指标内容
const getIndicatorContent = (store: any) => {
  const indicatorContentData = store.styles?.[chartConfigKey.indicatorContent]
  const indicatorStyle = indicatorContentData?.[chartConfigKey.indicatorTextStyle]
  const { color, fontSize, fontWeight, fontStyle } = getTextConfigData(
    dimensionStyleWrapperKey,
    indicatorStyle
  )
  const indicatorPrimaryStyle = indicatorStyle?.[chartConfigKey.indicatorPrimaryStyle]
  const {
    color: color1,
    fontSize: fontSize1,
    fontWeight: fontWeight1,
    fontStyle: fontStyle1
  } = getTextConfigData(indicatorPrimaryTextStyleWrapperKey, indicatorPrimaryStyle)
  const {
    color: color2,
    fontSize: fontSize2,
    fontWeight: fontWeight2,
    fontStyle: fontStyle2
  } = getTextConfigData(indicatorPrimaryNumberStyleWrapperKey, indicatorPrimaryStyle)
  const indicatorAssistant = indicatorStyle?.[chartConfigKey.indicatorAssistant]
  const indicatorTotal = indicatorStyle?.[chartConfigKey.indicatorTotal]
  const modifiedSwitch = indicatorContentData?.[chartConfigKey.modifiedSwitch]
  const modifiedDrawing = indicatorContentData?.[chartConfigKey.modifiedDrawing]

  indicatorContent.value = {
    indicatorContentPosition: indicatorContentData?.[chartConfigKey.indicatorContentPosition],
    indicatorDataAlign: indicatorContentData?.[chartConfigKey.indicatorAlign],
    indicatorValueSpace: indicatorContentData?.[chartConfigKey.indicatorValueSpace],
    dimensionName: indicatorContentData?.[chartConfigKey.dimensionName],
    indicatorDisplayName: indicatorContentData?.[chartConfigKey.indicatorDisplayName],
    dimensionColor: color,
    dimensionSize: fontSize,
    dimensionWeight: fontWeight,
    dimensionStyle: fontStyle,
    indicatorPrimaryTextColor: color1,
    indicatorPrimaryTextSize: fontSize1,
    indicatorPrimaryTextWeight: fontWeight1,
    indicatorPrimaryTextStyle: fontStyle1,
    indicatorPrimaryNumberColor: color2,
    indicatorPrimaryNumberSize: fontSize2,
    indicatorPrimaryNumberWeight: fontWeight2,
    indicatorPrimaryNumberStyle: fontStyle2,

    indicatorAssistantTextSizeStyle:
      indicatorAssistant?.[chartConfigKey.indicatorAssistantTextSizeStyle],
    indicatorAssistantTextStyle: indicatorAssistant?.[chartConfigKey.indicatorAssistantTextStyle],
    indicatorAssistantName: indicatorAssistant?.[chartConfigKey.indicatorAssistantName],
    indicatorAssistantNumber: indicatorAssistant?.[chartConfigKey.indicatorAssistantNumber],

    indicatorTotalTextSizeStyle: indicatorTotal?.[chartConfigKey.indicatorTotalTextSizeStyle],
    indicatorTotalTextStyle: indicatorTotal?.[chartConfigKey.indicatorTotalTextStyle],
    indicatorTotalName: indicatorTotal?.[chartConfigKey.indicatorTotalName],
    indicatorTotalNumber: indicatorTotal?.[chartConfigKey.indicatorTotalNumber],

    modifiedPosition: modifiedSwitch ? modifiedDrawing?.[chartConfigKey.modifiedPosition] : '',
    modifiedStyle: modifiedSwitch ? modifiedDrawing?.[chartConfigKey.modifiedStyle] : ''
  }
}

// 系列设置
const getSeriesSetting = (store: any) => {
  const seriesSettingData = store.styles?.[chartConfigKey.seriesSetting]
  const seriesSettingSelect = seriesSettingData?.['keymap_wrapper']
  if (seriesSettingSelect) {
    const seriesLabel = seriesSettingSelect[seriesSetting.value.seriesSelect]
    // 指标数据值前后缀
    const prefixSuffix = seriesLabel?.[chartConfigKey.indicatorDataPrefixSuffix]
    seriesSetting.value = {
      seriesSelect: Object.keys(seriesSettingSelect)[0],
      indicatorDataPrefix: prefixSuffix?.[chartConfigKey.indicatorDataPrefix],
      indicatorDataSuffix: prefixSuffix?.[chartConfigKey.indicatorDataSuffix]
    }
  }
}

// 条件格式   先不做
const conditionalFormat = (store: any) => {}

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    updateChartWithoutDom: async (store) => {
      useData.value = []
      const dimensions = store?.fields?.dimensions as Field[]
      const measurements = store?.fields?.measurements as Field[]
      const legends = store?.fields?.legends as Field[]
      const tooltips = store?.fields?.tooltips as Field[]

      if (measurements?.length) {
        const originChartData = await loadData(dimensions.concat(measurements, legends, tooltips))
        const { classKey } = groupChartDataByFields(originChartData, dimensions, measurements)

        originChartData.forEach((dataItem) => {
          let measureArr = []
          measurements.forEach((item) => {
            measureArr.push({
              name: item.name,
              value: dataItem[item.name]
            })
          })
          useData.value.push({
            title: dataItem[classKey],
            measureInfo: measureArr
          })

          provideData(originChartData)
        })
      }
    },
    updateStoreWithoutDom: (store) => {
      // 指标数据
      getIndicatorLayout(store)
      // 列标题
      getIndicatorContent(store)
      // 序号
      getSeriesSetting(store)
      // 条件格式
      conditionalFormat(store)
    },
    loadChartWithoutDom: (store) => {}
  }
})
</script>

<style lang="scss" scoped></style>
