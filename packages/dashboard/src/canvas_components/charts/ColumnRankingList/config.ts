// 排行榜
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
  // define-config
  defineCollapse,
  defineChartConfig,
  defineCheckbox,
  defineCheckboxWrapper,
  defineRadioGroup,
  defineInput,
  defineInputNumber,
  defineSelect,
  defineColorPicker,
  defineTextWrapper,
  defineTextConfig,
  type ChartStore
} from '../../shortcut'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.COLUMN_OR_BAR,
  ChartName.COLUMN_RANKING_LIST
)

// Key
export const chartConfigKey = defineConfigKey(componentID, [
  // 指标数据   indicatorData
  'indicatorData',
  'indicatorDataTargetValue',
  'indicatorDataDisplayMethod',
  'indicatorDataDisplayLocation',
  'indicatorDataBarColor',
  'indicatorDataBarColorJust',
  'indicatorDataBarColorNegative',
  'indicatorDataBarColorBackground',
  'indicatorDataBarFillet',
  'indicatorDataBarHeight',
  'indicatorDataLineSpace',
  'indicatorDataParallel',
  'indicatorDataParallelRank',
  'indicatorDataMobileDisplayBarNum',
  // 列标题     columnHeadings
  'columnHeadings',
  'columnHeadingsWrapper',
  'columnHeadingsShow',
  // 序号      serialNumber
  'serialNumber',
  'serialNumberName',
  'serialNumberTOP3Style',
  // 条件格式   conditionalFormat
  'conditionalFormatSeries',
  'conditionalFormatQuickStyle',
  'conditionalFormatCustomStyle',
  'conditionalFormatSynchronizeStyle'
])
export const indicatorDataParallelTxtKey = 'indicatorDataParallelTxt'
export const columnHeadingTxtKey = 'columnHeadingTxt'

