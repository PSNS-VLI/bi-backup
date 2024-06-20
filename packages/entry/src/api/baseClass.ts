export class AnalyseApiRequest {
  /** method */
  method = 'GET'

  /** requestContent */
  requestContent = new RequestContent()

  /** url */
  url = ''
}

export class ApiDatasourceSaveRequest {
  /** cron表达式类型 */
  cronType = 'HOUR'

  /** cron表达式值 */
  cronValue = ''

  /** 字段信息 */
  fieldsRequest = []

  /** 数据源ID */
  id = undefined

  /** 请求方法 */
  method = 'GET'

  /** 数据源名称 */
  name = ''

  /** requestContent */
  requestContent = new RequestContent()

  /** 数据源类型 */
  type = 'FILE'

  /** 更新方式 */
  updateMethod = 'MANUAL'

  /** 地址 */
  url = ''
}

export class ApiDetailVO {
  /** cron表达式类型 */
  cronType = 'HOUR'

  /** cron表达式值 */
  cronValue = ''

  /** 字段信息 */
  fields = []

  /** 数据源ID */
  id = undefined

  /** 请求方法 */
  method = ''

  /** 数据源名称 */
  name = ''

  /** requestContent */
  requestContent = new RequestContent()

  /** 数据源类型 */
  type = 'FILE'

  /** 更新方式 */
  updateMethod = 'MANUAL'

  /** 请求url */
  url = ''
}

export class ApiSyncPageRequest {
  /** 当前页 */
  currentPage = undefined

  /** 结束时间 */
  endTime = ''

  /** 数据源ID */
  id = undefined

  /** 页大小 */
  pageSize = undefined

  /** 开始时间 */
  startTime = ''
}

export class ApiSyncVO {
  /** 执行耗时 */
  durationTime = undefined

  /** 上次执行状态 */
  lastExecStatus = 'SUCCESS'

  /** 上次执行时间 */
  lastExecTime = ''

  /** 日志信息 */
  logInfo = ''
}

export class ConditionItem {
  /** 条件值 */
  conditionValue = ''

  /** 匹配类型 */
  matchingType = 'EQ'
}

export class DashboardDataVO {
  /** 数据 */
  data = []

  /** 字段 */
  fields = []
}

export class DashboardLoadDataRequest {
  /** 所有字段 */
  allFields = []

  /** 数据集id */
  datasetId = undefined

  /** 过滤条件 */
  filterConditions = []
}

export class DashboardRequest {
  /** 仪表板内容 */
  content = ''

  /** id */
  id = undefined

  /** 仪表板名字 */
  name = ''

  /** 父id */
  pid = undefined
}

export class DashboardVO {
  /** 仪表板内容 */
  content = ''

  /** 创建人 */
  createBy = ''

  /** 创建时间 */
  createTime = ''

  /** id */
  id = undefined

  /** 仪表板名字 */
  name = ''

  /** 父id */
  pid = undefined

  /** 状态 */
  status = 'PUBLISH'

  /** 仪表板类型 */
  type = 'FOLDER'

  /** 更新人 */
  updateBy = ''

  /** 更新时间 */
  updateTime = ''
}

export class DatasetRequest {
  /** 所有字段 */
  allFields = []

  /** 数据源类型 */
  datasourceType = 'FILE'

  /** 过滤条件 */
  filterConditions = []

  /** 数据集id */
  id = undefined

  /** 数据集名字 */
  name = ''

  /** 父id */
  pid = undefined

  /** 关联树信息 */
  treeUnion = []
}

export class DatasetSqlLogVO {
  /** 创建时间 */
  createTime = ''

  /** 持续时间单位ms */
  durationTime = undefined

  /** 信息 */
  info = ''

  /** 状态 */
  status = 'SUCCESS'
}

export class DatasetTableFieldRequest {
  /** 聚合方式，默认是SUM */
  aggregation = ''

  /** 是否选中0选中1未选中2被引用 */
  checked = undefined

  /** 孩子节点 */
  children = []

  /** 转化值 */
  convertValue = undefined

  /** 数据格式化 */
  dataFormat = ''

  /** 数据类型 */
  dataType = 'DIMENSION'

  /** 节点类型 */
  datasetTableFieldType = 'DATE'

  /** 数据集表Id */
  datasetTableId = undefined

  /** 数据集表名字 */
  datasetTableName = ''

