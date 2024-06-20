<template>
  <div>
    <TableList
      :rowsData="originChartData"
      :headers="headersData"
      :frameStyle="frameStyle"
      :mainColor="mainColor"
      :measureValueStyle="measureValueStyle"
      :headerStyle="headerStyle"
      :headerRowStyle="headerRowStyle"
    ></TableList>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TableList from './TableList'
import {
  ChartName,
  useChart,
  type ChartProps,
  type Field,
  groupChartDataByFields,
  getTextConfigData
} from '../../shortcut'

import {
  componentID,
  chartConfigKey,
  basicTextWrapperKey,
  headerTextWrapperKey,
  headerRowTextWrapperKey
} from './config'
defineOptions({
  name: ChartName.TABLE_CROSSTAB
})
const props = withDefaults(defineProps<ChartProps>(), {})
const originChartData = ref()
const headersData = ref<string[]>([])
// 表格框架样式
const frameStyle = ref()
// 主色系
const mainColor = ref()
// 度量值样式
const measureValueStyle = ref()
// 表头样式
const headerStyle = ref({
  headerText: {},
  headerBackground: '',
  noShow: false
})
const headerRowStyle = ref({
  headerText: {},
  headerBackground: ''
})
const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    updateChartWithoutDom: async (store) => {
      const dimensions = store?.fields?.dimensions as Field[]
      const measurements = store?.fields?.measurements as Field[]
      const legends = store?.fields?.legends as Field[]
      const tooltips = store?.fields?.tooltips as Field[]

      if (dimensions?.length && measurements?.length) {
        headersData.value = []
        originChartData.value = await loadData(dimensions.concat(measurements, legends, tooltips))
        dimensions.forEach((item) => {
          headersData.value.push(item.name)
        })
        measurements.forEach((item) => {
          headersData.value.push(item.name)
        })
        console.log('headersData.value', headersData)
      }
    },
    updateStoreWithoutDom: (store) => {
      frameStyle.value =
        store.styles?.[chartConfigKey.tableBasicStyle]?.[chartConfigKey.tableBasicFrameStyle]
      mainColor.value =
        store.styles?.[chartConfigKey.tableBasicStyle]?.[chartConfigKey.tableMainColor]
      if (mainColor.value === 'custom') {
        mainColor.value =
          store.styles?.[chartConfigKey.tableBasicStyle]?.[chartConfigKey.tableEvenCustomColor]
      }
      measureValueStyle.value = getTextConfigData(
        basicTextWrapperKey,
        store.styles?.[chartConfigKey.tableBasicStyle]
      )
      // 列表头
      headerStyle.value.headerBackground =
        store.styles?.[chartConfigKey.headerStyle]?.[chartConfigKey.headerColumnStyle]?.[
          chartConfigKey.headerColumnBackground
        ]
      headerStyle.value.headerText = getTextConfigData(
        headerTextWrapperKey,
        store.styles?.[chartConfigKey.headerStyle]?.[chartConfigKey.headerColumnStyle]
      )
      headerStyle.value.noShow =
        store.styles?.[chartConfigKey.headerStyle]?.[chartConfigKey.headerColumnStyle]?.[
          chartConfigKey.headerColumnDisplay
        ]
      // 行表头
      headerRowStyle.value.headerBackground =
        store.styles?.[chartConfigKey.headerStyle]?.[chartConfigKey.headerRowStyle]?.[
          chartConfigKey.headerRowBackground
        ]
      headerRowStyle.value.headerText = getTextConfigData(
        headerRowTextWrapperKey,
        store.styles?.[chartConfigKey.headerStyle]?.[chartConfigKey.headerRowStyle]
      )
    },

    loadChartWithoutDom: (store) => {}
  }
})
</script>
