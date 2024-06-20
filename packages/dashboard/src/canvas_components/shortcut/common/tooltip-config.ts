import {
  keyIsValue,
  defineTextConfig,
  defineRadioGroup,
  defineCheckboxGroup,
  defineColorPicker,
  getTextConfigData,
  boolArray,
  type Field
} from '../../shortcut'
import type { MarkNode } from '@antv/g2'
import type { ChartStore } from '../types/chart'
type LegendConfigKey = {
  [key: string]: string
  tooltipConfigDisplayMethod: string
  tooltipConfigContent: string
  tooltipConfigBackgroundColor: string
}
const configKey: LegendConfigKey = keyIsValue({
  tooltipConfigDisplayMethod: '',
  tooltipConfigContent: '',
  tooltipConfigBackgroundColor: ''
}) as LegendConfigKey

const getTooltipConfigKeyMap = (wrapperKey: string) => {
  return Object.keys(configKey).reduce(
    (keyMap: Record<string, string>, key) => {
      keyMap[key] = `${wrapperKey}${configKey[key][0].toUpperCase()}${configKey[key].slice(1)}`

      return keyMap
    },
    {
      wrapperKey: wrapperKey
    }
  ) as {
    wrapperKey: string
  } & LegendConfigKey
}
type isShow = {
  isShowMethod?: Boolean
  isShowData?: Boolean
  isShowDimension?: Boolean
}
export const defineTooltipConfig = (
  wrapperKey: string,
  rest: isShow,
  defaultContent: string = ''
) => {
  const tooltipConfigKey = getTooltipConfigKeyMap(wrapperKey)
  const { isShowMethod, isShowData, isShowDimension } = rest
  return boolArray([
    (isShowMethod ?? true) &&
      defineRadioGroup({
        key: tooltipConfigKey.tooltipConfigDisplayMethod,
        label: '展示方式',
        options: [
          {
            label: '按单数据点',
            value: 'data',
            tooltip: {
              description: '展示鼠标悬浮的数据点所关联的数据'
            }
          },
          {
            label: '按维值',
            value: 'dimension',
            tooltip: {
              description: '展示相同维值下的所有数据'
            }
          }
        ],
        default: 'data'
      }),
    (isShowData ?? true) &&
      defineCheckboxGroup({
        displayController: (_, nearbyConfigStore) => {
          if (isShowMethod === undefined || isShowMethod) {
            return nearbyConfigStore?.[tooltipConfigKey.tooltipConfigDisplayMethod] === 'data'
          }
          return true
        },
        key: tooltipConfigKey.tooltipConfigContent,
        label: '内容',
        inline: true,
        options: [
          {
            label: '占比',
            value: 'proportion'
          }
        ],
        default: [defaultContent]
      }),
    (isShowDimension ?? true) &&
      defineCheckboxGroup({
        displayController: (_, nearbyConfigStore) => {
          return nearbyConfigStore?.[tooltipConfigKey.tooltipConfigDisplayMethod] === 'dimension'
        },
        key: tooltipConfigKey.tooltipConfigContent,
        label: '内容',
        inline: true,
        options: [
          {
            label: '总计',
            value: 'total'
          },
          {
            label: '占比',
            value: 'proportion'
          }
        ]
      }),
    defineColorPicker({
      key: tooltipConfigKey.tooltipConfigBackgroundColor,
      label: '背景色',
      inline: true
    }),
    defineTextConfig(wrapperKey)
  ])
}
interface TooltipData {
  title: String
  items: Array<TooltipItem>
}
interface TooltipItem {
  color: string
  name: string
  value: string
  percent: string
}
interface StyleData {
  tooltipDisplayMethod: string
  tooltipDisplayContent: Array<string>
  tooltipBackgroundColor: string
  tooltipTextStyle: TextStyle
}
interface TextStyle {
  color: string
  fontSize: string
  fontWeight: string
  fontStyle: string
}
export const getTooltipConfigData = (
  wrapperKey: string,
  chartConfig: Record<string, any> = {},
  mark: MarkNode
) => {
  const tooltipConfigKey = getTooltipConfigKeyMap(wrapperKey)
  const tooltipConfig = chartConfig?.[tooltipConfigKey.wrapperKey]
  // 展示的内容
  const tooltipDisplayMethod = tooltipConfig?.[tooltipConfigKey.tooltipConfigDisplayMethod]

  const tooltipDisplayContent = tooltipConfig?.[tooltipConfigKey.tooltipConfigContent]
  // 背景色
  const tooltipBackgroundColor = tooltipConfig?.[tooltipConfigKey.tooltipConfigBackgroundColor]
  // 文本
  const tooltipTextStyle = getTextConfigData(wrapperKey, tooltipConfig)
  mark.interaction('tooltip', {
    css: {
      '.g2-tooltip': {
        background: tooltipBackgroundColor,
        'font-size': tooltipTextStyle.fontSize + 'px',
        color: tooltipTextStyle.color,
        'font-weight': tooltipTextStyle.fontWeight
      },
      '.g2-tooltip-title': {
        'font-size': tooltipTextStyle.fontSize + 'px',
        color: tooltipTextStyle.color,
        'font-weight': tooltipTextStyle.fontWeight
      },
      '.g2-tooltip-list-item-value': {
        'font-size': tooltipTextStyle.fontSize + 'px',
        color: tooltipTextStyle.color,
        'font-weight': tooltipTextStyle.fontWeight
      }
    }
  })
  return {
    tooltipDisplayMethod,
    tooltipDisplayContent,
    tooltipBackgroundColor,
    tooltipTextStyle
  }
}
// export const tooltipRender = (
//   event: Object,
//   tooltipData: TooltipData,
//   tooltipStyle: StyleData,
//   chartData?: any
// ) => {
//   const { title, items } = tooltipData
//   let total: any = 0
//   items.forEach((item) => {
//     total += Number(item.value)
//   })
//   total = total.toFixed(2)
//   items.forEach((item) => {
//     if (chartData) {
//       // chartData.forEach((dataItem: any) => {
//       //   if (dataItem.item === item.name) {
//       //     item.percent = dataItem.percent
//       //   }
//       // })
//     } else {
//       item.percent = ((Number(item.value) / total) * 100).toFixed(1)
//     }
//   })
//   const { tooltipDisplayMethod, tooltipDisplayContent, tooltipBackgroundColor, tooltipTextStyle } =
//     tooltipStyle
//   const isShowProportion = tooltipDisplayContent?.includes('proportion') ? true : false
//   const isShowTotal = tooltipDisplayContent?.includes('total') ? true : false
//   const { color, fontSize, fontWeight, fontStyle } = tooltipTextStyle

