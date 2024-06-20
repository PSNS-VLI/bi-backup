import { defineAsyncComponent } from 'vue'

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
  // define-config
  defineCollapse,
  defineChartConfig,
  defineCheckbox,
  defineCheckboxGroup,
  defineRadioGroup,
  defineRadioIconGroup,
  defineInput,
  defineInputNumber,
  defineSelect,
  defineColorPicker,
  defineTextConfig,
  defineTextWrapper,
  defineTooltipConfig,
  defineCheckboxWrapper,
  defineKeymapWrapper,
  getTextConfigData,
  type ChartStore,
  type Field
} from '../../shortcut'

export const { componentID, componentName, componentTitle } = getChartIDAndName(
  ChartCategory.GEOGRAPHY,
  ChartName.COLOR_MAP
)

export const chartConfigKey = defineConfigKey(componentID, [
  // 地理区域
  'geography',
  'geographyDisplayRange',
  'geographyContourFilling',
  'geographyContourShow',
  'geographyBackgroundColor',
  'geographyContourLine',
  // 区块
  'block',
  'blockKeymap',
  'blockDataMapping',
  'blockTransparency',
  // 数据标签
  'dataTag',
  'showDataTag',
  'dataTagFullDisplay',
  'dataTagContent',
  'dataTagTextStyle',
  'dataTagTextStyleRegion',
  'dataTagTextStyleMeasurement',
  // 总计
  'total',
  'showTotal',
  'totalCustomName',
  'totalTextStyle',
  'totalTextStyleName',
  'totalTextStyleNumber',
  // 图例
  'legend',
  'showLegend',
  'legendPosition',
  'legendStyle',
  // tooltip
  'tooltip',
  'showTooltip',
  // 辅助展示
  'assistConfig'
])

const enum MappingInterval {
  CONTINUITY,
  DISCRETE
}

const enum DataTagContent {
  REGION_NAME,
  MEASUREMENT
}

const enum LegendPosition {
  LEFT,
  RIGHT
}

export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'dimensions',
      label: '地理区域',
      fieldClass: FieldClass.DIMENSION,
      fieldsNumLimit: 1,
      required: true
    }),
    defineField({
      key: 'measurements',
      label: '色彩饱和度',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 5,
      required: true
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
    // 地理区域
    defineCollapse({
      key: chartConfigKey.geography,
      label: '地理区域',
      children: [
        defineRadioGroup({
          key: chartConfigKey.geographyDisplayRange,
          label: '显示范围',
          tooltip: {
            description: '当数据只有一个，建议切换到自定义范围'
          },
          options: [
            {
              label: '自动',
              value: 'automatic'
            },
            {
              label: '自定义',
              value: 'custom'
            }
          ],
          default: 'automatic'
        }),
        defineCheckboxWrapper({
          key: chartConfigKey.geographyContourFilling,
          checkboxKey: chartConfigKey.geographyContourShow,
          label: '轮廓与填充',
          children: [
            defineColorPicker({
              key: chartConfigKey.geographyBackgroundColor,
              label: '区块底色',
              inline: true
            }),
            defineColorPicker({
              key: chartConfigKey.geographyContourLine,
              label: '轮廓线',
              inline: true
            })
          ]
        })
      ]
    }),
    // 区块
    defineCollapse({
      key: chartConfigKey.block,
      label: '区块',
      children: [
        // 区块色彩配置  请选择系列
        defineKeymapWrapper({
          key: chartConfigKey.blockKeymap,
          mapper: defineSelect({
            label: '区块色彩配置',
            key: '',
            optionsComputer: {
              chartStoreComputer(configStore) {
                const measurements = configStore.fields.measurements as Array<Field>

                if (measurements?.length) {
                  return measurements.map((field) => ({
                    label: field.name,
                    value: field.name
                  }))
                }
                return []
              }
            }
          }),
          children: [
            defineRadioGroup({
              key: chartConfigKey.blockDataMapping,
              label: '数据映射区间',
              options: [
                {
                  label: '连续型区间',
                  value: MappingInterval.CONTINUITY
                },

                {
                  label: '等分区间',
                  value: MappingInterval.DISCRETE
                }
              ],
              default: MappingInterval.CONTINUITY
            }),
            defineInputNumber({
              key: chartConfigKey.blockTransparency,
              label: '透明度',
              prefixIcon: 'icon-monitor',
              suffix: '%',
              attribute: {
                min: 0,
                max: 100
              },
              default: 100,
              inline: true
            })
          ]
        })
      ]
    }),
    // 数据标签
    defineCollapse({
      key: chartConfigKey.dataTag,
      switcherKey: chartConfigKey.showDataTag,
      label: '数据标签',
      children: [
        defineCheckbox({
          key: chartConfigKey.dataTagFullDisplay,
          label: '全量显示'
        }),
        defineCheckboxGroup({
          key: chartConfigKey.dataTagContent,
          label: '内容',
          inline: true,
          options: [
            {
              label: '区域名称',
              value: DataTagContent.REGION_NAME
            },
            {
              label: '度量',
              value: DataTagContent.MEASUREMENT
            }
          ],
          default: [DataTagContent.REGION_NAME]
        }),
        defineTextWrapper({
          key: chartConfigKey.dataTagTextStyle,
          label: '文字样式',
          inline: false,
          children: [
            defineTextConfig(chartConfigKey.dataTagTextStyleRegion, { textLabel: '区域名称' }),
            defineTextConfig(chartConfigKey.dataTagTextStyleMeasurement, { textLabel: '度量' })
          ]
        })
      ]
    }),
    // 总计
    defineCollapse({
      key: chartConfigKey.total,
      switcherKey: chartConfigKey.showTotal,
      label: '总计',
      children: [
        defineInput({
          key: chartConfigKey.totalCustomName,
          label: '自定义名称',
          inline: false,
          placeholder: '请输入总计名',
          default: ''
        }),
        defineTextWrapper({
          key: chartConfigKey.totalTextStyle,
          label: '文本样式',
          inline: false,
          children: [
            defineTextConfig(chartConfigKey.totalTextStyleName, {
              textLabel: '名称',
              fontSize: 14
            }),
            defineTextConfig(chartConfigKey.totalTextStyleNumber, {
              textLabel: '数值',
              fontSize: 20
            })
          ]
        })
      ]
    }),
    // 图例
    defineCollapse({
      key: chartConfigKey.legend,
      switcherKey: chartConfigKey.showLegend,
      label: '图例',
      children: [
        defineRadioIconGroup({
          key: chartConfigKey.legendPosition,
          label: '位置',
          hideOptionLabel: true,
          inline: true,
          options: [
            {
              label: '',
              iconClass: 'icon-Left',
              value: LegendPosition.RIGHT
            },
            {
              label: '',
              iconClass: 'icon-Right',
              value: LegendPosition.LEFT
            }
          ],
          default: LegendPosition.LEFT
        }),
        defineTextConfig(chartConfigKey.legendStyle)
      ]
    }),
    // 工具提示
    defineCollapse({
      key: chartConfigKey.tooltip,
      switcherKey: chartConfigKey.showTooltip,
      label: '工具提示',
      children: [
        ...defineTooltipConfig(
          chartConfigKey.tooltip,
          {
            isShowDimension: false,
            isShowMethod: false,
            isShowData: false
          },
          ''
        )
      ]
    }),
    // 辅助展示
    defineCollapse({
      key: chartConfigKey.assistConfig,
      label: '辅助展示',
      children: []
    })
  ]),
  analyses: []
})

