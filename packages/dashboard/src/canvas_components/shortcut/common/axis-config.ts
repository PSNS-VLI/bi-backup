import {
  keyIsValue,
  valueAsKey,
  boolArray,
  defineCollapse,
  defineSubCollapse,
  defineCheckbox,
  defineRadioGroup,
  defineInput,
  defineSelect,
  defineColorPicker,
  defineCheckboxWrapper,
  // common
  getTextConfigKeyMap,
  defineTextConfig,
  getTextConfigData
} from '../shortcut'

const axisConfigWrapperKeyMap = {
  axisConfig: 'axisConfig'
}

export const enum AxisLineType {
  SOLID,
  DASHED
}
const lineTypeOptions = [
  {
    label: '————',
    value: AxisLineType.SOLID
  },
  {
    label: '----',
    value: AxisLineType.DASHED
  }
]
const lineWidthOptions = [
  {
    label: '1px',
    value: 1
  },
  {
    label: '2px',
    value: 2
  },
  {
    label: '3px',
    value: 3
  },
  {
    label: '4px',
    value: 4
  }
]

const titleAndUnitStyleWrapperKey = 'titleAndUnitStyle'
const labelStyleWrapperKey = 'labelStyle'
const titleAndUnitStyleKeyMap = getTextConfigKeyMap(titleAndUnitStyleWrapperKey)
const labelStyleKeyMap = getTextConfigKeyMap(labelStyleWrapperKey)
const axisConfigGeneralKeyMap = keyIsValue({
  axis: '',
  showAxis: '',
  // title-and-unit
  titleAndUnit: '',
  showTitleAndUnit: '',
  titleAndUnitTitle: '',
  titleAndUnitUnit: '',
  ...valueAsKey(titleAndUnitStyleKeyMap),
  // axis-label
  label: '',
  showLabel: '',
  ...valueAsKey(labelStyleKeyMap),
  labelShowScale: '',
  // axis-line
  line: '',
  showLine: '',
  lineType: '',
  lineWidth: '',
  lineColor: '',
  // axis-grid-line
  gridLine: '',
  showGridLine: '',
  gridLineType: '',
  gridLineWidth: '',
  gridLineColor: ''
})

export const enum XAxisLabelDisplayRule {
  AUTO,
  MIN,
  MAX
}
const xAxisLabelDisplayRuleOptions = [
  {
    label: '智能展示',
    value: XAxisLabelDisplayRule.AUTO
  },
  {
    label: '强制稀疏',
    value: XAxisLabelDisplayRule.MIN
  },
  {
    label: '最多展示',
    value: XAxisLabelDisplayRule.MAX
  }
]
const xAxisConfigKeyMap = keyIsValue({
  labelDisplayRule: '',
  labelDisplayContent: ''
})

export const enum YAxisTitleAndUnitPosition {
  OUT,
  TOP
}
const yAxisTitleAndUnitPositionOptions = [
  {
    label: '轴外侧',
    value: YAxisTitleAndUnitPosition.OUT
  },
  {
    label: '轴上方',
    value: YAxisTitleAndUnitPosition.TOP
  }
]
const yAxisConfigKeyMap = keyIsValue({
  scaleReverse: '',
  titleAndUnitPosition: ''
})

type AxisType = 'x' | 'y'
const deduplicateAxes = (axes: Array<AxisType>) => {
  return axes.reduce((res: Array<AxisType>, axis) => {
    if (!res.includes(axis)) {
      res.push(axis)
    }
    return res
  }, [])
}
const getAxisConfigKey = (interpolation: AxisType, key: string) => {
  const prefix = axisConfigWrapperKeyMap.axisConfig
  key = `${key[0].toUpperCase()}${key.slice(1)}`

  return `${prefix}${interpolation.toUpperCase()}${key}`
}
const getAxisConfigKeyMap = (axis: AxisType) => {
  const keyMap = { ...axisConfigGeneralKeyMap }
  Object.assign(keyMap, axis === 'x' ? xAxisConfigKeyMap : yAxisConfigKeyMap)

  return Object.keys(keyMap).reduce((finalKeyMap: Record<string, string>, key) => {
    finalKeyMap[key] = getAxisConfigKey(axis, key)

    return finalKeyMap
  }, {})
}

