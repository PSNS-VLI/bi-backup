import type { Component as VueComponent } from 'vue'

import type { Key } from './common'
import type { FieldClass } from './dataset'

export interface ConfigLabel {
  label: string
  tooltip?: ConfigTooltip
}

export interface ConfigTooltip {
  description?: string
}

export interface BaseConfig {
  key: Key
}

interface BaseCollapseConfig<T> extends ConfigLabel {
  children: Array<T>
  switcherKey?: string
}

export interface CollapseConfig<T extends BaseConfig = BaseConfig>
  extends Exclude<BaseConfig, 'component'>,
    BaseCollapseConfig<SubCollapseConfig<T> | T> {}

export interface SubCollapseConfig<T extends BaseConfig = BaseConfig, U = 'collapse'>
  extends BaseConfig,
    BaseCollapseConfig<T> {
  type: U
}

export const enum ConfigItemType {
  CHECKBOX,
  CHECKBOX_GROUP,
  RADIO_GROUP,
  RADIO_ICON_GROUP,
  RADIO_TAB,
  RADIO_GROUP_NEST,
  INPUT,
  INPUT_NUMBER,
  SELECT,
  COLOR_PICKER,
  TEXT_STYLE,
  TEXT_WRAPPER,
  CHECKBOX_WRAPPER,
  KEYMAP_WRAPPER,
  CUSTOM
}

export interface ConfigItemBase extends BaseConfig, ConfigLabel {
  type?: ConfigItemType
  default?: any
  inline?: boolean
  displayController?: (
    configStore: ChartConfigStore,
    nearbyConfigStore: Record<Key, any>
  ) => boolean
}

interface OptionsComputer<T> {
  optionsComputer?: {
    chartStoreComputer?: (configStore: ChartConfigStore) => Array<ConfigLabel & { value: T }>
    chartDataComputer?: (chartData: Array<any>) => Array<ConfigLabel & { value: T }>
  }
}

export interface ConfigCheckbox extends ConfigItemBase {
  type: ConfigItemType.CHECKBOX
  default?: boolean
}

export interface ConfigCheckboxGroup<T> extends ConfigItemBase {
  type: ConfigItemType.CHECKBOX_GROUP
  options: Array<ConfigLabel & { value: T }>
  default?: Array<T>
}

export interface ConfigRadioGroup<T> extends ConfigItemBase, OptionsComputer<T> {
  type: ConfigItemType.RADIO_GROUP
  options: Array<ConfigLabel & { value: T }>
  default: T
}

export interface ConfigRadioIconGroup<T> extends ConfigItemBase {
  type: ConfigItemType.RADIO_ICON_GROUP
  options: Array<ConfigLabel & { value: T; iconClass: string }>
  hideOptionLabel: boolean
  default: T
}

export interface ConfigRadioTab<T> extends ConfigItemBase {
  type: ConfigItemType.RADIO_TAB
  options: Array<ConfigLabel & { value: T }>
  default: T
}

type ConfigRadioType =
  | ConfigItemType.RADIO_GROUP
  | ConfigItemType.RADIO_ICON_GROUP
  | ConfigItemType.RADIO_TAB
export interface ConfigRadioGroupNest<T, U> extends ConfigItemBase {
  type: ConfigItemType.RADIO_GROUP_NEST
  levelOneType: ConfigRadioType
  levelTwoType: ConfigRadioType
  options: Array<
    ConfigLabel & {
      value: T
      iconClass?: string
      options: Array<ConfigLabel & { value: U; iconClass?: string }>
    }
  >
  keyMap: {
    levelOne: Key
    levelTwo: Key
  }
  default: {
    levelOne: T
    levelTwo: U
  }
}

export interface ConfigInput extends ConfigItemBase {
  type: ConfigItemType.INPUT
  placeholder?: string
  default?: string
}

export interface ConfigInputNumber extends ConfigItemBase {
  type: ConfigItemType.INPUT_NUMBER
  prefix?: string
  prefixIcon?: string
  suffix?: string
  placeholder?: string
  default?: number
  attribute?: Record<string, any>
}

export interface ConfigSelect<T> extends ConfigItemBase, OptionsComputer<T> {
  type: ConfigItemType.SELECT
  options?: Array<ConfigLabel & { value: T }>
  placeholder?: string
  default?: T
}

export interface ConfigColorPicker extends ConfigItemBase {
  type: ConfigItemType.COLOR_PICKER
  predefineColors?: string[]
  default?: string
}

export const enum ConfigTextStyleType {
  FONT_WEIGHT = 'fontWeight',
  FONT_STYLE = 'fontStyle',
  TEXT_ALIGN = 'textAlign'
}
export const enum ConfigTextStyleFontWeight {
  NORMAL = 'normal',
  BOLD = 'bold'
}
export const enum ConfigTextStyleFontStyle {
  NORMAL = 'normal',
  ITALIC = 'italic'
}
export const enum ConfigTextStyleTextAlign {
  START = 'start',
  CENTER = 'center'
}
export interface ConfigTextStyle extends ConfigItemBase {
  type: ConfigItemType.TEXT_STYLE
  layouts?: Array<ConfigTextStyleType>
  keyMap?: {
    fontWeight?: Key
    fontStyle?: Key
    textAlign?: Key
  }
  default?: {
    fontWeight?: ConfigTextStyleFontWeight
    fontStyle?: ConfigTextStyleFontStyle
    textAlign?: ConfigTextStyleTextAlign
  }
}

export interface ConfigTextWrapper extends ConfigItemBase {
  type: ConfigItemType.TEXT_WRAPPER
  children: Array<ConfigItemBase>
  flexColumn?: boolean
}

export interface ConfigCheckboxWrapper extends ConfigItemBase {
  type: ConfigItemType.CHECKBOX_WRAPPER
  children: Array<ConfigItemBase>
  checkboxKey?: Key
  default?: Record<Key, any>
  defaultCheckbox?: boolean
  excludeKeys?: Array<Key>
  hideChildren?: boolean
}

export interface ConfigKeymapWrapper extends ConfigItemBase {
  type: ConfigItemType.KEYMAP_WRAPPER
  mapper: Exclude<ConfigSelect<Key>, 'key'> | Exclude<ConfigRadioGroup<Key>, 'key'>
  children: Array<ConfigItemBase>
}

export interface ConfigCustom extends ConfigItemBase {
  type: ConfigItemType.CUSTOM
  component: VueComponent
  attributes?: Record<string, any>
}

export const enum FieldConfigType {
  FIELD,
  FIELD_FILTER
}
export interface FieldConfig extends BaseConfig, ConfigLabel {
  type: FieldConfigType
  required?: boolean
  unique?: boolean
  fieldsNumLimit?: number
  fieldClass?: FieldClass
}

export interface StyleConfig extends CollapseConfig<ConfigItemBase> {}

export interface StyleItemConfig extends ConfigLabel, ConfigItemBase {
  children?: Array<ConfigItemBase>
}

export interface AnalysisConfig extends StyleConfig {}

export interface ChartConfig {
  fields: Array<FieldConfig>
  styles: Array<StyleConfig>
  analyses: Array<AnalysisConfig>
}

export interface ChartConfigStore extends Record<Key, any> {
  fields: Record<Key, any>
  styles: Record<Key, any>
  analyses: Record<Key, any>
}
