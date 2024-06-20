type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value
}

declare namespace defs {
  export class AnalyseApiRequest {
    /** method */
    method: 'GET' | 'POST'

    /** requestContent */
    requestContent: defs.RequestContent

    /** url */
    url: string
  }

  export class ApiDatasourceSaveRequest {
    /** cron表达式类型 */
    cronType?: 'HOUR' | 'DAY'

    /** cron表达式值 */
    cronValue?: string

    /** 字段信息 */
    fieldsRequest: Array<defs.FieldRequest>

    /** 数据源ID */
    id?: number

    /** 请求方法 */
    method: 'GET' | 'POST'

    /** 数据源名称 */
    name: string

    /** requestContent */
    requestContent: defs.RequestContent

    /** 数据源类型 */
    type: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 更新方式 */
    updateMethod: 'MANUAL' | 'AUTO'

    /** 地址 */
    url: string
  }

  export class ApiDetailVO {
    /** cron表达式类型 */
    cronType?: 'HOUR' | 'DAY'

    /** cron表达式值 */
    cronValue?: string

    /** 字段信息 */
    fields?: Array<defs.FieldVO>

    /** 数据源ID */
    id?: number

    /** 请求方法 */
    method?: string

    /** 数据源名称 */
    name?: string

    /** requestContent */
    requestContent?: defs.RequestContent

    /** 数据源类型 */
    type?: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 更新方式 */
    updateMethod?: 'MANUAL' | 'AUTO'

    /** 请求url */
    url?: string
  }

  export class ApiSyncPageRequest {
    /** 当前页 */
    currentPage: number

    /** 结束时间 */
    endTime?: string

    /** 数据源ID */
    id: number

    /** 页大小 */
    pageSize: number

    /** 开始时间 */
    startTime?: string
  }

  export class ApiSyncVO {
    /** 执行耗时 */
    durationTime?: number

    /** 上次执行状态 */
    lastExecStatus?: 'SUCCESS' | 'FAIL'

    /** 上次执行时间 */
    lastExecTime?: string

    /** 日志信息 */
    logInfo?: string
  }

  export class ConditionItem {
    /** 条件值 */
    conditionValue?: string

    /** 匹配类型 */
    matchingType?:
      | 'EQ'
      | 'NE'
      | 'CONTAIN'
      | 'NOT_CONTAIN'
      | 'START_WITH'
      | 'END_WITH'
      | 'IS_EMPTY'
      | 'IS_NOT_EMPTY'
      | 'EMPTY_TEXT'
      | 'NOT_EMPTY_TEXT'
      | 'GT'
      | 'GT_EQ'
      | 'LT'
      | 'LT_EQ'
  }

  export class DashboardDataVO {
    /** 数据 */
    data?: Array<object>

    /** 字段 */
    fields?: Array<defs.DatasetTableFieldVO>
  }

  export class DashboardLoadDataRequest {
    /** 所有字段 */
    allFields: Array<defs.DatasetTableFieldRequest>

    /** 数据集id */
    datasetId: number

    /** 过滤条件 */
    filterConditions?: Array<defs.FilterConditionRequest>
  }

  export class DashboardRequest {
    /** 仪表板内容 */
    content?: string

    /** id */
    id?: number

    /** 仪表板名字 */
    name: string

    /** 父id */
    pid?: number
  }

  export class DashboardVO {
    /** 仪表板内容 */
    content?: string

    /** 创建人 */
    createBy?: string

    /** 创建时间 */
    createTime?: string

    /** id */
    id?: number

    /** 仪表板名字 */
    name?: string

    /** 父id */
    pid?: number

    /** 状态 */
    status?: 'PUBLISH' | 'OFF_LINE' | 'SAVE_UNPUBLISHED'

    /** 仪表板类型 */
    type?: 'FOLDER' | 'DASHBOARD'

    /** 更新人 */
    updateBy?: string

    /** 更新时间 */
    updateTime?: string
  }

  export class DatasetRequest {
    /** 所有字段 */
    allFields?: Array<defs.DatasetTableFieldRequest>

    /** 数据源类型 */
    datasourceType?: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 过滤条件 */
    filterConditions?: Array<defs.FilterConditionRequest>

    /** 数据集id */
    id?: number

    /** 数据集名字 */
    name?: string

    /** 父id */
    pid?: number

    /** 关联树信息 */
    treeUnion?: Array<defs.TreeUnionRequest>
  }

  export class DatasetSqlLogVO {
    /** 创建时间 */
    createTime?: string

    /** 持续时间单位ms */
    durationTime?: number

    /** 信息 */
    info?: string

    /** 状态 */
    status?: 'SUCCESS' | 'FAIL'
  }

  export class DatasetTableFieldRequest {
    /** 聚合方式，默认是SUM */
    aggregation?: string

    /** 是否选中0选中1未选中2被引用 */
    checked?: number

    /** 孩子节点 */
    children?: Array<defs.DatasetTableFieldRequest>

    /** 转化值 */
    convertValue?: number

    /** 数据格式化 */
    dataFormat?: string

    /** 数据类型 */
    dataType?: 'DIMENSION' | 'MEASURE'

    /** 节点类型 */
    datasetTableFieldType?:
      | 'DATE'
      | 'DOUBLE'
      | 'INTEGER'
      | 'BOOLEAN'
      | 'STRING'
      | 'GEOGRAPHY'
      | 'FIELD'
      | 'FOLDER'
      | 'ARRAY'
      | 'NUMBER'
      | 'ARRAYLIST'
      | 'OBJECT'

    /** 数据集表Id */
    datasetTableId?: number

    /** 数据集表名字 */
    datasetTableName?: string

    /** 数据集表原始名字 */
    datasetTableOriginName?: string

