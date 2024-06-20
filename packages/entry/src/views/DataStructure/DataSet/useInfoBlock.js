import { ref } from 'vue'
import { dateFormat } from './blocks/store'
import cloneDeep from 'lodash/cloneDeep'
import api from '@/api'
import { ElMessage } from 'element-plus'
const { datasetApi } = api

const useInfoBlock = (updateMode, props) => {
  const contentType = ref('')
  const sqlName = ref('未命名')
  const saveHandlerClick = (params) => {
    console.log('保存了', params)
  }
  const actions = ref([])

  const showItems = ref(false) //按钮弹出框状态
  const itemTitle = ref('') //按钮弹出框标题
  const filterParams = ref({})
  const previewTableDatas = ref([]) //预览表格数据
  //标准时间->格式化时间转换
  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const diff = date - startOfYear
    const oneWeek = 1000 * 60 * 60 * 24 * 7
    const weekNumber = Math.ceil(diff / oneWeek + 1)
    return weekNumber
  }
  const weekAndDate = (str, flag) => {
    const dateToWeekFormat = (dateStr) => {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const week = getWeekNumber(date)
      return `${year}-${week} 周`
    }
    const dateToQuarterFormat = (dateStr) => {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const quarter = Math.floor((date.getMonth() + 3) / 3)
      return `${year}-${quarter} 季度`
    }
    const dateToTimeFormat = (dateStr) => {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
    if (flag === 'week') {
      return dateToWeekFormat(str)
    } else if (flag === 'quarter') {
      return dateToQuarterFormat(str)
    } else if (flag === 'datetime') {
      return dateToTimeFormat(str)
    } else if (flag === 'minute') {
      return str
    } else if (flag === 'second') {
      return str
    }
  }
  const optionStringTerm = [
    {
      options: [
        {
          value: 'EQ',
          label: '精确匹配'
        },
        {
          value: 'NE',
          label: '不匹配'
        }
      ]
    },
    {
      options: [
        {
          value: 'CONTAIN',
          label: '包含'
        },
        {
          value: 'NOT_CONTAIN',
          label: '不包含'
        }
      ]
    },
    {
      options: [
        {
          value: 'START_WITH',
          label: '开头是'
        },
        {
          value: 'END_WITH',
          label: '结尾是'
        }
      ]
    },
    {
      options: [
        {
          value: 'IS_EMPTY',
          label: '为空'
        },
        {
          value: 'NOT_IS_EMPTY',
          label: '不为空'
        }
      ]
    },
    {
      options: [
        {
          value: 'EMPTY_TEXT',
          label: '空文本'
        },
        {
          value: 'NOT_EMPTY_TEXT',
          label: '非空文本'
        }
      ]
    }
  ]
  const optionsNumTerm = [
    {
      options: [
        {
          value: 'EQ',
          label: '等于'
        },
        {
          value: 'NE',
          label: '不等于'
        }
      ]
    },
    {
      options: [
        {
          value: 'GT',
          label: '大于'
        },
        {
          value: 'GT_EQ',
          label: '大于等于'
        }
      ]
    },
    {
      options: [
        {
          value: 'LT',
          label: '小于'
        },
        {
          value: 'LT_EQ',
          label: '小于等于'
        }
      ]
    },
    {
      options: [
        {
          value: 'IS_EMPTY',
          label: '为空'
        },
        {
          value: 'NOT_IS_EMPTY',
          label: '不为空'
        }
      ]
    }
  ]

  //过滤--转化数据
  const stringAndNumConditions = (item) => {
    // 条件、枚举
    if (item.fieldsForm.filterType === 'ENUM_VALUE') {
      if (item.type === 'NUMBER' || item.type === 'INTEGER') {
        const conditionType = item.fieldsForm.conditionType
        if (conditionType === 'SINGLE_CONDITION') {
          return [
            {
              matchingType: item.fieldsForm.matchingType,
              conditionValue:
                item.fieldsForm.conditionValue === undefined ? '' : item.fieldsForm.conditionValue
            }
          ]
        } else if (conditionType === 'OR_CONDITION') {
          return [
            {
              matchingType: item.fieldsForm.conditionValueOr.fir.matchingType,
              conditionValue:
                item.fieldsForm.conditionValueOr.fir.conditionValue === undefined
                  ? ''
                  : item.fieldsForm.conditionValueOr.fir.conditionValue
            },
            {
              matchingType: item.fieldsForm.conditionValueOr.sec.matchingType,
              conditionValue:
                item.fieldsForm.conditionValueOr.sec.conditionValue === undefined
                  ? ''
                  : item.fieldsForm.conditionValueOr.sec.conditionValue
            }
          ]
        } else if (conditionType === 'AND_CONDITION') {
          return [
            {
              matchingType: item.fieldsForm.conditionValueAnd.fir.matchingType,
              conditionValue:
                item.fieldsForm.conditionValueAnd.fir.conditionValue === undefined
                  ? ''
                  : item.fieldsForm.conditionValueAnd.fir.conditionValue
            },
            {
              matchingType: item.fieldsForm.conditionValueAnd.sec.matchingType,
              conditionValue:
                item.fieldsForm.conditionValueAnd.sec.conditionValue === undefined
                  ? ''
                  : item.fieldsForm.conditionValueAnd.sec.conditionValue
            }
          ]
        }
      } else {
        if (item.fieldsForm.conditionType === 'OR_CONDITION') {
          return item.fieldsForm.emuneCondition.map((emuneItem) => ({
            matchingType: 'EQ',
            conditionValue: emuneItem
          }))
        } else {
          return [
            {
              matchingType: item.fieldsForm.matchingType,
              conditionValue: item.fieldsForm.conditionValue || item.fieldsForm.emuneCondition
            }
          ]
        }
      }
    } else {
      const conditionType = item.fieldsForm.conditionType
      if (conditionType === 'SINGLE_CONDITION') {
        return [
          {
            matchingType: item.fieldsForm.matchingType,
            conditionValue: item.fieldsForm.conditionValue
          }
        ]
      } else if (conditionType === 'OR_CONDITION') {
        return [
          {
            matchingType: item.fieldsForm.conditionValueOr.fir.matchingType,
            conditionValue:
              item.fieldsForm.conditionValueOr.fir.conditionValue === undefined
                ? ''
                : item.fieldsForm.conditionValueOr.fir.conditionValue
          },
          {
            matchingType: item.fieldsForm.conditionValueOr.sec.matchingType,
            conditionValue:
              item.fieldsForm.conditionValueOr.sec.conditionValue === undefined
                ? ''
                : item.fieldsForm.conditionValueOr.sec.conditionValue
          }
        ]
      } else if (conditionType === 'AND_CONDITION') {
        return [
          {
            matchingType: item.fieldsForm.conditionValueAnd.fir.matchingType,
            conditionValue:
              item.fieldsForm.conditionValueAnd.fir.conditionValue === undefined
                ? ''
                : item.fieldsForm.conditionValueAnd.fir.conditionValue
          },
          {
            matchingType: item.fieldsForm.conditionValueAnd.sec.matchingType,
            conditionValue:
              item.fieldsForm.conditionValueAnd.sec.conditionValue === undefined
                ? ''
                : item.fieldsForm.conditionValueAnd.sec.conditionValue
          }
        ]
      }
    }
  }
  //计算字段--转化数据
  const persentMap = {
    1: '%0',
    2: '%00'
  }
  const selfDataConvert = (addFieldItem) => {
    if (addFieldItem.definiteSelf === 'num') {
      return addFieldItem.definiteSelfNum
    } else {
      return persentMap[addFieldItem.definiteSelfNum]
    }
  }

  const tableTabActions = ref([
    {
      type: 'normal',
      prefix: 'plus',
      transparent: true,
      label: '新建计算字段',
      auto: true,
      flow: true,
      disabled: true,
      handler: () => {
        showItems.value = true
        itemTitle.value = '新建计算字段'
        contentType.value = 'fieldItem'
      }
    },
    {
      type: 'normal',
      prefix: 'zuzhijigou-',
      transparent: true,
      auto: true,
      flow: true,
      disabled: true,
      label: '新建分组维度',
      handler: () => {
        showItems.value = true
        itemTitle.value = '新建分组维度'
        contentType.value = 'dimensionItem'
      }
    },
    {
      type: 'normal',
      prefix: 'filter',
      transparent: true,
      auto: true,
      flow: true,
      disabled: true,
      label: '过滤',
      isAmount: true,
      amount: 0,
      handler: () => {
        showItems.value = true
        itemTitle.value = '数据集过滤条件设置'
        contentType.value = 'filterItem'
      }
    },
    {
      label: '刷新预览',
      prefix: 'refresh-right',
      auto: true,
      flow: true,
      disabled: true,
      handler: async (
        _,
        {
          dragItems,
          currentDataSource,
          allFields,
          filterConditions,
          queryId,
          addFieldItem,
          definiteSelfCheck,
          addFieldEditName
        }
      ) => {
        const resultfilterConditionsData = cloneDeep(filterConditions)
        const convertConditionValue = (item, subtype) => {
          if (item.fieldsForm.conditionTimeType === 'BETWEEN') {
            item.fieldsForm.conditionTimeTypeBetween = {
              start: weekAndDate(item.fieldsForm.conditionTimeTypeBetween.start, subtype),
              end: weekAndDate(item.fieldsForm.conditionTimeTypeBetween.end, subtype)
            }
          } else {
            item.fieldsForm.conditionValue = weekAndDate(item.fieldsForm.conditionValue, subtype)
          }
        }

        resultfilterConditionsData.map((item) => {
          switch (item.granularity) {
            case 'year-week':
              convertConditionValue(item, 'week')
              break
            case 'year-quarter':
              convertConditionValue(item, 'quarter')
              break
            case 'year-month-day':
              return item
            case 'datetime':
              convertConditionValue(item, 'datetime')
              break
            case 'hour':
              return item
            case 'hour-minute':
              convertConditionValue(item, 'minute')
              break
            case 'hour-minute-second':
              convertConditionValue(item, 'second')
              break
            default:
              break
          }
        })
        const convertTreeStructure = (dragItems) => {
          const convertNode = (node) => {
            const { datasourceId, id, name, type, unionToParent, originName, tableSql } = node
            const currentDst = {
              name,
              originName,
              datasourceId: datasourceId || id,
              type,
              tableSql: tableSql || null
            }

            let childrenDst = []
            if (node.children && node.children.length > 0) {
              childrenDst = node.children.map(convertNode)
            }

            let unionFields = []
            if (unionToParent) {
              unionFields = unionToParent.unionFields.map((field) => ({
                parentField:
                  typeof field.parentField === 'string'
                    ? {
                        name: field.parentField,
                        datasetTableOriginName:
                          field.parentDatasetTableOriginName ??
                          unionToParent.unionFields[0].parentDatasetTableOriginName
                      }
                    : field.parentField,
                currentField:
                  typeof field.currentField === 'string'
                    ? {
                        name: field.currentField,
                        datasetTableOriginName:
                          field.currentDatasetTableOriginName ??
                          unionToParent.unionFields[0].currentDatasetTableOriginName
                      }
                    : field.currentField
              }))
            }
            const result = {
              currentDst,
              childrenDst,
              unionToParent: unionToParent
                ? {
                    unionType: unionToParent.unionType,
                    unionFields
                  }
                : {
                    unionType: 'LEFT',
                    unionFields
                  }
            }
            return result
          }

          const treeUnion = dragItems.map(convertNode)
          return treeUnion // 包装在一个数组中，以满足所需的输出结构
        }
        //拖拽树
        const convertedTreeUnion = convertTreeStructure(dragItems)
        //所有字段
        let mergedAllFields = allFields.reduce((accumulator, currentItem) => {
          const childrenArray =
            currentItem.children.filter(
              (child) =>
                !(
                  (child.extraField === 1 || child.extraField === 2 || child.extraField === 3) &&
                  child.checked === 1
                )
            ) || []

          let regex = /\(([^)]*)\)/
          const newItems = childrenArray
            .filter((fields) => fields.move !== 1)
            .map((child) => ({
              name: child.name,
              originName: child.originName || null,
              type: typeof child.type === 'object' ? child.type?.[0] : child.type || null,
              originType: child.originType || null,
              datasourceId: dragItems[0].datasourceId || dragItems[0].id || child.datasourceId,
              datasetId: queryId ? queryId : null,
              datasetTableName: child.datasetTableName || null,
              datasetTableOriginName:
                child.datasetTableOriginName || child.datasetTableName || null,
              description: child.description || '',
              fieldAliasName: child.fieldAliasName || null,
              dataType: child.dataType || null,
              extraField: child.extraField || 0,
              checked: child.checked,
              datasetTableFieldType: child.datasetTableFieldType, //是字段还是文件
              expression: child.expression || null,
              dataFormat:
                child.extraField === 1
                  ? child.dataFormat === 'manual'
                    ? child.definiteFormat
                    : child.dataFormat === 'self'
                      ? selfDataConvert(child)
                      : child.dataFormat || null
                  : child.dataFormat || null,
              granularities:
                child.type === 'DATE' || child.type?.[0] === 'DATE' ? child.granularities : null,
              granularity:
                child.type === 'DATE' || (child.type?.[0] === 'DATE' && child.granularity)
                  ? child.granularity
                  : undefined,
              convertValue: child.convertValue || 1,
              aggregation: child.aggregation || '',
              // 如果有子节点，递归处理
              children: child.children
                ? child.children
                    .filter((fields) => fields.move !== 1)
                    .map((grandchild) => ({
                      name: grandchild.name,
                      originName: grandchild.originName,
                      type:
                        typeof grandchild.type === 'object'
                          ? grandchild.type?.[0]
                          : grandchild.type || null,
                      originType: grandchild.originType || null,
                      datasourceId:
                        dragItems[0].datasourceId || dragItems[0].id || child.datasourceId,
                      datasetId: queryId ? queryId : null,
                      datasetTableName: grandchild.datasetTableName || child.datasetTableName,
                      datasetTableOriginName:
                        grandchild.datasetTableOriginName ||
                        child.datasetTableOriginName ||
                        child.datasetTableName,
                      description: grandchild.description || '',
                      fieldAliasName: grandchild.fieldAliasName || null,
                      dataType: grandchild.dataType,
                      extraField: grandchild.extraField || 0,
                      checked: child.checked || child.children?.length > 0 ? grandchild.checked : 1,
                      datasetTableFieldType: grandchild.datasetTableFieldType, //是字段还是文件
                      expression: grandchild.expression || null,
                      dataFormat: grandchild.dataFormat || null,
                      granularities:
                        child.type === 'DATE' || (child.type?.[0] === 'DATE' && child.granularities)
                          ? grandchild.granularities
                          : null,
                      granularity: child.granularities ? grandchild.granularity : undefined,
                      convertValue: grandchild.convertValue,
                      aggregation: grandchild.aggregation,
                      children: grandchild.children
                        ? grandchild.children
                            .filter((fields) => fields.move !== 1)
                            .map((grandgrandchild) => ({
                              name: grandgrandchild.name,
                              originName: grandgrandchild.originName,
                              type:
                                typeof grandgrandchild.type === 'object'
                                  ? grandgrandchild.type?.[0]
                                  : grandgrandchild.type || null,
                              originType: grandgrandchild.originType || null,
                              datasourceId:
                                dragItems[0].datasourceId || dragItems[0].id || child.datasourceId,
                              datasetId: null,
                              datasetTableName:
                                grandgrandchild.datasetTableName || child.datasetTableName,
                              datasetTableOriginName:
                                grandgrandchild.datasetTableOriginName ||
                                child.datasetTableOriginName ||
                                child.datasetTableName,
                              description: grandgrandchild.description || '',
                              fieldAliasName: grandgrandchild.fieldAliasName || null,
                              dataType: grandgrandchild.dataType,
                              extraField: grandgrandchild.extraField || 0,
                              checked: child.checked,
                              datasetTableFieldType: grandgrandchild.datasetTableFieldType, //是字段还是文件
                              expression: grandgrandchild.expression || null,
                              dataFormat: grandgrandchild.dataFormat || null,
                              granularity:
                                grandgrandchild.type === 'DATE' ||
                                (grandgrandchild.type?.[0] === 'DATE' &&
                                  grandgrandchild.name.includes('('))
                                  ? grandgrandchild.name.match(regex)[1]
                                  : null, //时间类型必填
                              convertValue: null,
                              aggregation: grandgrandchild.aggregation
                                ? grandgrandchild.aggregation.toUpperCase()
                                : null,
                              children: null
                            }))
                        : null
                    }))
                : null
            }))

          accumulator.push(...newItems) // 新创建的数组添加到 accumulator 中
          return accumulator
        }, [])
        //过滤
        const convertFilterConditions = resultfilterConditionsData.map((item) => {
          return {
            datasetTableName: item.fieldsForm.datasetTableName || item.datasetTableName,
            datasetTableFieldName: item.fieldsForm.datasetTableFieldName || item.name,
            datasetTableFieldOriginName:
              item.fieldsForm.datasetTableFieldOriginName || item.originName,
            datasetTableOriginName:
              item.fieldsForm.datasetTableOriginName || item.datasetTableOriginName,
            filterType: item.fieldsForm.filterType,
            conditionType:
              item.type === 'DATE'
                ? item.fieldsForm.filterType === 'CONDITION'
                  ? item.fieldsForm?.conditionTimeType || item.fieldsForm.conditionType
                  : item.fieldsForm.conditionType
                : item.fieldsForm.conditionType,
            conditions:
              item.type === 'DATE'
                ? item.fieldsForm.conditionTimeType === 'BETWEEN'
                  ? [
                      {
                        matchingType: 'GT_EQ',
                        conditionValue: item.fieldsForm.conditionTimeTypeBetween.start
                      },
                      {
                        matchingType: 'LT_EQ',
                        conditionValue: item.fieldsForm.conditionTimeTypeBetween.end
                      }
                    ]
                  : [
                      {
                        matchingType:
                          item.fieldsForm.filterType === 'CONDITION'
                            ? item.fieldsForm.conditionTimeType === 'BEGIN_WITH'
                              ? 'GT_EQ'
                              : 'LT_EQ'
                            : item.fieldsForm.matchingType,
                        conditionValue:
                          item.fieldsForm.conditionValue === undefined
                            ? ''
                            : item.fieldsForm.conditionValue
                      }
                    ]
                : item.fieldsForm.conditions || stringAndNumConditions(item)
          }
        })
        //新建计算字段
        if (addFieldItem) {
          mergedAllFields.push({
            name: addFieldItem.name,
            originName: addFieldItem.originName || null,
            type: addFieldItem.type || null,
            originType: addFieldItem.originType || null,
            datasourceId: dragItems[0].datasourceId || dragItems[0].id || addFieldItem.datasourceId,
            datasetId: queryId ? queryId : null,
            datasetTableName: addFieldItem.datasetTableName || null,
            datasetTableOriginName: addFieldItem.datasetTableOriginName || null,
            description: addFieldItem.description || '',
            fieldAliasName: addFieldItem.fieldAliasName || null,
            dataType: addFieldItem.dataType || null,
            extraField: addFieldItem.extraField || 0,
            checked: addFieldItem.checked,
            datasetTableFieldType: addFieldItem.datasetTableFieldType, //是字段还是文件
            expression: addFieldItem.expression || null,
            dataFormat:
              addFieldItem.dataFormat === 'manual'
                ? addFieldItem.definiteFormat
                : addFieldItem.dataFormat === 'self'
                  ? selfDataConvert(addFieldItem)
                  : addFieldItem.dataFormat || null,
            granularities: addFieldItem.type === 'DATE' ? addFieldItem.granularities : null,
            granularity:
              addFieldItem.type === 'DATE' && addFieldItem.granularity
                ? addFieldItem.granularity
                : undefined,
            convertValue: addFieldItem.convertValue || null,
            aggregation: addFieldItem.aggregation || '',
            children: null
          })
        }
        // 请求预览数据集数据列表接口
        const result = await datasetApi.previewData.send({
          datasourceType: dragItems[0].type === 'SQL' ? currentDataSource.type : dragItems[0].type,
          treeUnion: convertedTreeUnion,
          allFields: mergedAllFields,
          filterConditions: convertFilterConditions
        })
        if (result) {
          //从返回的result.data中查找和字段原名相匹配后赋值，表格数据
          if (result.code !== 407 && result.fields) {
            const nameAliasMap = result.fields.map((field) => ({
              type: field.type,
              originType: field.originType,
              dataFormat: field.dataFormat || 2,
              name: field.name,
              fieldAliasName: field.fieldAliasName,
              convertValue: field.convertValue || 1
            }))
            if (result.data) {
              const transformedData = result.data.map((item) => {
                return nameAliasMap.reduce((acc, alias) => {
                  const formatValue = item[alias.fieldAliasName]?.value

                  const formatConvertValue = Number(alias.convertValue || 1)
                  const index = String(alias.dataFormat).indexOf('%')
                  let formattedValue
                  if (formatValue && formatValue !== 'None') {
                    switch (alias.type) {
                      case 'DATE':
                        if (alias.originType !== 'DATE') {
                          formattedValue = '-'
                        } else {
                          formattedValue = dateFormat(formatValue, alias.dataFormat)
                        }
                        break
                      case 'NUMBER':
                        if (index !== -1) {
                          if (alias.dataFormat === '%00') {
                            const convertValue =
                              (formatValue * 100 * formatConvertValue).toFixed(2) + '%'
                            if (
                              definiteSelfCheck &&
                              (alias.name === addFieldItem?.name || alias.name === addFieldEditName)
                            ) {
                              formattedValue = convertValue
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            } else {
                              formattedValue = convertValue
                            }
                          } else {
                            const convertValue =
                              (formatValue * 100 * formatConvertValue).toFixed(1) + '%'
                            if (
                              definiteSelfCheck &&
                              (alias.name === addFieldItem?.name || alias.name === addFieldEditName)
                            ) {
                              formattedValue = convertValue
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            } else {
                              formattedValue = convertValue
                            }
                          }
                        } else {
                          if (formatValue !== '-') {
                            const convertValue = Number(formatValue * formatConvertValue).toFixed(
                              alias.dataFormat
                            )
                            if (
                              definiteSelfCheck &&
                              (alias.name === addFieldItem?.name || alias.name === addFieldEditName)
                            ) {
                              formattedValue = convertValue
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            } else {
                              formattedValue = convertValue
                            }
                          } else {
                            formattedValue = String(formatValue)
                          }
                        }
                        break
                      default:
                        formattedValue = String(formatValue) // 默认转化为字符串
                        break
                    }
                  } else {
                    formattedValue = '-'
                  }
                  acc[alias.name] = formattedValue
                  return acc
                }, {})
              })
              previewTableDatas.value = transformedData
            }
            return true
          } else {
            ElMessage.warning(result?.msg)
            return
          }
        }
        return result
      }
    }
  ])
  const showItemClick = (val) => {
    showItems.value = val
  }
  const updateSqlName = (val) => {
    sqlName.value = val
  }
  const updateContentType = (val) => {
    contentType.value = val
  }
  const dataSetDetail = ref([])
  const loadDetail = async () => {
    const response = await datasetApi.detail.send({ id: props.id })
    if (response) dataSetDetail.value = response
    sqlName.value = response.name
  }
  updateMode && loadDetail()

  return {
    sqlName,
    actions,
    tableTabActions,
    contentType,
    itemTitle,
    showItems,
    updateSqlName,
    updateContentType,
    saveHandlerClick,
    showItemClick,
    dataSetDetail,
    filterParams,
    previewTableDatas, //刷新预览
    optionsNumTerm,
    optionStringTerm,
    weekAndDate
  }
}

