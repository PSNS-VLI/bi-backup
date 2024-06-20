import request, { FILE_TYPE } from '../utils/request'

/**
 * @typedef FileUploadParam
 * @property {File} file - 需要上传的文件对象
 */

/**
 * 文件上传接口
 */
const apiData = {
  uploadVideo: {
    spec: '上传视频',
    type: 'file',
    /**
     * @param param {FileUploadParam}
     * @return {Promise<FileUploadResponse>}
     */
    send: function (param) {
      return request({
        method: this.type,
        data: {
          file: param.file,
          fileType: FILE_TYPE.VIDEO
        }
      })
    }
  },
  uploadAudio: {
    spec: '上传音频',
    type: 'file',
    /**
     * @param param {FileUploadParam}
     * @return {Promise<FileUploadResponse>}
     */
    send: function (param) {
      return request({
        method: this.type,
        data: {
          file: param.file,
          fileType: FILE_TYPE.AUDIO
        }
      })
    }
  },
  uploadImage: {
    spec: '上传图片',
    type: 'file',
    /**
     * @param param {{}}
     * @return {Promise<FileUploadResponse>}
     */
    send: function (param) {
      return request({
        method: this.type,
        data: {
          file: param.file,
          fileType: FILE_TYPE.IMAGE
        }
      })
    }
  },
  uploadFile: {
    spec: '上传文件',
    type: 'file',
    /**
     * @param param {FileUploadParam}
     * @return {Promise<FileUploadResponse>}
     */
    send: function (param) {
      return request({
        method: this.type,
        data: {
          file: param.file,
          fileType: FILE_TYPE.FILE
        }
      })
    }
  }
}

export default apiData
