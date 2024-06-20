<template>
  <div class="dimension-item">
    <el-form :model="fieldsForm" label-width="80px">
      <el-form-item label="字段原名" prop="name">
        <el-input v-model="fieldsForm.name" />
      </el-form-item>
      <el-form-item label="分组字段" prop="fields">
        <el-select v-model="fieldsForm.fields" placeholder="请选择">
          <el-option
            v-for="(item, index) in optionData"
            :key="index"
            :label="item?.name"
            :value="item?.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分组设置" prop="name" class="inline-form">
        <!--          string类型-->
        <template v-if="fieldsItem?.type === 'STRING'">
          <div class="group" v-for="(group, index) in fieldsForm.groups" :key="index">
            <el-input v-model="group.groupName" class="inline-input" />
            <el-popover width="500" trigger="click" v-model:visible="group.visible">
              <template #reference>
                <el-input v-model="fieldsForm.groups[index].values" readonly></el-input>
              </template>
              <transfer
                :filedsItem="filedsItem"
                @transferShow="transferShow"
                @handlerLeave="(addedItems) => handlerLeave(index, addedItems)"
                @handleSearchChange="handleSearchChange"
              ></transfer>
            </el-popover>
            <span class="delete-option">
              <i
                :style="{ display: index === 0 ? 'none' : 'block' }"
                class="iconfont icon-delete"
                @click="handleInputDelete(index)"
              ></i>
            </span>
          </div>
        </template>
        <!--        num类型-->
        <template v-if="fieldsItem?.type === 'NUMBER' || fieldsItem?.type === 'INTEGER'">
          <div class="group" v-for="(group, index) in fieldsForm.groups" :key="index">
            <el-input v-model="group.groupName" class="inline-input" />
            <el-input-number
              v-model="group.num.leftValue"
              controls-position="right"
            ></el-input-number>
            <el-select v-model="group.num.leftMatchType" class="symbol-select">
              <el-option label="<" value="GT" />
              <el-option label="≤" value="GT_EQ" />
            </el-select>
            <el-tooltip
              placement="bottom-start"
              :content="fieldsForm.fields"
              :show-arrow="false"
              effect="light"
              :offset="18"
              :show-after="500"
              :hide-after="0"
            >
              <span class="symbol-span">{{ fieldsForm.fields }}</span>
            </el-tooltip>
            <el-select v-model="group.num.rightMatchType" class="symbol-select">
              <el-option label="<" value="LT" />
              <el-option label="≤" value="LT_EQ" />
            </el-select>
            <el-input-number
              v-model="group.num.rightValue"
              controls-position="right"
            ></el-input-number>
            <span class="delete-option">
              <i
                :style="{ display: index === 0 ? 'none' : 'block' }"
                class="iconfont icon-delete"
                @click="handleInputDelete(index)"
              ></i>
            </span>
          </div>
        </template>
        <!--        date类型-->
        <template v-if="fieldsItem?.type === 'DATE'">
          <div class="group" v-for="(group, index) in fieldsForm.groups" :key="index">
            <el-input v-model="group.groupName" class="inline-input" />
            <template v-if="selectValue === 'year'">
              <el-date-picker
                v-model="group.time.leftValue"
                type="year"
                format="YYYY"
                value-format="YYYY"
                placeholder="请选择日期"
              />
              ~
              <el-date-picker
                v-model="group.time.rightValue"
                type="year"
                format="YYYY"
                value-format="YYYY"
                placeholder="请选择日期"
              />
            </template>
            <template v-if="selectValue === 'year-month'">
              <el-date-picker
                v-model="group.time.leftValue"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
                placeholder="请选择日期"
              />
              ~
              <el-date-picker
                v-model="group.time.rightValue"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
                placeholder="请选择日期"
              />
            </template>
            <template v-if="selectValue === 'year-week'">
              <el-date-picker
                v-model="group.time.leftValue"
                type="week"
                format="YYYY-ww 周"
                placeholder="请选择日期"
              />
              ~
              <el-date-picker
                v-model="group.time.rightValue"
                type="week"
                format="YYYY-ww 周"
                placeholder="请选择日期"
              />
            </template>
            <template v-if="selectValue === 'year-quarter'">
              <QuarterPicker
                v-model="group.time.leftValue"
                format="YYYY-Q 季度"
                placeholder="选择季度"
              ></QuarterPicker>
              ~
              <QuarterPicker
                v-model="group.time.rightValue"
                format="YYYY-Q 季度"
                placeholder="选择季度"
              ></QuarterPicker>
            </template>
            <template v-if="selectValue === 'year-month-day'">
              <el-date-picker
                v-model="group.time.leftValue"
                type="dates"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
              />
              ~
              <el-date-picker
                v-model="group.time.rightValue"
                type="dates"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
              />
            </template>
            <template v-if="selectValue === 'datetime'">
              <el-date-picker
                v-model="group.time.leftValue"
                type="datetime"
                placeholder="选择时间"
              />
              ~
              <el-date-picker
                v-model="group.time.rightValue"
                type="datetime"
                placeholder="选择时间"
              />
            </template>
            <template v-if="selectValue === 'hour-minute'">
              <el-time-picker
                v-model="group.time.leftValue"
                format="HH:mm"
                :picker-options="{
                  selectableRange: '18:30 - 20:30'
                }"
                placeholder="选择时间"
              />
              ~
              <el-time-picker
                v-model="group.time.rightValue"
                format="HH:mm"
                :picker-options="{
                  selectableRange: '18:30 - 20:30'
                }"
                placeholder="选择时间"
              />
            </template>
            <template v-if="selectValue === 'hour-minute-second'">
              <el-time-picker
                v-model="group.time.leftValue"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                placeholder="选择时间"
              />
              ~
              <el-time-picker
                v-model="group.time.rightValue"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                placeholder="选择时间"
              />
            </template>
            <template v-if="selectValue === 'hour'">
              <el-select v-model="group.time.leftValue" placeholder="选择小时" style="width: 120px">
                <el-option
                  v-for="item in hourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              ~
              <el-select
                v-model="group.time.rightValue"
                placeholder="选择小时"
                style="width: 120px"
              >
                <el-option
                  v-for="item in hourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>

            <span class="delete-option">
              <i
                :style="{ display: index === 0 ? 'none' : 'block' }"
                class="iconfont icon-delete"
                @click="handleInputDelete(index)"
              ></i>
            </span>
          </div>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button @click="handlerNewGroup">新建分组</el-button>
      </el-form-item>
      <el-form-item prop="defaultDimension" class="inline-form">
        <div class="group">
          <el-input
            style="width: 130px"
            v-model="fieldsForm.defaultDimension"
            placeholder="请输入分组名称"
          />
          <span style="display: flex; flex: 1; padding-left: 8px"
            >{{ fieldsItem?.type === 'STRING' ? '未覆盖维度值' : '未覆盖数值区间' }}
          </span>
        </div>
      </el-form-item>
      <el-form-item label="字段描述" prop="name">
        <el-input v-model="fieldsForm.description" placeholder="请输入字段描述" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import Transfer from './Transfer.vue'
