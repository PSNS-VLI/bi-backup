import request from '@/utils/request'

const apiData = {
  datasetCount: {
    path: '/api/bi/dataset/v1/dataset/count',
    type: 'get',
    /*
     * 数据集数量
     */
    send: function (param: PONT_TYPE.DatasetCountParam): Promise<PONT_TYPE.DatasetCountResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  remove: {
    path: '/api/bi/dataset/v1/delete',
    type: 'get',
    /*
     * 删除数据集或文件夹
     */
    send: function (param: PONT_TYPE.RemoveParam): Promise<PONT_TYPE.RemoveResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  detail: {
    path: '/api/bi/dataset/v1/detail',
    type: 'get',
    /*
     * 数据集详情
     */
    send: function (param: PONT_TYPE.DetailParam): Promise<PONT_TYPE.DetailResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getFieldDataList: {
    path: '/api/bi/dataset/v1/field/data/list',
    type: 'post',
    /*
     * 查看字段下的值列表
     */
    send: function (
      param: PONT_TYPE.GetFieldDataListParam
    ): Promise<PONT_TYPE.GetFieldDataListResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  folderList: {
    path: '/api/bi/dataset/v1/folder/list',
    type: 'get',
    /*
     * 查看文件夹列表
     */
    send: function (param: PONT_TYPE.FolderListParam): Promise<PONT_TYPE.FolderListResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  saveFolder: {
    path: '/api/bi/dataset/v1/folder/save',
    type: 'post',
    /*
     * 保存文件夹
     */
    send: function (param: PONT_TYPE.SaveFolderParam): Promise<PONT_TYPE.SaveFolderResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  list: {
    path: '/api/bi/dataset/v1/list',
    type: 'get',
    /*
     * 数据集列表查询
     */
    send: function (param: PONT_TYPE.ListParam): Promise<PONT_TYPE.ListResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  move: {
    path: '/api/bi/dataset/v1/move',
    type: 'post',
    /*
     * 移动文件夹或数据集
     */
    send: function (param: PONT_TYPE.MoveParam): Promise<PONT_TYPE.MoveResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  previewData: {
    path: '/api/bi/dataset/v1/preview-data',
    type: 'post',
    /*
     * 数据集预览
     */
    send: function (param: PONT_TYPE.PreviewDataParam): Promise<PONT_TYPE.PreviewDataResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  previewSql: {
    path: '/api/bi/dataset/v1/preview-sql',
    type: 'post',
    /*
     * 数据集预览SQL
     */
    send: function (param: PONT_TYPE.PreviewSqlParam): Promise<PONT_TYPE.PreviewSqlResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  renameFolder: {
    path: '/api/bi/dataset/v1/rename-folder',
    type: 'post',
    /*
     * 重命名文件夹
     */
    send: function (param: PONT_TYPE.RenameFolderParam): Promise<PONT_TYPE.RenameFolderResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  save: {
    path: '/api/bi/dataset/v1/save',
    type: 'post',
    /*
     * 保存数据集
     */
    send: function (param: PONT_TYPE.SaveParam): Promise<PONT_TYPE.SaveResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getSqlHistoryList: {
    path: '/api/bi/dataset/v1/sql/history/list',
    type: 'post',
    /*
     * sql历史记录列表
     */
    send: function (
      param: PONT_TYPE.GetSqlHistoryListParam
    ): Promise<PONT_TYPE.GetSqlHistoryListResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getTableFields: {
    path: '/api/bi/dataset/v1/table/fields',
    type: 'get',
    /*
     * 获取表字段
     */
    send: function (
      param: PONT_TYPE.GetTableFieldsParam
    ): Promise<PONT_TYPE.GetTableFieldsResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  tree: {
    path: '/api/bi/dataset/v1/tree',
    type: 'get',
    /*
     * 数据集树形结构
     */
    send: function (param: PONT_TYPE.TreeParam): Promise<PONT_TYPE.TreeResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  }
}

export default apiData