  /** 数据集表原始名字 */
  datasetTableOriginName = ''

  /** 数据源id */
  datasourceId = undefined

  /** 描述 */
  description = ''

  /** 表达式 */
  expression = ''

  /** 额外扩展字段:0原始、1计算、2范围分组、3固定值分组4、时间粒度分组 */
  extraField = undefined

  /** 字段别名 */
  fieldAliasName = ''

  /** 粒度数组 */
  granularities = []

  /** 粒度 */
  granularity = ''

  /** 字段名 */
  name = ''

  /** 原始字段名 */
  originName = ''

  /** 原始字段类型 */
  originType = 'DATE'

  /** 父id */
  pid = undefined

  /** 排序类型 */
  sortType = 'DESC'

  /** 字段类型 */
  type = 'DATE'
}

export class DatasetTableFieldVO {
  /** 聚合方式，默认是SUM */
  aggregation = ''

  /** 是否选中0选中1未选中2被引用 */
  checked = undefined

  /** 孩子节点 */
  children = []

  /** 列索引 */
  columnIndex = undefined

  /** 转化值 */
  convertValue = undefined

  /** 数据格式化 */
  dataFormat = ''

  /** 数据类型 */
  dataType = 'DIMENSION'

  /** 节点类型 */
  datasetTableFieldType = 'FIELD'

  /** 数据集表Id */
  datasetTableId = undefined

  /** 数据集表名字 */
  datasetTableName = ''

  /** 数据集表原始名字 */
  datasetTableOriginName = ''

  /** 数据源Id */
  datasourceId = undefined

  /** 描述 */
  description = ''

  /** 表达式 */
  expression = ''

  /** 额外扩展字段:0原始、1计算、2范围分组、3固定值分组、4粒度字段 */
  extraField = undefined

  /** 字段别名 */
  fieldAliasName = ''

  /** 粒度数组 */
  granularities = []

  /** 粒度 */
  granularity = ''

  /** 字段id */
  id = undefined

  /** 字段名 */
  name = ''

  /** 原始字段名 */
  originName = ''

  /** 原始字段类型 */
  originType = 'DATE'

  /** 父id */
  pid = undefined

  /** 排序类型 */
  sortType = 'DESC'

  /** 字段类型 */
  type = 'DATE'
}

export class DatasetTableRequest {
  /** 数据源id */
  datasourceId = undefined

  /** 数据集表名 */
  name = ''

  /** 原始表名 */
  originName = ''

  /** 表sql */
  tableSql = ''

  /** 数据集表类型 */
  type = 'SQL'
}

export class DatasetTableVO {
  /** 数据源id */
  datasourceId = undefined

  /** 描述 */
  description = ''

  /** 字段信息 */
  fields = []

  /** 数据集表id */
  id = undefined

  /** 数据集表名 */
  name = ''

  /** 数据集表原始名字 */
  originName = ''

  /** 表sql */
  tableSql = ''

  /** 数据集表类型 */
  type = 'SQL'
}

export class DatasetTreeVO {
  /** 所有字段 */
  allFields = []

  /** 过滤条件 */
  filterConditions = []

  /** 数据集id */
  id = undefined

  /** 数据集名字 */
  name = ''

  /** 父id */
  pid = undefined

  /** 关联树 */
  treeUnion = []
}

export class DatasetVO {
  /** 孩子节点 */
  children = []

  /** 创建人 */
  createBy = ''

  /** 数据源名字 */
  datasourceName = ''

  /** 数据源类型 */
  datasourceType = 'FILE'

  /** 数据集id */
  id = undefined

  /** 数据集名字 */
  name = ''

  /** 父id */
  pid = undefined

  /** 数据集类型 */
  type = 'FOLDER'

  /** 更新时间 */
  updateTime = ''
}

export class DatasourceApiVO {
  /** 数据大小（byte） */
  dataSize = undefined

  /** 数据源id */
  id = undefined

  /** 上次执行状态 */
  lastExecStatus = 'SUCCESS'

  /** 上次执行时间 */
  lastExecTime = ''

  /** 数据源名称 */
  name = ''

  /** 原始文件名 */
  originName = ''
}

export class DatasourceBaseInfoVO {
  /** 数据源ID */
  id = undefined

  /** 数据源名称 */
  name = ''

  /** 数据源类型 */
  type = 'FILE'
}

export class DatasourceDbVO {
  /** 数据源描述 */
  description = ''