//操作项辅助函数
const findNodeByNameOrId = (nodes, attach) => {
  for (const node of nodes) {
    if (node.id === attach) {
      return node // 返回当前节点
    }
    // 如果没有id匹配，检查name
    if (node.name === attach && node?.move !== 1) {
      return node // 如果name匹配，返回当前节点
    }
    if (node.children) {
      const foundNode = findNodeByNameOrId(node.children, attach)
      if (foundNode) {
        return foundNode
      }
    }
  }
  return null
}

const flattenTreeData = (treeData) => {
  let result = []
  for (const node of treeData) {
    if (node.children) {
      for (const child of node.children) {
        if (child.dataType === 'DIMENSION' || child.dataType === 'MEASURE') {
          result.push(child)
        }
        result = result.concat(flattenTreeData(child.children || []))
      }
    }
  }
  return result
}

//数据预览图标
const ICONMAP = {
  INTEGER: 'icon-num',
  NUMBER: 'icon-num',
  DOUBLE: 'icon-num',
  STRING: 'icon-str',
  DATE: 'icon-Calendar',
  GEOGRAPHY: 'icon-leidatu'
}
const setIconsInTree = (treeData) => {
  return treeData.map((node) => {
    if (node && node.type && node.datasetTableFieldType === 'FIELD') {
      node.icon = ICONMAP[typeof node.type === 'string' ? node.type : node.type?.[0]] || ''
    } else if (node.datasetTableFieldType === 'FOLDER') {
      node.icon = 'icon-folder-opened'
    }
    // 如果存在子节点，递归处理
    if (node.children) {
      node.children = setIconsInTree(node.children)
    }
    return node
  })
}
//过滤操作---时间类型map
const DATEMAP = {
  year: 'year',
  'hour-minute': 'hour-minute',
  'hour-minute-second': 'hour-minute-second',
  'year-week': 'year-week',
  'year-month': 'year-month',
  'year-month-day': 'year-month-day',
  'year-quarter': 'year-quarter',
  hour: 'hour',
  datetime: 'datetime'
}

