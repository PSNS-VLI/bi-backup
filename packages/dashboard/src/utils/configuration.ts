import type { Key } from '../types/common'
import type {
  FieldConfig,
  CollapseConfig,
  SubCollapseConfig,
  ConfigItemBase,
  ConfigCheckbox,
  ConfigCheckboxGroup,
  ConfigRadioGroup,
  ConfigRadioIconGroup,
  ConfigRadioTab,
  ConfigRadioGroupNest,
  ChartConfig,
  BaseConfig,
  ConfigInput,
  ConfigSelect,
  ConfigColorPicker,
  ConfigTextStyle,
  ConfigInputNumber,
  ConfigTextWrapper,
  ConfigCheckboxWrapper,
  ConfigKeymapWrapper,
  ChartConfigStore,
  ConfigCustom
} from '../types/configuration'
import {
  ConfigItemType,
  ConfigTextStyleType,
  ConfigTextStyleFontStyle,
  ConfigTextStyleFontWeight,
  ConfigTextStyleTextAlign,
  FieldConfigType
} from '../types/configuration'
import { FieldClass } from '../types/dataset'

export function isWhat<T extends ConfigItemBase>(
  config: BaseConfig,
  type: ConfigItemType
): config is T {
  return (<ConfigItemBase>config).type === type
}

export function isSubCollapse(
  collapse: BaseConfig | SubCollapseConfig
): collapse is SubCollapseConfig {
  return (<SubCollapseConfig>collapse).type === 'collapse'
}

export function isCheckbox(config: BaseConfig): config is ConfigCheckbox {
  return isWhat<ConfigCheckbox>(config, ConfigItemType.CHECKBOX)
}

export function isCheckboxGroup<T>(config: BaseConfig): config is ConfigCheckboxGroup<T> {
  return isWhat<ConfigCheckboxGroup<T>>(config, ConfigItemType.CHECKBOX_GROUP)
}

export function isRadioGroup<T>(config: BaseConfig): config is ConfigRadioGroup<T> {
  return isWhat<ConfigRadioGroup<T>>(config, ConfigItemType.RADIO_GROUP)
}

export function isRadioIconGroup<T>(config: BaseConfig): config is ConfigRadioIconGroup<T> {
  return isWhat<ConfigRadioIconGroup<T>>(config, ConfigItemType.RADIO_ICON_GROUP)
}

export function isRadioTab<T>(config: BaseConfig): config is ConfigRadioTab<T> {
  return isWhat<ConfigRadioTab<T>>(config, ConfigItemType.RADIO_TAB)
}

export function isRadioGroupNest<T, U>(config: BaseConfig): config is ConfigRadioGroupNest<T, U> {
  return isWhat<ConfigRadioGroupNest<T, U>>(config, ConfigItemType.RADIO_GROUP_NEST)
}

export function isInput(config: BaseConfig): config is ConfigInput {
  return isWhat<ConfigInput>(config, ConfigItemType.INPUT)
}

export function isInputNumber(config: BaseConfig): config is ConfigInputNumber {
  return isWhat<ConfigInputNumber>(config, ConfigItemType.INPUT_NUMBER)
}

export function isSelect<T>(config: BaseConfig): config is ConfigSelect<T> {
  return isWhat<ConfigSelect<T>>(config, ConfigItemType.SELECT)
}

export function isColorPicker(config: BaseConfig): config is ConfigColorPicker {
  return isWhat<ConfigColorPicker>(config, ConfigItemType.COLOR_PICKER)
}

export function isTextStyle(config: BaseConfig): config is ConfigTextStyle {
  return isWhat<ConfigTextStyle>(config, ConfigItemType.TEXT_STYLE)
}

export function isTextWrapper(config: BaseConfig): config is ConfigTextWrapper {
  return isWhat<ConfigTextWrapper>(config, ConfigItemType.TEXT_WRAPPER)
}

export function isCheckboxWrapper(config: BaseConfig): config is ConfigCheckboxWrapper {
  return isWhat<ConfigCheckboxWrapper>(config, ConfigItemType.CHECKBOX_WRAPPER)
}

export function isKeymapWrapper(config: BaseConfig): config is ConfigKeymapWrapper {
  return isWhat<ConfigKeymapWrapper>(config, ConfigItemType.KEYMAP_WRAPPER)
}

export function isCustom(config: BaseConfig): config is ConfigCustom {
  return isWhat<ConfigCustom>(config, ConfigItemType.CUSTOM)
}

const defineConfig = <T>(config: T) => config
const defineConfigItem = <T, OMIT extends string = ''>(type: ConfigItemType) => {
  return (config: Omit<T, 'type' | OMIT>) => Object.assign({}, { type }, config) as T
}