    /** 数据源id */
    datasourceId?: number

    /** 描述 */
    description?: string

    /** 表达式 */
    expression?: string

    /** 额外扩展字段:0原始、1计算、2范围分组、3固定值分组4、时间粒度分组 */
    extraField?: number

    /** 字段别名 */
    fieldAliasName?: string

    /** 粒度数组 */
    granularities?: Array<string>

    /** 粒度 */
    granularity?: string

    /** 字段名 */
    name?: string

    /** 原始字段名 */
    originName?: string

    /** 原始字段类型 */
    originType?:
      | 'DATE'
      | 'DOUBLE'
      | 'INTEGER'
      | 'BOOLEAN'
      | 'STRING'
      | 'GEOGRAPHY'
      | 'FIELD'
      | 'FOLDER'
      | 'ARRAY'
      | 'NUMBER'
      | 'ARRAYLIST'
      | 'OBJECT'

    /** 父id */
    pid?: number

    /** 排序类型 */
    sortType?: 'DESC' | 'ASC' | 'DEFAULT'

    /** 字段类型 */
    type?:
      | 'DATE'
      | 'DOUBLE'
      | 'INTEGER'
      | 'BOOLEAN'
      | 'STRING'
      | 'GEOGRAPHY'
      | 'FIELD'
      | 'FOLDER'
      | 'ARRAY'
      | 'NUMBER'
      | 'ARRAYLIST'
      | 'OBJECT'
  }

  export class DatasetTableFieldVO {
    /** 聚合方式，默认是SUM */
    aggregation?: string

    /** 是否选中0选中1未选中2被引用 */
    checked?: number

    /** 孩子节点 */
    children?: Array<defs.DatasetTableFieldVO>

    /** 列索引 */
    columnIndex?: number

    /** 转化值 */
    convertValue?: number

    /** 数据格式化 */
    dataFormat?: string

    /** 数据类型 */
    dataType?: 'DIMENSION' | 'MEASURE'

    /** 节点类型 */
    datasetTableFieldType?: 'FIELD' | 'FOLDER'

    /** 数据集表Id */
    datasetTableId?: number

    /** 数据集表名字 */
    datasetTableName?: string

    /** 数据集表原始名字 */
    datasetTableOriginName?: string

    /** 数据源Id */
    datasourceId?: number

    /** 描述 */
    description?: string

    /** 表达式 */
    expression?: string

    /** 额外扩展字段:0原始、1计算、2范围分组、3固定值分组、4粒度字段 */
    extraField?: number

    /** 字段别名 */
    fieldAliasName?: string

    /** 粒度数组 */
    granularities?: Array<string>

    /** 粒度 */
    granularity?: string

    /** 字段id */
    id?: number

    /** 字段名 */
    name?: string

    /** 原始字段名 */
    originName?: string

    /** 原始字段类型 */
    originType?:
      | 'DATE'
      | 'DOUBLE'
      | 'INTEGER'
      | 'BOOLEAN'
      | 'STRING'
      | 'GEOGRAPHY'
      | 'FIELD'
      | 'FOLDER'
      | 'ARRAY'
      | 'NUMBER'
      | 'ARRAYLIST'
      | 'OBJECT'

    /** 父id */
    pid?: number

    /** 排序类型 */
    sortType?: 'DESC' | 'ASC' | 'DEFAULT'

    /** 字段类型 */
    type?:
      | 'DATE'
      | 'DOUBLE'
      | 'INTEGER'
      | 'BOOLEAN'
      | 'STRING'
      | 'GEOGRAPHY'
      | 'FIELD'
      | 'FOLDER'
      | 'ARRAY'
      | 'NUMBER'
      | 'ARRAYLIST'
      | 'OBJECT'
  }

  export class DatasetTableRequest {
    /** 数据源id */
    datasourceId?: number

    /** 数据集表名 */
    name?: string

    /** 原始表名 */
    originName?: string

    /** 表sql */
    tableSql?: string

    /** 数据集表类型 */
    type?: 'SQL' | 'MYSQL' | 'DM' | 'FILE' | 'API'
  }

  export class DatasetTableVO {
    /** 数据源id */
    datasourceId?: number

    /** 描述 */
    description?: string

    /** 字段信息 */
    fields?: Array<defs.DatasetTableFieldVO>

    /** 数据集表id */
    id?: number

    /** 数据集表名 */
    name?: string

    /** 数据集表原始名字 */
    originName?: string

    /** 表sql */
    tableSql?: string

    /** 数据集表类型 */
    type?: 'SQL' | 'MYSQL' | 'DM' | 'FILE' | 'API'
  }

  export class DatasetTreeVO {
    /** 所有字段 */
    allFields?: Array<defs.DatasetTableFieldVO>

    /** 过滤条件 */
    filterConditions?: Array<defs.FilterConditionVO>

    /** 数据集id */
    id?: number

    /** 数据集名字 */
    name?: string

    /** 父id */
    pid?: number

    /** 关联树 */
    treeUnion?: Array<defs.TreeUnionVO>
  }

  export class DatasetVO {
    /** 孩子节点 */
    children?: Array<defs.DatasetVO>

    /** 创建人 */
    createBy?: string

    /** 数据源名字 */
    datasourceName?: string

    /** 数据源类型 */
    datasourceType?: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 数据集id */
    id?: number

    /** 数据集名字 */
    name?: string

    /** 父id */
    pid?: number

    /** 数据集类型 */
    type?: 'FOLDER' | 'DATASET'

    /** 更新时间 */
    updateTime?: string
  }

  export class DatasourceApiVO {
    /** 数据大小（byte） */
    dataSize?: number

    /** 数据源id */
    id?: number

