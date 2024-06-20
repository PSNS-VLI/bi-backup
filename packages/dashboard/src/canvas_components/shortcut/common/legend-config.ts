import {
  keyIsValue,
  defineTextConfig,
  defineRadioGroupNest,
  getTextConfigData
} from '../../shortcut'
type LegendConfigKey = {
  [key: string]: string
  legendConfigLegendPosition: string
  legendConfigLegendPositionDirection: string
  legendConfigLegendPositionAlign: string
}
const configKey: LegendConfigKey = keyIsValue({
  legendConfigLegendPosition: '',
  legendConfigLegendPositionDirection: '',
  legendConfigLegendPositionAlign: ''
}) as LegendConfigKey

const getLegendConfigKeyMap = (wrapperKey: string) => {
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

export const defineLegendConfig = (wrapperKey: string) => {
  const legendConfigKey = getLegendConfigKeyMap(wrapperKey)
  return [
    defineRadioGroupNest('RADIO_ICON_GROUP', 'RADIO_TAB', {
      key: legendConfigKey.legendConfigLegendPosition,
      label: '位置',
      inline: true,
      keyMap: {
        levelOne: legendConfigKey.legendConfigLegendPositionDirection,
        levelTwo: legendConfigKey.legendConfigLegendPositionAlign
      },
      options: [
        {
          label: '上',
          iconClass: 'icon-Up',
          value: 'top',
          options: [
            {
              label: '居左',
              value: 'flex-start'
            },
            {
              label: '居中',
              value: 'center'
            },
            {
              label: '居右',
              value: 'flex-end'
            }
          ]
        },
        {
          label: '下',
          iconClass: 'icon-Down',
          value: 'bottom',
          options: [
            {
              label: '居左',
              value: 'flex-start'
            },
            {
              label: '居中',
              value: 'center'
            },
            {
              label: '居右',
              value: 'flex-end'
            }
          ]
        },
        {
          label: '左',
          iconClass: 'icon-Left',
          value: 'left',
          options: [
            {
              label: '居上',
              value: 'flex-start'
            },
            {
              label: '居中',
              value: 'center'
            },
            {
              label: '居下',
              value: 'flex-end'
            }
          ]
        },
        {
          label: '右',
          iconClass: 'icon-Right',
          value: 'right',
          options: [
            {
              label: '居上',
              value: 'flex-start'
            },
            {
              label: '居中',
              value: 'center'
            },
            {
              label: '居下',
              value: 'flex-end'
            }
          ]
        }
      ],
      default: {
        levelOne: 'top',
        levelTwo: 'center'
      }
    }),
    defineTextConfig(wrapperKey)
  ]
}
export const getChartConfigData = (wrapperKey: string, chartConfig: Record<string, any> = {}) => {
  const legendConfigKey = getLegendConfigKeyMap(wrapperKey)
  const legendConfig = chartConfig?.[legendConfigKey.wrapperKey]
  const position =
    legendConfig?.[legendConfigKey.legendConfigLegendPosition]?.[
      legendConfigKey.legendConfigLegendPositionDirection
    ]
  const layout =
    legendConfig?.[legendConfigKey.legendConfigLegendPosition]?.[
      legendConfigKey.legendConfigLegendPositionAlign
    ]
  const legendStyle = getTextConfigData(wrapperKey, legendConfig)

  return {
    position: position,
    layout: { justifyContent: layout },
    cols: '',
    itemLabelFill: legendStyle.color,
    itemLabelFontSize: legendStyle.fontSize,
    itemLabelFontWeight: legendStyle.fontWeight,
    itemLabelFontFamily: legendStyle.fontStyle
  }
}
