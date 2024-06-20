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
  defineSelect,
  defineCheckbox,
  defineTextConfig,
  getChartConfigData,
  defineKeymapWrapper,
  getTooltipConfigData,
  defineAxesConfig,
  getAxesConfigData,
  type ChartStore
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.LINE_OR_PLANE,
  ChartName.PLANE_CHART
)
const legendConfigLegendStyleWrapperKey = 'legendConfigLegendStyle'
export const dataTagConfigStyleWrapperKey = 'dataTagConfigStyle'
export const tooltipConfigStyleTextStyleWrapperKey = 'tooltipConfigStyleTextStyle'
export const seriesLabelTextWrapperKey = 'seriesLabelText'

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
  'dataTagSwitchKey',
  'assistConfig',
  'assistConfigAbbreviation',

  'seriesSetting',
  'seriesChoose',
  'showDataLabel',
  'labelPosition',
  'showExtremeValue'
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
      children: [fullDisplay, position, text],
      switcherKey: 'dataTagSwitchKey'
    }),
    defineCollapse({
      key: tooltipConfigStyleTextStyleWrapperKey,
      label: '工具提示',
      children: [...defineTooltipConfig(tooltipConfigStyleTextStyleWrapperKey, {}, '')]
    }),
    defineCollapse({
      key: chartConfigKey.seriesSetting,
      label: '系列设置',
      children: [
        defineKeymapWrapper({
          displayController: (configStore) => {
            return configStore.fields.dimensions?.length
          },
          key: 'keymap_wrapper',
          mapper: defineSelect({
            key: '',
            // key: chartConfigKey.seriesSettingSelect,
            label: '请选择系列',
            options: [
              {
                label: 'age',
                value: 'age'
              }
            ],
            optionsComputer: {
              chartStoreComputer: (configStore) => {
                const fields = configStore.fields?.measurements
                return Array.isArray(fields)
                  ? fields.map((item, index) => ({
                      label: `${item.name}`,
                      value: `${item.name}`
                    }))
                  : []
              }
            }
          }),
          children: [
            defineCheckbox({
              key: chartConfigKey.showDataLabel,
              label: '显示数据标签',
              default: true
            }),
            defineSelect({
              key: chartConfigKey.labelPosition,
              label: '位置',
              options: labelPosition
            }),
            defineTextConfig(seriesLabelTextWrapperKey),
            defineCheckbox({
              key: chartConfigKey.showExtremeValue,
              label: '显示最值'
            })
          ]
        })
      ]
    })
    // defineCollapse({
    //   key: chartConfigKey.assistConfig,
    //   label: '辅助展示',
    //   children: [
    //     defineRadioGroup({
    //       key: chartConfigKey.assistConfigAbbreviation,
    //       label: '显示缩略轴',
    //       options: [
    //         {
    //           label: '智能适配',
    //           value: 'a'
    //         },
    //         {
    //           label: '显示',
    //           value: 'b'
    //         },
    //         {
    //           label: '不显示',
    //           value: 'c'
    //         }
    //       ],
    //       default: 'a'
    //     })
    //   ]
    // })
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
  icon: 'icon-Chart_Area',
  name: componentName,
  description: '用来展示在一定时间内数据的趋势走向以及他们所占的面积比例。',
  dimensionDescription: '最少1个维度',
  measureDescription: '最少1个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
