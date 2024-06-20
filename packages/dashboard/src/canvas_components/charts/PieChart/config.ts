import { defineAsyncComponent } from 'vue'
import type { MarkNode } from '@antv/g2'

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
  defineInput,
  // define-config
  defineCollapse,
  defineSubCollapse,
  defineChartConfig,
  defineTextConfig,
  defineCheckbox,
  defineCheckboxGroup,
  defineRadioIconGroup,
  defineInputNumber,
  defineSelect,
  defineColorPicker,
  defineTextWrapper,
  type ChartStore,
  defineLegendConfig,
  defineDataTagConfig,
  getChartConfigData,
  defineTooltipConfig
} from '../../shortcut'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.PIE_OR_RING,
  ChartName.PIE_CHART
)

export const chartConfigKey = defineConfigKey(componentID, [
  // area
  'sectorAreaConfig',
  'legendSwitch',
  'legendConfigLegendStyle',
  'legendConfigLegendLabelContent',
  'legendConfigLegendLabelContentDetail',
  'legendConfigLegendLabelContentMeasurement',
  'legendConfigLegendLabelContentProportion',

  //total
  'totalSwitch',
  'totalConfig',
  'totalConfigTitle',

  // series
  'seriesConfig',
  'seriesConfigSelectColumn',
  'seriesConfigTiTle',

  'auxiliaryDisplayConfig',
  'auxiliaryDisplayConfigTitle',
  'auxiliaryDisplayConfigShow',
  'auxiliaryDisplayConfigSelected'
])
const legendConfigLegendStyleWrapperKey = 'legendConfigLegendStyle'
export const dataTagConfigStyleWrapperKey = 'dataTagConfigStyle'
export const tooltipConfigStyleTextStyleWrapperKey = 'tooltipConfigStyleTextStyle'
export const totalConfigStyleTitleWrapperKey = 'totalConfigStyleTitle'
const checkboxContentOptions = [
  {
    label: '维度',
    value: 'dimensionality'
  },
  {
    label: '度量',
    value: 'measurement'
  },
  {
    label: '占比',
    value: 'proportion'
  }
]
const checkboxContentDefault = ['dimensionality', 'measurement', 'proportion']

