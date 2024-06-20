import * as KEY from './key'

/**
 * 系统名称
 */
const SYSTEM_NAME = '平台应用服务'

/**
 * 是否启用动态路由
 */
const DYNAMIC_ROUTER = false

/**
 * 是否启用权限限制
 */
const ACCESS_CONTROL = false

/**
 * TOKEN过期时间(单位秒)
 */
const TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60

/**
 * 使用rem作为基础单位计算尺寸，如果改为true 那么需要将gx-component.scss中size方法中单位改为0.01rem
 */
const REM_REPLACE_PX = false

// 基准尺寸
const REM_BASIC_SIZE = 100

// 设计稿尺寸
const REM_DESIGN_DRAFT_WIDTH = 1920

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

// 文件上传服务器配置
const DEFAULT_FILE_UPLOAD_SERVER_URL = 'http://192.168.31.96:10000'
const FILE_UPLOAD_SERVER_URL =
  import.meta.env.VITE_APP_FILE_UPLOAD_SERVER_URL || DEFAULT_FILE_UPLOAD_SERVER_URL
const FILE_PREVIEW_SERVER_URL =
  import.meta.env.VITE_APP_FILE_PREVIEW_SERVER_URL || DEFAULT_FILE_UPLOAD_SERVER_URL

export {
  KEY,
  SYSTEM_NAME,
  DYNAMIC_ROUTER,
  ACCESS_CONTROL,
  TOKEN_EXPIRE_TIME,
  REM_REPLACE_PX,
  REM_BASIC_SIZE,
  REM_DESIGN_DRAFT_WIDTH,
  BASE_URL,
  FILE_UPLOAD_SERVER_URL,
  FILE_PREVIEW_SERVER_URL
}