//   return {
//     tooltipBackgroundColor,
//     color,
//     fontSize,
//     fontWeight,
//     fontStyle
//   }

//   // return `
//   // <div class="tooltip" style="background-color: ${tooltipBackgroundColor}; color: ${color};font-size: ${fontSize}px;font-weight: ${fontWeight}; font-style: ${fontStyle} ">
//   //   <h3 class="tooltip-title" style="${title ? '' : 'display: none;'}">${title}</h3>
//   //   <div class="tooltip-content">
//   //     ${items.map((d: TooltipItem) => {
//   //       return `<div style="display: flex;justify-content: space-between;">
//   //         <div>
//   //           <span class="marker" style="background-color: ${d.color}"></span>
//   //           <span >${d.name}</span>
//   //         </div>
//   //         <div><span>${d.value}</span><span style="${isShowProportion ? '' : 'display: none;'}">(${d.percent}%)</span></div>
//   //       </div>
//   //     `
//   //     })}
//   //     <div  style="${isShowTotal ? '' : 'display: none;'}">
//   //       <div style="display: flex;justify-content: space-between;">
//   //         <span>总计</span>
//   //         <span>
//   //           ${total}
//   //           <span style="${isShowProportion ? '' : 'display: none;'}">100%</span>
//   //         </span>
//   //       </div>
//   //     </div>
//   //   </div>
//   // </div>`
// }

export const customToolTip = (
  mark: MarkNode,
  store: Partial<ChartStore>,
  chartData: any,
  tooltipDisplayContent: any
) => {
  const measurements = store?.fields?.measurements as Field[]
  mark.tooltip({
    items: [
      (d, index, data, column) => {
        if (measurements.length === 1) {
          return {
            name: d.__BI_COLOR_KEY__,
            value: d[column.y.field]
          }
        } else {
          return {
            name: d.__BI_COLOR_KEY__,
            value: `${d[column.y.field]}${
              tooltipDisplayContent.includes('proportion')
                ? '(' + chartData[index]?.__BI_PERCENT_STR_VALUE_KEY__ + ')'
                : ''
            }
            `
          }
        }
      }
    ]
  })
}
