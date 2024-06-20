import request from '@/utils/request'

const apiData = {
  delete_1: {
    path: '/api/bi/dashboard/v1/delete',
    type: 'get',
    /*
     * 删除
     */
    send: function (param: PONT_TYPE.Delete_1Param): Promise<PONT_TYPE.Delete_1Response> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  detail_1: {
    path: '/api/bi/dashboard/v1/detail',
    type: 'get',
    /*
     * 详情
     */
    send: function (param: PONT_TYPE.Detail_1Param): Promise<PONT_TYPE.Detail_1Response> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  folderList_1: {
    path: '/api/bi/dashboard/v1/folder/list',
    type: 'get',
    /*
     * 查看文件夹列表
     */
    send: function (param: PONT_TYPE.FolderList_1Param): Promise<PONT_TYPE.FolderList_1Response> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  saveFolder_1: {
    path: '/api/bi/dashboard/v1/folder/save',
    type: 'post',
    /*
     * 保存文件夹
     */
    send: function (param: PONT_TYPE.SaveFolder_1Param): Promise<PONT_TYPE.SaveFolder_1Response> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  list_1: {
    path: '/api/bi/dashboard/v1/list',
    type: 'get',
    /*
     * 仪表板列表查询
     */
    send: function (param: PONT_TYPE.List_1Param): Promise<PONT_TYPE.List_1Response> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  loadData: {
    path: '/api/bi/dashboard/v1/load-data',
    type: 'post',
    /*
     * 加载数据
     */
    send: function (param: PONT_TYPE.LoadDataParam): Promise<PONT_TYPE.LoadDataResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  move_1: {
    path: '/api/bi/dashboard/v1/move',
    type: 'post',
    /*
     * 移动文件夹或仪表板
     */
    send: function (param: PONT_TYPE.Move_1Param): Promise<PONT_TYPE.Move_1Response> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  publish: {
    path: '/api/bi/dashboard/v1/publish',
    type: 'get',
    /*
     * 发布
     */
    send: function (param: PONT_TYPE.PublishParam): Promise<PONT_TYPE.PublishResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  renameFolder_1: {
    path: '/api/bi/dashboard/v1/rename-folder',
    type: 'post',
    /*
     * 重命名文件夹
     */
    send: function (
      param: PONT_TYPE.RenameFolder_1Param
    ): Promise<PONT_TYPE.RenameFolder_1Response> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  save_1: {
    path: '/api/bi/dashboard/v1/save',
    type: 'post',
    /*
     * 保存仪表板
     */
    send: function (param: PONT_TYPE.Save_1Param): Promise<PONT_TYPE.Save_1Response> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  }
}

export default apiData
