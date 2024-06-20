import { defineAsyncComponent } from 'vue'

import {
  getChartIDAndName,
  ChartCategory,
  ChartName,
  defineChart,
  defineChartConfig,
  defineField,
  FieldClass,
  defineStyles,
  defineAxesConfig,
  defineCollapse,
  defineTooltipConfig,
  type ChartStore
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.BUBBLE_OR_SCATTER,
  ChartName.SCATTER_CHART
)
export const tooltipConfigStyleTextStyleWrapperKey = 'tooltipConfigStyleTextStyle'

export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'xAxis',
      label: 'X轴',
      fieldClass: FieldClass.DIMENSION,
      required: true,
      fieldsNumLimit: 1
    }),
    defineField({
      key: 'yAxis',
      label: 'Y轴',
      fieldClass: FieldClass.MEASUREMENT,
      required: true,
      fieldsNumLimit: 1
    }),
    defineField({
      key: 'category',
      label: '类别',
      fieldClass: FieldClass.DIMENSION,
      fieldsNumLimit: 1
    }),
    defineField({
      key: 'color',
      label: '颜色',
      fieldClass: FieldClass.DIMENSION,
      fieldsNumLimit: 1
    }),
    defineField({
      key: 'playbackAxis',
      label: '播放轴',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 1
    }),
    defineField({
      key: 'tooltips',
      label: '工具提示',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 5
    }),
    defineField({
      key: 'filters',
      label: '过滤器'
    })
  ],
  styles: defineStyles({ componentName }, [
    defineAxesConfig(['x', 'y']),
    defineCollapse({
      key: tooltipConfigStyleTextStyleWrapperKey,
      label: '工具提示',
      children: [
        ...defineTooltipConfig(
          tooltipConfigStyleTextStyleWrapperKey,
          {
            isShowData: false,
            isShowDimension: false,
            isShowMethod: false
          },
          ''
        )
      ]
    })
  ]),
  analyses: []
})
export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_ScatterPlot',
  name: componentName,
  description: '用来展示数据的相关性和分布关系',
  dimensionDescription: 'X轴可选1个维度',
  measureDescription: 'X轴可选1个维度；Y轴必选一个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