const defineFieldConfig = (config: FieldConfig): FieldConfig => {
  return Object.assign({}, config, {
    label:
      config.label +
      (config.fieldClass ? (config.fieldClass === FieldClass.DIMENSION ? '/维度' : '/度量') : '')
  })
}
export const defineField = (config: Omit<FieldConfig, 'type'>): FieldConfig =>
  defineFieldConfig({
    type: FieldConfigType.FIELD,
    ...config
  })

export const defineFieldFilter = (config: Omit<FieldConfig, 'type'>): FieldConfig =>
  defineFieldConfig({
    type: FieldConfigType.FIELD_FILTER,
    ...config
  })

export const defineCheckbox = defineConfigItem<ConfigCheckbox>(ConfigItemType.CHECKBOX)

export const defineCheckboxGroup = <T>(config: Omit<ConfigCheckboxGroup<T>, 'type'>) =>
  Object.assign({}, { type: ConfigItemType.CHECKBOX_GROUP }, config) as ConfigCheckboxGroup<T>

export const defineRadioGroup = <T>(config: Omit<ConfigRadioGroup<T>, 'type'>) =>
  Object.assign({}, { type: ConfigItemType.RADIO_GROUP }, config) as ConfigRadioGroup<T>

export const defineRadioIconGroup = <T>(config: Omit<ConfigRadioIconGroup<T>, 'type'>) =>
  Object.assign({}, { type: ConfigItemType.RADIO_ICON_GROUP }, config) as ConfigRadioIconGroup<T>

export const defineRadioTab = <T>(config: Omit<ConfigRadioTab<T>, 'type'>) =>
  Object.assign({}, { type: ConfigItemType.RADIO_TAB }, config) as ConfigRadioTab<T>

type ConfigRadioType = 'RADIO_GROUP' | 'RADIO_ICON_GROUP' | 'RADIO_TAB'
const getRadioType = (radioType: ConfigRadioType) => {
  let res: ConfigItemType = ConfigItemType.RADIO_GROUP

  switch (radioType) {
    case 'RADIO_ICON_GROUP':
      res = ConfigItemType.RADIO_ICON_GROUP
      break
    case 'RADIO_TAB':
      res = ConfigItemType.RADIO_TAB
      break
    default:
      break
  }

  return res
}
export const defineRadioGroupNest = <T, U>(
  levelOneType: ConfigRadioType,
  levelTwoType: ConfigRadioType,
  config: Omit<ConfigRadioGroupNest<T, U>, 'type' | 'levelOneType' | 'levelTwoType'>
) => {
  return Object.assign(
    {},
    {
      type: ConfigItemType.RADIO_GROUP_NEST,
      levelOneType: getRadioType(levelOneType),
      levelTwoType: getRadioType(levelTwoType)
    },
    config
  ) as ConfigRadioGroupNest<T, U>
}

export const defineInput = defineConfigItem<ConfigInput>(ConfigItemType.INPUT)
export const defineInputNumber = defineConfigItem<ConfigInputNumber>(ConfigItemType.INPUT_NUMBER)
export const defineSelect = defineConfigItem<ConfigSelect<any>>(ConfigItemType.SELECT)
export const defineColorPicker = defineConfigItem<ConfigColorPicker>(ConfigItemType.COLOR_PICKER)
export const defineTextStyle = (
  config: Omit<ConfigTextStyle, 'type' | 'default' | 'layouts'> & {
    default?: {
      fontWeight?: 'normal' | 'bold' | string
      fontStyle?: 'normal' | 'italic' | string
      textAlign?: 'start' | 'center'
    }
    layouts?: Array<'fontWeight' | 'fontStyle' | 'textAlign'>
  }
) => {
  const res = {}

  Object.assign(res, config, {
    type: ConfigItemType.TEXT_STYLE
  })

  if (config.default) {
    Object.assign(res, {
      default: {
        fontWeight:
          config.default.fontWeight === 'bold'
            ? ConfigTextStyleFontWeight.BOLD
            : ConfigTextStyleFontWeight.NORMAL,
        fontStyle:
          config.default.fontStyle === 'italic'
            ? ConfigTextStyleFontStyle.ITALIC
            : ConfigTextStyleFontStyle.NORMAL,
        textAlign:
          config.default.textAlign === 'center'
            ? ConfigTextStyleTextAlign.CENTER
            : ConfigTextStyleTextAlign.START
      }
    })
  }

  if (config.layouts) {
    Object.assign(res, {
      layouts: config.layouts.map((layout) => {
        let realLayout: ConfigTextStyleType | string = ''

        switch (layout) {
          case 'fontWeight':
            realLayout = ConfigTextStyleType.FONT_WEIGHT
            break
          case 'fontStyle':
            realLayout = ConfigTextStyleType.FONT_STYLE
            break
          case 'textAlign':
            realLayout = ConfigTextStyleType.TEXT_ALIGN
            break
        }

        return realLayout
      })
    })
  }

  return res as ConfigTextStyle
}
export const defineTextWrapper = defineConfigItem<ConfigTextWrapper>(ConfigItemType.TEXT_WRAPPER)
export const defineCheckboxWrapper = defineConfigItem<ConfigCheckboxWrapper>(
  ConfigItemType.CHECKBOX_WRAPPER
)
export const defineKeymapWrapper = defineConfigItem<ConfigKeymapWrapper, 'label'>(
  ConfigItemType.KEYMAP_WRAPPER
)
export const defineCustom = defineConfigItem<ConfigCustom>(ConfigItemType.CUSTOM)

