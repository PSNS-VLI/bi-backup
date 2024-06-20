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
  defineInputNumber,
  defineField,
  defineFieldFilter,
  // define-config
  defineCollapse,
  defineCheckboxWrapper,
  defineChartConfig,
  defineRadioGroup,
  defineSelect,
  defineSubCollapse,
  defineTextConfig,
  defineTextWrapper,
  type ChartStore
} from '../../shortcut'

export const { componentID, componentName, componentTitle } = getChartIDAndName(
  ChartCategory.INDICATOR,
  ChartName.INDICATOR_DASHBOARD
)

export const chartConfigKey = defineConfigKey(componentID, [
  // 仪表样式
  'instrumentStyle',
  'intervalColor',
  'intervalColorShow',
  'intervalNumber',
  'instrumentScaleLines',
  'instrumentScaleLineType',
  // 数据标签
  'dataLabel',
  'mainLabel',
  'mainLabelStyle',
  'mainTextStyle',
  'mainLabelDecimalPlaces',
  'subLabel'
])

export const nameKey = 'nameKeyStyle'
export const valueKey = 'valueKeyStyle'
export const subLabelTextKey = 'subLabelTextKey Style'
export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'measurements',
      label: '指针角度',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 1,
      required: true
    }),
    defineFieldFilter({
      key: 'filters',
      label: '过滤器'
    })
  ],
  styles: defineStyles({ componentName }, [
    // 仪表样式
    defineCollapse({
      key: chartConfigKey.instrumentStyle,
      label: '仪表样式',
      children: [
        // 可视化样式切换
        // defineRadioIconGroup({
        //   key: chartConfigKey.,
        //   label: '可视化样式切换',
        //   hideOptionLabel: true,
        //   options: [
        //     {
        //       label: '标准',
        //       value: 'standard',
        //       iconClass: 'icon-cq-piechat'
        //     },
        //     {
        //       label: '扇形',
        //       value: 'sector',
        //       iconClass: 'icon-chart_Cyclegraph'
        //     },
        //     {
        //       label: '刻度',
        //       value: 'scale',
        //       iconClass: 'icon-cq-piechat'
        //     }
        //   ],
        //   default: 'standard'
        // }),

        defineCheckboxWrapper({
          key: chartConfigKey.intervalColor,
          checkboxKey: chartConfigKey.intervalColorShow,
          label: '区块色彩配置',
          children: [
            defineInputNumber({
              key: chartConfigKey.intervalNumber,
              label: '区间个数',
              prefixIcon: '',
              suffix: '',
              attribute: {
                min: 2,
                max: 10
              },
              inline: true
            })
          ]
        }),

        // 内部刻度线
        defineSubCollapse({
          key: chartConfigKey.instrumentScaleLines,
          label: '内部刻度线',
          type: 'collapse',
          children: [
            defineRadioGroup({
              key: chartConfigKey.instrumentScaleLineType,
              label: '刻度线形式',
              options: [
                {
                  label: '显示百分比',
                  value: 'percentage'
                },
                {
                  label: '显示原值',
                  value: 'originalValue'
                }
              ],
              inline: false,
              default: 'percentage'
            })
          ]
        })
      ]
    }),
    // 数据标签
    defineCollapse({
      key: chartConfigKey.dataLabel,
      label: '数据标签',
      children: [
        defineSubCollapse({
          key: chartConfigKey.mainLabel,
          label: '主标签',
          type: 'collapse',
          children: [
            defineRadioGroup({
              key: chartConfigKey.mainLabelStyle,
              label: '标签样式',
              options: [
                {
                  label: '显示指针值',
                  value: 'pointerValue'
                },
                {
                  label: '显示百分比',
                  value: 'percentage'
                }
              ],
              inline: false,
              default: 'percentage'
            }),
            defineTextWrapper({
              key: chartConfigKey.mainTextStyle,
              label: '文本样式',
              inline: false,
              children: [
                defineTextConfig(nameKey, { textLabel: '名称' }),
                defineTextConfig(valueKey, { textLabel: '数值', fontSize: 20, fontWeight: 'bold' })
              ]
            }),
            defineSelect({
              key: chartConfigKey.mainLabelDecimalPlaces,
              label: '占比值小数位数',
              inline: true,
              options: [
                {
                  label: '0',
                  value: '0'
                },
                {
                  label: '1',
                  value: '1'
                },
                {
                  label: '2',
                  value: '2'
                }
              ],
              default: '1'
            })
          ]
        }),

        defineSubCollapse({
          key: chartConfigKey.subLabel,
          label: '副标签',
          type: 'collapse',
          children: [defineTextConfig(subLabelTextKey)]
        })
      ]
    })
    // defineCollapse({
    //   key: chartConfigKey.,
    //   label: '起点/终点',
    //   children: []
    // })
  ]),
  analyses: []
})

export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {}

export default defineChart(chartConfig, {
  id: componentID,
  name: componentName,
  title: componentTitle,
  icon: 'icon-yibiaopan',
  description: '用来展示某个指标值所在的数据范围。',
  dimensionDescription: '',
  measureDescription: '1个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
