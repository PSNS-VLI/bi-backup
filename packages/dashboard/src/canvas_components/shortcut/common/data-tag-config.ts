import {
  keyIsValue,
  defineCheckbox,
  defineCheckboxGroup,
  defineSelect,
  defineTextConfig,
  getTextConfigData
} from '../../shortcut'

type DataTagConfigKey = {
  [key: string]: string
  dataTagConfigFullDisplay: string
  dataTagConfigDigit: string
  dataTagConfigContent: string
  dataTagConfigPosition: string
}
const configKey: DataTagConfigKey = keyIsValue({
  dataTagConfigFullDisplay: '',
  dataTagConfigDigit: '',
  dataTagConfigContent: '',
  dataTagConfigPosition: ''
}) as DataTagConfigKey

export const getDataTagConfigKeyMap = (wrapperKey: string) => {
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
  } & DataTagConfigKey
}
type Checkbox = {
  checkboxContentOptions?: Option[] | undefined
  checkboxContentDefault?: Array<string>
  labelPosition?: Option[]
  labelPositionDefault?: string
}
type Option = {
  label: string
  value: string
}
const contentOptions = [{ label: '', value: '' }]
export const defineDataTagConfig = (wrapperKey: string, rest: Checkbox) => {
  const textConfigKey = getDataTagConfigKeyMap(wrapperKey)
  return [
    defineCheckbox({
      key: textConfigKey.dataTagConfigFullDisplay,
      label: '全量显示'
    }),
    defineCheckboxGroup({
      key: textConfigKey.dataTagConfigContent,
      label: '内容',
      inline: true,
      options: rest.checkboxContentOptions ?? contentOptions,
      default: rest.checkboxContentDefault
    }),
    defineTextConfig(wrapperKey),
    defineSelect({
      key: textConfigKey.dataTagConfigDigit,
      label: '占比小数位数',
      inline: true,
      options: [
        {
          label: '0',
          value: 'zero'
        },
        {
          label: '1',
          value: 'one'
        },
        {
          label: '2',
          value: 'two'
        }
      ],
      default: 'two'
    }),
    defineSelect({
      key: textConfigKey.dataTagConfigPosition,
      label: '位置',
      inline: true,
      options: rest.labelPosition ?? contentOptions,
      default: rest.labelPositionDefault
    })
  ]
}
export const getDataTagConfigData = (wrapperKey: string, configStore: Record<string, any> = {}) => {
  const textConfigKey = getDataTagConfigKeyMap(wrapperKey)
  // 文本样式
  const dataStyle = getTextConfigData(wrapperKey, configStore[textConfigKey.wrapperKey])
  // 占比小数位数
  const digit = configStore?.[wrapperKey]?.[textConfigKey.dataTagConfigDigit]
  const position = configStore?.[wrapperKey]?.[textConfigKey.dataTagConfigPosition]
  const fullDisplay = configStore?.[wrapperKey]?.[textConfigKey.dataTagConfigFullDisplay]
  const content = configStore?.[wrapperKey]?.[textConfigKey.dataTagConfigContent]
  return {
    position: position ?? 'outside',
    fontWeight: dataStyle.fontWeight,
    fontSize: dataStyle.fontSize,
    fill: dataStyle.color,
    digit,
    fullDisplay,
    content
  }
}
