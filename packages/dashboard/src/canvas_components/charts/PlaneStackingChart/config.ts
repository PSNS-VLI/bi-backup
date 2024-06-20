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
  defineCollapse,
  defineLegendConfig,
  defineTooltipConfig,
  defineDataTagConfig,
  defineConfigKey,
  defineRadioGroup,
  getChartConfigData,
  getTooltipConfigData,
  getAxesConfigData,
  defineAxesConfig,
  type ChartStore
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.LINE_OR_PLANE,
  ChartName.PLANE_STACKING
)
const legendConfigLegendStyleWrapperKey = 'legendConfigLegendStyle'
export const dataTagConfigStyleWrapperKey = 'dataTagConfigStyle'
export const tooltipConfigStyleTextStyleWrapperKey = 'tooltipConfigStyleTextStyle'

const checkboxContentOptions = [
  {
    label: '度量',
    value: 'measurement'
  },
  {
    label: '占比',
    value: 'percent'
  },
  {
    label: '总计',
    value: 'total'
  }
]
const checkboxContentDefault = ['dimensionality', 'measurement']

const labelPosition = [
  {
    label: '自动',
    value: 'auto'
  },
  {
    label: '线上方',
    value: 'top'
  },
  {
    label: '线下方',
    value: 'bottom'
  }
]
const labelPositionDefault = 'top'
const [fullDisplay, content, text, digit, position] = [
  ...defineDataTagConfig(dataTagConfigStyleWrapperKey, {
    checkboxContentOptions,
    checkboxContentDefault,
    labelPosition,
    labelPositionDefault
  })
]
export const chartConfigKey = defineConfigKey(componentID, [
  'assistConfig',
  'assistConfigAbbreviation'
])
export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'dimensions',
      label: '类别轴',
      fieldClass: FieldClass.DIMENSION,
      required: true
    }),
    defineField({
      key: 'measurements',
      label: '值轴',
      fieldClass: FieldClass.MEASUREMENT,
      required: true
    }),
    defineField({
      key: 'legends',
      label: '颜色图例',
      fieldClass: FieldClass.DIMENSION,
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
      key: legendConfigLegendStyleWrapperKey,
      label: '图例',
      children: [...defineLegendConfig(legendConfigLegendStyleWrapperKey)]
    }),
    defineCollapse({
      key: dataTagConfigStyleWrapperKey,
      label: '数据标签',
      children: [content, fullDisplay, position, text]
    }),
    defineCollapse({
      key: tooltipConfigStyleTextStyleWrapperKey,
      label: '工具提示',
      children: [...defineTooltipConfig(tooltipConfigStyleTextStyleWrapperKey, {}, '')]
    }),
    defineCollapse({
      key: chartConfigKey.assistConfig,
      label: '辅助展示',
      children: [
        defineRadioGroup({
          key: chartConfigKey.assistConfigAbbreviation,
          label: '显示缩略轴',
          options: [
            {
              label: '智能适配',
              value: 'a'
            },
            {
              label: '显示',
              value: 'b'
            },
            {
              label: '不显示',
              value: 'c'
            }
          ],
          default: 'a'
        })
      ]
    })
  ]),
  analyses: []
})
export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {
  mark.axis(getAxesConfigData(['x', 'y'], chartConfigStore.styles))

  mark.legend('color', {
    ...getChartConfigData(legendConfigLegendStyleWrapperKey, chartConfigStore.styles)
  })
}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_StackedArea',
  name: componentName,
  description: '用来显示每个数值所占大小随时间或类别变化的趋势线，展示的是部分与整体的关系。',
  dimensionDescription: '最少1个维度',
  measureDescription: '最少1个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