    /** 上次执行状态 */
    lastExecStatus?: 'SUCCESS' | 'FAIL'

    /** 上次执行时间 */
    lastExecTime?: string

    /** 数据源名称 */
    name?: string

    /** 原始文件名 */
    originName?: string
  }

  export class DatasourceBaseInfoVO {
    /** 数据源ID */
    id?: number

    /** 数据源名称 */
    name?: string

    /** 数据源类型 */
    type?: 'FILE' | 'API' | 'MYSQL' | 'DM'
  }

  export class DatasourceDbVO {
    /** 数据源描述 */
    description?: string

    /** 数据源ID */
    id?: number

    /** 数据源类型 */
    name?: string
  }

  export class DatasourceDetailVO {
    /** 文件绝对路径 */
    completePath?: string

    /** 字段信息 */
    fields?: Array<defs.FieldVO>

    /** 数据源ID */
    id?: number

    /** 文件名 */
    name?: string

    /** 文件原名称 */
    originName?: string

    /** 文件相对路径 */
    relativePath?: string

    /** 数据源类型 */
    type?: 'FILE' | 'API' | 'MYSQL' | 'DM'
  }

  export class DatasourceFieldVO {
    /** 数据库名称 */
    databaseName?: string

    /** 表注释 */
    description?: string

    /** 字段列表 */
    fields?: Array<defs.FieldVO>

    /** 表名称 */
    name?: string

    /** 类型 */
    type?: 'FILE' | 'API' | 'MYSQL' | 'DM'
  }

  export class DatasourceFileVO {
    /** 数据大小（byte） */
    dataSize?: number

    /** 数据源id */
    id?: number

    /** 上次执行时间 */
    lastExecTime?: string

    /** 数据源名称 */
    name?: string

    /** 原始文件名 */
    originName?: string
  }

  export class DatasourceSaveRequest {
    /** 数据库名称 */
    database: string

    /** 数据库类型 */
    dbType: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 数据源ID */
    id?: number

    /** 显示名称 */
    name: string

    /** 数据库密码 */
    password: string

    /** 数据库端口 */
    port: number

    /** 数据库schema */
    schema?: string

    /** 是否启用ssl 0开启1关闭 */
    ssl: number

    /** 数据源类型 */
    type: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 数据库地址 */
    url: string

    /** 数据库用户名 */
    username: string

    /** 数据库版本 */
    version?: number
  }

  export class DbDatasourceDetailVO {
    /** 数据库名称 */
    database: string

    /** 数据库类型 */
    dbType: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 数据源id */
    id?: number

    /** 数据源名称 */
    name?: string

    /** 数据库密码 */
    password: string

    /** 数据库端口 */
    port: number

    /** 数据库schema */
    schema?: string

    /** 是否启用ssl 0开启1关闭 */
    ssl: number

    /** 数据源类型 */
    type?: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 数据库地址 */
    url: string

    /** 数据库用户名 */
    username: string

    /** 数据库版本 */
    version?: number
  }

  export class DbDatasourceRequest {
    /** 数据库名称 */
    database: string

    /** 数据库类型 */
    dbType: 'FILE' | 'API' | 'MYSQL' | 'DM'

    /** 数据库密码 */
    password: string

    /** 数据库端口 */
    port: number

    /** 数据库schema */
    schema?: string

    /** 是否启用ssl 0开启1关闭 */
    ssl: number

    /** 数据库地址 */
    url: string

    /** 数据库用户名 */
    username: string

    /** 数据库版本 */
    version?: number
  }

  export class FieldRequest {
    /** 是否勾选 0选中1不选中 */
    checked: number

    /** 子节点 */
    children?: Array<defs.FieldRequest>

    /** 字段名称 */
    name: string

    /** 字段原始名称 */
    originName: string

    /** 字段原始类型 */
    originType: string

    /** 字段类型 */
    type: string
  }

  export class FieldVO {
    /** 聚合方式 */
    aggregation?: string

    /** 是否选中 */
    checked?: number

    /** 孩子节点 */
    children?: Array<defs.FieldVO>

    /** 列索引 */
    columnIndex?: number

    /** 转换值 */
    convertValue?: number

    /** 数据格式 */
    dataFormat?: string

    /** 数据类型 */
    dataType?: 'DIMENSION' | 'MEASURE'

    /** 数据集表字段类型 */
    datasetTableFieldType?: 'FIELD' | 'FOLDER'

    /** 数据集表名字 */
    datasetTableName?: string

    /** 原始表名 */
    datasetTableOriginName?: string

    /** 字段描述 */
    description?: string

    /** 聚合表达式 */
    expression?: string

    /** 扩展字段 0原始、1计算、2范围分组、3固定值分组（默认0） */
    extraField?: number

    /** 字段别名 */
    fieldAliasName?: string

    /** 粒度数组 */
    granularities?: Array<string>

    /** 粒度 */
    granularity?: string

    /** 字段名称 */
    name?: string

    /** 原始字段名称 */
    originName?: string

    /** 原始字段类型 */
    originType?:
      | 'DATE'
      | 'DOUBLE'
      | 'INTEGER'
      | 'BOOLEAN'
      | 'STRING'
      | 'GEOGRAPHY'
      | 'FIELD'
      | 'FOLDER'
      | 'ARRAY'
      | 'NUMBER'
      | 'ARRAYLIST'
      | 'OBJECT'

    /** 排序类型 */
    sortType?: 'DESC' | 'ASC' | 'DEFAULT'

    /** 数组字段列表 */
    subFields?: Array<defs.FieldVO>

