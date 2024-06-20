import { defineAsyncComponent } from 'vue'

import {
  getChartIDAndName,
  ChartCategory,
  ChartName,
  defineChart,
  defineChartConfig,
  defineField,
  defineConfigKey,
  defineStyles,
  defineCollapse,
  defineRadioIconGroup,
  defineRadioGroup,
  type ChartStore,
  defineTextConfig,
  defineCheckbox,
  defineColorPicker,
  defineSubCollapse,
  defineFieldFilter
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'

export const { componentID, componentName } = getChartIDAndName(
  ChartCategory.TABLE,
  ChartName.TABLE_CROSSTAB
)
export const chartConfigKey = defineConfigKey(componentID, [
  'tableBasicStyle',
  'tableBasicFrameStyle',
  'tableMainColor',
  'tableColumnWidth',
  'tableWordWrap',
  'tableEvenCustomColor',

  'tableCell',
  'tableCellDisplayMethod',
  'tableCellFreeze',
  'tableCellFreezeSelect',

  'headerStyle',
  'headerColumnStyle',
  'headerColumnDisplay',
  'headerColumnBackground',

  'headerRowStyle',
  'headerRowBackground'
])
export const basicTextWrapperKey = 'basicText'
export const headerTextWrapperKey = 'headerText'
export const headerRowTextWrapperKey = 'headerRowText'
export const chartConfig = defineChartConfig({
  fields: [
    defineField({
      key: 'dimensions',
      label: '行',
      required: true
    }),
    defineField({
      key: 'measurements',
      label: '列',
      required: true
    }),
    defineFieldFilter({
      key: 'filters',
      label: '过滤器'
    })
  ],
  styles: defineStyles({ componentName }, [
    defineCollapse({
      key: chartConfigKey.tableBasicStyle,
      label: '表格基础样式',
      children: [
        defineRadioIconGroup({
          key: chartConfigKey.tableBasicFrameStyle,
          label: '',
          options: [
            {
              label: '斑马线',
              value: 'zebraCrossing',
              iconClass: 'icon-banmaxian'
            },
            {
              label: '线框',
              value: 'wireFrame',
              iconClass: 'icon-xiankuang'
            },
            {
              label: '简版',
              value: 'abridgedEdition',
              iconClass: 'icon-jianban'
            },
            {
              label: '极简',
              value: 'minimalism',
              iconClass: 'icon-jijian'
            }
          ],
          hideOptionLabel: false,
          default: 'zebraCrossing'
        }),
        defineRadioGroup({
          key: chartConfigKey.tableMainColor,
          label: '主色系',
          inline: false,
          options: [
            {
              label: '主题色',
              value: 'themeColor'
            },
            {
              label: '灰色',
              value: 'gray'
            },
            {
              label: '自定义',
              value: 'custom'
            }
          ],
          default: 'themeColor'
        }),
        defineColorPicker({
          displayController: (_, nearbyConfigStore) => {
            return nearbyConfigStore?.[chartConfigKey.tableMainColor] === 'custom'
          },
          key: chartConfigKey.tableEvenCustomColor,
          label: '颜色配置',
          inline: true
        }),
        defineTextConfig(basicTextWrapperKey)
        // defineRadioGroup({
        //   key: chartConfigKey.tableColumnWidth,
        //   label: '列宽',
        //   inline: true,
        //   options: [
        //     {
        //       label: '按容器自适应',
        //       value: 'selfAdaption'
        //     },
        //     {
        //       label: '自定义',
        //       value: 'custom'
        //     }
        //   ],
        //   default: 'selfAdaption'
        // }),
        // defineCheckbox({
        //   key: chartConfigKey.tableWordWrap,
        //   label: '自动换行'
        // })
      ]
    }),
    // defineCollapse({
    //   key: chartConfigKey.tableCell,
    //   label: '单元格',
    //   children: [
    //     defineRadioGroup({
    //       key: chartConfigKey.tableCellDisplayMethod,
    //       label: '展示方式',
    //       options: [
    //         {
    //           label: '平埔展示',
    //           value: 'tileDisplay'
    //         },
    //         {
    //           label: '树形展示',
    //           value: 'treeDisplay'
    //         }
    //       ],
    //       default: 'tileDisplay'
    //     }),
    //     defineCheckbox({
    //       key: chartConfigKey.tableCellFreeze,
    //       label: '冻结',
    //       tooltip: {
    //         description: '冻结列整体宽度，需小于表格总宽度的60%，以保证滑动列可正常展示'
    //       }
    //     }),
    //     defineSelect({
    //       key: chartConfigKey.tableCellFreezeSelect,
    //       label: '',
    //       options: [
    //         {
    //           label: '智能（表头）',
    //           value: 'aiHeader'
    //         },
    //         {
    //           label: '列',
    //           value: 'column'
    //         }
    //       ],
    //       default: 'aiHeader'
    //     })
    //   ]
    // })
    defineCollapse({
      key: chartConfigKey.headerStyle,
      label: '表头样式',
      children: [
        defineSubCollapse({
          key: chartConfigKey.headerColumnStyle,
          label: '列表头',
          type: 'collapse',
          children: [
            defineCheckbox({
              key: chartConfigKey.headerColumnDisplay,
              label: '不显示列表头'
            }),
            defineColorPicker({
              key: chartConfigKey.headerColumnBackground,
              label: '背景填充',
              inline: true
            }),
            defineTextConfig(headerTextWrapperKey)
          ]
        }),
        defineSubCollapse({
          key: chartConfigKey.headerRowStyle,
          label: '行表头',
          type: 'collapse',
          children: [
            defineColorPicker({
              key: chartConfigKey.headerRowBackground,
              label: '背景填充',
              inline: true
            }),
            defineTextConfig(headerRowTextWrapperKey)
          ]
        })
      ]
    })
  ]),
  analyses: []
})
export const setChartConfigData = (mark: MarkNode, chartConfigStore: Partial<ChartStore>) => {}

export default defineChart(chartConfig, {
  id: componentID,
  icon: 'icon-Chart_Crosstab',
  name: componentName,
  description: '用来查看多个维度或度量的未汇总的明细数据。',
  dimensionDescription: '不限制维度个数',
  measureDescription: '不限制度量个数',
  component: defineAsyncComponent(() => import('./index.vue'))
})
