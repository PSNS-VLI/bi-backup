// 堆积条形图

import { defineAsyncComponent } from 'vue'
import { type MarkNode } from '@antv/g2'

// 导入所需组件
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
  defineAxesConfig,
  getAxesConfigData,
  // define-config
  defineCollapse,
  defineChartConfig,
  // defineCheckbox,
  defineRadioGroup,
  // defineInputNumber,
  defineSelect,
  defineTextConfig,
  // defineColorPicker,
  // defineTextStyle,
  // defineTextWrapper,
  defineCheckboxWrapper,
  defineKeymapWrapper,
  type ChartStore,
  defineLegendConfig,
  defineDataTagConfig,
  getChartConfigData,
  defineTooltipConfig
  // getTooltipConfigData
} from '../../shortcut'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.COLUMN_OR_BAR,
  ChartName.COLUMN_STACKING
)

// Key
export const chartConfigKey = defineConfigKey(componentID, [
  // drawConfig 绘图
  'drawConfig',
  'drawConfigChartType',
  'drawConfigBarWidth',
  'drawConfigGradient',
  'drawConfigStacking',
  'drawConfigPercentage',
  'drawConfigChartAlignment',
  'drawConfigChartTypeCheckbox',
  'drawConfigMobileDefaultSelection',
  'drawConfigMobileDefaultSelectionItem',
  'drawConfigSpecifySelect',
  // legend 图例
  'legendConfig',
  'legendConfigLegendPosition',
  'legendConfigLegendPositionDirection',
  'legendConfigLegendPositionAlign',
  'legendConfigLegendStyle',
  'legendConfigLegendStyleColor',
  'legendConfigLegendStyleFontSize',
  'legendConfigLegendStyleTextStyle',
  // datatag 数据标签
  // tooltip 工具提示
  // series 系列
  'seriesConfig',
  'seriesConfigDataTag',
  'seriesConfigShowDataTag',
  'seriesConfigDataTagPosition',
  'seriesConfigDataTagStyle',
  'seriesConfigDataTagStyleColor',
  'seriesConfigDataTagStyleFontSize',
  'seriesConfigDataTagStyleTextStyle',
  'seriesConfigShowMax',
  // assist 帮助
  'assistConfig',
  'assistConfigAbbreviation'
])

const legendConfigLegendStyleWrapperKey = 'legendConfigLegendStyle'
const dataTagConfigStyleWrapperKey = 'dataTagConfigStyle'
export const tooltipConfigStyleTextStyleWrapperKey = 'tooltipConfigStyleTextStyle'
export const seriesConfigTextKey = 'seriesConfigTextKey'

const checkboxContentOptions = [
  {
    label: '度量',
    value: 'measurement'
  },
  {
    label: '百分比',
    value: 'proportion'
  },
  {
    label: '总计',
    value: 'total'
  }
]
const checkboxContentDefault = ['']

const labelPosition = [
  {
    label: '自动',
    value: 'outside'
  },
  {
    label: '内部贴顶',
    value: 'right'
  },
  {
    label: '内部贴底',
    value: 'left'
  },
  {
    label: '内部中心',
    value: 'outside'
  }
]
const labelPositionDefault = 'outside'

