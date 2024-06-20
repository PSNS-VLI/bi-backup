import {
  DatasetNodeType,
  FieldType,
  FieldNodeType,
  FieldDataFormatType,
  FieldSortType,
  FieldAggregationType,
  FieldNullDisplayType,
  FieldClass
} from '../types/dataset'
import type { Dataset, Field, FieldSettings } from '../types/dataset'

export const getDatasetIconByNodeType = (dataSet: Dataset) => {
  let icon = ''

  switch (dataSet.nodeType) {
    case DatasetNodeType.FOLDER:
      icon = 'icon-folder-opened'
      break
    case DatasetNodeType.DATASET:
      icon = ''
      break
    default:
      break
  }

  return icon
}

export const getFieldIconByType = (field: Field): string => {
  let icon = ''
  switch (field.type) {
    case FieldType.DATE:
      icon = 'icon-date'
      break
    case FieldType.DOUBLE:
      icon = 'icon-num'
      break
    case FieldType.NUMBER:
      icon = 'icon-num'
      break
    case FieldType.GEOGRAPHY:
      icon = ''
      break
    case FieldType.STRING:
      icon = 'icon-str'
      break
    default:
      break
  }
  return icon
}

export const getFieldIconByNodeType = (field: Field): string => {
  let icon = ''
  switch (field.nodeType) {
    case FieldNodeType.FOLDER:
      icon = 'icon-folder-opened'
      break
    case FieldNodeType.FIELD_SET:
      icon = 'icon-zuzhijigou-'
      break
    case FieldNodeType.FIELD:
      icon = getFieldIconByType(field)
      break
    default:
      break
  }
  return icon
}

export const FieldDataFormatTypeMap: Record<FieldDataFormatType, string> = {
  [FieldDataFormatType.AUTO]: '自动',
  [FieldDataFormatType.INTEGER]: '整数',
  [FieldDataFormatType.KEEP_ONE_DECIMAL]: '保留1位小数',
  [FieldDataFormatType.KEEP_TWO_DECIMALS]: '保留2位小数',
  [FieldDataFormatType.PERCENTAGE]: '百分比',
  [FieldDataFormatType.KEEP_ONE_DECIMAL_PERCENTAGE]: '百分比1位小数',
  [FieldDataFormatType.KEEP_TWO_DECIMALS_PERCENTAGE]: '百分比2位小数',
  [FieldDataFormatType.CUSTOM]: '自定义'
}

const setFieldSettings = (field: Field, callback: (settings: FieldSettings) => void) => {
  Object.assign(field.settings, {
    nullDisplay: {
      nullValue: FieldNullDisplayType.AUTO
    }
  })

  callback(field.settings)

  return field
}

export const setFieldDataFormat = (field: Field, value: FieldDataFormatType) =>
  setFieldSettings(field, (fieldSettings) => {
    Object.assign(fieldSettings, {
      dataFormat: value
    })
  })

export const FieldSortTypeMap: Record<FieldSortType, string> = {
  [FieldSortType.AUTO]: '不排序',
  [FieldSortType.ASC]: '升序',
  [FieldSortType.DESC]: '降序'
}

export const setFieldSort = (field: Field, value: FieldSortType) =>
  setFieldSettings(field, (fieldSettings) => {
    Object.assign(fieldSettings, {
      sort: value
    })
  })

export const FieldAggregationTypeMap: Record<FieldAggregationType, string> = {
  [FieldAggregationType.SUM]: '求和',
  [FieldAggregationType.AVG]: '平均值',
  [FieldAggregationType.COUNT]: '计数',
  [FieldAggregationType.MAX]: '最大值',
  [FieldAggregationType.MIN]: '最小值'
}

export const setFieldAggregation = (field: Field, value: FieldAggregationType) =>
  setFieldSettings(field, (fieldSettings) => {
    Object.assign(fieldSettings, {
      aggregation: value
    })
  })

export const FieldNullDisplayTypeMap: Record<FieldNullDisplayType, string> = {
  [FieldNullDisplayType.AUTO]: '自动',
  [FieldNullDisplayType.STRIKE_THROUGH]: `展示为'-'`,
  [FieldNullDisplayType.NULL]: `展示为'null'`,
  [FieldNullDisplayType.DO_NOT_SHOW]: '不展示',
  [FieldNullDisplayType.CUSTOM]: '自定义'
}

export const setNullDisplay = (
  field: Field,
  value: FieldNullDisplayType,
  type: 'nullValue' | 'nullChar'
) =>
  setFieldSettings(field, (fieldSettings) => {
    Object.assign(fieldSettings, {
      nullDisplay: Object.assign({}, fieldSettings.nullDisplay, {
        [type]: value
      })
    })
  })

export const initFieldSettings = (field: Field): FieldSettings => {
  const settings: Record<string, any> = {
    sort: FieldSortType.AUTO,
    nullDisplay: {
      nullValue: FieldNullDisplayType.AUTO
    }
  }

  if (field.class === FieldClass.DIMENSION) {
    settings.nullDisplay.nullChar = FieldNullDisplayType.AUTO
  } else {
    settings.dataFormat = FieldDataFormatType.AUTO
    settings.aggregation = FieldAggregationType.SUM
  }

  return settings as FieldSettings
}

export const filterFieldsByFieldClass = (
  fields: Array<Field>,
  fieldClass: FieldClass,
  mapper?: (field: Field) => any
) => {
  const filteredFields = fields.filter((field) => field.class === fieldClass)

  if (typeof mapper === 'function') {
    return filteredFields.map(mapper)
  }

  return filteredFields
}
