import { defineAsyncComponent } from 'vue'

import {
  getChartIDAndName,
  ChartCategory,
  ChartName,
  defineChart,
  defineChartConfig,
  defineField,
  FieldClass,
  defineAxesConfig,
  defineStyles,
  defineConfigKey,
  defineCollapse,
  defineLegendConfig,
  defineTooltipConfig,
  defineDataTagConfig,
  getChartConfigData,
  type ChartStore
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.PIE_OR_RING,
  ChartName.RADAR_CHART
)
export const chartConfigKey = defineConfigKey(componentID, ['labelField', 'labelSwitch'])

const legendConfigLegendStyleWrapperKey = 'legendConfigLegendStyle'
export const dataTagConfigStyleWrapperKey = 'dataTagConfigStyle'
export const tooltipConfigStyleTextStyleWrapperKey = 'tooltipConfigStyleTextStyle'

const labelPosition = [
  {
    label: '自动',
    value: 'auto'
  },
  {
    label: '分支标签名下方',
    value: 'bottom'
  }
]
const labelPositionDefault = 'auto'
const [fullDisplay, content, text, digit, position] = [
  ...defineDataTagConfig(dataTagConfigStyleWrapperKey, {
    labelPosition,
    labelPositionDefault
  })
]
export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'dimensions',
      label: '分支标签',
      fieldClass: FieldClass.DIMENSION,
      fieldsNumLimit: 1,
      required: true
    }),
    defineField({
      key: 'measurements',
      label: '分支长度',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 10,
      required: true
    }),
    // defineRadioGroup({
    //   key: chartConfigKey.labelField,
    //   label: '',
    //   options: [
    //     {
    //       label: '维度作为分支标签',
    //       value: 'dimension'
    //     },
    //     {
    //       label: '度量作为分支标签',
    //       value: 'measurement'
    //     }
    //   ],
    //   default: 'dimension'
    // }),
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
      switcherKey: chartConfigKey.labelSwitch
    }),
    defineCollapse({
      key: tooltipConfigStyleTextStyleWrapperKey,
      label: '工具提示',
      children: [
        ...defineTooltipConfig(
          tooltipConfigStyleTextStyleWrapperKey,
          {
            isShowDimension: false,
            isShowData: false
          },
          ''
        )
      ]
    })
  ]),
  analyses: []
})
export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {
  mark.legend('color', {
    ...getChartConfigData(legendConfigLegendStyleWrapperKey, chartConfigStore.styles)
  })
}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_Radar',
  name: componentName,
  description: '用来展示分析所得的数字或比率，多用于展示维度值的分布',
  dimensionDescription: '1个维度',
  measureDescription: '最少1个度量，最多10个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