const [fullDisplay, content, text, digit] = [
  ...defineDataTagConfig(dataTagConfigStyleWrapperKey, {
    checkboxContentOptions,
    checkboxContentDefault
  })
]
export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'dimensions',
      label: '扇区标签',
      fieldClass: FieldClass.DIMENSION,
      required: true
    }),
    defineField({
      key: 'measurements',
      label: '扇区角度',
      fieldClass: FieldClass.MEASUREMENT,
      required: true
    }),
    defineField({
      key: 'tooltips',
      label: '工具提示',
      fieldClass: FieldClass.MEASUREMENT
    }),
    defineField({
      key: 'filters',
      label: '过滤器'
    })
  ],
  styles: defineStyles({ componentName }, [
    defineCollapse({
      key: chartConfigKey.sectorAreaConfig,
      label: '扇形区域',
      children: [
        defineRadioIconGroup({
          key: chartConfigKey.sectorAreaConfigChangeStyle,
          label: '可视化样式切换',
          hideOptionLabel: false,
          options: [
            {
              label: '饼形',
              value: 'pie',
              iconClass: 'icon-cq-piechat'
            },
            {
              label: '环形',
              value: 'cycle',
              iconClass: 'icon-chart_Cyclegraph'
            }
          ],
          default: 'pie'
        }),
        defineInputNumber({
          key: chartConfigKey.sectorAreaConfigRadius,
          label: '半径占比',
          suffix: '%',
          inline: true
        }),
        defineCheckbox({
          key: chartConfigKey.sectorAreaConfigMerge,
          label: '合并数据为其他'
        })
      ]
    }),
    defineCollapse({
      key: legendConfigLegendStyleWrapperKey,
      label: '图例',
      children: [
        ...defineLegendConfig(legendConfigLegendStyleWrapperKey),
        defineSubCollapse({
          key: chartConfigKey.legendConfigLegendLabelContent,
          label: '显示标签内容',
          type: 'collapse',
          children: [
            defineCheckboxGroup({
              key: chartConfigKey.legendConfigLegendLabelContentDetail,
              label: '内容',
              inline: true,
              options: [
                {
                  label: '度量',
                  value: 'measurement'
                },
                {
                  label: '占比',
                  value: 'proportion'
                }
              ],
              default: ['measurement']
            }),
            defineInputNumber({
              key: chartConfigKey.dataTagConfigStyleFontSize,
              label: '与主图例间距',
              prefixIcon: '',
              suffix: 'px',
              attribute: {
                min: 0
              },
              inline: true
            }),
            defineTextWrapper({
              key: chartConfigKey.legendConfigLegendStyle,
              label: '文本样式',
              children: [
                defineColorPicker({
                  key: chartConfigKey.legendConfigLegendLabelContentMeasurement,
                  label: '度量',
                  inline: true
                }),
                defineColorPicker({
                  key: chartConfigKey.legendConfigLegendLabelContentProportion,
                  label: '占比',
                  inline: true
                })
              ]
            })
          ]
        })
      ],
      switcherKey: chartConfigKey.legendSwitch
    }),
    defineCollapse({
      key: dataTagConfigStyleWrapperKey,
      label: '数据标签',
      children: [fullDisplay, content, text, digit]
    }),
    defineCollapse({
      key: tooltipConfigStyleTextStyleWrapperKey,
      label: '工具提示',
      children: [
        ...defineTooltipConfig(
          tooltipConfigStyleTextStyleWrapperKey,
          {
            isShowDimension: false,
            isShowMethod: false
          },
          ''
        )
      ]
    }),
    defineCollapse({
      key: chartConfigKey.totalConfig,
      label: '总计',
      children: [
        defineInput({
          key: chartConfigKey.totalConfigTitle,
          label: '自定义名称',
          placeholder: '请输入总计名',
          inline: true
        }),
        defineTextConfig(totalConfigStyleTitleWrapperKey)
      ],
      switcherKey: chartConfigKey.totalSwitch
    }),
    defineCollapse({
      key: chartConfigKey.seriesConfig,
      label: '系列设置',
      children: [
        defineSelect({
          key: chartConfigKey.seriesConfigSelectColumn,
          label: '请选择系列',
          options: [
            {
              label: '0',
              value: 'zero'
            },
            {
              label: '1',
              value: 'one'
            },
            {
              label: '2',
              value: 'two'
            }
          ],
          default: 'two'
        }),
        defineInput({
          key: chartConfigKey.seriesConfigTiTle,
          label: '别名',
          placeholder: '',
          inline: true
        })
      ]
    })
    // defineCollapse({
    //   key: chartConfigKey.auxiliaryDisplayConfig,
    //   label: '辅助展示',
    //   children: [
    //     defineCheckboxWrapper({
    //       key: chartConfigKey.auxiliaryDisplayConfigTitle,
    //       label: '开启指标筛选展示',
    //       checkboxKey: chartConfigKey.auxiliaryDisplayConfigShow,
    //       children: [
    //         defineSelect({
    //           key: chartConfigKey.auxiliaryDisplayConfigSelected,
    //           label: '默认选中',
    //           inline: true,
    //           options: [
    //             {
    //               label: '0',
    //               value: 'zero'
    //             },
    //             {
    //               label: '1',
    //               value: 'one'
    //             },
    //             {
    //               label: '2',
    //               value: 'two'
    //             }
    //           ],
    //           default: 'two'
    //         })
    //       ]
    //     })
    //   ]
    // })
  ]),
  analyses: []
})

export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {
  // 扇形区域
  const sectorAreaConfig = chartConfigStore.styles?.[chartConfigKey.sectorAreaConfig]
  const sectorAreaType = sectorAreaConfig?.[chartConfigKey.sectorAreaConfigChangeStyle]
  if (sectorAreaType && sectorAreaType === 'cycle') {
    // TODO
    mark.coordinate({ type: 'theta', outerRadius: 0.8, innerRadius: 0.5 })
  } else {
    mark.coordinate({ type: 'theta', outerRadius: 0.8 })
  }
  // 图例
  const isShowLegend = chartConfigStore.styles?.[chartConfigKey.legendSwitch]
  if (isShowLegend) {
    const legendConfig = chartConfigStore.styles?.[legendConfigLegendStyleWrapperKey]
    const legendContent =
      legendConfig?.[chartConfigKey.legendConfigLegendLabelContent]?.[
        chartConfigKey.legendConfigLegendLabelContentDetail
      ]

    // 图表
    mark.legend('color', {
      ...getChartConfigData(legendConfigLegendStyleWrapperKey, chartConfigStore.styles),
      itemValueText: (datum: Object, index: any, data: any) => {
        const measurement = legendContent.includes('measurement') ? data[index].count : ''
        const proportion = legendContent.includes('proportion') ? `(${data[index].percent}%)` : ''
        return measurement + proportion
      }
    })
  }
}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_Pie',
  name: componentName,
  description: '用来展示数据中各项的大小与各项综合的比例。',
  dimensionDescription: '1个维度',
  measureDescription: '最少1个维度，最多10个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