  /** 数据源ID */
  id = undefined

  /** 数据源类型 */
  name = ''
}

export class DatasourceDetailVO {
  /** 文件绝对路径 */
  completePath = ''

  /** 字段信息 */
  fields = []

  /** 数据源ID */
  id = undefined

  /** 文件名 */
  name = ''

  /** 文件原名称 */
  originName = ''

  /** 文件相对路径 */
  relativePath = ''

  /** 数据源类型 */
  type = 'FILE'
}

export class DatasourceFieldVO {
  /** 数据库名称 */
  databaseName = ''

  /** 表注释 */
  description = ''

  /** 字段列表 */
  fields = []

  /** 表名称 */
  name = ''

  /** 类型 */
  type = 'FILE'
}

export class DatasourceFileVO {
  /** 数据大小（byte） */
  dataSize = undefined

  /** 数据源id */
  id = undefined

  /** 上次执行时间 */
  lastExecTime = ''

  /** 数据源名称 */
  name = ''

  /** 原始文件名 */
  originName = ''
}

export class DatasourceSaveRequest {
  /** 数据库名称 */
  database = ''

  /** 数据库类型 */
  dbType = 'FILE'

  /** 数据源ID */
  id = undefined

  /** 显示名称 */
  name = ''

  /** 数据库密码 */
  password = ''

  /** 数据库端口 */
  port = undefined

  /** 数据库schema */
  schema = ''

  /** 是否启用ssl 0开启1关闭 */
  ssl = undefined

  /** 数据源类型 */
  type = 'FILE'

  /** 数据库地址 */
  url = ''

  /** 数据库用户名 */
  username = ''

  /** 数据库版本 */
  version = undefined
}

export class DbDatasourceDetailVO {
  /** 数据库名称 */
  database = ''

  /** 数据库类型 */
  dbType = 'FILE'

  /** 数据源id */
  id = undefined

  /** 数据源名称 */
  name = ''

  /** 数据库密码 */
  password = ''

  /** 数据库端口 */
  port = undefined

  /** 数据库schema */
  schema = ''

  /** 是否启用ssl 0开启1关闭 */
  ssl = undefined

  /** 数据源类型 */
  type = 'FILE'

  /** 数据库地址 */
  url = ''

  /** 数据库用户名 */
  username = ''

  /** 数据库版本 */
  version = undefined
}

export class DbDatasourceRequest {
  /** 数据库名称 */
  database = ''

  /** 数据库类型 */
  dbType = 'FILE'

  /** 数据库密码 */
  password = ''

  /** 数据库端口 */
  port = undefined

  /** 数据库schema */
  schema = ''

  /** 是否启用ssl 0开启1关闭 */
  ssl = undefined

  /** 数据库地址 */
  url = ''

  /** 数据库用户名 */
  username = ''

  /** 数据库版本 */
  version = undefined
}

export class FieldRequest {
  /** 是否勾选 0选中1不选中 */
  checked = undefined

  /** 子节点 */
  children = []

  /** 字段名称 */
  name = ''

  /** 字段原始名称 */
  originName = ''

  /** 字段原始类型 */
  originType = ''

  /** 字段类型 */
  type = ''
}

export class FieldVO {
  /** 聚合方式 */
  aggregation = ''

  /** 是否选中 */
  checked = undefined

  /** 孩子节点 */
  children = []

  /** 列索引 */
  columnIndex = undefined

  /** 转换值 */
  convertValue = undefined

  /** 数据格式 */
  dataFormat = ''

  /** 数据类型 */
  dataType = 'DIMENSION'

  /** 数据集表字段类型 */
  datasetTableFieldType = 'FIELD'

  /** 数据集表名字 */
  datasetTableName = ''

  /** 原始表名 */
  datasetTableOriginName = ''

  /** 字段描述 */
  description = ''

  /** 聚合表达式 */
  expression = ''

  /** 扩展字段 0原始、1计算、2范围分组、3固定值分组（默认0） */
  extraField = undefined

  /** 字段别名 */
  fieldAliasName = ''

  /** 粒度数组 */
  granularities = []

  /** 粒度 */
  granularity = ''

  /** 字段名称 */
  name = ''

  /** 原始字段名称 */
  originName = ''

  /** 原始字段类型 */
  originType = 'DATE'

  /** 排序类型 */
  sortType = 'DESC'