    /** 字段类型 */
    type?:
      | 'DATE'
      | 'DOUBLE'
      | 'INTEGER'
      | 'BOOLEAN'
      | 'STRING'
      | 'GEOGRAPHY'
      | 'FIELD'
      | 'FOLDER'
      | 'ARRAY'
      | 'NUMBER'
      | 'ARRAYLIST'
      | 'OBJECT'

    /** 字段值 */
    value?: string
  }

  export class FileDatasourceSaveRequest {
    /** 文件绝对路径 */
    completePath: string

    /** 字段信息 */
    fieldRequest?: Array<defs.FieldRequest>

    /** 文件原名称 */
    fileName: string

    /** 数据源ID */
    id?: number

    /** 文件名称 */
    name: string

    /** 文件相对路径 */
    relativePath: string

    /** 数据源类型 */
    type: 'FILE' | 'API' | 'MYSQL' | 'DM'
  }

  export class FilterConditionRequest {
    /** 聚合函数 */
    aggregation?: string

    /** 条件类型 */
    conditionType?:
      | 'SINGLE_CONDITION'
      | 'OR_CONDITION'
      | 'AND_CONDITION'
      | 'BEGIN_WITH'
      | 'END_WITH'
      | 'BETWEEN'

    /** 条件信息 */
    conditions?: Array<defs.ConditionItem>

    /** 数据集id */
    datasetId?: number

    /** 数据集表字段id */
    datasetTableFieldId?: number

    /** 数据集表字段名 */
    datasetTableFieldName?: string

    /** 数据集表字段原始名 */
    datasetTableFieldOriginName?: string

    /** 数据集表id */
    datasetTableId?: number

    /** 数据集表名 */
    datasetTableName?: string

    /** 数据集表名原始名 */
    datasetTableOriginName?: string

    /** 过滤类型 */
    filterType?: 'CONDITION' | 'ENUM_VALUE'
  }

  export class FilterConditionVO {
    /** 条件类型 */
    conditionType?:
      | 'SINGLE_CONDITION'
      | 'OR_CONDITION'
      | 'AND_CONDITION'
      | 'BEGIN_WITH'
      | 'END_WITH'
      | 'BETWEEN'

    /** 条件信息 */
    conditions?: Array<defs.ConditionItem>

    /** 数据集id */
    datasetId?: number

    /** 数据集表字段id */
    datasetTableFieldId?: number

    /** 数据集表名字 */
    datasetTableFieldName?: string

    /** 数据集表字段原始名字 */
    datasetTableFieldOriginName?: string

    /** 数据集表id */
    datasetTableId?: number

    /** 数据集表名字 */
    datasetTableName?: string

    /** 数据集表原始名字 */
    datasetTableOriginName?: string

    /** 过滤类型 */
    filterType?: 'CONDITION' | 'ENUM_VALUE'

    /** 过滤条件id */
    id?: number
  }

  export class FolderRequest {
    /** 文件夹id或数据集id */
    id?: number

    /** 文件夹名字 */
    name?: string

    /** 父id */
    pid?: number

    /** 目标id */
    targetId?: number
  }

  export class FolderVO {
    /** 孩子节点 */
    children?: Array<defs.FolderVO>

    /** 文件夹id */
    id?: number

    /** 文件夹名字 */
    name?: string

    /** 父id */
    pid?: number
  }

  export class PageableResponseApiSyncVO {
    /** 分页数据 */
    list?: Array<defs.ApiSyncVO>

    /** 当前页数 */
    page?: number

    /** 每页大小 */
    size?: number

    /** 总条数 */
    totalElements?: number

    /** 总页数 */
    totalPages?: number
  }

  export class PageableResponseDatasourceApiVO {
    /** 分页数据 */
    list?: Array<defs.DatasourceApiVO>

    /** 当前页数 */
    page?: number

    /** 每页大小 */
    size?: number

    /** 总条数 */
    totalElements?: number

    /** 总页数 */
    totalPages?: number
  }

  export class PageableResponseDatasourceDbVO {
    /** 分页数据 */
    list?: Array<defs.DatasourceDbVO>

    /** 当前页数 */
    page?: number

    /** 每页大小 */
    size?: number

    /** 总条数 */
    totalElements?: number

    /** 总页数 */
    totalPages?: number
  }

  export class PageableResponseDatasourceFileVO {
    /** 分页数据 */
    list?: Array<defs.DatasourceFileVO>

    /** 当前页数 */
    page?: number

    /** 每页大小 */
    size?: number

    /** 总条数 */
    totalElements?: number

    /** 总页数 */
    totalPages?: number
  }

  export class PreviewDataVO {
    /** 数据 */
    data?: Array<object>

    /** 字段 */
    fields?: Array<defs.DatasetTableFieldVO>

    /** 执行信息 */
    info?: string
  }

  export class PreviewSqlRequest {
    /** 数据集id */
    datasetId?: number

    /** 数据源id */
    datasourceId?: number

    /** sql语句 */
    sql?: string
  }

  export class RequestContent {
    /** 请求参数 */
    argumentMap?: ObjectMap<any, object>

    /** 是否需要鉴权 */
    authorizationStatus?: number

    /** 请求体 */
    bodyMap?: ObjectMap<any, object>

    /** 请求头 */
    headerMap?: ObjectMap<any, string>
  }

  export class ResultApiDetailVO {
    /** code */
    code?: number

    /** data */
    data?: defs.ApiDetailVO

    /** msg */
    msg?: string
  }

  export class ResultBoolean {
    /** code */
    code?: number

    /** data */
    data?: boolean

    /** msg */
    msg?: string
  }

  export class ResultDashboardDataVO {
    /** code */
    code?: number

    /** data */
    data?: defs.DashboardDataVO

    /** msg */
    msg?: string
  }

  export class ResultDashboardVO {
    /** code */
    code?: number

