import type { IDType } from './common'

export const enum DatasetNodeType {
  FOLDER = 'FOLDER',
  DATASET = 'DATASET'
}

export interface Dataset {
  id: IDType
  name: string
  nodeType: DatasetNodeType
}

export const enum FieldType {
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  /**
   * @deprecated
   */
  DOUBLE = 'DOUBLE',
  STRING = 'STRING',
  GEOGRAPHY = 'GEOGRAPHY'
}

export const enum FieldClass {
  DIMENSION = 'DIMENSION',
  MEASUREMENT = 'MEASURE'
}

export const enum FieldNodeType {
  FOLDER = 'FOLDER',
  FIELD = 'FIELD',
  FIELD_SET = 'FIELD_SET'
}

export const enum FieldDataFormatType {
  AUTO = 'AUTO',
  INTEGER = 'INTEGER',
  KEEP_ONE_DECIMAL = 'KEEP_ONE_DECIMAL',
  KEEP_TWO_DECIMALS = 'KEEP_TWO_DECIMALS',
  PERCENTAGE = 'PERCENTAGE',
  KEEP_ONE_DECIMAL_PERCENTAGE = 'KEEP_ONE_DECIMAL_PERCENTAGE',
  KEEP_TWO_DECIMALS_PERCENTAGE = 'KEEP_TWO_DECIMALS_PERCENTAGE',
  CUSTOM = 'CUSTOM'
}

export const enum FieldSortType {
  DESC = 'DESC',
  ASC = 'ASC',
  AUTO = 'DEFAULT'
}

export const enum FieldAggregationType {
  SUM = 'SUM',
  AVG = 'AVG',
  COUNT = 'COUNT',
  MAX = 'MAX',
  MIN = 'MIN'
}

export const enum FieldNullDisplayType {
  AUTO = 'AUTO',
  STRIKE_THROUGH = 'STRIKE_THROUGH',
  NULL = 'NULL',
  DO_NOT_SHOW = 'DO_NOT_SHOW',
  CUSTOM = 'CUSTOM'
}

export const enum FieldFilterType {
  CONDITION = 'CONDITION',
  ENUM_VALUE = 'ENUM_VALUE'
}

export const enum FieldFilterConditionType {
  SINGLE_CONDITION = 'SINGLE_CONDITION',
  OR_CONDITION = 'OR_CONDITION',
  AND_CONDITION = 'AND_CONDITION',
  BEGIN_WITH = 'BEGIN_WITH',
  END_WITH = 'END_WITH',
  BETWEEN = 'BETWEEN'
}

export const enum FieldFilterConditionMatchingType {
  EQ = 'EQ',
  NE = 'NE',
  CONTAIN = 'CONTAIN',
  NOT_CONTAIN = 'NOT_CONTAIN',
  START_WITH = 'START_WITH',
  END_WITH = 'END_WITH',
  IS_EMPTY = 'IS_EMPTY',
  NOT_IS_EMPTY = 'NOT_IS_EMPTY',
  EMPTY_TEXT = 'EMPTY_TEXT',
  NOT_EMPTY_TEXT = 'NOT_EMPTY_TEXT',
  GT = 'GT',
  GT_EQ = 'GT_EQ',
  LT = 'LT',
  LT_EQ = 'LT_EQ'
}

export interface FieldFilterCondition {
  matchingType: FieldFilterConditionMatchingType
  conditionValue: string
}

export interface FieldSettings {
  displayName: string
  dataFormat?: FieldDataFormatType
  sort?: FieldSortType
  aggregation?: FieldAggregationType
  nullDisplay?: {
    nullValue: FieldNullDisplayType
    nullChar?: FieldNullDisplayType
  }
  filter?: {
    filterType: FieldFilterType
    conditionType: FieldFilterConditionType
    conditions: Array<FieldFilterCondition>
  }
}

export interface Field {
  id: IDType
  name: string
  originName: string
  type: FieldType
  class: FieldClass
  nodeType: FieldNodeType
  settings: FieldSettings
  description?: string
  source?: Record<string, any>
}

interface TreeNode<T> {
  pid: IDType
  children?: Array<T>
}

export interface DatasetNode extends Dataset, TreeNode<DatasetNode> {}

export type DatasetTree = Array<DatasetNode>

export interface FieldTreeNode extends Field, TreeNode<FieldTreeNode> {}

export type FieldTree = Array<FieldTreeNode>