const [fullDisplay, content, text, digit, position] = [
  ...defineDataTagConfig(dataTagConfigStyleWrapperKey, {
    checkboxContentOptions,
    checkboxContentDefault,
    labelPosition,
    labelPositionDefault
  })
]
// 配置
export const chartConfig = defineChartConfig({
  // 字段
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

  // 样式
  // 标题与卡片
  styles: defineStyles({ componentName }, [
    // 绘图区域
    // defineCollapse({
    //   key: chartConfigKey.drawConfig,
    //   label: '绘图区域',
    //   children: [
    //     // 可视化图表切换
    //     defineRadioIconGroup({
    //       key: chartConfigKey.drawConfigChartType,
    //       label: '可视化图表切换',
    //       hideOptionLabel: true,
    //       options: [
    //         {
    //           label: '柱图',
    //           value: 'bar',
    //           iconClass: 'icon-cq-zhuzhungtu'
    //         },
    //         {
    //           label: '堆积柱图',
    //           value: 'stacking',
    //           iconClass: 'icon-cq-duiditzhuzhuangtu'
    //         },
    //         {
    //           label: '百分比堆积柱图',
    //           value: 'percentage',
    //           iconClass: 'icon-cq-baifenbizhuzhuangtu'
    //         }
    //       ],
    //       default: 'stacking'
    //     }),
    //     // 柱体宽度
    // defineInputNumber({
    //   key: chartConfigKey.drawConfigBarWidth,
    //   label: '柱体宽度',
    //   prefixIcon: 'icon-monitor',
    //   suffix: '%',
    //   attribute: {
    //     min: 0,
    //     max: 100
    //   },
    //   default: 20,
    //   inline: true
    // }),
    //     // 图表对齐方式
    //     defineRadioGroup({
    //       key: chartConfigKey.drawConfigChartAlignment,
    //       label: '图表对齐方式',
    //       options: [
    //         {
    //           label: '左对齐',
    //           value: 'left'
    //         },
    //         {
    //           label: '右对齐',
    //           value: 'right'
    //         }
    //       ],
    //       inline: false,
    //       default: 'left'
    //     }),
    // // 复选框
    // defineCheckbox({
    //   key: chartConfigKey.drawConfigGradient,
    //   label: '开启渐变效果'
    // }),
    //     defineCheckbox({
    //       key: chartConfigKey.drawConfigStacking,
    //       label: '堆积',
    //       default: true
    //     }),
    //     defineCheckbox({
    //       key: chartConfigKey.drawConfigPercentage,
    //       label: '百分比堆积'
    //     }),
    //     // 移动端默认选中
    //     defineSubCollapse({
    //       key: chartConfigKey.drawConfigMobileDefaultSelection,
    //       label: '移动端默认选中',
    //       // collapse 折叠
    //       type: 'collapse',
    //       children: [
    //         // 默认选中项
    //         defineRadioGroup({
    //           key: chartConfigKey.drawConfigMobileDefaultSelectionItem,
    //           label: '默认选中项',
    //           options: [
    //             {
    //               label: '全局最后一个维值',
    //               value: 'whole'
    //             },
    //             {
    //               label: '指定系列最后一个维值',
    //               value: 'specify'
    //             }
    //           ],
    //           inline: false,
    //           default: 'whole'
    //         }),
    // // 下拉框
    // defineSelect({
    //   key: chartConfigKey.drawConfigSpecifySelect,
    //   label: '',
    //   inline: true,
    //   options: [
    //     {
    //       label: '自动',
    //       value: 'auto'
    //     }
    //   ]
    // })
    //       ]
    //     })
    //   ]
    // }),
    // 坐标轴
    defineAxesConfig(['x', 'y']),
    // 图例
    defineCollapse({
      key: legendConfigLegendStyleWrapperKey,
      label: '图例',
      children: [...defineLegendConfig(legendConfigLegendStyleWrapperKey)]
    }),
    // 数据标签
    defineCollapse({
      key: dataTagConfigStyleWrapperKey,
      label: '数据标签',
      // 条形图没有 content，其他两个有。当切换为 堆积/百分比 时，要向 children push content。（未完成）
      children: [content, fullDisplay, position, text]
    }),
    // 工具提示
    defineCollapse({
      key: tooltipConfigStyleTextStyleWrapperKey,
      label: '工具提示',
      children: [
        ...defineTooltipConfig(
          tooltipConfigStyleTextStyleWrapperKey,
          {
            isShowDimension: false
          },
          ''
        )
      ]
    }),
    // 系列设置
    defineCollapse({
      key: chartConfigKey.seriesConfig,
      label: '系列设置',
      children: [
        defineKeymapWrapper({
          displayController: (configStore) => {
            return configStore.fields.dimensions?.length
          },
          key: 'keymap_wrapper',
          mapper: defineSelect({
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
            }
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
                      label: '内部贴顶',
                      value: 'right'
                    },
                    {
                      label: '内部贴底',
                      value: 'left'
                    },
                    {
                      label: '内部中心',
                      value: 'outside'
                    }
                  ],
                  default: 'outside'
                }),
                defineTextConfig(seriesConfigTextKey)
              ]
            })
          ]
        })
      ]
    }),
    // 辅助展示
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

  //分析
  analyses: []
})

// 更新图表数据
export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {
  // // 一、绘图区域
  // const drawConfig = chartConfigStore.styles?.[chartConfigKey.drawConfig]

  // // 复选框 渐变
  // const drawConfigGradient = drawConfig?.[chartConfigKey.drawConfigGradient]
  // if (drawConfigGradient) {
  //   mark.style({ fill: 'l (90) 0.5: rgba(20,98,255,1) 1:rgba(77,184,255,1) ' })
  // } else {
  //   // mark.style({ fill: '' })
  // }

  // // 柱体宽度                                                           ？？？？？？？？？？？？？？？？
  // const drawConfigBarWidth = drawConfig?.[chartConfigKey.drawConfigBarWidth]
  // mark.style('maxWidth', drawConfigBarWidth)

  // // 图表对齐方式                                                         ？？？？？？？？？？？？？？？？
  // const drawConfigChartAlignment = drawConfig?.[chartConfigKey.drawConfigChartAlignment]
  // if (drawConfigChartAlignment === 'right') {
  //   mark.axis('x', {
  //     position: 'right'
  //   })
  // } else if (drawConfigChartAlignment === 'left') {
  //   mark.axis('x', {
  //     position: 'left'
  //   })
  // }

  // 二、坐标轴
  mark.axis(getAxesConfigData(['x', 'y'], chartConfigStore.styles))

  // 三、图例功能
  mark.legend('color', {
    ...getChartConfigData(legendConfigLegendStyleWrapperKey, chartConfigStore.styles)
  })
}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_StackedBar',
  name: componentName,
  description: '用来展示一个大类包含的每个小类的数据，以及各个小类的对比。',
  dimensionDescription: '最少1个维度',
  measureDescription: '最少1个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