    /** data */
    data?: defs.DashboardVO

    /** msg */
    msg?: string
  }

  export class ResultDatasetTableVO {
    /** code */
    code?: number

    /** data */
    data?: defs.DatasetTableVO

    /** msg */
    msg?: string
  }

  export class ResultDatasetTreeVO {
    /** code */
    code?: number

    /** data */
    data?: defs.DatasetTreeVO

    /** msg */
    msg?: string
  }

  export class ResultDatasourceDetailVO {
    /** code */
    code?: number

    /** data */
    data?: defs.DatasourceDetailVO

    /** msg */
    msg?: string
  }

  export class ResultDatasourceFieldVO {
    /** code */
    code?: number

    /** data */
    data?: defs.DatasourceFieldVO

    /** msg */
    msg?: string
  }

  export class ResultDbDatasourceDetailVO {
    /** code */
    code?: number

    /** data */
    data?: defs.DbDatasourceDetailVO

    /** msg */
    msg?: string
  }

  export class ResultFolderVO {
    /** code */
    code?: number

    /** data */
    data?: defs.FolderVO

    /** msg */
    msg?: string
  }

  export class ResultInteger {
    /** code */
    code?: number

    /** data */
    data?: number

    /** msg */
    msg?: string
  }

  export class ResultListDashboardVO {
    /** code */
    code?: number

    /** data */
    data?: Array<defs.DashboardVO>

    /** msg */
    msg?: string
  }

  export class ResultListDatasetSqlLogVO {
    /** code */
    code?: number

    /** data */
    data?: Array<defs.DatasetSqlLogVO>

    /** msg */
    msg?: string
  }

  export class ResultListDatasetVO {
    /** code */
    code?: number

    /** data */
    data?: Array<defs.DatasetVO>

    /** msg */
    msg?: string
  }

  export class ResultListDatasourceBaseInfoVO {
    /** code */
    code?: number

    /** data */
    data?: Array<defs.DatasourceBaseInfoVO>

    /** msg */
    msg?: string
  }

  export class ResultListDatasourceTypeEnum {
    /** code */
    code?: number

    /** data */
    data?: Array<'FILE' | 'API' | 'MYSQL' | 'DM'>

    /** msg */
    msg?: string
  }

  export class ResultListFieldVO {
    /** code */
    code?: number

    /** data */
    data?: Array<defs.FieldVO>

    /** msg */
    msg?: string
  }

  export class ResultLong {
    /** code */
    code?: number

    /** data */
    data?: number

    /** msg */
    msg?: string
  }

  export class ResultPageableResponseApiSyncVO {
    /** code */
    code?: number

    /** data */
    data?: defs.PageableResponseApiSyncVO

    /** msg */
    msg?: string
  }

  export class ResultPageableResponseDatasourceApiVO {
    /** code */
    code?: number

    /** data */
    data?: defs.PageableResponseDatasourceApiVO

    /** msg */
    msg?: string
  }

  export class ResultPageableResponseDatasourceDbVO {
    /** code */
    code?: number

    /** data */
    data?: defs.PageableResponseDatasourceDbVO

    /** msg */
    msg?: string
  }

  export class ResultPageableResponseDatasourceFileVO {
    /** code */
    code?: number

    /** data */
    data?: defs.PageableResponseDatasourceFileVO

    /** msg */
    msg?: string
  }

  export class ResultPreviewDataVO {
    /** code */
    code?: number

    /** data */
    data?: defs.PreviewDataVO

    /** msg */
    msg?: string
  }

  export class TreeUnionRequest {
    /** 孩子节点 */
    childrenDst?: Array<defs.TreeUnionRequest>

    /** currentDst */
    currentDst?: defs.DatasetTableRequest

    /** unionToParent */
    unionToParent?: defs.UnionToParentRequest
  }

  export class TreeUnionVO {
    /** 孩子节点 */
    childrenDst?: Array<defs.TreeUnionVO>

    /** currentDst */
    currentDst?: defs.DatasetTableVO

    /** unionToParent */
    unionToParent?: defs.UnionToParentVO
  }

  export class UnionItemRequest {
    /** currentField */
    currentField?: defs.DatasetTableFieldRequest

    /** parentField */
    parentField?: defs.DatasetTableFieldRequest
  }

  export class UnionToParentRequest {
    /** 连接字段信息 */
    unionFields?: Array<defs.UnionItemRequest>

    /** 连接类型 */
    unionType?: 'LEFT' | 'INNER' | 'RIGHT'
  }

  export class UnionToParentVO {
    /** 连接字段信息 */
    unionFields?: Array<defs.UnionItemRequest>

    /** 连接类型 */
    unionType?: 'LEFT' | 'INNER' | 'RIGHT'
  }
}

declare namespace PONT_API {
  /**
   * 仪表板接口
   */
  export class dashboard {
    delete_1: {
      path: string
      type: string
      send(param: PONT_TYPE.Delete_1Param): Promise<PONT_TYPE.Delete_1Response>
    }

    detail_1: {
      path: string
      type: string
      send(param: PONT_TYPE.Detail_1Param): Promise<PONT_TYPE.Detail_1Response>
    }

    folderList_1: {
      path: string
      type: string
      send(param: PONT_TYPE.FolderList_1Param): Promise<PONT_TYPE.FolderList_1Response>
    }

    saveFolder_1: {
      path: string
      type: string
      send(param: PONT_TYPE.SaveFolder_1Param): Promise<PONT_TYPE.SaveFolder_1Response>
    }

    list_1: {
      path: string
      type: string
      send(param: PONT_TYPE.List_1Param): Promise<PONT_TYPE.List_1Response>
    }