  /** 数组字段列表 */
  subFields = []

  /** 字段类型 */
  type = 'DATE'

  /** 字段值 */
  value = ''
}

export class FileDatasourceSaveRequest {
  /** 文件绝对路径 */
  completePath = ''

  /** 字段信息 */
  fieldRequest = []

  /** 文件原名称 */
  fileName = ''

  /** 数据源ID */
  id = undefined

  /** 文件名称 */
  name = ''

  /** 文件相对路径 */
  relativePath = ''

  /** 数据源类型 */
  type = 'FILE'
}

export class FilterConditionRequest {
  /** 聚合函数 */
  aggregation = ''

  /** 条件类型 */
  conditionType = 'SINGLE_CONDITION'

  /** 条件信息 */
  conditions = []

  /** 数据集id */
  datasetId = undefined

  /** 数据集表字段id */
  datasetTableFieldId = undefined

  /** 数据集表字段名 */
  datasetTableFieldName = ''

  /** 数据集表字段原始名 */
  datasetTableFieldOriginName = ''

  /** 数据集表id */
  datasetTableId = undefined

  /** 数据集表名 */
  datasetTableName = ''

  /** 数据集表名原始名 */
  datasetTableOriginName = ''

  /** 过滤类型 */
  filterType = 'CONDITION'
}

export class FilterConditionVO {
  /** 条件类型 */
  conditionType = 'SINGLE_CONDITION'

  /** 条件信息 */
  conditions = []

  /** 数据集id */
  datasetId = undefined

  /** 数据集表字段id */
  datasetTableFieldId = undefined

  /** 数据集表名字 */
  datasetTableFieldName = ''

  /** 数据集表字段原始名字 */
  datasetTableFieldOriginName = ''

  /** 数据集表id */
  datasetTableId = undefined

  /** 数据集表名字 */
  datasetTableName = ''

  /** 数据集表原始名字 */
  datasetTableOriginName = ''

  /** 过滤类型 */
  filterType = 'CONDITION'

  /** 过滤条件id */
  id = undefined
}

export class FolderRequest {
  /** 文件夹id或数据集id */
  id = undefined

  /** 文件夹名字 */
  name = ''

  /** 父id */
  pid = undefined

  /** 目标id */
  targetId = undefined
}

export class FolderVO {
  /** 孩子节点 */
  children = []

  /** 文件夹id */
  id = undefined

  /** 文件夹名字 */
  name = ''

  /** 父id */
  pid = undefined
}

export class PageableResponseApiSyncVO {
  /** 分页数据 */
  list = []

  /** 当前页数 */
  page = undefined

  /** 每页大小 */
  size = undefined

  /** 总条数 */
  totalElements = undefined

  /** 总页数 */
  totalPages = undefined
}

export class PageableResponseDatasourceApiVO {
  /** 分页数据 */
  list = []

  /** 当前页数 */
  page = undefined

  /** 每页大小 */
  size = undefined

  /** 总条数 */
  totalElements = undefined

  /** 总页数 */
  totalPages = undefined
}

export class PageableResponseDatasourceDbVO {
  /** 分页数据 */
  list = []

  /** 当前页数 */
  page = undefined

  /** 每页大小 */
  size = undefined

  /** 总条数 */
  totalElements = undefined

  /** 总页数 */
  totalPages = undefined
}

export class PageableResponseDatasourceFileVO {
  /** 分页数据 */
  list = []

  /** 当前页数 */
  page = undefined

  /** 每页大小 */
  size = undefined

  /** 总条数 */
  totalElements = undefined

  /** 总页数 */
  totalPages = undefined
}

export class PreviewDataVO {
  /** 数据 */
  data = []

  /** 字段 */
  fields = []

  /** 执行信息 */
  info = ''
}

export class PreviewSqlRequest {
  /** 数据集id */
  datasetId = undefined

  /** 数据源id */
  datasourceId = undefined

  /** sql语句 */
  sql = ''
}

export class RequestContent {
  /** 请求参数 */
  argumentMap = undefined

  /** 是否需要鉴权 */
  authorizationStatus = undefined

  /** 请求体 */
  bodyMap = undefined

  /** 请求头 */
  headerMap = undefined
}

export class ResultApiDetailVO {
  /** code */
  code = undefined

  /** data */
  data = new ApiDetailVO()

  /** msg */
  msg = ''
}

export class ResultBoolean {
  /** code */
  code = undefined