export const getChartConfigData = (store: Partial<ChartStore>) => {
  const styles = store.styles

  const geography = styles?.[chartConfigKey.geography]
  const contourFilling = geography?.[chartConfigKey.geographyContourFilling]
  const contourFillingData = {
    fill: '#fefefe',
    stroke: 'grey'
  }
  if (contourFilling?.[chartConfigKey.geographyContourShow]) {
    contourFillingData.fill = contourFilling?.[chartConfigKey.geographyBackgroundColor]
    contourFillingData.stroke = contourFilling?.[chartConfigKey.geographyContourLine]
  }

  const dataTag = styles?.[chartConfigKey.dataTag]
  const dataTagContent = dataTag?.[chartConfigKey.dataTagContent] ?? []
  const dataTagTextStyle = dataTag?.[chartConfigKey.dataTagTextStyle]
  const dataTagTextStyleRegion = getTextConfigData(
    chartConfigKey.dataTagTextStyleRegion,
    dataTagTextStyle
  )
  const dataTagTextStyleMeasurement = getTextConfigData(
    chartConfigKey.dataTagTextStyleMeasurement,
    dataTagTextStyle
  )

  const dataTagData = {
    showDataTag: styles?.[chartConfigKey.showDataTag],
    reginName: {
      show: dataTagContent.includes(DataTagContent.REGION_NAME) ?? true,
      fontSize: dataTagTextStyleRegion.fontSize ?? 12,
      fontWeight: dataTagTextStyleRegion.fontWeight ?? 400,
      textAlign: dataTagTextStyleRegion.textAlign ?? 'start',
      fill: dataTagTextStyleRegion.color
    },
    measurement: {
      show: dataTagContent.includes(DataTagContent.MEASUREMENT) ?? false,
      fontSize: dataTagTextStyleMeasurement.fontSize ?? 12,
      fontWeight: dataTagTextStyleMeasurement.fontWeight ?? 400,
      textAlign: dataTagTextStyleMeasurement.textAlign ?? 'start',
      fill: dataTagTextStyleMeasurement.color
    }
  }

  const total = styles?.[chartConfigKey.total]
  const totalTextStyle = total?.[chartConfigKey.totalTextStyle]
  const totalData = {
    showTotal: styles?.[chartConfigKey.showTotal],
    name: total?.[chartConfigKey.totalCustomName],
    nameStyle: getTextConfigData(chartConfigKey.totalTextStyleName, totalTextStyle, {
      fontSizePixel: true
    }),
    numberStyle: getTextConfigData(chartConfigKey.totalTextStyleNumber, totalTextStyle, {
      fontSizePixel: true
    })
  }

  const legend = styles?.[chartConfigKey.legend]
  const legendStyle = getTextConfigData(chartConfigKey.legendStyle, legend)

  const legendData = {
    showLegend: styles?.[chartConfigKey.showLegend],
    titleFontSize: legendStyle.fontSize ?? 12,
    titleFontWeight: legendStyle.fontWeight,
    titleFill: legendStyle.color,
    layout: {
      justifyContent:
        legend?.[chartConfigKey.legendPosition] === LegendPosition.RIGHT ? 'flex-start' : 'flex-end'
    }
  }

  return {
    contourFillingData,
    dataTagData,
    totalData,
    legendData
  }
}

export default defineChart(chartConfig, {
  id: componentID,
  name: componentName,
  title: componentTitle,
  icon: 'icon-dituicon',
  description: '用色彩的深浅来展示数据的大小和分布范围。',
  dimensionDescription: '1个地理维度',
  measureDescription: '最少1个度量，最多5个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