    loadData: {
      path: string
      type: string
      send(param: PONT_TYPE.LoadDataParam): Promise<PONT_TYPE.LoadDataResponse>
    }

    move_1: {
      path: string
      type: string
      send(param: PONT_TYPE.Move_1Param): Promise<PONT_TYPE.Move_1Response>
    }

    publish: {
      path: string
      type: string
      send(param: PONT_TYPE.PublishParam): Promise<PONT_TYPE.PublishResponse>
    }

    renameFolder_1: {
      path: string
      type: string
      send(param: PONT_TYPE.RenameFolder_1Param): Promise<PONT_TYPE.RenameFolder_1Response>
    }

    save_1: {
      path: string
      type: string
      send(param: PONT_TYPE.Save_1Param): Promise<PONT_TYPE.Save_1Response>
    }
  }

  /**
   * 数据集接口
   */
  export class dataset {
    datasetCount: {
      path: string
      type: string
      send(param: PONT_TYPE.DatasetCountParam): Promise<PONT_TYPE.DatasetCountResponse>
    }

    remove: {
      path: string
      type: string
      send(param: PONT_TYPE.RemoveParam): Promise<PONT_TYPE.RemoveResponse>
    }

    detail: {
      path: string
      type: string
      send(param: PONT_TYPE.DetailParam): Promise<PONT_TYPE.DetailResponse>
    }

    getFieldDataList: {
      path: string
      type: string
      send(param: PONT_TYPE.GetFieldDataListParam): Promise<PONT_TYPE.GetFieldDataListResponse>
    }

    folderList: {
      path: string
      type: string
      send(param: PONT_TYPE.FolderListParam): Promise<PONT_TYPE.FolderListResponse>
    }

    saveFolder: {
      path: string
      type: string
      send(param: PONT_TYPE.SaveFolderParam): Promise<PONT_TYPE.SaveFolderResponse>
    }

    list: {
      path: string
      type: string
      send(param: PONT_TYPE.ListParam): Promise<PONT_TYPE.ListResponse>
    }

    move: {
      path: string
      type: string
      send(param: PONT_TYPE.MoveParam): Promise<PONT_TYPE.MoveResponse>
    }

    previewData: {
      path: string
      type: string
      send(param: PONT_TYPE.PreviewDataParam): Promise<PONT_TYPE.PreviewDataResponse>
    }

    previewSql: {
      path: string
      type: string
      send(param: PONT_TYPE.PreviewSqlParam): Promise<PONT_TYPE.PreviewSqlResponse>
    }

    renameFolder: {
      path: string
      type: string
      send(param: PONT_TYPE.RenameFolderParam): Promise<PONT_TYPE.RenameFolderResponse>
    }

    save: {
      path: string
      type: string
      send(param: PONT_TYPE.SaveParam): Promise<PONT_TYPE.SaveResponse>
    }

    getSqlHistoryList: {
      path: string
      type: string
      send(param: PONT_TYPE.GetSqlHistoryListParam): Promise<PONT_TYPE.GetSqlHistoryListResponse>
    }

    getTableFields: {
      path: string
      type: string
      send(param: PONT_TYPE.GetTableFieldsParam): Promise<PONT_TYPE.GetTableFieldsResponse>
    }

    tree: {
      path: string
      type: string
      send(param: PONT_TYPE.TreeParam): Promise<PONT_TYPE.TreeResponse>
    }
  }

  /**
   * 数据源接口
   */
  export class datasource {
    analyseApiField: {
      path: string
      type: string
      send(param: PONT_TYPE.AnalyseApiFieldParam): Promise<PONT_TYPE.AnalyseApiFieldResponse>
    }

    getApiDetail: {
      path: string
      type: string
      send(param: PONT_TYPE.GetApiDetailParam): Promise<PONT_TYPE.GetApiDetailResponse>
    }

    getDataSourceApiPage: {
      path: string
      type: string
      send(
        param: PONT_TYPE.GetDataSourceApiPageParam
      ): Promise<PONT_TYPE.GetDataSourceApiPageResponse>
    }

    saveApiDatasource: {
      path: string
      type: string
      send(param: PONT_TYPE.SaveApiDatasourceParam): Promise<PONT_TYPE.SaveApiDatasourceResponse>
    }

    updateApiData: {
      path: string
      type: string
      send(param: PONT_TYPE.UpdateApiDataParam): Promise<PONT_TYPE.UpdateApiDataResponse>
    }

    getApiSyncPage: {
      path: string
      type: string
      send(param: PONT_TYPE.GetApiSyncPageParam): Promise<PONT_TYPE.GetApiSyncPageResponse>
    }

    analyseDbDatasource: {
      path: string
      type: string
      send(
        param: PONT_TYPE.AnalyseDbDatasourceParam
      ): Promise<PONT_TYPE.AnalyseDbDatasourceResponse>
    }

    getDbDatasourceDetail: {
      path: string
      type: string
      send(
        param: PONT_TYPE.GetDbDatasourceDetailParam
      ): Promise<PONT_TYPE.GetDbDatasourceDetailResponse>
    }

    getDataSourceDbPage: {
      path: string
      type: string
      send(
        param: PONT_TYPE.GetDataSourceDbPageParam
      ): Promise<PONT_TYPE.GetDataSourceDbPageResponse>
    }

    saveDbDatasource: {
      path: string
      type: string
      send(param: PONT_TYPE.SaveDbDatasourceParam): Promise<PONT_TYPE.SaveDbDatasourceResponse>
    }

    deleteDatasource: {
      path: string
      type: string
      send(param: PONT_TYPE.DeleteDatasourceParam): Promise<PONT_TYPE.DeleteDatasourceResponse>
    }

