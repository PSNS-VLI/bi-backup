import { defineAsyncComponent } from 'vue'
import { type MarkNode } from '@antv/g2'

import {
  getChartIDAndName,
  getTextConfigData,
  defineChart,
  ChartCategory,
  ChartName,
  FieldClass,
  defineConfigKey,
  defineField,
  defineFieldFilter,
  defineCollapse,
  defineChartConfig,
  defineInput,
  defineInputNumber,
  defineStyles,
  defineSelect,
  defineSubCollapse,
  defineTextConfig,
  defineTextWrapper,
  type ChartStore
} from '../../shortcut'

export const { componentID, componentName, componentTitle } = getChartIDAndName(
  ChartCategory.INDICATOR,
  ChartName.INDICATOR_RIPPLE
)

export const chartConfigKey = defineConfigKey(componentID, [
  'proportionBar',
  'proportionBarWidth',
  'indicatorContent',
  'mainIndicators',
  'mainIndicatorsStyle',
  'mainLabelDecimalPlaces',
  'proportionCalculationMethod',
  'currentTargetValue',
  'currentTargetValueSwitch',
  'currentValueLabel',
  'targetValueLabel',
  'setUpTargetValue',
  'targetValueType',
  'targetValue'
])

export const nameKey = 'nameStyle'
export const proportionKey = 'proportionStyle'
export const currentTargetValueTextKey = 'currentTargetValueTextStyle'

export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'measurements',
      label: '进度指标',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 5,
      required: true
    }),
    defineFieldFilter({
      key: 'filters',
      label: '过滤器'
    })
  ],
  styles: defineStyles({ componentName }, [
    // 占比条
    defineCollapse({
      key: chartConfigKey.proportionBar,
      label: '占比条',
      children: [
        // 可视化图表切换
        // defineRadioIconGroup({
        //   key: chartConfigKey.,
        //   label: '可视化图表切换',
        //   hideOptionLabel: true,
        //   options: [
        //     {
        //       label: '条形',
        //       value: 'standard',
        //       iconClass: 'icon-cq-piechat'
        //     },
        //     {
        //       label: '环形',
        //       value: 'sector',
        //       iconClass: 'icon-chart_Cyclegraph'
        //     },
        //     {
        //       label: '水波图',
        //       value: 'scale',
        //       iconClass: 'icon-cq-piechat'
        //     }
        //   ],
        //   default: 'standard'
        // }),
        defineInputNumber({
          key: chartConfigKey.proportionBarWidth,
          label: '占比条宽度',
          prefixIcon: '',
          suffix: 'px',
          attribute: {
            min: 1,
            max: 48
          },
          default: 3,
          inline: true
        })
      ]
    }),

    // 指标内容
    defineCollapse({
      key: chartConfigKey.indicatorContent,
      label: '指标内容',
      children: [
        // 主指标
        defineSubCollapse({
          key: chartConfigKey.mainIndicators,
          label: '主指标',
          type: 'collapse',
          children: [
            defineTextWrapper({
              key: chartConfigKey.mainIndicatorsStyle,
              label: '文本样式',
              inline: false,
              children: [
                defineTextConfig(nameKey, { textLabel: '名称' }),
                defineTextConfig(proportionKey, {
                  textLabel: '占比',
                  fontSize: 20,
                  fontWeight: 'bold'
                })
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
            }),
            defineSelect({
              key: chartConfigKey.proportionCalculationMethod,
              label: '完成占比计算方式',
              tooltip: {
                description: '仅当目标值为负数时，选择的计算方式才生效'
              },
              options: [
                {
                  label: '[1-(实际值/目标值–1)]*100%',
                  value: '0'
                },
                {
                  label: '(实际值/目标值)*100%',
                  value: '1'
                }
              ],
              default: '0'
            })
          ]
        })
      ]
    }),

    // 当前值/目标值
    defineCollapse({
      key: chartConfigKey.currentTargetValue,
      label: '当前值/目标值',
      switcherKey: chartConfigKey.currentTargetValueSwitch,
      children: [
        defineInput({
          key: chartConfigKey.currentValueLabel,
          label: '当前值-展示名称',
          inline: true,
          placeholder: '实际',
          default: '实际'
        }),
        defineInput({
          key: chartConfigKey.targetValueLabel,
          label: '目标值-展示名称',
          inline: true,
          placeholder: '目标',
          default: '目标'
        }),
        defineTextConfig(currentTargetValueTextKey),
        // 设置目标值
        defineSubCollapse({
          key: chartConfigKey.setUpTargetValue,
          label: '设置目标值',
          type: 'collapse',
          children: [
            defineSelect({
              key: chartConfigKey.targetValueType,
              label: '目标类型',
              inline: true,
              options: [
                {
                  label: '固定值',
                  value: 'fixed'
                },
                {
                  label: '动态值',
                  value: 'dynamic'
                }
              ],
              default: 'dynamic'
            }),
            defineInput({
              displayController: (_, nearbyConfigStore) => {
                return nearbyConfigStore?.[chartConfigKey.targetValueType] === 'fixed'
              },
              key: chartConfigKey.targetValue,
              label: '目标值',
              inline: true
            })
          ]
        })
      ]
    })
  ]),
  analyses: []
})

