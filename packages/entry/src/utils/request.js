import axios from 'axios'
import storage from 'store'
import { ElMessage } from 'element-plus'

import { KEY } from '@/config'

import fileUpload, { FILE_TYPE } from './upload-file'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 50000,
  headers: {
    post: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  },
  withCredentials: false
})

const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    switch (error.response.status) {
      case 403:
        ElMessage.error({
          message: 'Forbidden',
          description: data.msg
        })
        break
      case 401:
        ElMessage.error({
          message: 'Unauthorized',
          description: 'Authorization verification failed'
        })
        break
      default:
        ElMessage.error({
          message: 'Request Error',
          description: 'Unknown request exception'
        })
    }
  }
  return Promise.resolve({})
}

instance.interceptors.request.use((config) => {
  const token = storage.get(KEY.TOKEN_KEY)
  if (token) {
    config.headers['token'] = token
  }
  return config
}, errorHandler)

instance.interceptors.response.use((response) => {
  const data = response.data
  if (response.status === 200) {
    if (data.code === 200) {
      return Promise.resolve(data.data)
    } else if (data.code === 407) {
      return Promise.resolve(data)
    } else {
      switch (data?.code?.toString().slice(0, 1)) {
        case '6':
          ElMessage.error(data?.msg)
          break
        case '4':
          ElMessage.warning(data?.msg)
          break
        default:
          ElMessage.warning(data?.msg)
      }
      return Promise.resolve(false)
    }
  } else {
    ElMessage.warning('接口调用异常')
    return Promise.resolve(false)
  }
}, errorHandler)

/**
 * @param payload {AxiosRequestConfig|{method: "file"|"get"|"post", data: FileUploadParam|{}, params: FileUploadParam|{}}}
 * @return {AxiosPromise|Promise<AxiosResponse<any>>|Promise<FileUploadResponse>}
 */
const request = (payload) => {
  if (payload.method === 'file') {
    const data = payload.data || payload.params
    return fileUpload(data.file, data.fileType)
  }
  if (payload.method === 'get') {
    if (payload.data) {
      payload.params = payload.data
      delete payload.data
    }
    return instance(payload)
  }
  if (payload.params) {
    payload.data = payload.params
    delete payload.params
  }
  return instance(payload)
}

export default request
export { FILE_TYPE }