// 设置图标操作项
const options = [
  {
    label: '自动',
    value: 'auto'
  },
  {
    label: '整数',
    value: '0'
  },
  {
    label: '保留1位小数',
    value: '1'
  },
  {
    label: '保留2位小数',
    value: '2'
  },
  {
    label: '百分比1位小数',
    value: '%0'
  },
  {
    label: '百分比2位小数',
    value: '%00'
  },
  {
    label: '自定义',
    value: 'self'
  },
  {
    label: '手动输入',
    value: 'manual'
  }
]
const editorForm = ref([])
const handlerEdit = (editorData, data) => {
  editorForm.value = [
    {
      itemType: 'input',
      label: '字段原名',
      key: 'name',
      required: true,
      'show-word-limit': true,
      minlength: 0,
      maxlength: 80,
      rules: [
        {
          validator: (_, val, callback) => {
            if (!val.trim()) {
              callback(new Error('字段原名不能为空格！'))
              return
            }
            callback()
          },
          trigger: 'blur'
        }
      ]
    },
    {
      itemType: 'text',
      label: '物理字段名',
      key: 'phyFields',
      required: true,
      rules: [
        {
          validator: (_, val, callback) => {
            if (!val) {
              callback(new Error('物理字段名不能为空格！'))
              return
            }
            callback()
          },
          trigger: 'blur'
        }
      ]
    },
    {
      type: 'textarea',
      label: '字段描述',
      key: 'description',
      'show-word-limit': true,
      maxlength: '80',
      resize: 'none'
    }
  ]
  if (data.type === 'NUMBER' || data.type === 'INTEGER') {
    editorForm.value.splice(
      2,
      0,
      {
        itemType: 'select',
        label: '显示值格式化',
        key: 'dataFormat',
        options: options
      },
      {
        itemType: 'input',
        label: '单位换算乘以',
        key: 'convertValue',
        rules: [
          {
            validator: (_, val, callback) => {
              if (!val) {
                callback(new Error('单位换算乘以不能为空！'))
                return
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    )
  } else if (data.type === 'DATE') {
    editorForm.value.splice(2, 0, {
      itemType: 'select',
      label: '日期显示格式',
      key: 'dataFormat',
      options: [
        {
          value: 'yyyy-MM-dd HH:mm:ss',
          label: '自动'
        },
        {
          value: 'YYYY-MM-DD HH:mm:ss',
          label: 'YYYY-MM-DD HH:mm:ss (例:2024-04-28 16:06:06)'
        },
        {
          value: 'YYYYMMDD HH:mm:ss',
          label: 'YYYYMMDD HH:mm:ss (例:20240428 16:06:06)'
        },
        {
          value: 'YYYY/MM/DD HH:mm:ss',
          label: 'YYYY/MM/DD HH:mm:ss (例:2024/04/28 16:06:06)'
        },
        {
          value: 'YYYY年MM月DD日 HH:mm:ss',
          label: 'YYYY年MM月DD日 HH时mm分ss秒 (例:2024年04月28日 16时06分06秒)'
        }
      ]
    })
  }
  // }

  return Object.assign(
    editorData,
    data,
    { dataFormat: data.dataFormat || 'auto' },
    { name: data.name },
    { phyFields: data.originName },
    { description: data.description },
    { convertValue: data.convertValue ?? 1 }
  )
}
function findNodesByName(nodes, name, result) {
  nodes.forEach((node) => {
    if (node.name === name) {
      result.push(node)
    }
    if (node.children) {
      findNodesByName(node.children, name, result)
    }
  })
}
const handlerCopy = (parentData, data, event, parent, dragItems) => {
  let newNode = { ...data }
  let existingNames = [] // 存储已存在的name
  const collectExistingNames = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      if (node.name) {
        existingNames.push(node.name)
      }
      if (node.children) {
        collectExistingNames(node.children) // 递归收集子节点的name
      }
    }
  }
  collectExistingNames(parentData)
  // 修改newObj的name，已存在则添加递增数字
  let newName = `${newNode.name}_副本`
  let count = 1
  while (existingNames.includes(newName)) {
    newName = `${newNode.name}_副本${count}`
    count++
  }
  newNode.name = newName
  delete newNode.id //复制后的节点没有id
  if (parent) {
    //增加条件：目标节点是维度还是度量
    if (dragItems[0].children?.length) {
      // 至少两张拖拽表
      let targetFolderNodes = [] // 用于存储所有找到的节点
      findNodesByName(parentData, data.datasetTableName, targetFolderNodes)
      if (targetFolderNodes?.length) {
        const targetNodeIndex = targetFolderNodes[
          data.dataType === 'DIMENSION' ? 0 : 1
        ].children.findIndex((parentChild) => parentChild.name === data.name)
        if (targetNodeIndex !== -1) {
          targetFolderNodes[data.dataType === 'DIMENSION' ? 0 : 1].children.splice(
            targetNodeIndex + 1,
            0,
            newNode
          )
        }
      } else {
        const targetNodeIndex = parentData[
          data.dataType === 'DIMENSION' ? 0 : 1
        ].children.findIndex((parentChild) => parentChild.name === data.name)
        if (targetNodeIndex !== -1) {
          parentData[data.dataType === 'DIMENSION' ? 0 : 1].children.splice(
            targetNodeIndex + 1,
            0,
            newNode
          )
        }
      }
    } else {
      const targetNodeIndex = parentData[data.dataType === 'DIMENSION' ? 0 : 1].children.findIndex(
        (parentChild) => parentChild.name === data.name
      )
      if (targetNodeIndex !== -1) {
        parentData[data.dataType === 'DIMENSION' ? 0 : 1].children.splice(
          targetNodeIndex + 1,
          0,
          newNode
        )
      }
    }
  } else {
    if (dragItems[0].children?.length) {
      // 至少两张拖拽表
      let targetFolderNodes = [] // 用于存储所有找到的节点
      findNodesByName(parentData, data.datasetTableName, targetFolderNodes)
      if (targetFolderNodes?.length) {
        const targetNodeIndex = targetFolderNodes[
          data.dataType === 'DIMENSION' ? 0 : 1
        ].children.findIndex((parentChild) => parentChild.name === data.name)
        if (targetNodeIndex !== -1) {
          targetFolderNodes[data.dataType === 'DIMENSION' ? 0 : 1].children.splice(
            targetNodeIndex + 1,
            0,
            newNode
          )
        }
      } else {
        const targetNodeIndex = parentData[
          data.dataType === 'DIMENSION' ? 0 : 1
        ].children.findIndex((parentChild) => parentChild.name === data.name)
        if (targetNodeIndex !== -1) {
          parentData[data.dataType === 'DIMENSION' ? 0 : 1].children.splice(
            targetNodeIndex + 1,
            0,
            newNode
          )
        }
      }
    } else {
      const targetNodeIndex = parentData[data.dataType === 'DIMENSION' ? 0 : 1].children.findIndex(
        (parentChild) => parentChild.name === data.name
      )
      if (targetNodeIndex !== -1) {
        parentData[data.dataType === 'DIMENSION' ? 0 : 1].children.splice(
          targetNodeIndex + 1,
          0,
          newNode
        )
      }
    }
  }
  return parentData // 返回更新后的父节点数据
}

const handlerToMeasure = (treeData, data) => {
  const targetNode = findNodeByNameOrId(treeData, data.name)
  if (!targetNode) return
  if (targetNode.reference === 1) {
    ElMessage.warning('该字段被引用,不能转换')
    return
  }
  if (targetNode.dataType === 'MEASURE') {
    // targetNode.dataType = 'DIMENSION'
    targetNode.checked = 1
    targetNode.move = 1
    treeData[0]?.children.push(
      Object.assign({}, { ...targetNode }, { checked: 0, move: 0, dataType: 'DIMENSION' })
    )
    return
  }
  if (targetNode.dataType === 'DIMENSION') {
    //维度----删除后加入度量
    // targetNode.dataType = 'MEASURE'
    targetNode.checked = 1
    targetNode.move = 1
    treeData[1]?.children.push(
      Object.assign({}, { ...targetNode }, { checked: 0, move: 0, dataType: 'MEASURE' })
    )
    return
  }
}

// 删除操作
const updateChecked = (treeData, targetData) => {
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i]

    if (node.name === targetData.name) {
      node.checked = 1 // 设置当前节点的checked属性为1
    }

    if (node.children) {
      // 递归处理子节点以查找匹配的节点
      updateChecked(node.children, targetData)
    }
  }
}

const handlerDelete = (treeData, data) => {
  updateChecked(treeData, data)
}
const handlerDate = (treeData, data, format) => {
  const targetNode = findNodeByNameOrId(treeData, data.name)
  Object.assign(targetNode, { type: 'DATE', icon: ICONMAP[targetNode.type], dataFormat: format })
  setIconsInTree(treeData)
}
const handlerDocs = (treeData, data) => {
  const targetNode = findNodeByNameOrId(treeData, data.name)
  targetNode.type = 'STRING'
  targetNode.icon = ICONMAP[targetNode.type]
  setIconsInTree(treeData)
}
const handlerNum = (treeData, data) => {
  const targetNode = findNodeByNameOrId(treeData, data.name)
  targetNode.type = 'NUMBER'
  setIconsInTree(treeData)
}
const handlerGeography = (treeData, data) => {
  const targetNode = findNodeByNameOrId(treeData, data.name)
  targetNode.type = 'GEOGRAPHY'
  setIconsInTree(treeData)
}
const handlerEventMap = {
  edit: handlerEdit,
  copy: handlerCopy,
  toMeasure: handlerToMeasure,
  delete: handlerDelete,
  date: handlerDate,
  docs: handlerDocs,
  num: handlerNum,
  geography: handlerGeography
}

//新建分组维度
const fieldsTypeMap = {
  STRING: 'string',
  DOUBLE: 'num',
  default: 'time'
}

const fieldOptions = [
  {
    value: 'edit',
    label: '编辑文件夹',
    icon: 'icon-edit-outline'
  },
  {
    value: 'delete',
    label: '删除',
    icon: 'icon-delete'
  }
]

//下拉菜单选项
const getDropdownItems = (data) => {
  const dropdownOptions = [
    {
      value: 'edit',
      label: '编辑',
      icon: 'icon-edit-outline'
    },
    {
      value: 'typeSwitch',
      label: '维度类型切换',
      icon: 'icon-qiehuan',
      children: [
        {
          value: 'geography',
          label: '地理',
          icon: 'icon-leidatu',
          isActive: 'GEOGRAPHY'
        },
        {
          value: 'date',
          label: '日期',
          icon: 'icon-date',
          children: [
            {
              value: 'date',
              format: 'YYYY-MM-DD HH:mm:ss',
              label: 'YYYY-MM-DD'
            },
            {
              value: 'date',
              format: 'YYYYMMDD HH:mm:ss',
              label: 'YYYYMMDD'
            },
            {
              value: 'date',
              format: 'YYYY/MM/DD HH:mm:ss',
              label: 'YYYY/MM/DD'
            },
            {
              value: 'date',
              format: 'YYYY年MM月DD日 HH:mm:ss',
              label: 'YYYY年MM月DD日'
            }
          ]
        },
        {
          value: 'docs',
          label: '文本',
          icon: 'icon-str',
          isActive: 'STRING'
        },
        {
          value: 'num',
          label: '数字',
          icon: 'icon-num',
          isActive: 'NUMBER'
        }
      ]
    },
    {
      value: 'copy',
      label: '复制',
      icon: 'icon-copy-document'
    },
    {
      value: 'toMeasure',
      label: '转换为度量',
      icon: 'icon-qiehuan'
    },
    {
      value: 'delete',
      label: '删除',
      icon: 'icon-delete'
    }
  ]
  //不同类型返回的操作
  if (data.datasetTableFieldType === 'FIELD') {
    if (data.type !== 'DATE') {
      if (data.dataType === 'MEASURE') {
        dropdownOptions[3].label = '转换为维度'
        dropdownOptions[1].label = '度量类型切换'
        dropdownOptions[1].children.splice(0, 2)
      } else {
        dropdownOptions[3].label = '转换为度量'
      }
    } else {
      dropdownOptions.splice(1, 1)
      dropdownOptions.splice(2, 1)
    }
    return dropdownOptions // 返回fieldOptions数组
  } else if (data.datasetTableFieldType === 'FOLDER') {
    return fieldOptions // 返回options数组
  }
}
const getIconForColor = (value) => {
  if (value) {
    const valueType = value?.type && typeof value.type === 'string' ? value.type : value.type?.[0]
    switch (valueType) {
      case 'INTEGER':
        return { color: '#2468F2' }
      case 'NUMBER':
        return { color: '#2468F2' }
      case 'STRING':
        return { color: '#67C23A' }
      case 'DATE':
        return { color: '#2468F2' }
      default:
        break
    }
  }
}

//收集节点名
const getAllUniqueNames = (treeData, currentNodeName, namesSet = new Set()) => {
  for (const item of treeData) {
    if (item.name !== currentNodeName) {
      namesSet.add(item.name)
    }
    if (item.children && item.children.length > 0) {
      getAllUniqueNames(item.children, currentNodeName, namesSet)
    }
  }
  return namesSet
}

//更新数据预览树
const ensureUniqueName = (treeData, itemName, datasetTableFieldType) => {
  let nameCount = 1
  let uniqueName = itemName
  // 遍历treeData来检查是否有重名的节点
  const checkName = (nodes) => {
    if (Array.isArray(nodes)) {
      for (let node of nodes) {
        if (node.name === uniqueName && node.datasetTableFieldType === datasetTableFieldType) {
          // 找到重名,自增
          uniqueName = `${itemName}${nameCount++}`
          checkName(treeData)
        }
        if (node.children) {
          checkName(node.children)
        }
      }
    }
  }
  checkName(treeData)

  return uniqueName
}
const findParent = (treeData, name, parent) => {
  for (let index = 0; index < treeData.length; index++) {
    const node = treeData[index]
    if (node.name === name) {
      return [parent, node]
    }
    if (node.children) {
      const childResults = findParent(node.children, name, node)
      if (childResults) {
        return childResults
      }
    }
  }
}
const findOriginParent = (treeData, name, parent) => {
  for (let index = 0; index < treeData.length; index++) {
    const node = treeData[index]
    if (node.originName === name) {
      return [parent, node]
    }
    if (node.children) {
      const childResults = findOriginParent(node.children, name, node)
      if (childResults) {
        return childResults
      }
    }
  }
}

//----------------------------------
//----------------------------------
//----------------------------------
//拖拽树中已经保证name唯一，不用再文件夹生成唯一name
//逻辑更改为先找节点，没有找到创建节点，找到修改节点

const updateTreeData = (result, folderName, treeData, type) => {
  //字段、文件夹，树
  const resultData = Array.isArray(result) ? cloneDeep(result) : [result]
  if (!resultData) return
  if (!treeData.some((item) => item.children.length > 0)) {
    //说明只拖拽了一张表
    resultData.forEach((item) => {
      if (item.dataType === 'MEASURE') {
        treeData[1].children.push(item)
      } else {
        treeData[0].children.push(item)
      }
    })
  } else if (type) {
    resultData.forEach((item) => {
      if (item.dataType === 'MEASURE') {
        treeData[1].children.unshift(item)
      } else {
        treeData[0].children.unshift(item)
      }
    })
  } else {
    const isDimensionForder = findOriginParent(treeData[0].children, folderName, null) //treeData[0].children任意一个树枝存在就ok
    const isMeasureForder = findOriginParent(treeData[1].children, folderName, null) //treeData[0].children任意一个树枝存在就ok
    const isExitForder = isDimensionForder?.length || isMeasureForder?.length
    if (!isExitForder && !type) {
      // 没有找到表名节点，创建表名文件夹
      const newMeasureFolder = {
        name: folderName,
        originName: folderName,
        datasetTableFieldType: 'FOLDER',
        children: []
      }
      const newDimensionFolder = {
        name: folderName,
        originName: folderName,
        datasetTableFieldType: 'FOLDER',
        children: []
      }
      //添加文件夹
      if (treeData[1].children) {
        treeData[1].children.push(newMeasureFolder)
      } else {
        treeData[1].children = []
        treeData[1].children.push(newMeasureFolder)
      }
      if (treeData[0].children) {
        treeData[0].children.push(newDimensionFolder)
      } else {
        treeData[0].children = []
        treeData[0].children.push(newDimensionFolder)
      }

      //resultData---------关联关系的两张表
      resultData[0].fields.forEach((item) => {
        if (item.dataType === 'MEASURE') {
          //找到对应节点，更新
          const node = treeData[1].children.find((treeItem) => treeItem.name === item.name)

          if (node) {
            Object.assign(node, { checked: item.checked })
          }
        } else {
          const node = treeData[0].children.find((treeItem) => treeItem.name === item.name)

          if (node) {
            Object.assign(node, { checked: item.checked })
          }
        }
      })
      resultData[1].fields.forEach((item) => {
        if (item.dataType === 'MEASURE') {
          item.name = ensureUniqueName(treeData[1].children, item.name, item.datasetTableFieldType)
          newMeasureFolder.children.push(item)
        } else {
          item.name = ensureUniqueName(treeData[0].children, item.name, item.datasetTableFieldType)
          newDimensionFolder.children.push(item)
        }
      })
    } else {
      const findAllNodesByName = (tree, name, result = []) => {
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          if (node.originName === name) {
            result.push(node)
          }

          if (node.children && node.children.length > 0) {
            findAllNodesByName(node.children, name, result)
          }
        }
        return result
      }
      // resultData:关联的两张表
      const treeNode = findAllNodesByName(treeData, resultData[1].name) //维度、度量拖拽表文件夹

      if (treeNode) {
        resultData[1].fields.forEach((fieldsItem) => {
          treeNode[fieldsItem.dataType === 'DIMENSION' ? 0 : 1].children.forEach((treeField) => {
            if (treeField.originName === fieldsItem.originName) {
              treeField.checked = fieldsItem.checked
            }
          })
        })
      }

      resultData[0].fields.forEach((item) => {
        if (item.dataType === 'MEASURE') {
          //找到对应节点，更新
          const node = treeData[1].children.find(
            (treeItem) => treeItem.originName === item.originName
          )

          if (node) {
            Object.assign(node, { checked: item.checked })
          }
        } else {
          const node = treeData[0].children.find(
            (treeItem) => treeItem.originName === item.originName
          )

          if (node) {
            Object.assign(node, { checked: item.checked })
          }
        }
      })
    }
  }
  setIconsInTree(treeData)
}
const removeNode = (tree, name) => {
  if (!tree || !Array.isArray(tree)) {
    return
  }
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    node.children = node.children.filter((child) => child.name !== name)
    removeNode(node.children, name, node)
  }
}
export default useInfoBlock
export {
  editorForm,
  options,
  handlerEventMap,
  findNodeByNameOrId,
  setIconsInTree,
  flattenTreeData, //平铺预览树节点
  fieldsTypeMap,
  getDropdownItems,
  getIconForColor,
  getAllUniqueNames,
  ICONMAP,
  DATEMAP,
  updateTreeData,
  handlerCopy,
  handlerDelete,
  findParent,
  removeNode
}
