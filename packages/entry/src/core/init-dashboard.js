import { DashboardApi } from '@bi/dashboard'

import api from '@/api'
import fileApi from '@/api/upload-file'
import { FILE_PREVIEW_SERVER_URL } from '@/config'

const dashboardApi = api.dashboardApi
const datasetApi = api.datasetApi

/**
 * @param {Array<defs.DatasetVO>} datasetList
 */
const convertDataset = (datasetList) => {
  return datasetList.reduce((resList, dataset) => {
    const newDataset = {
      id: dataset.id,
      pid: dataset.pid,
      name: dataset.name,
      nodeType: dataset.type
    }

    if (dataset.children?.length) {
      Object.assign(newDataset, {
        children: convertDataset(dataset.children)
      })
    }

    resList.push(newDataset)

    return resList
  }, [])
}

/**
 *
 * @param {Array<defs.DatasetTableFieldVO>} fieldList
 * @returns
 */
const convertField = (fieldList) => {
  return fieldList.reduce((resList, field) => {
    const newField = {
      id: field.id,
      pid: field.pid,
      name: field.name,
      originName: field.originName,
      type: field.type,
      class: field.dataType,
      nodeType:
        field.type === 'DATE' && field.children?.length ? 'FIELD_SET' : field.datasetTableFieldType,
      description: field.description,
      settings: {
        displayName: field.name,
        aggregation: field.aggregation,
        sort: 'DEFAULT',
        nullDisplay: {
          nullValue: 'AUTO'
        }
      },
      source: field
    }

    if (field.children?.length) {
      Object.assign(newField, {
        children: convertField(field.children)
      })
    }

    resList.push(newField)

    return resList
  }, [])
}

/**
 *
 * @returns {defs.DatasetTableFieldRequest}
 */
const convertFieldReverse = (field) => {
  /**
   * @type {defs.DatasetTableFieldRequest}
   */
  const newFild = JSON.parse(JSON.stringify(field.source ?? {}))
  const settings = field.settings

  newFild.name = field.name
  newFild.dataType = field.class

  if (settings.aggregation) {
    newFild.aggregation = settings.aggregation
  }

  if (settings.sort) {
    newFild.sortType = settings.sort
  }

  return newFild
}

DashboardApi.bindApi({
  saveDashboardFolder: async (param) => await dashboardApi.saveFolder_1.send(param),
  deleteDashboardFolder: async (param) => await dashboardApi.delete_1.send(param),
  moveDashboardFolder: async (param) => await dashboardApi.move_1.send(param),
  loadDashboardFolderList: async (param) => {
    const folderList = await dashboardApi.folderList_1.send(param)
    if (folderList) {
      return [folderList]
    }
    return false
  },
  loadDashboardList: async (param) => await dashboardApi.list_1.send(param),

  saveDashboard: async (param) => await dashboardApi.save_1.send(param),
  publishDashboard: async (param) => await dashboardApi.publish.send(param),
  loadDashboard: async (param) => await dashboardApi.detail_1.send(param),

  loadData: async (param) => {
    /**
     * @type {PONT_TYPE.LoadDataParam}
     */
    const newParam = {
      datasetId: param.datasetId,
      allFields: param.fields.map(convertFieldReverse)
    }
    if (param.fieldFilters?.length) {
      newParam.filterConditions = param.fieldFilters.map((fieldFilter) => {
        /**
         * @type {defs.FilterConditionRequest}
         */
        const newFieldFilter = convertFieldReverse(convertFieldReverse)
        const settings = fieldFilter.settings

        if (settings.filter) {
          const filter = settings.filter

          newFieldFilter.conditionType = filter.conditionType
          newFieldFilter.conditions = filter.conditions
        }

        return newFieldFilter
      })
    }

    const result = await dashboardApi.loadData.send(newParam)

    if (result) {
      const [fieldAliasNameMap, fieldsMap] = result.fields.reduce(
        (maps, field) => {
          const aliasNameMap = maps[0]
          const fieldsMap = maps[1]

          aliasNameMap[field.fieldAliasName] = field.name
          fieldsMap[field.fieldAliasName] = field

          return maps
        },
        [{}, {}]
      )

      return result.data.map((item) => {
        return Object.keys(item).reduce((newData, key) => {
          const field = fieldsMap[key]
          const isGeoField = field?.type === 'GEOGRAPHY'

          newData[fieldAliasNameMap[key]] = isGeoField
            ? item[key]?.extraMap?.regionCode
            : item[key]?.value

          return newData
        }, {})
      })
    }

    return false
  },

  loadDataset: async (param) => {
    const datasetList = await datasetApi.tree.send(param)

    if (datasetList) {
      return convertDataset(datasetList)
    }

    return false
  },
  loadField: async (param) => {
    const fieldList = await datasetApi.detail.send({ id: param.datasetId })

    if (fieldList) {
      return convertField(fieldList.allFields ?? [])
    }

    return false
  },

  uploadImage: async (param) => {
    const res = await fileApi.uploadImage.send(param)

    if (res.url) {
      return `${FILE_PREVIEW_SERVER_URL}${res.url}`
    }

    return false
  }
})