  /** data */
  data = false

  /** msg */
  msg = ''
}

export class ResultDashboardDataVO {
  /** code */
  code = undefined

  /** data */
  data = new DashboardDataVO()

  /** msg */
  msg = ''
}

export class ResultDashboardVO {
  /** code */
  code = undefined

  /** data */
  data = new DashboardVO()

  /** msg */
  msg = ''
}

export class ResultDatasetTableVO {
  /** code */
  code = undefined

  /** data */
  data = new DatasetTableVO()

  /** msg */
  msg = ''
}

export class ResultDatasetTreeVO {
  /** code */
  code = undefined

  /** data */
  data = new DatasetTreeVO()

  /** msg */
  msg = ''
}

export class ResultDatasourceDetailVO {
  /** code */
  code = undefined

  /** data */
  data = new DatasourceDetailVO()

  /** msg */
  msg = ''
}

export class ResultDatasourceFieldVO {
  /** code */
  code = undefined

  /** data */
  data = new DatasourceFieldVO()

  /** msg */
  msg = ''
}

export class ResultDbDatasourceDetailVO {
  /** code */
  code = undefined

  /** data */
  data = new DbDatasourceDetailVO()

  /** msg */
  msg = ''
}

export class ResultFolderVO {
  /** code */
  code = undefined

  /** data */
  data = new FolderVO()

  /** msg */
  msg = ''
}

export class ResultInteger {
  /** code */
  code = undefined

  /** data */
  data = undefined

  /** msg */
  msg = ''
}

export class ResultListDashboardVO {
  /** code */
  code = undefined

  /** data */
  data = []

  /** msg */
  msg = ''
}

export class ResultListDatasetSqlLogVO {
  /** code */
  code = undefined

  /** data */
  data = []

  /** msg */
  msg = ''
}

export class ResultListDatasetVO {
  /** code */
  code = undefined

  /** data */
  data = []

  /** msg */
  msg = ''
}

export class ResultListDatasourceBaseInfoVO {
  /** code */
  code = undefined

  /** data */
  data = []

  /** msg */
  msg = ''
}

export class ResultListDatasourceTypeEnum {
  /** code */
  code = undefined

  /** data */
  data = []

  /** msg */
  msg = ''
}

export class ResultListFieldVO {
  /** code */
  code = undefined

  /** data */
  data = []

  /** msg */
  msg = ''
}

export class ResultLong {
  /** code */
  code = undefined

  /** data */
  data = undefined

  /** msg */
  msg = ''
}

export class ResultPageableResponseApiSyncVO {
  /** code */
  code = undefined

  /** data */
  data = new PageableResponseApiSyncVO()

  /** msg */
  msg = ''
}

export class ResultPageableResponseDatasourceApiVO {
  /** code */
  code = undefined

  /** data */
  data = new PageableResponseDatasourceApiVO()

  /** msg */
  msg = ''
}

export class ResultPageableResponseDatasourceDbVO {
  /** code */
  code = undefined

  /** data */
  data = new PageableResponseDatasourceDbVO()

  /** msg */
  msg = ''
}

export class ResultPageableResponseDatasourceFileVO {
  /** code */
  code = undefined

  /** data */
  data = new PageableResponseDatasourceFileVO()

  /** msg */
  msg = ''
}

export class ResultPreviewDataVO {
  /** code */
  code = undefined

  /** data */
  data = new PreviewDataVO()

  /** msg */
  msg = ''
}

export class TreeUnionRequest {
  /** 孩子节点 */
  childrenDst = []

  /** currentDst */
  currentDst = new DatasetTableRequest()

  /** unionToParent */
  unionToParent = new UnionToParentRequest()
}

export class TreeUnionVO {
  /** 孩子节点 */
  childrenDst = []

  /** currentDst */
  currentDst = new DatasetTableVO()

  /** unionToParent */
  unionToParent = new UnionToParentVO()
}

export class UnionItemRequest {
  /** currentField */
  currentField = new DatasetTableFieldRequest()

  /** parentField */
  parentField = new DatasetTableFieldRequest()
}

export class UnionToParentRequest {
  /** 连接字段信息 */
  unionFields = []

  /** 连接类型 */
  unionType = 'LEFT'
}

export class UnionToParentVO {
  /** 连接字段信息 */
  unionFields = []

  /** 连接类型 */
  unionType = 'LEFT'
}