export const getAxesConfigKeyMap = (axes: Array<AxisType>) => {
  axes = deduplicateAxes(axes)

  return axes.reduce(
    (finalKeyMap: Record<string, string>, axisType) => {
      const baseKeyMap = Object.assign(
        {},
        axisConfigGeneralKeyMap,
        axisType === 'x' ? xAxisConfigKeyMap : yAxisConfigKeyMap
      )

      const newKeyMap = Object.keys(baseKeyMap).reduce((newKeyMap: Record<string, string>, key) => {
        const uniKey = getAxisConfigKey(axisType, key)
        newKeyMap[uniKey] = uniKey

        return newKeyMap
      }, {})

      Object.assign(finalKeyMap, newKeyMap)

      return finalKeyMap
    },
    { ...axisConfigWrapperKeyMap }
  )
}
export const defineAxesConfig = (axes: Array<AxisType>) => {
  axes = deduplicateAxes(axes)

  return defineCollapse({
    key: axisConfigWrapperKeyMap.axisConfig,
    label: '坐标轴',
    children: axes.map((axis) => {
      const configKey = getAxisConfigKeyMap(axis)

      const axisName = `${axis === 'x' ? 'X' : 'Y'}轴`
      return defineSubCollapse({
        key: configKey.axis,
        label: axisName,
        type: 'collapse',
        children: boolArray([
          defineCheckbox({
            key: configKey.showAxis,
            label: `显示${axisName}`,
            default: true
          }),
          axis === 'y' &&
            defineCheckbox({
              key: configKey.scaleReverse,
              label: 'Y轴刻度反转'
            }),
          defineCheckboxWrapper({
            key: configKey.titleAndUnit,
            checkboxKey: configKey.showTitleAndUnit,
            label: '显示标题和单位',
            children: boolArray([
              defineInput({
                key: configKey.titleAndUnitTitle,
                label: '标题',
                placeholder: '标题名称',
                inline: true
              }),
              defineInput({
                key: configKey.titleAndUnitUnit,
                label: '单位',
                placeholder: '单位',
                inline: true
              }),
              axis === 'y' &&
                defineSelect({
                  key: configKey.titleAndUnitPosition,
                  label: '位置',
                  tooltip: {
                    description: '双y轴下，两侧轴标题位置会同步'
                  },
                  inline: true,
                  options: yAxisTitleAndUnitPositionOptions,
                  default: YAxisTitleAndUnitPosition.OUT
                }),
              defineTextConfig(titleAndUnitStyleWrapperKey)
            ])
          }),
          defineCheckboxWrapper({
            key: configKey.label,
            checkboxKey: configKey.showLabel,
            label: '显示轴标签',
            children: boolArray([
              axis === 'x' &&
                defineRadioGroup({
                  key: configKey.labelDisplayRule,
                  label: '轴标签显示规则',
                  options: xAxisLabelDisplayRuleOptions as any[],
                  default: XAxisLabelDisplayRule.AUTO
                }),
              defineTextConfig(labelStyleWrapperKey),
              defineCheckbox({
                key: configKey.labelShowScale,
                label: '显示刻度线',
                default: true
              })
            ])
          }),
          axis === 'x' &&
            defineSelect({
              key: configKey.labelDisplayContent,
              label: '展示内容',
              inline: true,
              options: []
            }),
          defineCheckboxWrapper({
            key: configKey.line,
            checkboxKey: configKey.showLine,
            label: '显示坐标轴',
            children: [
              defineSelect({
                key: configKey.lineType,
                label: '',
                inline: true,
                options: lineTypeOptions,
                default: AxisLineType.SOLID
              }),
              defineSelect({
                key: configKey.lineWidth,
                label: '',
                inline: true,
                options: lineWidthOptions,
                default: lineWidthOptions[0].value
              }),
              defineColorPicker({
                key: configKey.lineColor,
                label: '',
                inline: true
              })
            ]
          }),
          defineCheckboxWrapper({
            key: configKey.gridLine,
            checkboxKey: configKey.showGridLine,
            label: '显示网格线',
            children: [
              defineSelect({
                key: configKey.gridLineType,
                label: '',
                inline: true,
                options: lineTypeOptions,
                default: AxisLineType.DASHED
              }),
              defineSelect({
                key: configKey.gridLineWidth,
                label: '',
                inline: true,
                options: lineWidthOptions,
                default: lineWidthOptions[0].value
              }),
              defineColorPicker({
                key: configKey.gridLineColor,
                label: '',
                inline: true
              })
            ]
          })
        ])
      })
    })
  })
}
export const getAxesConfigData = (axes: Array<AxisType>, configStore: Record<string, any> = {}) => {
  axes = deduplicateAxes(axes)

  return axes.reduce((axesConfigData, axis) => {
    const configKey = getAxisConfigKeyMap(axis)

    const axisConfigStore = configStore?.[axisConfigWrapperKeyMap.axisConfig]?.[configKey.axis]
    const axisConfig: Record<string, any> =
      axis === 'x'
        ? {
            labelAlign: 'horizontal',
            tick: false
          }
        : {}

    if (!axisConfigStore?.[configKey.showAxis]) {
      Object.assign(axesConfigData, { [axis]: false })
      return axesConfigData
    }

    const titleAndUnit = axisConfigStore?.[configKey.titleAndUnit]
    if (titleAndUnit?.[configKey.showTitleAndUnit]) {
      const titleAndUnitStyle = getTextConfigData(titleAndUnitStyleWrapperKey, titleAndUnit)

      Object.assign(axisConfig, {
        title: `${titleAndUnit?.[configKey.titleAndUnitTitle] ?? ''}${titleAndUnit?.[configKey.titleAndUnitUnit] ? `(${titleAndUnit?.[configKey.titleAndUnitUnit]})` : ''}`,
        titleFontSize: titleAndUnitStyle.fontSize,
        titleFill: titleAndUnitStyle.color,
        titleFontWeight: titleAndUnitStyle.fontWeight
      })
    } else {
      Object.assign({
        title: undefined,
        titleFontSize: undefined,
        titleFill: undefined,
        titleFontWeight: undefined
      })
    }

    const label = axisConfigStore?.[configKey.label]

    if (label?.[configKey.showLabel]) {
      const labelStyle = getTextConfigData(labelStyleWrapperKey, label)

      Object.assign(axisConfig, {
        labelFontSize: labelStyle.fontSize,
        labelFill: labelStyle.color,
        labelFontWeight: labelStyle.fontWeight,
        tick: label?.[configKey.labelShowScale]
      })
    } else {
      axisConfig.label = false
    }

    const line = axisConfigStore?.[configKey.line]
    if (line?.[configKey.showLine]) {
      Object.assign(axisConfig, {
        line: true,
        lineLineWidth: line?.[configKey.lineWidth],
        lineLineDash: line?.[configKey.lineType] === AxisLineType.SOLID ? [0, 0] : [2, 10],
        lineStroke: line?.[configKey.lineColor]
      })
    } else {
      axisConfig.line = false
    }

    const gridLine = axisConfigStore?.[configKey.gridLine]
    if (gridLine?.[configKey.showGridLine]) {
      Object.assign(axisConfig, {
        grid: true,
        gridLineWidth: gridLine?.[configKey.gridLineWidth],
        gridLineDash: gridLine?.[configKey.gridLineType] === AxisLineType.SOLID ? [0, 0] : [2, 10],
        gridStroke: gridLine?.[configKey.gridLineColor]
      })
    } else {
      axisConfig.grid = false
    }

    Object.assign(axesConfigData, { [axis]: axisConfig })
    return axesConfigData
  }, {})
}
