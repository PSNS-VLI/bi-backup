import { defineAsyncComponent } from 'vue'

import {
  getChartIDAndName,
  ChartCategory,
  ChartName,
  defineChart,
  defineChartConfig,
  defineField,
  FieldClass,
  defineFieldFilter,
  defineStyles,
  defineConfigKey,
  defineKeymapWrapper,
  type ChartStore,
  defineCollapse,
  defineRadioGroup,
  defineInputNumber,
  defineRadioIconGroup,
  defineCheckbox,
  defineSubCollapse,
  defineTextConfig,
  defineTextWrapper,
  defineTextStyle,
  defineSelect,
  defineColorPicker,
  defineInput
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.INDICATOR,
  ChartName.INDICATOR_BOARD
)
export const chartConfigKey = defineConfigKey(componentID, [
  // 指标布局
  'indicatorLayout',
  'indicatorRelation', // 指标间关系
  'indicatorDisplayMethod', // 指标间块组展示形式
  'indicatorDisplayNumber', // 每行最多显示
  'indicatorSegmentation', // 指标块分割
  'indicatorSplitColor', // 分割线颜色
  'indicatorMargin', // 指标块间距
  // 指标内容
  'indicatorContent',
  'indicatorContentPosition', // 内容在指标块中位置
  'indicatorAlign', // 与指标对齐方式
  'indicatorValueSpace', // 指标值行间距
  'dimensionName', // 显示维度名称
  'indicatorDisplayName', // 显示主指标名称
  'indicatorTextStyle', // 字号设置
  'indicatorPrimaryStyle', // 主指标
  'indicatorAssistant', // 副指标
  'indicatorAssistantTextSizeStyle', // 副指标 - Size
  'indicatorAssistantTextStyle', // 副指标 - Style
  'indicatorAssistantName', // 副指标 - 名称 Color
  'indicatorAssistantNumber', // 副指标 - 数值 Color
  'indicatorTotal', // 指标
  'indicatorTotalTextSizeStyle', // 指标
  'indicatorTotalTextStyle', // 指标
  'indicatorTotalName', // 指标
  'indicatorTotalNumber', // 指标
  // 系列设置
  'seriesSetting',
  'seriesSettingSelect', // 请选择系列
  'indicatorDataPrefixSuffix', // 指标数据值前后缀
  'indicatorDataPrefix', // 前缀
  'indicatorDataSuffix', // 后缀
  // 条件格式
  'conditionalFormat', // 条件格式

  // 指标修饰图
  'modifiedDrawing',
  'modifiedSwitch',
  'modifiedPosition',
  'modifiedType',
  'modifiedStyle'
])
export const dimensionStyleWrapperKey = 'dimensionStyle'
export const indicatorPrimaryTextStyleWrapperKey = 'indicatorPrimaryTextStyle'
export const indicatorPrimaryNumberStyleWrapperKey = 'indicatorPrimaryNumberStyle'

