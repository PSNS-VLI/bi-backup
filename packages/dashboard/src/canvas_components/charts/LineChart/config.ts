import { defineAsyncComponent } from 'vue'

import {
  getChartIDAndName,
  ChartCategory,
  ChartName,
  defineField,
  FieldClass,
  defineChart,
  defineChartConfig,
  defineConfigKey,
  defineStyles,
  defineAxesConfig,
  defineCollapse,
  defineLegendConfig,
  defineCheckbox,
  defineSelect,
  defineTextConfig,
  defineRadioGroup,
  defineDataTagConfig,
  defineCheckboxWrapper,
  getChartConfigData,
  defineTooltipConfig,
  type ChartStore,
  getAxesConfigData,
  type Field
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.LINE_OR_PLANE,
  ChartName.LINE_CHART
)
export const chartConfigKey = defineConfigKey(componentID, [
  'dataTagSwitchKey',
  // series
  'seriesConfig',
  'seriesConfigDataTag',
  'seriesConfigShowDataTag',
  'seriesConfigDataTagPosition',
  'seriesConfigDataTagStyle',
  'seriesConfigDataTagStyleColor',
  'seriesConfigDataTagStyleFontSize',
  'seriesConfigDataTagStyleTextStyle',
  'seriesConfigShowMax',
  // assist
  'assistConfig',
  'assistConfigAbbreviation'
])
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
      children: [fullDisplay, position, text],
      switcherKey: 'dataTagSwitchKey'
    }),
    defineCollapse({
      key: tooltipConfigStyleTextStyleWrapperKey,
      label: '工具提示',
      children: [...defineTooltipConfig(tooltipConfigStyleTextStyleWrapperKey, {}, '')]
    }),
    defineCollapse({
      key: chartConfigKey.seriesConfig,
      label: '系列设置',
      children: [
        defineSelect({
          key: '',
          label: '标签',
          optionsComputer: {
            chartStoreComputer: (configStore) => {
              const fields = configStore.fields?.dimensions

              return Array.isArray(fields)
                ? fields.map((item, index) => ({
                    label: `${item.name}${index}`,
                    value: `${item.name}${index}`
                  }))
                : []
            },
            chartDataComputer: (chartData) => {
              const data = chartData[0] ?? {}
              return Object.keys(data).map((key) => ({
                label: key,
                value: key
              }))
            }
          }
        }),
        defineCheckboxWrapper({
          key: chartConfigKey.seriesConfigDataTag,
          checkboxKey: chartConfigKey.seriesConfigShowDataTag,
          label: '显示数据标签',
          children: [
            defineSelect({
              key: chartConfigKey.seriesConfigDataTagPosition,
              label: '位置',
              inline: true,
              options: [
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
            }),
            defineTextConfig(tooltipConfigStyleTextStyleWrapperKey)
          ]
        }),
        defineCheckbox({
          key: chartConfigKey.seriesConfigShowMax,
          label: '显示最值'
        })
      ]
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
  icon: 'icon-Chart_Line',
  name: componentName,
  description: '用来展示在一定时间间隔下数据的趋势走向。',
  dimensionDescription: '最少1个维度',
  measureDescription: '最少1个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