    analyseFile: {
      path: string
      type: string
      send(param: PONT_TYPE.AnalyseFileParam): Promise<PONT_TYPE.AnalyseFileResponse>
    }

    getDatasourceDetail: {
      path: string
      type: string
      send(
        param: PONT_TYPE.GetDatasourceDetailParam
      ): Promise<PONT_TYPE.GetDatasourceDetailResponse>
    }

    getDataSourceFilePage: {
      path: string
      type: string
      send(
        param: PONT_TYPE.GetDataSourceFilePageParam
      ): Promise<PONT_TYPE.GetDataSourceFilePageResponse>
    }

    saveFileDatasource: {
      path: string
      type: string
      send(param: PONT_TYPE.SaveFileDatasourceParam): Promise<PONT_TYPE.SaveFileDatasourceResponse>
    }

    getLastDatasource: {
      path: string
      type: string
      send(param: PONT_TYPE.GetLastDatasourceParam): Promise<PONT_TYPE.GetLastDatasourceResponse>
    }

    getDatasourceList: {
      path: string
      type: string
      send(param: PONT_TYPE.GetDatasourceListParam): Promise<PONT_TYPE.GetDatasourceListResponse>
    }

    getDatasourceDbTableFields: {
      path: string
      type: string
      send(
        param: PONT_TYPE.GetDatasourceDbTableFieldsParam
      ): Promise<PONT_TYPE.GetDatasourceDbTableFieldsResponse>
    }
  }
}

declare namespace PONT_TYPE {
  /** dashboard start */

  class Delete_1ParamOrigin {
    /** 仪表板id */
    id: number
  }

  type Delete_1Param = Delete_1ParamOrigin
  type Delete_1Response = defs.ResultBoolean

  class Detail_1ParamOrigin {
    /** 仪表板id */
    id: number
  }

  type Detail_1Param = Detail_1ParamOrigin
  type Detail_1Response = defs.ResultDashboardVO

  class FolderList_1ParamOrigin {}

  type FolderList_1Param = FolderList_1ParamOrigin
  type FolderList_1Response = defs.ResultFolderVO

  class SaveFolder_1ParamOrigin {}

  type SaveFolder_1Param = SaveFolder_1ParamOrigin & defs.FolderRequest
  type SaveFolder_1Response = defs.ResultInteger

  class List_1ParamOrigin {
    /** 仪表板关键字 */
    keywords?: string
    /** 父id */
    pid?: number
  }

  type List_1Param = List_1ParamOrigin
  type List_1Response = defs.ResultListDashboardVO

  class LoadDataParamOrigin {}

  type LoadDataParam = LoadDataParamOrigin & defs.DashboardLoadDataRequest
  type LoadDataResponse = defs.ResultDashboardDataVO

  class Move_1ParamOrigin {}

  type Move_1Param = Move_1ParamOrigin & defs.FolderRequest
  type Move_1Response = defs.ResultBoolean

  class PublishParamOrigin {
    /** 仪表板id */
    id: number
    /** 状态 */
    status: 'PUBLISH' | 'OFF_LINE' | 'SAVE_UNPUBLISHED'
  }

  type PublishParam = PublishParamOrigin
  type PublishResponse = defs.ResultBoolean

  class RenameFolder_1ParamOrigin {}

  type RenameFolder_1Param = RenameFolder_1ParamOrigin & defs.FolderRequest
  type RenameFolder_1Response = defs.ResultBoolean

  class Save_1ParamOrigin {}

  type Save_1Param = Save_1ParamOrigin & defs.DashboardRequest
  type Save_1Response = defs.ResultBoolean

  /** dashboard end */

  /** dataset start */

  class DatasetCountParamOrigin {}

  type DatasetCountParam = DatasetCountParamOrigin
  type DatasetCountResponse = defs.ResultLong

  class RemoveParamOrigin {
    /** 数据集或文件夹id */
    id: number
  }

  type RemoveParam = RemoveParamOrigin
  type RemoveResponse = defs.ResultBoolean

  class DetailParamOrigin {
    /** 数据集id */
    id: number
  }

  type DetailParam = DetailParamOrigin
  type DetailResponse = defs.ResultDatasetTreeVO

  class GetFieldDataListParamOrigin {}

  type GetFieldDataListParam = GetFieldDataListParamOrigin & defs.DatasetRequest
  type GetFieldDataListResponse = defs.ResultPreviewDataVO

  class FolderListParamOrigin {}

  type FolderListParam = FolderListParamOrigin
  type FolderListResponse = defs.ResultFolderVO

  class SaveFolderParamOrigin {}

  type SaveFolderParam = SaveFolderParamOrigin & defs.FolderRequest
  type SaveFolderResponse = defs.ResultInteger

  class ListParamOrigin {
    /** 数据集关键字 */
    keywords?: string
    /** 父id */
    pid?: number
  }

  type ListParam = ListParamOrigin
  type ListResponse = defs.ResultListDatasetVO

  class MoveParamOrigin {}

  type MoveParam = MoveParamOrigin & defs.FolderRequest
  type MoveResponse = defs.ResultBoolean

  class PreviewDataParamOrigin {}

  type PreviewDataParam = PreviewDataParamOrigin & defs.DatasetRequest
  type PreviewDataResponse = defs.ResultPreviewDataVO

  class PreviewSqlParamOrigin {}

  type PreviewSqlParam = PreviewSqlParamOrigin & defs.PreviewSqlRequest
  type PreviewSqlResponse = defs.ResultPreviewDataVO

  class RenameFolderParamOrigin {}

  type RenameFolderParam = RenameFolderParamOrigin & defs.FolderRequest
  type RenameFolderResponse = defs.ResultBoolean

  class SaveParamOrigin {}

