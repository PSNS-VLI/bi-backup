import axios from 'axios'
import { ElMessage } from 'element-plus'

import { FILE_UPLOAD_SERVER_URL } from '@/config'

// 每个项目的appkey、appSecret都不相同，需要修改
const instance = axios.create({
  timeout: 50000,
  headers: {
    post: {
      'Access-Control-Allow-Origin': '*',
      appKey: 'business-intelligence-server',
      appSecret:
        'YnVzaW5lc3MtaW50ZWxsaWdlbmNlLXNlcnZlci1ZblZ6YVc1bGMzTXRhVzUwWld4c2FXZGxibU5sTFhObGNuWmxjZz09'
    }
  }
})

instance.interceptors.response.use(
  (response) => {
    const data = response.data
    if (response.status === 200) {
      if (data.code === 200) {
        return Promise.resolve(data?.data ? data.data : {})
      } else {
        ElMessage.error(data.msg)
        return Promise.resolve(data)
      }
    } else {
      ElMessage.warning('Description The file upload interface is called incorrectly!')
      return Promise.resolve(data)
    }
  },
  () => ElMessage.error('File upload error!')
)

/**
 * Defines the types of files that can be uploaded.
 */
class FILE_TYPE {
  static VIDEO = 'VIDEO'
  static AUDIO = 'AUDIO'
  static IMAGE = 'IMAGE'
  static FILE = 'FILE'
}

/**
 * File upload error class.
 */
class FileUploadError extends Error {
  /**
   * @constructor
   * @param message - error message
   */
  constructor(message) {
    super(`FileUploadError: ${message}`)
  }
}

/**
 * @typedef FileUploadParam
 * @param file {File} - The file being uploaded.
 * @param fileType {FILE_TYPE} - Type of the file to be uploaded.
 */
/**
 * @typedef FileUploadResponse
 * @property {string} originalName - File's original name.
 * @property {string} url - File's remote access path of the OSS service.It must be accessed from port 80.
 * @property {string} path - Physical path of the file in the linux system.
 */

/**
 * File upload service.
 * @param file {File} - The file being uploaded.
 * @param fileType {FILE_TYPE} - Type of the file to be uploaded.
 * @return {Promise<FileUploadResponse>}
 */
const uploadFile = (file, fileType) => {
  if (!(file instanceof File)) {
    throw new FileUploadError("The 'file' parameter must be an instance of the File object!")
  }
  fileType = fileType || File.type.split('/').shift().toUpperCase()
  if (!Object.hasOwn(FILE_TYPE, fileType)) {
    throw new FileUploadError(
      `Illegal 'fileType' parameter, should be one of the (${Object.keys(FILE_TYPE).join(', ')}).`
    )
  }
  const data = new FormData()
  data.append('file', file)
  return instance.post(
    `${FILE_UPLOAD_SERVER_URL}/api/upload-server/file/v1/upload?fileType=${fileType}`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

export default uploadFile
export { FILE_TYPE }