// 配置
export const chartConfig = defineChartConfig({
  // 字段
  fields: [
    defineField({
      key: 'dimensions',
      label: '类别',
      fieldClass: FieldClass.DIMENSION,
      fieldsNumLimit: 1,
      required: true
    }),
    defineField({
      key: 'measurements',
      label: '指标',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 1,
      required: true
    }),
    defineField({
      key: 'auxiliary',
      label: '辅助指标',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 3
    }),
    defineField({
      key: 'filters',
      label: '过滤器'
    })
  ],

  // 样式
  // 标题与卡片
  styles: defineStyles({ componentName }, [
    // 指标数据
    defineCollapse({
      key: chartConfigKey.indicatorData,
      label: '指标数据',
      children: [
        // 设置目标值
        defineInputNumber({
          key: chartConfigKey.indicatorDataTargetValue,
          label: '设置目标值',
          prefixIcon: 'icon-monitor',
          attribute: {},
          inline: true
        }),
        // 数据显示方式
        defineRadioGroup({
          key: chartConfigKey.indicatorDataDisplayMethod,
          label: '数据显示方式',
          options: [
            {
              label: '全部显示',
              value: 'all'
            },
            {
              label: '仅数据条',
              value: 'bar'
            },
            {
              label: '仅数字',
              value: 'num'
            }
          ],
          default: 'all'
        }),
        // 数值显示位置
        defineRadioGroup({
          key: chartConfigKey.indicatorDataDisplayLocation,
          label: '数值显示位置',
          options: [
            {
              label: '数据条右侧',
              value: 'right'
            },
            {
              label: '数据条左侧',
              value: 'left'
            }
          ],
          default: 'right'
        }),
        // 数据条颜色
        defineTextWrapper({
          key: chartConfigKey.indicatorDataBarColor,
          label: '数据条颜色',
          inline: true,
          children: [
            defineColorPicker({
              key: chartConfigKey.indicatorDataBarColorJust,
              label: '正值',
              inline: true
            }),
            defineColorPicker({
              key: chartConfigKey.indicatorDataBarColorNegative,
              label: '负值',
              inline: true
            }),
            defineColorPicker({
              key: chartConfigKey.indicatorDataBarColorBackground,
              label: '背景色',
              inline: true
            })
          ]
        }),

        // 数据条圆角
        defineInputNumber({
          key: chartConfigKey.indicatorDataBarFillet,
          label: '数据条圆角',
          prefixIcon: 'icon-monitor',
          suffix: 'px',
          attribute: {
            min: 0,
            max: 50
          },
          inline: true
        }),
        // 数据条高度
        defineInputNumber({
          key: chartConfigKey.indicatorDataBarHeight,
          label: '数据条高度',
          prefixIcon: 'icon-monitor',
          suffix: '%',
          attribute: {
            min: 10,
            max: 100
          },
          inline: true,
          default: 67
        }),
        // 行间距
        defineInputNumber({
          key: chartConfigKey.indicatorDataLineSpace,
          label: '行间距',
          prefixIcon: 'icon-monitor',
          suffix: 'px',
          attribute: {
            min: 0,
            max: 30
          },
          inline: true,
          default: 6
        }),
        // 数据相同时 并列处理
        defineTextWrapper({
          key: chartConfigKey.indicatorDataParallel,
          label: '数据相同时并列处理',
          children: [
            // 排名
            defineRadioGroup({
              key: chartConfigKey.indicatorDataParallelRank,
              label: '',
              options: [
                {
                  label: '排名',
                  value: 'notDense'
                },
                {
                  label: '密集排名',
                  value: 'dense'
                }
              ],
              default: 'notDense'
            })
          ]
        }),
        // 文本
        defineTextConfig(indicatorDataParallelTxtKey),
        // 移动端默认显示条数
        defineSelect({
          key: chartConfigKey.indicatorDataMobileDisplayBarNum,
          label: '移动端默认显示条数',
          inline: true,
          options: [
            {
              label: '5',
              value: 5
            },
            {
              label: '10',
              value: 10
            },
            {
              label: '15',
              value: 15
            },
            {
              label: '20',
              value: 20
            },
            {
              label: '30',
              value: 30
            },
            {
              label: '50',
              value: 50
            }
          ],
          default: 10
        })
      ]
    }),
    // 列标题
    defineCollapse({
      key: chartConfigKey.columnHeadings,
      label: '列标题',
      children: [
        // 是否显示 列标题
        defineCheckboxWrapper({
          key: chartConfigKey.columnHeadingsWrapper,
          checkboxKey: chartConfigKey.columnHeadingsShow,
          label: '显示列标题',
          defaultCheckbox: true,
          children: [
            // 列标题 文本
            defineTextConfig(columnHeadingTxtKey)
          ]
        })
      ]
    }),
    // 序号
    defineCollapse({
      key: chartConfigKey.serialNumber,
      label: '序号',
      children: [
        // 排序列名称
        defineInput({
          key: chartConfigKey.serialNumberName,
          label: '排序列名称',
          default: '排序',
          inline: true
        }),
        // TOP 3 样式
        defineSelect({
          key: chartConfigKey.serialNumberTOP3Style,
          label: 'TOP 3 样式',
          inline: true,
          options: [
            {
              label: '无',
              value: 'not' // 去掉 排序序号列
            },
            {
              label: '1,2,3',
              value: 1
            },
            {
              label: '图标',
              value: '1'
            },
            {
              label: '图标',
              value: '2'
            },
            {
              label: '图标',
              value: '3'
            },
            {
              label: '图标',
              value: '4'
            }
          ],
          default: 1
        })
      ]
    }),
    // 条件格式                      先不做
    defineCollapse({
      key: chartConfigKey.conditionalFormat,
      label: '条件格式',
      children: [
        // 请选择系列
        defineSelect({
          key: chartConfigKey.conditionalFormatSeries,
          label: '请选择系列',
          options: [
            {
              label: '值轴名称',
              value: 'value'
            }
          ],
          default: 'value'
        }),
        // 快捷样式
        defineSelect({
          key: chartConfigKey.conditionalFormatQuickStyle,
          label: '快捷样式',
          placeholder: '请选择快捷样式',
          options: [
            {
              label: '图标',
              value: 'value'
            }
          ]
        }),
        // 自定义样式
        defineCheckbox({
          key: chartConfigKey.conditionalFormatCustomStyle,
          label: '自定义样式'
        }),
        // 同步样式到
        defineSelect({
          key: chartConfigKey.conditionalFormatSynchronizeStyle,
          label: '同步样式到',
          placeholder: '请选择需要同步应用条件格式的...',
          options: [
            {
              label: '无',
              value: 'value'
            }
          ]
        })
      ]
    })
  ]),

  //分析
  analyses: []
})

// 更新图表数据
export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_Rankings',
  name: componentName,
  description: '用于展示TOP N的排行榜数据。',
  dimensionDescription: '1个维度',
  measureDescription: '1个主度量，最多3个辅助度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
