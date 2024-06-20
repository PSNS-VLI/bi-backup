import { defineAsyncComponent } from 'vue'
import { type MarkNode } from '@antv/g2'

import {
  // general
  getChartIDAndName,
  defineChart,
  ChartCategory,
  ChartName,
  FieldClass,
  // define-macro
  defineConfigKey,
  defineStyles,
  defineField,
  defineFieldFilter,
  defineAxesConfig,
  getAxesConfigData,
  // define-config
  defineCollapse,
  defineChartConfig,
  defineCheckbox,
  defineCheckboxGroup,
  defineRadioGroup,
  defineRadioGroupNest,
  defineInputNumber,
  defineSelect,
  defineColorPicker,
  defineTextStyle,
  defineTextWrapper,
  defineCheckboxWrapper,
  defineKeymapWrapper,
  type ChartStore
} from '../../shortcut'

export const { componentID, componentName, componentTitle } = getChartIDAndName(
  ChartCategory.COLUMN_OR_BAR,
  ChartName.BAR_CHART
)

export const chartConfigKey = defineConfigKey(componentID, [
  // legend
  'legendConfig',
  'legendConfigLegendPosition',
  'legendConfigLegendPositionDirection',
  'legendConfigLegendPositionAlign',
  'legendConfigLegendStyle',
  'legendConfigLegendStyleColor',
  'legendConfigLegendStyleFontSize',
  'legendConfigLegendStyleTextStyle',
  // datatag
  'dataTagConfig',
  'dataTagConfigFullDispaly',
  'dataTagConfigPosition',
  'dataTagConfigStyle',
  'dataTagConfigStyleColor',
  'dataTagConfigStyleFontSize',
  'dataTagConfigStyleTextStyle',
  // tooltip
  'tooltipConfig',
  'tooltipConfigDisplayMethod',
  'tooltipConfigContent',
  'tooltipConfigBackgroundColor',
  'tooltipConfigStyle',
  'tooltipConfigStyleColor',
  'tooltipConfigStyleFontSize',
  'tooltipConfigStyleTextStyle',
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
    defineFieldFilter({
      key: 'filters',
      label: '过滤器'
    })
  ],
  styles: defineStyles({ componentName }, [
    defineAxesConfig(['x', 'y']),
    defineCollapse({
      key: chartConfigKey.legendConfig,
      label: '图例',
      children: [
        defineRadioGroupNest('RADIO_ICON_GROUP', 'RADIO_TAB', {
          key: chartConfigKey.legendConfigLegendPosition,
          label: '位置',
          keyMap: {
            levelOne: chartConfigKey.legendConfigLegendPositionDirection,
            levelTwo: chartConfigKey.legendConfigLegendPositionAlign
          },
          options: [
            {
              label: '上',
              iconClass: 'icon-Up',
              value: 'top',
              options: [
                {
                  label: '居左',
                  value: 'left'
                },
                {
                  label: '居中',
                  value: 'center'
                },
                {
                  label: '居右',
                  value: 'right'
                }
              ]
            },
            {
              label: '下',
              iconClass: 'icon-Down',
              value: 'bottom',
              options: [
                {
                  label: '居左',
                  value: 'left'
                },
                {
                  label: '居中',
                  value: 'center'
                },
                {
                  label: '居右',
                  value: 'right'
                }
              ]
            },
            {
              label: '左',
              iconClass: 'icon-Left',
              value: 'left',
              options: [
                {
                  label: '居上',
                  value: 'top'
                },
                {
                  label: '居中',
                  value: 'center'
                },
                {
                  label: '居下',
                  value: 'bottom'
                }
              ]
            },
            {
              label: '右',
              iconClass: 'icon-Right',
              value: 'right',
              options: [
                {
                  label: '居上',
                  value: 'top'
                },
                {
                  label: '居中',
                  value: 'center'
                },
                {
                  label: '居下',
                  value: 'bottom'
                }
              ]
            }
          ],
          default: {
            levelOne: 'top',
            levelTwo: 'center'
          }
        }),
        defineTextWrapper({
          key: chartConfigKey.legendConfigLegendStyle,
          label: '文本',
          inline: true,
          children: [
            defineColorPicker({
              key: chartConfigKey.legendConfigLegendStyleColor,
              label: '',
              inline: true
            }),
            defineInputNumber({
              key: chartConfigKey.legendConfigLegendStyleFontSize,
              label: '',
              prefixIcon: 'icon-monitor',
              suffix: 'px',
              attribute: {
                min: 12
              },
              inline: true
            }),
            defineTextStyle({
              key: chartConfigKey.legendConfigLegendStyleTextStyle,
              label: '',
              layouts: ['fontWeight', 'fontStyle'],
              inline: true
            })
          ]
        })
      ]
    }),
    defineCollapse({
      key: chartConfigKey.dataTagConfig,
      label: '数据标签',
      children: [
        defineCheckbox({
          key: chartConfigKey.dataTagConfigFullDispaly,
          label: '全量显示'
        }),
        defineSelect({
          key: chartConfigKey.dataTagConfigPosition,
          label: '位置',
          inline: true,
          options: [
            {
              label: '自动',
              value: 'auto'
            },
            {
              label: '柱顶外侧',
              value: 'top-out'
            },
            {
              label: '内部贴顶',
              value: 'inner-out'
            },
            {
              label: '内部中心',
              value: 'inner-center'
            }
          ]
        }),
        defineTextWrapper({
          key: chartConfigKey.dataTagConfigStyle,
          label: '文本',
          inline: true,
          children: [
            defineColorPicker({
              key: chartConfigKey.dataTagConfigStyleColor,
              label: '',
              inline: true
            }),
            defineInputNumber({
              key: chartConfigKey.dataTagConfigStyleFontSize,
              label: '',
              prefixIcon: 'icon-monitor',
              suffix: 'px',
              attribute: {
                min: 12
              },
              inline: true
            }),
            defineTextStyle({
              key: chartConfigKey.dataTagConfigStyleTextStyle,
              label: '',
              layouts: ['fontWeight', 'fontStyle'],
              inline: true
            })
          ]
        })
      ]
    }),
    defineCollapse({
      key: chartConfigKey.tooltipConfig,
      label: '工具提示',
      children: [
        defineRadioGroup({
          key: chartConfigKey.tooltipConfigDisplayMethod,
          label: '展示方式',
          options: [
            {
              label: '按单数据点',
              value: 'a'
            },
            {
              label: '按维值',
              value: 'b'
            }
          ],
          default: 'a'
        }),
        defineCheckboxGroup({
          key: chartConfigKey.tooltipConfigContent,
          label: '内容',
          inline: true,
          options: [
            {
              label: '占比',
              value: 'proportion'
            }
          ]
        }),
        defineColorPicker({
          key: chartConfigKey.tooltipConfigBackgroundColor,
          label: '背景色',
          inline: true
        }),
        defineTextWrapper({
          key: chartConfigKey.tooltipConfigStyle,
          label: '文本',
          inline: true,
          children: [
            defineColorPicker({
              key: chartConfigKey.tooltipConfigStyleColor,
              label: '',
              inline: true
            }),
            defineInputNumber({
              key: chartConfigKey.tooltipConfigStyleFontSize,
              label: '',
              prefixIcon: 'icon-monitor',
              suffix: 'px',
              attribute: {
                min: 12
              },
              inline: true
            }),
            defineTextStyle({
              key: chartConfigKey.tooltipConfigStyleTextStyle,
              label: '',
              layouts: ['fontWeight', 'fontStyle'],
              inline: true
            })
          ]
        })
      ]
    }),
    defineCollapse({
      key: chartConfigKey.seriesConfig,
      label: '系列设置',
      children: [
        defineKeymapWrapper({
          displayController: (configStore) => {
            return configStore.fields.dimensions?.length
          },
          key: 'keymap_wrapper',
          mapper: defineRadioGroup({
            key: '',
            label: '标签',
            options: [
              {
                label: 'age',
                value: 'age'
              }
            ],
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
            },
            default: ''
          }),
          children: [
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
                      label: '柱顶外侧',
                      value: 'top-out'
                    },
                    {
                      label: '内部贴顶',
                      value: 'inner-out'
                    },
                    {
                      label: '内部中心',
                      value: 'inner-center'
                    }
                  ]
                }),
                defineTextWrapper({
                  key: chartConfigKey.seriesConfigDataTagStyle,
                  label: '文本',
                  inline: true,
                  children: [
                    defineColorPicker({
                      key: chartConfigKey.seriesConfigDataTagStyleColor,
                      label: '',
                      inline: true
                    }),
                    defineInputNumber({
                      key: chartConfigKey.seriesConfigDataTagStyleFontSize,
                      label: '',
                      prefixIcon: 'icon-monitor',
                      suffix: 'px',
                      attribute: {
                        min: 12
                      },
                      inline: true
                    }),
                    defineTextStyle({
                      key: chartConfigKey.seriesConfigDataTagStyleTextStyle,
                      label: '',
                      layouts: ['fontWeight', 'fontStyle'],
                      inline: true
                    })
                  ]
                })
              ]
            }),
            defineCheckbox({
              key: chartConfigKey.seriesConfigShowMax,
              label: '显示最值'
            })
          ]
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
}

export default defineChart(chartConfig, {
  id: componentID,
  name: componentName,
  title: componentTitle,
  icon: 'icon-Chart_Column',
  description: '用来展示表中某个字段的汇总值，例如求和、平均值、最大值和最小值。',
  dimensionDescription: '不限制维度个数',
  measureDescription: '不限制度量个数',
  component: defineAsyncComponent(() => import('./index.vue'))
})