import QuarterPicker from './QuarterPicker.vue'
import { flattenTreeData } from '../useInfoBlock'
import { computed, ref, defineProps, watchEffect, defineExpose, watch } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import api from '@/api'
const { datasetApi } = api

const props = defineProps({
  data: {
    type: Array
  },
  attach: {
    type: Object
  },
  detailData: {
    type: Object
  }
})
//分组字段下拉框回显
const data = computed(() => flattenTreeData(props.data).filter((item) => item.extraField === 0))
const optionData = ref([]) //分组字段下拉框值
const hourOptions = Array.from({ length: 23 }, (_, index) => {
  const hour = index + 1
  const paddedHour = hour < 10 ? `0${hour}` : hour.toString()
  return {
    label: paddedHour,
    value: paddedHour
  }
})

const fieldsForm = ref({
  name: props.detailData?.name ?? '',
  fields: '', //选择的字段
  groups: [
    {
      groupName: '分组1',
      values: null, //字符串值
      visible: 'false',
      time: {
        leftValue: '',
        rightValue: ''
      },
      num: {
        leftValue: undefined,
        leftMatchType: '',
        rightValue: undefined,
        rightMatchType: ''
      },
      matchType: {
        leftMatchType: '',
        rightMatchType: ''
      }
    }
  ], //存储新建分组项
  defaultDimension: '未分组', //默认分组维度
  description: ''
})
//整理expression
const convertNormalDate = (str, flag) => {
  //-----------
  const weekFormatToDate = (weekStr) => {
    const parts = weekStr.split('-')
    const year = parseInt(parts[0])
    const week = parseInt(parts[1])

    const startOfYear = new Date(year, 0, 1)
    const firstWeekDay = startOfYear.getDay()
    const firstWeekStart = startOfYear.setDate(1 - firstWeekDay + 1)

    const weekStart = new Date(firstWeekStart)
    weekStart.setDate(weekStart.getDate() + (week - 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    return weekStart
    // return {
    //   start: weekStart,
    //   end: weekEnd
    // }
  }
  //---------
  const quarterFormatToDate = (quarterStr) => {
    const parts = quarterStr.split('-')
    const year = parseInt(parts[0])
    const quarter = parseInt(parts[1])

    const startMonth = (quarter - 1) * 3
    const date = new Date(year, startMonth, 1)
    date.setMonth(startMonth + 3, 0)

    return date
  }
  //---------年月日时分秒
  const timeFormatToDate = (timeStr) => {
    const [datePart, timePart] = timeStr.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes, seconds] = timePart.split(':').map(Number)

    return new Date(year, month - 1, day, hours, minutes, seconds)
  }
  if (flag === 'week') {
    return weekFormatToDate(str)
  } else if (flag === 'create_time(year-quarter)') {
    return quarterFormatToDate(str)
  } else if (flag === 'datetime') {
    return timeFormatToDate(str)
  } else if (flag === 'CREATE_TIME(year-month-day)') {
    return [str]
    // return yearToDate(str)
  } else if (flag === 'minute') {
    return minuteFormatToDate(str)
  } else if (flag === 'second') {
    return secondFormatToDate(str)
  }
}
const convertFieldsForm = (expression) => {
  if (expression?.rangeItems) {
    fieldsForm.value.groups = expression.rangeItems.slice(0, -1).map((item) => {
      return {
        groupName: item.groupName,
        values: null,
        visible: 'false',
        time: {
          leftValue: convertNormalDate(item.leftValue, expression.column),
          rightValue: convertNormalDate(item.rightValue, expression.column)
        },
        num: {
          leftValue: undefined,
          leftMatchType: '',
          rightValue: undefined,
          rightMatchType: ''
        },
        matchType: {
          leftMatchType: item.leftMatchType,
          rightMatchType: item.rightMatchType
        },
        defaultDimension: '未分组', //默认分组维度
        description: ''
      }
    })
  } else if (expression?.enumItems) {
    fieldsForm.value.groups = expression.enumItems.slice(0, -1).map((item) => {
      return {
        groupName: item.groupName,
        values: item.values,
        visible: 'false',
        time: {
          leftValue: '',
          rightValue: ''
        },
        num: {
          leftValue: '',
          leftMatchType: '',
          rightValue: '',
          rightMatchType: ''
        },
        matchType: {
          leftMatchType: '',
          rightMatchType: ''
        },
        defaultDimension: '未分组', //默认分组维度
        description: ''
      }
    })
  }
  fieldsForm.value.fields = expression.column
}

const detailDataDeepClone = cloneDeep(props.detailData)
watch(
  () => props.detailData,
  (n) => {
    if (n) {
      convertFieldsForm(JSON.parse(n.expression))
      Object.assign(fieldsForm.value, n)
    }
  },
  {
    immediate: true
  }
)

const flattenDeep = (nodes) => {
  let result = []

  nodes.forEach((node) => {
    if (!node.children || node.children.length === 0) {
      result.push({ ...node, children: null })
    }

    // 如果节点有子节点，递归处理子节点
    if (node.children) {
      result = result.concat(flattenDeep(node.children))
    }
  })

  return result
}
optionData.value = flattenDeep(data.value).filter((item) => item.checked !== 1)
//---------------------
const handlerLeave = (index, addedItems) => {
  fieldsForm.value.groups[index].visible = false
  if (!addedItems) return
  fieldsForm.value.groups[index].values = addedItems
}
const handleSearchChange = async (val) => {
  await loadData(props.attach)
  if (val) {
    filedsItem.value = searchFields.filter((item) => item.includes(val))
  } else {
    filedsItem.value = searchFields
  }
}

//新建分组
let count = 2
const handlerNewGroup = () => {
  //添加分组后，已添加和字段均清空
  const newObj = {
    groupName: `分组${count}`,
    values: null,
    visible: 'false',
    time: {
      leftValue: '',
      rightValue: ''
    },
    num: {
      leftValue: undefined,
      leftMatchType: '',
      rightValue: undefined,
      rightMatchType: ''
    },
    matchType: {
      leftMatchType: '',
      rightMatchType: ''
    }
  }
  count++
  fieldsForm.value.groups.push(newObj)
}

const filedsItem = ref([]) //存储左侧字段

let searchFields = null
const loadData = async ({ dragItems, allFields, currentDataSource, filterConditions }) => {
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
      if (unionToParent && unionToParent.unionToParent) {
        unionFields = unionToParent.unionToParent.unionFields.map((field) => ({
          parentField: {
            name: field.parentField,
            datasetTableOriginName: field.parentDatasetTableOriginName
          },
          currentField: {
            name: field.currentField,
            datasetTableOriginName: field.currentDatasetTableOriginName
          }
        }))
      }

      const result = {
        currentDst,
        childrenDst,
        unionToParent:
          unionToParent && unionToParent.unionToParent
            ? {
                unionType: unionToParent.unionToParent
                  ? unionToParent.unionToParent.unionType
                  : unionToParent.unionType || 'LEFT',
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
  let regex = /\(([^)]*)\)/
  const mergedAllFields = optionData.value
    .filter((item) => item.name === fieldsForm.value.fields)
    .map((child) => ({
      name: child.name,
      originName: child.originName,
      type: child.type || '',
      originType: child.originType,
      datasourceId: dragItems[0].datasourceId || dragItems[0].id,
      datasetId: null,
      datasetTableName: child.datasetTableName || null,
      datasetTableOriginName: child.datasetTableOriginName || child.datasetTableName || null,
      description: child.description || '',
      fieldAliasName: child.fieldAliasName || null,
      dataType: child.dataType || null,
      extraField: child.extraField || 0,
      checked: 0,
      datasetTableFieldType: child.type === 'FOLDER' ? 'FOLDER' : child.datasetTableFieldType, //是字段还是文件
      expression: child.expression || null,
      dataFormat: child.dataFormat || null,
      granularity:
        child.type === 'DATE' && child.name.includes('(') ? child.name.match(regex)[1] : '', //时间类型必填
      convertValue: null,
      aggregation: child.aggregation ? child.aggregation.toUpperCase() : null,
      children: child.children || null
    }))
  const result = await datasetApi.getFieldDataList.send({
    datasourceType: dragItems[0].type === 'SQL' ? currentDataSource.type : dragItems[0].type,
    treeUnion: convertedTreeUnion,
    allFields: mergedAllFields,
    filterConditions: filterConditions[0]?.datasetTableName ? filterConditions : []
  })
  let extractedValues = []
  if (result?.fields) {
    ;[
      result?.fields.forEach((field) => {
        extractedValues = [...new Set(result.data.map((item) => item[field.fieldAliasName].value))]
      })
    ]
  }
  searchFields = extractedValues
  filedsItem.value = extractedValues
}

const handleInputDelete = (index) => {
  fieldsForm.value.groups.splice(index, 1)
}
const selectValue = ref('')
// 分组
const fieldsItem = ref(null)
watchEffect(() => {
  fieldsItem.value = optionData.value.filter((item) => item.name === fieldsForm.value.fields)[0]

  const selectItem = optionData.value.filter((item) => item.name === fieldsForm.value.fields)
  if (selectItem.length > 0) {
    fieldsForm.value.allFieldsItem = selectItem[0]

    if (selectItem[0].type === 'STRING') {
      loadData(props.attach)
    } else if (selectItem[0].type === 'DATE') {
      const regex = /\((.*?)\)/
      selectValue.value = fieldsForm.value.fields.match(regex)[1]
    }
  }
})

watch(
  () => fieldsForm.value.fields,
  (n, o) => {
    if (n !== o) {
      Object.assign(fieldsForm.value, {
        name: fieldsForm.value.name,
        fields: fieldsForm.value.fields, //选择的字段
        groups: [
          {
            groupName: '分组1',
            values: null,
            visible: 'false',
            time: {
              leftValue: '',
              rightValue: ''
            },
            num: {
              leftValue: '',
              leftMatchType: '',
              rightValue: '',
              rightMatchType: ''
            },
            matchType: {
              leftMatchType: '',
              rightMatchType: ''
            }
          }
        ], //存储新建分组项
        defaultDimension: '未分组', //默认分组维度
        description: ''
      })
    }
  }
)

const disabled = ref(true)
watch(
  () => fieldsForm.value.name,
  (n, o) => {
    if (n) {
      disabled.value = false
    } else {
      disabled.value = true
    }
  },
  {
    deep: true,
    immediate: true
  }
)
//分组字段默认值
watch(
  () => optionData.value.length,
  () => {
    if (!props.detailData) {
      fieldsForm.value.fields = optionData.value[0].name
    }
  },
  {
    immediate: true
  }
)
defineExpose({
  detailDataDeepClone,
  fieldsForm,
  disabled
})
</script>
<style lang="scss" scoped>
.dimension-item {
  width: size(792);
  height: size(514);
  //数值型表单组
  .inline-form {
    :deep(.el-form-item__content) {
      max-height: size(200);
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .group {
        display: flex;
        width: 100%;
        gap: size(6);
        padding: size(6) 0;
        span {
          display: inline-flex;
        }
        div.el-input-number {
          max-width: size(110);
          flex: 1;
        }
        .delete-option {
          width: size(20);
        }
        .iconfont {
          color: #a8abb2;
          &:hover {
            cursor: pointer;
          }
        }
        .symbol-span {
          flex: 1;
          max-width: size(80);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #333;
        }
      }

      .el-input.inline-input {
        width: size(159);
      }
      .symbol-select {
        flex: 1;
        max-width: size(100);
      }
    }
  }
}
</style>