  type SaveParam = SaveParamOrigin & defs.DatasetRequest
  type SaveResponse = defs.ResultBoolean

  class GetSqlHistoryListParamOrigin {}

  type GetSqlHistoryListParam = GetSqlHistoryListParamOrigin & defs.PreviewSqlRequest
  type GetSqlHistoryListResponse = defs.ResultListDatasetSqlLogVO

  class GetTableFieldsParamOrigin {
    /** 数据表名称 */
    tableName: string
    /** 数据源id */
    datasourceId: number
    /** 数据集id */
    datasetId?: number
  }

  type GetTableFieldsParam = GetTableFieldsParamOrigin
  type GetTableFieldsResponse = defs.ResultDatasetTableVO

  class TreeParamOrigin {}

  type TreeParam = TreeParamOrigin
  type TreeResponse = defs.ResultListDatasetVO

  /** dataset end */

  /** datasource start */

  class AnalyseApiFieldParamOrigin {}

  type AnalyseApiFieldParam = AnalyseApiFieldParamOrigin & defs.AnalyseApiRequest
  type AnalyseApiFieldResponse = defs.ResultListFieldVO

  class GetApiDetailParamOrigin {
    /** id */
    id: number
  }

  type GetApiDetailParam = GetApiDetailParamOrigin
  type GetApiDetailResponse = defs.ResultApiDetailVO

  class GetDataSourceApiPageParamOrigin {
    /** keywords */
    keywords?: string
    /** currentPage */
    currentPage: number
    /** pageSize */
    pageSize: number
  }

  type GetDataSourceApiPageParam = GetDataSourceApiPageParamOrigin
  type GetDataSourceApiPageResponse = defs.ResultPageableResponseDatasourceApiVO

  class SaveApiDatasourceParamOrigin {}

  type SaveApiDatasourceParam = SaveApiDatasourceParamOrigin & defs.ApiDatasourceSaveRequest
  type SaveApiDatasourceResponse = defs.ResultBoolean

  class UpdateApiDataParamOrigin {
    /** id */
    id: number
  }

  type UpdateApiDataParam = UpdateApiDataParamOrigin
  type UpdateApiDataResponse = defs.ResultBoolean

  class GetApiSyncPageParamOrigin {}

  type GetApiSyncPageParam = GetApiSyncPageParamOrigin & defs.ApiSyncPageRequest
  type GetApiSyncPageResponse = defs.ResultPageableResponseApiSyncVO

  class AnalyseDbDatasourceParamOrigin {}

  type AnalyseDbDatasourceParam = AnalyseDbDatasourceParamOrigin & defs.DbDatasourceRequest
  type AnalyseDbDatasourceResponse = defs.ResultBoolean

  class GetDbDatasourceDetailParamOrigin {
    /** id */
    id: number
  }

  type GetDbDatasourceDetailParam = GetDbDatasourceDetailParamOrigin
  type GetDbDatasourceDetailResponse = defs.ResultDbDatasourceDetailVO

  class GetDataSourceDbPageParamOrigin {
    /** keywords */
    keywords?: string
    /** id */
    id: number
    /** currentPage */
    currentPage: number
    /** pageSize */
    pageSize: number
  }

  type GetDataSourceDbPageParam = GetDataSourceDbPageParamOrigin
  type GetDataSourceDbPageResponse = defs.ResultPageableResponseDatasourceDbVO

  class SaveDbDatasourceParamOrigin {}

  type SaveDbDatasourceParam = SaveDbDatasourceParamOrigin & defs.DatasourceSaveRequest
  type SaveDbDatasourceResponse = defs.ResultBoolean

  class DeleteDatasourceParamOrigin {
    /** id */
    id: number
  }

  type DeleteDatasourceParam = DeleteDatasourceParamOrigin
  type DeleteDatasourceResponse = defs.ResultBoolean

  class AnalyseFileParamOrigin {
    /** filePath */
    filePath: string
  }

  type AnalyseFileParam = AnalyseFileParamOrigin
  type AnalyseFileResponse = defs.ResultListFieldVO

  class GetDatasourceDetailParamOrigin {
    /** id */
    id: number
  }

  type GetDatasourceDetailParam = GetDatasourceDetailParamOrigin
  type GetDatasourceDetailResponse = defs.ResultDatasourceDetailVO

  class GetDataSourceFilePageParamOrigin {
    /** keywords */
    keywords?: string
    /** currentPage */
    currentPage: number
    /** pageSize */
    pageSize: number
  }

  type GetDataSourceFilePageParam = GetDataSourceFilePageParamOrigin
  type GetDataSourceFilePageResponse = defs.ResultPageableResponseDatasourceFileVO

  class SaveFileDatasourceParamOrigin {}

  type SaveFileDatasourceParam = SaveFileDatasourceParamOrigin & defs.FileDatasourceSaveRequest
  type SaveFileDatasourceResponse = defs.ResultBoolean

  class GetLastDatasourceParamOrigin {}

  type GetLastDatasourceParam = GetLastDatasourceParamOrigin
  type GetLastDatasourceResponse = defs.ResultListDatasourceTypeEnum

  class GetDatasourceListParamOrigin {}

  type GetDatasourceListParam = GetDatasourceListParamOrigin
  type GetDatasourceListResponse = defs.ResultListDatasourceBaseInfoVO

  class GetDatasourceDbTableFieldsParamOrigin {
    /** datasourceId */
    datasourceId: number
    /** tableName */
    tableName: string
  }

  type GetDatasourceDbTableFieldsParam = GetDatasourceDbTableFieldsParamOrigin
  type GetDatasourceDbTableFieldsResponse = defs.ResultDatasourceFieldVO

  /** datasource end */
}
