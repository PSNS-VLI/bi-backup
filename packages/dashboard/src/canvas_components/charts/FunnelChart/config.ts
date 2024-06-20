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
  getChartConfigData,
  getTooltipConfigData,
  type ChartStore
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.FUNNEL_TRANSFORM,
  ChartName.FUNNEL_CHART
)
const legendConfigLegendStyleWrapperKey = 'legendConfigLegendStyle'
const dataTagConfigStyleWrapperKey = 'dataTagConfigStyle'
const tooltipConfigStyleTextStyleWrapperKey = 'tooltipConfigStyleTextStyle'
const checkboxContentOptions = [
  {
    label: '转化率',
    value: 'percentConversion'
  },
  {
    label: '度量值',
    value: 'metric'
  },
  {
    label: '转化率+度量值',
    value: 'total'
  }
]
const checkboxContentDefault = ['percentConversion']
const [fullDisplay, content, text, digit, position] = [
  ...defineDataTagConfig(dataTagConfigStyleWrapperKey, {
    checkboxContentOptions,
    checkboxContentDefault
  })
]
export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'dimensions',
      label: '漏斗分层',
      fieldClass: FieldClass.DIMENSION,
      required: true
    }),
    defineField({
      key: 'measurements',
      label: '漏斗层宽',
      fieldClass: FieldClass.MEASUREMENT,
      required: true
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
    defineCollapse({
      key: legendConfigLegendStyleWrapperKey,
      label: '图例',
      children: [...defineLegendConfig(legendConfigLegendStyleWrapperKey)]
    }),
    defineCollapse({
      key: dataTagConfigStyleWrapperKey,
      label: '数据标签',
      children: [fullDisplay, position, text]
    }),
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
export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {
  mark.legend('color', {
    ...getChartConfigData(legendConfigLegendStyleWrapperKey, chartConfigStore.styles)
  })
}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_Funnel',
  name: componentName,
  description: '用来展示业务各环节的转化递进情况；如用户从进入网站倒是先购买的最终转化率。',
  dimensionDescription: '0或1个维度',
  measureDescription: '最少1个维度，最多10个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