export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'dimensions',
      label: '看板标签',
      fieldClass: FieldClass.DIMENSION,
      fieldsNumLimit: 1
    }),
    defineField({
      key: 'measurements',
      label: '看板指标',
      fieldClass: FieldClass.MEASUREMENT,
      fieldsNumLimit: 20,
      required: true
    }),
    defineFieldFilter({
      key: 'filters',
      label: '过滤器'
    })
  ],
  styles: defineStyles({ componentName }, [
    // 指标布局
    defineCollapse({
      key: chartConfigKey.indicatorLayout,
      label: '指标布局',
      children: [
        defineRadioGroup({
          key: chartConfigKey.indicatorRelation,
          label: '指标间关系',
          options: [
            {
              label: '并列',
              value: 'parataxis'
            },
            {
              label: '主副',
              value: 'auxiliary'
            }
          ],
          default: 'auxiliary'
        }),
        defineRadioGroup({
          key: chartConfigKey.indicatorDisplayMethod,
          label: '指标间块组展示形式',
          options: [
            {
              label: '左右滑动',
              value: 'around'
            },
            {
              label: '换行平铺',
              value: 'tile'
            }
          ],
          default: 'tile'
        }),
        defineInputNumber({
          key: chartConfigKey.indicatorDisplayNumber,
          label: '每行最多显示',
          inline: true,
          suffix: '个',
          attribute: {
            min: 1
          },
          default: 3
        }),
        defineRadioIconGroup({
          key: chartConfigKey.indicatorSegmentation,
          label: '指标块分割',
          hideOptionLabel: false,
          options: [
            {
              label: '无',
              value: 'none',
              iconClass: 'icon-NoSegmentation'
            },
            {
              label: '分割线',
              value: 'line',
              iconClass: 'icon-Divider'
            },
            {
              label: '背景填充',
              value: 'background',
              iconClass: 'icon-BackgroundFill'
            }
          ],
          default: 'none'
        }),
        defineColorPicker({
          displayController: (_, nearbyConfigStore) => {
            return nearbyConfigStore?.[chartConfigKey.indicatorSegmentation] === 'line'
          },
          key: chartConfigKey.indicatorSplitColor,
          label: '分割线颜色'
        }),
        defineInputNumber({
          displayController: (_, nearbyConfigStore) => {
            return nearbyConfigStore?.[chartConfigKey.indicatorSegmentation] === 'background'
          },
          key: chartConfigKey.indicatorMargin,
          label: '指标块间距',
          inline: true,
          prefixIcon: 'icon-monitor',
          suffix: 'px',
          attribute: {
            min: 4,
            max: 30
          },
          default: 4
        })
      ]
    }),
    // 指标内容
    defineCollapse({
      key: chartConfigKey.indicatorContent,
      label: '指标内容',
      children: [
        defineRadioGroup({
          key: chartConfigKey.indicatorContentPosition,
          label: '内容在指标块中位置',
          options: [
            {
              label: '横向居左',
              value: 'left',
              tooltip: {
                description: '左侧留有最小宽度，指标块内居左'
              }
            },
            {
              label: '横向居中',
              value: 'center'
            }
          ],
          default: 'left'
        }),
        defineRadioGroup({
          displayController: (_, nearbyConfigStore) => {
            return nearbyConfigStore?.[chartConfigKey.indicatorContentPosition] === 'center'
          },
          key: chartConfigKey.indicatorAlign,
          label: '与指标对齐方式',
          options: [
            {
              label: '左对齐',
              value: 'left'
            },
            {
              label: '居中对齐',
              value: 'center'
            }
          ],
          default: 'left'
        }),
        defineRadioGroup({
          key: chartConfigKey.indicatorValueSpace,
          label: '指标值行间距',
          options: [
            {
              label: '适中',
              value: 'moderate'
            },
            {
              label: '紧凑',
              value: 'compact'
            }
          ],
          default: 'moderate'
        }),
        defineCheckbox({
          key: chartConfigKey.dimensionName,
          label: '显示维度名称',
          default: true
        }),
        defineCheckbox({
          key: chartConfigKey.indicatorDisplayName,
          label: '显示主指标名称',
          default: true
        }),
        defineSubCollapse({
          key: chartConfigKey.indicatorTextStyle,
          label: '字号设置',
          type: 'collapse',
          children: [
            defineTextConfig(dimensionStyleWrapperKey, { textLabel: '维度', fontWeight: 'bold' }),
            defineTextWrapper({
              displayController: (configStore) => {
                const indicatorLayout = configStore.styles?.[chartConfigKey.indicatorLayout]
                return indicatorLayout?.[chartConfigKey.indicatorRelation] === 'auxiliary'
              },
              key: chartConfigKey.indicatorPrimaryStyle,
              label: '主指标',
              children: [
                defineTextConfig(indicatorPrimaryTextStyleWrapperKey, { textLabel: '名称' }),
                defineTextConfig(indicatorPrimaryNumberStyleWrapperKey, {
                  textLabel: '数值',
                  fontSize: 24,
                  fontWeight: 'bold'
                })
              ]
            }),
            defineTextWrapper({
              displayController: (configStore) => {
                const indicatorLayout = configStore.styles?.[chartConfigKey.indicatorLayout]
                return indicatorLayout?.[chartConfigKey.indicatorRelation] === 'auxiliary'
              },
              key: chartConfigKey.indicatorAssistant,
              label: '副指标',
              children: [
                defineInputNumber({
                  key: chartConfigKey.indicatorAssistantTextSizeStyle,
                  label: '',
                  inline: true,
                  prefixIcon: 'icon-monitor',
                  suffix: 'px',
                  attribute: {
                    min: 12,
                    max: 30
                  }
                }),
                defineTextStyle({
                  key: chartConfigKey.indicatorAssistantTextStyle,
                  label: '',
                  inline: true,
                  layouts: ['fontWeight', 'fontStyle']
                }),
                defineColorPicker({
                  inline: true,
                  key: chartConfigKey.indicatorAssistantName,
                  label: '名称'
                }),
                defineColorPicker({
                  inline: true,
                  key: chartConfigKey.indicatorAssistantNumber,
                  label: '数值'
                })
              ]
            }),
            defineTextWrapper({
              displayController: (configStore) => {
                const indicatorLayout = configStore.styles?.[chartConfigKey.indicatorLayout]
                return indicatorLayout?.[chartConfigKey.indicatorRelation] === 'parataxis'
              },
              key: chartConfigKey.indicatorTotal,
              label: '指标',
              children: [
                defineInputNumber({
                  key: chartConfigKey.indicatorTotalTextSizeStyle,
                  label: '',
                  inline: true,
                  prefixIcon: 'icon-monitor',
                  suffix: 'px',
                  attribute: {
                    min: 12,
                    max: 30
                  }
                }),
                defineTextStyle({
                  key: chartConfigKey.indicatorTotalTextStyle,
                  label: '',
                  inline: true,
                  layouts: ['fontWeight', 'fontStyle'],
                  default: {
                    fontWeight: 'normal'
                  }
                }),
                defineColorPicker({
                  inline: true,
                  key: chartConfigKey.indicatorTotalName,
                  label: '名称'
                }),
                defineColorPicker({
                  inline: true,
                  key: chartConfigKey.indicatorTotalNumber,
                  label: '数值'
                })
              ]
            })
          ]
        }),
        defineSubCollapse({
          key: chartConfigKey.modifiedDrawing,
          label: '指标修饰图',
          type: 'collapse',
          switcherKey: chartConfigKey.modifiedSwitch,
          children: [
            defineRadioGroup({
              key: chartConfigKey.modifiedPosition,
              label: '修饰图位置',
              options: [
                { label: '左侧', value: 'left' },
                { label: '上方', value: 'top' }
              ],
              default: 'left'
            }),
            // defineRadioGroup({
            //   key: chartConfigKey.modifiedType,
            //   label: '修饰图类型',
            //   // inline: true,
            //   options: [
            //     { label: '素材', value: 'material' },
            //     {
            //       label: '图片字段',
            //       value: 'picture'
            //     }
            //   ],
            //   default: 'material'
            // }),
            defineRadioGroup({
              key: chartConfigKey.modifiedStyle,
              label: '图形样式',
              inline: true,
              options: [
                { label: '透亮', value: 'bright' },
                {
                  label: '纯色',
                  value: 'pureColor'
                }
              ],
              default: 'bright'
            })
          ]
        })
      ]
    }),
    // 系列设置
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
            defineTextWrapper({
              key: chartConfigKey.indicatorDataPrefixSuffix,
              label: '指标数据值前后缀',
              children: [
                defineInput({
                  key: chartConfigKey.indicatorDataPrefix,
                  label: '前缀',
                  inline: true,
                  placeholder: '请填写(如￥)'
                }),
                defineInput({
                  key: chartConfigKey.indicatorDataSuffix,
                  label: '后缀',
                  inline: true,
                  placeholder: '请填写(如元)'
                })
              ]
            })
          ]
        })
      ]
    }),
    // 条件格式
    defineCollapse({
      key: chartConfigKey.conditionalFormat,
      label: '条件格式',
      children: []
    })
  ]),
  analyses: []
})
export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_IndicatorDashboard',
  name: componentName,
  description: '用来展示数据中各项的大小与各项综合的比例。',
  dimensionDescription: '1个维度',
  measureDescription: '最少1个维度，最多10个度量',
  component: defineAsyncComponent(() => import('./index.vue'))
})