export const defineCollapse = defineConfig<CollapseConfig<ConfigItemBase>>
export const defineSubCollapse = defineConfig<SubCollapseConfig<ConfigItemBase>>

export const defineChartConfig = defineConfig<ChartConfig>

export const defineConfigKey = (prefix: string, configKeys: Array<string>) => {
  const keyMap: Record<string, string> = {}

  for (const key of configKeys) {
    keyMap[key] = `${prefix}_${key}`
  }

  return keyMap
}

export const initFieldConfigData = (fieldConfigs: Array<FieldConfig>) => {
  const data: Record<Key, Array<any>> = {}

  fieldConfigs.forEach((fieldConfig) => {
    data[fieldConfig.key] = []
  })

  return data
}

export const initConfigItem = (baseConfigs: Array<BaseConfig>, data: Record<Key, any>) => {
  baseConfigs.forEach((baseConfig) => {
    const defaultVal = (baseConfig as ConfigItemBase).default
    switch (true) {
      case isRadioGroupNest(baseConfig):
        data[baseConfig.key] = {
          [baseConfig.keyMap.levelOne]: baseConfig.default.levelOne,
          [baseConfig.keyMap.levelTwo]: baseConfig.default.levelTwo
        }
        break
      case isCheckboxGroup(baseConfig):
        data[baseConfig.key] = baseConfig.default || []
        break
      case isTextStyle(baseConfig):
        data[baseConfig.key] = baseConfig.default || {}
        break
      case isTextWrapper(baseConfig):
        data[baseConfig.key] = baseConfig.default || {}
        if (baseConfig.children.length) {
          initConfigItem(baseConfig.children, data[baseConfig.key])
        }
        break
      case isCheckboxWrapper(baseConfig):
        data[baseConfig.key] = baseConfig.default || {}
        if (baseConfig.children.length) {
          initConfigItem(baseConfig.children, data[baseConfig.key])
        }
        break
      case isKeymapWrapper(baseConfig):
        data[baseConfig.key] = baseConfig.default || {}
        break
      case isInputNumber(baseConfig):
        if (baseConfig.attribute) {
          if (baseConfig.default) {
            if (baseConfig.attribute.max) {
              data[baseConfig.key] =
                baseConfig.default <= baseConfig.attribute.max
                  ? baseConfig.default
                  : baseConfig.attribute.max
            }
            if (baseConfig.attribute.min) {
              data[baseConfig.key] =
                baseConfig.default >= baseConfig.attribute.min
                  ? baseConfig.default
                  : baseConfig.attribute.min
            }
          } else {
            data[baseConfig.key] = baseConfig.attribute.min
          }
        }
        break
      default:
        if (defaultVal !== undefined) {
          data[baseConfig.key] = defaultVal
        }
        break
    }
  })
}

export const initCollapseConfigData = (collapses: Array<CollapseConfig>) => {
  const data: Record<Key, any> = {}

  collapses.forEach((collapse) => {
    const collapseItems: Array<BaseConfig> = []
    data[collapse.key] = {}
    collapse.children.forEach((subCollapse) => {
      if (isSubCollapse(subCollapse)) {
        data[collapse.key][subCollapse.key] = {}
        initConfigItem(subCollapse.children, data[collapse.key][subCollapse.key])
      } else {
        collapseItems.push(subCollapse)
      }
    })
    initConfigItem(collapseItems, data[collapse.key])
  })

  return data
}

export const initChartConfigData = (chartConfig: ChartConfig): ChartConfigStore => {
  return {
    fields: initFieldConfigData(chartConfig.fields),
    styles: initCollapseConfigData(chartConfig.styles),
    analyses: {}
  }
}
