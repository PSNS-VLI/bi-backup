import request from '@/utils/request'

const apiData = {
  analyseApiField: {
    path: '/api/bi/datasource/v1/api/analyse',
    type: 'post',
    /*
     * 解析api
     * 解析api
     */
    send: function (
      param: PONT_TYPE.AnalyseApiFieldParam
    ): Promise<PONT_TYPE.AnalyseApiFieldResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getApiDetail: {
    path: '/api/bi/datasource/v1/api/detail',
    type: 'get',
    /*
     * 获取api数据源详情
     * 获取api数据源详情
     */
    send: function (param: PONT_TYPE.GetApiDetailParam): Promise<PONT_TYPE.GetApiDetailResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getDataSourceApiPage: {
    path: '/api/bi/datasource/v1/api/list',
    type: 'get',
    /*
     * 查询探索空间api列表
     * 查询探索空间api列表
     */
    send: function (
      param: PONT_TYPE.GetDataSourceApiPageParam
    ): Promise<PONT_TYPE.GetDataSourceApiPageResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  saveApiDatasource: {
    path: '/api/bi/datasource/v1/api/save',
    type: 'post',
    /*
     * 保存api数据源
     * 保存api数据源
     */
    send: function (
      param: PONT_TYPE.SaveApiDatasourceParam
    ): Promise<PONT_TYPE.SaveApiDatasourceResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  updateApiData: {
    path: '/api/bi/datasource/v1/api/sync',
    type: 'get',
    /*
     * 同步api数据源
     * 同步api数据源
     */
    send: function (param: PONT_TYPE.UpdateApiDataParam): Promise<PONT_TYPE.UpdateApiDataResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getApiSyncPage: {
    path: '/api/bi/datasource/v1/api/sync/history/list',
    type: 'post',
    /*
     * 同步api数据源历史记录
     * 同步api数据源历史记录
     */
    send: function (
      param: PONT_TYPE.GetApiSyncPageParam
    ): Promise<PONT_TYPE.GetApiSyncPageResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  analyseDbDatasource: {
    path: '/api/bi/datasource/v1/db/analyse',
    type: 'post',
    /*
     * 测试数据库连接
     * 测试数据库连接
     */
    send: function (
      param: PONT_TYPE.AnalyseDbDatasourceParam
    ): Promise<PONT_TYPE.AnalyseDbDatasourceResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getDbDatasourceDetail: {
    path: '/api/bi/datasource/v1/db/detail',
    type: 'get',
    /*
     * 获取数据库数据源详情
     * 获取数据库数据源详情
     */
    send: function (
      param: PONT_TYPE.GetDbDatasourceDetailParam
    ): Promise<PONT_TYPE.GetDbDatasourceDetailResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getDataSourceDbPage: {
    path: '/api/bi/datasource/v1/db/list',
    type: 'get',
    /*
     * 查询数据库数据源列表
     * 查询数据库数据源列表
     */
    send: function (
      param: PONT_TYPE.GetDataSourceDbPageParam
    ): Promise<PONT_TYPE.GetDataSourceDbPageResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  saveDbDatasource: {
    path: '/api/bi/datasource/v1/db/save',
    type: 'post',
    /*
     * 保存数据库数据源
     * 保存数据库数据源
     */
    send: function (
      param: PONT_TYPE.SaveDbDatasourceParam
    ): Promise<PONT_TYPE.SaveDbDatasourceResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  deleteDatasource: {
    path: '/api/bi/datasource/v1/delete',
    type: 'get',
    /*
     * 删除数据源
     * 删除数据源
     */
    send: function (
      param: PONT_TYPE.DeleteDatasourceParam
    ): Promise<PONT_TYPE.DeleteDatasourceResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  analyseFile: {
    path: '/api/bi/datasource/v1/file/analyse',
    type: 'get',
    /*
     * 解析文件
     * 解析文件
     */
    send: function (param: PONT_TYPE.AnalyseFileParam): Promise<PONT_TYPE.AnalyseFileResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getDatasourceDetail: {
    path: '/api/bi/datasource/v1/file/detail',
    type: 'get',
    /*
     * 获取文件数据源详情
     * 获取文件数据源详情
     */
    send: function (
      param: PONT_TYPE.GetDatasourceDetailParam
    ): Promise<PONT_TYPE.GetDatasourceDetailResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getDataSourceFilePage: {
    path: '/api/bi/datasource/v1/file/list',
    type: 'get',
    /*
     * 查询探索空间文件列表
     * 查询探索空间文件列表
     */
    send: function (
      param: PONT_TYPE.GetDataSourceFilePageParam
    ): Promise<PONT_TYPE.GetDataSourceFilePageResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  saveFileDatasource: {
    path: '/api/bi/datasource/v1/file/save',
    type: 'post',
    /*
     * 保存文件数据源
     * 保存文件数据源
     */
    send: function (
      param: PONT_TYPE.SaveFileDatasourceParam
    ): Promise<PONT_TYPE.SaveFileDatasourceResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getLastDatasource: {
    path: '/api/bi/datasource/v1/lately',
    type: 'get',
    /*
     * 查询最近的数据源
     * 查询最近的数据源
     */
    send: function (
      param: PONT_TYPE.GetLastDatasourceParam
    ): Promise<PONT_TYPE.GetLastDatasourceResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getDatasourceList: {
    path: '/api/bi/datasource/v1/list',
    type: 'get',
    /*
     * 查询我的数据源
     * 查询我的数据源
     */
    send: function (
      param: PONT_TYPE.GetDatasourceListParam
    ): Promise<PONT_TYPE.GetDatasourceListResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  },
  getDatasourceDbTableFields: {
    path: '/api/bi/datasource/v1/table/fields',
    type: 'get',
    /*
     * 查询数据库数据源表字段列表
     * 查询数据库数据源表字段列表
     */
    send: function (
      param: PONT_TYPE.GetDatasourceDbTableFieldsParam
    ): Promise<PONT_TYPE.GetDatasourceDbTableFieldsResponse> {
      return request({
        url: this.path,
        method: this.type,
        data: param
      })
    }
  }
}

export default apiData
