import {
  keyIsValue,
  defineTextWrapper,
  defineColorPicker,
  defineInputNumber,
  defineTextStyle
} from '../../utils'

type TextConfigKey = {
  [key: string]: string
  color: string
  fontSize: string
  textStyle: string
}
const configKey: TextConfigKey = keyIsValue({
  color: '',
  fontSize: '',
  textStyle: ''
}) as TextConfigKey

export const getTextConfigKeyMap = (wrapperKey: string) => {
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
  } & TextConfigKey
}

export const defineTextConfig = (
  wrapperKey: string,
  options: {
    textLabel?: string
    fontSize?: number
    maxFontSize?: number
    fontWeight?: string
    fontStyle?: string
  } = {}
) => {
  const {
    textLabel = '文本',
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontSize = 12,
    maxFontSize = 30
  } = options
  const textConfigKey = getTextConfigKeyMap(wrapperKey)

  return defineTextWrapper({
    key: wrapperKey,
    label: textLabel,
    inline: true,
    children: [
      defineColorPicker({
        key: textConfigKey.color,
        label: '',
        inline: true
      }),
      defineInputNumber({
        key: textConfigKey.fontSize,
        label: '',
        inline: true,
        prefixIcon: 'icon-monitor',
        suffix: 'px',
        attribute: {
          min: 12,
          max: maxFontSize
        },
        default: fontSize
      }),
      defineTextStyle({
        key: textConfigKey.textStyle,
        label: '',
        inline: true,
        layouts: ['fontWeight', 'fontStyle'],
        default: {
          fontWeight: fontWeight,
          fontStyle: fontStyle
        }
      })
    ]
  })
}

export const getTextConfigData = (
  wrapperKey: string,
  configStore: Record<string, any> = {},
  options: {
    fontSizePixel?: boolean
  } = {}
) => {
  const { fontSizePixel = false } = options

  const textConfigKey = getTextConfigKeyMap(wrapperKey)
  const textConfigStore = configStore[textConfigKey.wrapperKey]
  const textStyleConfigStore = textConfigStore?.[textConfigKey.textStyle]

  const textConfigData = {
    color: textConfigStore?.[textConfigKey.color],
    fontSize: textConfigStore?.[textConfigKey.fontSize] + (fontSizePixel ? 'px' : 0),
    fontWeight: '',
    fontStyle: '',
    textAlign: ''
  }
  Object.assign(textConfigData, textStyleConfigStore)

  return textConfigData
}