export const getChartConfigData = (store: Partial<ChartStore>) => {
  const styles = store.styles
  const proportionBar = styles?.[chartConfigKey.proportionBar]
  const indicatorContent = styles?.[chartConfigKey.indicatorContent]
  const currentTargetValue = styles?.[chartConfigKey.currentTargetValue]
  const mainIndicators = indicatorContent?.[chartConfigKey.mainIndicators]
  const mainIndicatorsStyle = mainIndicators?.[chartConfigKey.mainIndicatorsStyle]
  const setUpTargetValue = currentTargetValue?.[chartConfigKey.setUpTargetValue]
  const { color, fontSize, fontWeight, fontStyle } = getTextConfigData(nameKey, mainIndicatorsStyle)
  const {
    color: color1,
    fontSize: fontSize1,
    fontWeight: fontWeight1,
    fontStyle: fontStyle1
  } = getTextConfigData(proportionKey, mainIndicatorsStyle)
  const {
    color: color2,
    fontSize: fontSize2,
    fontWeight: fontWeight2,
    fontStyle: fontStyle2
  } = getTextConfigData(currentTargetValueTextKey, currentTargetValue)

  const proportionBarData = {
    proportionBarWidth: proportionBar?.[chartConfigKey.proportionBarWidth]
  }
  const indicatorContentData = {
    mainIndicatorsName: {
      color,
      fontSize,
      fontWeight,
      fontStyle
    },
    mainIndicatorsProportion: {
      color1,
      fontSize1,
      fontWeight1,
      fontStyle1
    },
    mainLabelDecimalPlaces: mainIndicators?.[chartConfigKey.mainLabelDecimalPlaces],
    proportionCalculationMethod: mainIndicators?.[chartConfigKey.proportionCalculationMethod]
  }
  const currentTargetData = {
    currentTargetValueSwitch: styles?.[chartConfigKey.currentTargetValueSwitch],
    currentValueLabel: currentTargetValue?.[chartConfigKey.currentValueLabel],
    targetValueLabel: currentTargetValue?.[chartConfigKey.targetValueLabel],
    currentTargetText: {
      color2,
      fontSize2,
      fontWeight2,
      fontStyle2
    },
    targetValueType: setUpTargetValue?.[chartConfigKey.targetValueType],
    targetValue: setUpTargetValue?.[chartConfigKey.targetValue]
  }

  return {
    proportionBarData,
    indicatorContentData,
    currentTargetData
  }
}

export default defineChart(chartConfig, {
  id: componentID,
  name: componentName,
  title: componentTitle,
  icon: 'icon-shuibotu',
  description: '用来展示某个指标的数值占比。',
  dimensionDescription: '',
  measureDescription: '最少1个，最多5个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
