<template>
  <StepBoxBlock
    ref="stepBoxBlock"
    :steps-data="stepsData"
    @done="done"
    :swag="swag"
    :queryId="query.id"
  >
    <template #basicInfo>
      <span class="source-create-step-basic__title">基础认证</span>
      <div class="source-create-step-basic__content">
        <div class="source-create-step-basic__content__form">
          <el-form :model="form" ref="formBasicSelf" label-width="120px">
            <el-form-item
              label="连接名称"
              prop="name"
              :rules="[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 1, max: 10, message: '长度必须在1到10个字符之间', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item
              label="接口地址"
              prop="url"
              :rules="[{ required: true, message: '请输入接口地址', trigger: 'blur' }]"
            >
              <el-input v-model="form.url" />
            </el-form-item>
            <el-form-item
              label="请求类型"
              prop="method"
              :rules="[{ required: true, message: '请选择请求类型', trigger: 'blur' }]"
            >
              <el-radio-group v-model="form.method">
                <el-radio label="GET" />
                <el-radio label="POST" />
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <hr />
        <span class="source-create-step-basic__content__title">参数设置</span>
        <div class="source-create-step-basic__content-param">
          <div class="source-create-step-basic__content-param param__tabs">
            <GxTabs
              arrangeMode="row"
              v-model:initial="initial"
              :tabsData="tabsData"
              @change-click="changeClick"
            />
          </div>
          <!--                普通参数内容-->
          <div
            class="source-create-step-basic__content-param param__content"
            v-show="initial === 0"
          >
            <FormTable
              ref="formTableSelf"
              :table-data="tableData"
              :tableColumns="tableColumns"
            ></FormTable>
            <GxActions :actions="addActions"></GxActions>
          </div>
          <!--                头参数内容-->
          <div
            class="source-create-step-basic__content-param param__content"
            v-show="initial === 1"
          >
            <FormTable
              ref="formHeaderTableSelf"
              :table-data="headerTableData"
              :tableColumns="headerTableColumns"
            ></FormTable>
            <GxActions :actions="addActions"></GxActions>
          </div>
          <!--                查询语句-->
          <div
            class="source-create-step-basic__content-param param__content content__equl"
            v-show="initial === 2"
            ref="sqlContainerSelf"
          ></div>
          <!--                授权验证-->
          <div
            class="source-create-step-basic__content-param param__content"
            v-show="initial === 3"
          >
            <div class="source-create-step-basic__content-param__form">
              <el-form :model="form" label-width="120px">
                <el-form-item label="授权验证" prop="authorizationStatus" required>
                  <el-select v-model="form.authorizationStatus" placeholder="请选择授权" clearable>
                    <el-option label="无" value="FIRST" />
                    <el-option label="授权" value="ZERO" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </template>
    <template #parameterInfo>
      <div style="height: 100%">
        <template v-if="true">
          <span class="source-create-step-parameter__title">数据结构</span>
          <div class="source-create-step-parameter__content">
            <el-table
              :data="convertAnalyResTableData"
              row-key="rowKey"
              :row-class-name="tableRowClassName"
              default-expand-all
              ref="analyResTableSelf"
            >
              <el-table-column width="120px">
                <template v-slot="scope">
                  <el-checkbox
                    v-model="scope.row.checked"
                    :indeterminate="scope.row.isIndeterminate"
                    @change="adjustCheck(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                v-for="columnItem in analyResTableColumns"
                :key="columnItem.prop"
                :label="columnItem.label"
                :prop="columnItem.prop"
                align="center"
              >
                <template #default="scope">
                  <el-input
                    v-if="columnItem.prop === 'originName' && scope.row[columnItem.prop]"
                    v-model="scope.row[columnItem.prop]"
                    placeholder="请输入字段重命名"
                  ></el-input>
                  <el-select
                    v-else-if="columnItem.prop === 'type' && scope.row[columnItem.prop]"
                    v-model="scope.row[columnItem.prop]"
                    placeholder="请选择字段类型"
                  >
                    <template #prefix>
                      <i :class="['iconfont', `${ICONMAP[scope.row[columnItem.prop]]}`]"></i>
                    </template>
                    <el-option
                      v-for="option in columnItem.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    >
                      <template #default>
                        <div>
                          <i :class="['iconfont', `${ICONMAP[option.value]}`]"></i>
                          <span>{{ option.label }}</span>
                        </div>
                      </template>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template v-if="tableColumnsPreview.length > 0">
          <span class="source-create-step-parameter__title"> 数据预览</span>
          <div class="preview-check">
            <GxTable :table-data="tableDataPreview" :tableColumns="tableColumnsPreview"></GxTable>
          </div>
        </template>
      </div>

      <hr />
    </template>
    <template #structureInfo>
      <div class="source-create-step-struct">
        <el-form :model="form" label-width="120px" ref="formSelf">
          <el-form-item label="更新周期" prop="updateMethod">
            <el-select
              v-model="form.updateMethod"
              placeholder="请选择周期"
              @change="handleOptionChange"
            >
              <el-option label="手动更新" value="MANUAL" />
              <el-option label="定时更新" value="AUTO" />
            </el-select>
          </el-form-item>
          <div style="display: flex">
            <!-- 更新频率 -->
            <el-form-item
              label="更新频率"
              prop="cronType"
              v-if="form.updateMethod === 'AUTO'"
              class="sub-item"
            >
              <el-select
                style="width: 240px"
                v-model="form.cronType"
                placeholder="请选择频率"
                @change="handleSubOptionChange"
              >
                <el-option label="天级" value="DAY" />
                <el-option label="小时级" value="HOUR" />
              </el-select>
            </el-form-item>
            <!-- cornValue 天级每日 -->
            <el-form-item
              label="每日"
              prop="cronValue"
              v-if="form.updateMethod === 'AUTO' && form.cronType === 'DAY'"
              :rules="[{ required: true, message: '此项为必填项', trigger: 'blur' }]"
              class="sub-item"
            >
              <el-time-picker
                type="date"
                format="HH:mm"
                value-format="HH:mm"
                v-model="form.cronValue"
                style="width: 100%"
            /></el-form-item>
            <!-- 小时 -->
            <el-form-item
              label="每日"
              prop="cronH"
              v-if="form.updateMethod === 'AUTO' && form.cronType === 'HOUR'"
              :rules="[{ required: true, message: '此项为必填项', trigger: 'blur' }]"
              class="sub-item"
            >
              <el-select
                v-model="form.cronH"
                multiple
                clearable
                collapse-tags
                :max-collapse-tags="1"
                style="width: 240px"
              >
                <template #header>
                  <el-checkbox
                    v-model="checkAll"
                    :indeterminate="indeterminate"
                    @change="handleCheckAll"
                  >
                    全选
                  </el-checkbox>
                </template>
                <el-option
                  v-for="item in cornHourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="cronM"
              v-if="form.updateMethod === 'AUTO' && form.cronType === 'HOUR'"
              :rules="[{ required: true, message: '此项为必填项', trigger: 'blur' }]"
              class="sub-item"
            >
              <el-select v-model="form.cronM" style="width: 240px">
                <el-option
                  v-for="item in cornHourSubOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>
  </StepBoxBlock>
</template>
<script setup>
import StepBoxBlock from './StepBoxBlock/StepBoxBlock.vue'
import FormTable from './FormTable.vue'
import {
  defineProps,
  defineEmits,
  ref,
  watch,
  watchEffect,
  onMounted,
  nextTick,
  reactive
} from 'vue'
import { ICONMAP } from '../useInfoBlock'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'
const query = useRoute().query

const { datasourceApi } = api
import { GxActions, GxTabs, GxTable } from '@gxhs/ui'
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'
import * as monaco from 'monaco-editor'
import { ElMessage } from 'element-plus'
const router = useRouter()
const props = defineProps({
  isAside: {
    type: Boolean,
    default: true
  },
  detailData: {
    type: Array
  }
})
const emits = defineEmits(['handlerApiActiveName'])
const body = ref(null)
const analyResTableSelf = ref(null) //数据结构表格

//转化解析字段
//-------表格中唯一的rowKey
function generateRandomString(minLength = 5, maxLength = 20) {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

const convertSubFieldsToChildren = (items) => {
  return items.map((item) => {
    const rowKey = generateRandomString()
    if (item.subFields?.length > 0) {
      const { subFields, checked, originName, type, ...newItem } = item
      return {
        rowKey,
        type: '',
        checked: checked ? true : false,
        ...newItem,
        children: convertSubFieldsToChildren(subFields)
      }
    } else {
      //遍历
      const { subFields, checked, originName, type, ...newItem } = item
      if (subFields !== null) {
        return {
          rowKey,
          checked: checked ? true : false,
          type: '',
          ...newItem
        }
      } else {
        return {
          rowKey,
          originName,
          checked: checked ? true : false,
          type,
          ...newItem
        }
      }
    }
  })
}
const convertToChildren = (items) => {
  return items.map((item) => {
    const rowKey = generateRandomString()
    if (item.children?.length > 0) {
      const { children, checked, ...newItem } = item
      return {
        rowKey,
        originName: '',
        type: '',
        checked: checked === 0 ? true : false,
        ...newItem,
        children: convertToChildren(children)
      }
    } else {
      //遍历
      const { children, checked, originName, type, ...newItem } = item
      if (children !== null) {
        return {
          rowKey,
          originName: '',
          checked: checked === 0 ? true : false,
          type: '',
          ...newItem
        }
      } else {
        return {
          rowKey,
          originName,
          checked: checked === 0 ? true : false,
          type,
          ...newItem
        }
      }
    }
  })
}

const headerMap = ref(null)
watch(
  () => props.detailData,
  (n, _) => {
    if (n.updateMethod === 'AUTO') {
      if (n.cronType === 'DAY') {
        Object.assign(form, n, {
          cronH: [],
          cronM: ''
        })
      } else if (n.cronType === 'HOUR') {
        const CORN = n.cronValue.split(':')
        const h = CORN.slice(0, CORN.length - 1).map((item) => Number(item))
        Object.assign(form, n, {
          cronH: h,
          cronM: Number(CORN[CORN.length - 1]),
          cronValue: ''
        })
      }
    } else {
      Object.assign(form, n, {
        cronH: [],
        cronM: '',
        cronValue: ''
      })
    }
    // 基础认证
    //参数设置
    const argumentMap = n.requestContent.argumentMap
    headerMap.value = n.requestContent.headerMap
    body.value = n.requestContent.bodyMap
    form.authorizationStatus = n.requestContent.authorizationStatus === 1 ? 'FIRST' : 'ZERO' //授权验证
    if (tableData.value.length < Object.keys(argumentMap).length) {
      for (let i = tableData.value.length; i < Object.keys(argumentMap).length; i++) {
        tableData.value.push({ name: '', nameKey: '' })
      }
    }
    // 普通参数
    Object.keys(argumentMap).forEach((key, index) => {
      const value = argumentMap[key]
      tableData.value[index].name = key
      tableData.value[index].nameKey = value
    })

    //数据结构
    convertAnalyResTableData.value = convertToChildren(n.fields)

    nextTick(() => {
      //预览树
      convertAnalyResTableData.value.forEach((item) => {
        if (item.children) {
          const all = item.children.filter((item) => !item.children).every((flag) => flag.checked)
          const some = item.children.some((flag) => flag.checked)
          // 部分选中半选择状态
          if (some) {
            if (!all) {
              item.isIndeterminate = true
            } else {
              item.checked = true
              item.isIndeterminate = false
            }
          } else {
            item.checked = false
            item.isIndeterminate = false
          }
        }
      })

      const selection = getAllCheckedItems(convertAnalyResTableData.value)
      getanalyResRowLength.value = selection.length
      if (selection.length > 0) {
        selection.forEach((selected) => {
          const exists = tableColumnsPreview.value.some((item) => item.prop === selected.name)
          if (!exists && !selected.children) {
            tableColumnsPreview.value.push({
              prop: selected.name,
              label: selected.name,
              value: selected.value
            })
          }

          tableDataPreview.value = [
            tableColumnsPreview.value.reduce((result, col) => {
              result[col.prop] = col?.value
              return result
            }, {})
          ]
        })
      } else {
        tableColumnsPreview.value = []
        tableDataPreview.value = []
      }
    })
  }
)
const isValidJSON = (jsonString) => {
  try {
    const a = JSON.parse(jsonString)
    for (let key in a) {
      if (typeof a[key] === 'object') {
        a[key] = JSON.stringify(a[key])
      }
    }
    return a
  } catch (error) {
    // 捕获到异常时显示错误消息
    ElMessage.error('输入的字符串不是有效的 JSON 格式')
    return
  }
}
const formBasicSelf = ref(null)
const formSelf = ref(null)
const getanalyResRowLength = ref(null) //数据结构表格勾选个数
const convertAnalyResTableData = ref(null)

const addLevelsToTree = (tree, parent = null, level = 0) => {
  return tree.map((node) => {
    // 添加 level 和 parent 属性
    const newNode = {
      ...node,
      level,
      parent
    }
    if (newNode.children) {
      newNode.children = addLevelsToTree(newNode.children, newNode, level + 1)
    }
    return newNode
  })
}
// 所有选中项
const collectUncheckedItems = (tree, checkedItems = []) => {
  tree.forEach((item) => {
    if (item.checked) {
      checkedItems.push(item)
    }

    if (item.children) {
      collectUncheckedItems(item.children, checkedItems)
    }
  })

  return checkedItems
}
const stepsData = [
  {
    name: '建立API连接',
    value: 'basicInfo',
    verify: async () => {
      if (query?.id) {
        form.updateMethod = 'MANUAL'
        form.cronH = []
        form.cronM = ''
        form.cronValue = ''
      }
      const formBasicValid = await formBasicSelf.value.validate(() => {})
      if (!formBasicValid) {
        return { proceed: false, message: '请填写完整！' }
      } else {
        let isValid = true
        if (form.method === 'POST' && editorInstance.getValue()) {
          isValid = isValidJSON(editorInstance.getValue())
          if (!editorInstance.getValue()) {
            return { proceed: false, message: '请填写正确格式：POST请求填写查询语句' }
          } else if (
            tableData.value &&
            Array.isArray(tableData.value) &&
            tableData.value.length > 0
          ) {
            return { proceed: false, message: '请填写正确格式：POST请求只填写查询语句' }
          }

          if (isValid) {
            body.value = isValidJSON(editorInstance.getValue())
          }
        } else if (form.method === 'POST' && query.id && !editorInstance.getValue()) {
          isValid = body.value
        } else if (form.method === 'POST' && !editorInstance.getValue()) {
          return { proceed: false, message: '请填写请求体' }
        } else if (form.method === 'GET') {
          if (editorInstance.getValue() && editorInstance.getValue() !== '{}') {
            return { proceed: false, message: 'GET请求存在请求体' }
          }
        }
        const requestContent = {
          headerMap: {},
          argumentMap: {},
          bodyMap: form.method === 'POST' ? isValid || {} : {},
          authorizationStatus: form.authorizationStatus === 'ZERO' ? 0 : 1
        }

        tableData.value.forEach((item) => {
          if (item.name && item.nameKey) {
            const key = item.name
            const value = item.nameKey
            requestContent.argumentMap[key] = value
          }
        })
        headerTableData.value.forEach((item) => {
          if (item.name && item.nameKey) {
            const key = item.name
            const value = item.nameKey
            requestContent.headerMap[key] = value
          }
        })
        const formTableValid = await formTableSelf.value.submit()
        const formHeaderTableValid = await formHeaderTableSelf.value.submit()
        if (isValid && formHeaderTableValid.valid && formTableValid.valid) {
          const result = await datasourceApi.analyseApiField.send({
            url: form.url,
            method: form.method,
            requestContent: requestContent
          })
          Object.keys(requestContent.argumentMap).forEach((key) => {
            if (!requestContent.argumentMap[key]) {
              delete requestContent.argumentMap[key]
            }
          })
          if (result) {
            ElMessage.success('测试连接成功，请点击下一步')
            // convertAnalyResTableData.value = []
            // debugger
            tableDataPreview.value = []
            tableColumnsPreview.value = []
            analyResTableData.value = result
            convertAnalyResTableData.value = convertSubFieldsToChildren(result)
          }
          return { proceed: true }
        } else {
          return { proceed: false, message: '表单校验未通过' }
        }
      }
    }
  },
  {
    name: '解析请求结果',
    value: 'parameterInfo',
    verify: async () => {
      if (getanalyResRowLength.value) {
        const deepConvertAnalyResTableData = JSON.parse(
          JSON.stringify(convertAnalyResTableData.value)
        )
        const treeWithLevels = addLevelsToTree(deepConvertAnalyResTableData)

        const checkedItems = collectUncheckedItems(treeWithLevels)

        console.log(checkedItems, '// 所有选中的项')

        if (checkedItems.length > 0) {
          let isProceed = {}
          const firstItem = checkedItems[0]
          const firstItemLevel = checkedItems[0]?.level
          let isAllSameLevel = true
          for (let i = 1; i < checkedItems.length; i++) {
            const currentItem = checkedItems[i]
            if (firstItem.children && currentItem.children) {
              isAllSameLevel = false //同时勾选两个有子项的项
              break
            } else if (firstItem.children && !currentItem.children) {
              if (firstItem.name !== currentItem.parent.name) {
                isAllSameLevel = false
              }
            } else if (!firstItem.children && !currentItem.children) {
              if (currentItem?.level !== firstItemLevel) {
                isAllSameLevel = false
                break
              } else if (
                firstItem.parent &&
                currentItem.parent &&
                firstItem.parent?.name !== currentItem.parent?.name
              ) {
                isAllSameLevel = false
                break
              }
            } else {
              isAllSameLevel = false
            }
          }
          if (!isAllSameLevel) {
            isProceed = { proceed: false, message: '请勾选同一层级数据' }
          } else {
            isProceed = { proceed: true }
          }
          return isProceed
        } else {
          return { proceed: false, message: '请勾选后再操作' }
        }
      } else {
        return { proceed: false, message: '请勾选后再操作' }
      }
    }
  },
  {
    name: '数据同步设置',
    value: 'structureInfo',
    verify: async () => {
      return { proceed: true }
    }
  }
]
const editorContent = ref('')
const changeClick = (index) => {
  editorContent.value = editorInstance.getValue()
  if (index === 2 && query.id) {
    editorInstance.setValue(JSON.stringify(body.value, null, 2))
  } else if (index === 1) {
    if (headerTableData.value.length < Object.keys(headerMap.value).length) {
      for (let i = headerTableData.value.length; i < Object.keys(headerMap.value).length; i++) {
        headerTableData.value.push({ name: '', nameKey: '' })
      }
    }
    // 头参数
    Object.keys(headerMap.value).forEach((key, index) => {
      const value = headerMap.value[key]
      headerTableData.value[index].name = key
      headerTableData.value[index].nameKey = value
    })
  }
  swag.value = null
}
// 引入monaco编译器部分
let editorInstance = null
const sqlContainerSelf = ref(null)
monaco.languages.registerCompletionItemProvider('sql', {
  provideCompletionItems: (model, position) => {
    let suggestions = []
    const { lineNumber, column } = position
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: 0,
      endLineNumber: lineNumber,
      endColumn: column
    })
    const contents = textBeforePointer.trim().split(/\s+/)
    const lastContents = contents[contents?.length - 1] // 获取最后一段非空字符串
    if (lastContents) {
      const sqlConfigKey = ['builtinFunctions', 'keywords', 'operators']
      sqlConfigKey.forEach((key) => {
        sqlLanguage[key].forEach((sql) => {
          suggestions.push({
            label: sql, // 显示的提示内容;默认情况下，这也是选择完成时插入的文本。
            insertText: sql // 选择此完成时应插入到文档中的字符串或片段
          })
        })
      })
    }
    return {
      suggestions
    }
  }
})

onMounted(() => {
  watchEffect(() => {
    if (sqlContainerSelf.value) {
      nextTick(() => {
        if (editorInstance) {
          editorInstance.dispose()
        }
        editorInstance = monaco.editor.create(sqlContainerSelf.value, {
          value: editorContent.value,
          language: 'sql',
          theme: 'hc-black',
          automaticLayout: true
        })
      })
    }
  })
})

const form = reactive({
  name: '',
  url: '',
  method: '', //请求类型
  authorizationStatus: 'FIRST', //授权验证---无
  updateMethod: 'MANUAL',
  cronType: 'DAY',
  hourValue: '',
  frequencyDay: '', //更新频率
  //小时
  cronValue: '',
  cronValueSub: 0,
  //每日
  cronH: '',
  cronM: 0
})
//天级下拉选项
const checkAll = ref(false)
const indeterminate = ref(false)
const cornHourOptions = ref([])
const cornHourSubOptions = ref([])
const generateOptions = () => {
  cornHourOptions.value = Array.from({ length: 24 }, (_, index) => ({
    label: index,
    value: index
  }))
  cornHourSubOptions.value = Array.from({ length: 60 }, (_, index) => ({
    label: index,
    value: index
  }))
}
generateOptions() //1~23的小时下拉菜单
watch(
  () => form.cronH,
  (val) => {
    if (val.length === 0) {
      checkAll.value = false
      indeterminate.value = false
    } else if (val.length === cornHourOptions.value.length) {
      checkAll.value = true
      indeterminate.value = false
    } else {
      indeterminate.value = true
    }
  },
  { deep: true }
)

const handleCheckAll = (val) => {
  indeterminate.value = false
  if (val) {
    form.cronH = cornHourOptions.value.map((_) => _.value)
  } else {
    form.cronH = []
  }
}
// 抽屉内容区配置
const initial = ref(0)
const tabsData = [
  {
    label: '普通参数',
    value: 'EXPLOR_SPACE'
  },
  {
    label: '头参数',
    value: 'MYSQL_DATABASE'
  },
  {
    label: '查询语句',
    value: 'MYSQL_DATABASE'
  },
  {
    label: '授权验证',
    value: 'MYSQL_DATABASE'
  }
]
const formTableSelf = ref(null)
const tableData = ref([])
const tableColumns = ref([
  {
    type: 'input',
    prop: 'name',
    label: '参数名称',
    rules: [
      {
        required: true,
        message: '必填项',
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) => {
          const field = rule.field
          const indexMatch = field.match(/datas\[(\d+)\]/)
          const currentIndex = indexMatch ? parseInt(indexMatch[1], 10) : null
          const isDumplicate = tableData.value.filter(
            (item, index) => item.name === value && index !== currentIndex
          )
          if (isDumplicate.length > 0) {
            callback(new Error('该字段名已存在'))
          } else {
            formTableSelf.value.clearValidate()
            callback()
          }
        },
        trigger: ['change', 'blur'] // 当数据改变时触发验证
      }
    ]
  },
  {
    type: 'input',
    prop: 'nameKey',
    label: '参数值',
    rules: [
      {
        required: true,
        message: '必填项',
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) => {
          const field = rule.field
          const indexMatch = field.match(/datas\[(\d+)\]/)
          const currentIndex = indexMatch ? parseInt(indexMatch[1], 10) : null
          const isDumplicate = tableData.value.filter(
            (item, index) => item.originName === value && index !== currentIndex
          )
          if (isDumplicate.length > 0) {
            callback(new Error('该字段名已存在'))
          } else {
            formTableSelf.value.clearValidate()
            callback()
          }
        },
        trigger: ['change', 'blur'] // 当数据改变时触发验证
      }
    ]
  },
  {
    type: 'operate',
    prop: 'operate',
    label: '操作',
    icon: [
      {
        iconfont: 'iconfont icon-delete',
        handleClick: (row, column, $index) => {
          tableData.value.splice($index, 1)
        }
      }
    ]
  }
])
const formHeaderTableSelf = ref(null)
const headerTableData = ref([
  {
    name: 'Content-Type',
    nameKey: 'application/json'
  },
  {
    name: 'Connection',
    nameKey: 'keep-alive'
  }
])
const headerTableColumns = [
  {
    type: 'input',
    prop: 'name',
    label: '参数名称',
    rules: [
      {
        required: true,
        message: '必填项',
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) => {
          const field = rule.field
          const indexMatch = field.match(/datas\[(\d+)\]/)
          const currentIndex = indexMatch ? parseInt(indexMatch[1], 10) : null
          const isDuplicate = headerTableData.value.filter(
            (item, index) => item.name === value && index !== currentIndex
          )

          const pattern = /^[^\u4e00-\u9fa5\s]+$/ // 不能填写汉字和空格

          if (isDuplicate.length > 0) {
            callback(new Error('该字段名已存在'))
          } else if (!pattern.test(value)) {
            callback(new Error('不能填写汉字和空格'))
          } else {
            formHeaderTableSelf.value.clearValidate()
            callback()
          }
        },
        trigger: ['change', 'blur']
      }
    ]
  },
  {
    type: 'input',
    prop: 'nameKey',
    label: '参数值',
    rules: [
      {
        required: true,
        message: '必填项',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'operate',
    prop: 'operate',
    label: '操作',
    icon: [
      {
        iconfont: 'iconfont icon-delete',
        handleClick: (row, column, $index) => {
          headerTableData.value.splice($index, 1)
        }
      }
    ]
  }
]
const analyResTableData = ref([
  {
    name: '',
    originName: '',
    type: ''
  }
])
const analyResTableColumns = [
  {
    prop: 'name',
    label: '解析字段'
  },
  {
    prop: 'originName',
    label: '字段重命名'
  },
  {
    prop: 'type',
    label: '字段类型',
    clearable: false,
    options: [
      {
        label: '文本',
        value: 'STRING'
      },
      {
        label: '数值',
        value: 'NUMBER'
      },
      {
        label: '日期',
        value: 'DATE'
      }
    ]
  }
]
const addActions = ref([
  {
    label: '添加参数',
    transparent: 'true',
    prefix: 'plus',
    auto: true,
    handler: () => {
      if (initial.value === 0) {
        if (
          tableData.value &&
          Array.isArray(tableData.value) &&
          tableData.value.length > 0 &&
          !Object.values(tableData.value[tableData.value?.length - 1]).every(
            (value) => value !== ''
          )
        ) {
          ElMessage.warning('填写后再添加')
          return
        } else {
          tableData.value.push({ name: '', nameKey: '' })
        }
      } else if (initial.value === 1) {
        headerTableData.value.push({})
      }
    }
  }
])

function getAllCheckedItems(items) {
  let checkedItems = []
  function traverse(items) {
    items.forEach((item) => {
      // 如果当前项被选中
      if (item.checked) {
        checkedItems.push(item)
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    })
  }
  if (items) {
    traverse(items)
  }

  return checkedItems
}
const adjustCheck = (row) => {
  // 全选、全不选
  if (row.children) {
    if (row.checked) {
      row.children.forEach((child) => {
        child.checked = !child.children
      })
    } else {
      row.children.map((item) => {
        item.checked = false
        if (item.children) {
          item.children.forEach((childItem) => (childItem.checked = false))
        }
      })
    }
  }
  //取消勾选预览表中删除row.name对应项
  tableColumnsPreview.value = tableColumnsPreview.value.filter((column) => {
    // return column.label !== row.name
    return column.checked
  })
  convertAnalyResTableData.value.forEach((item) => {
    if (item.children) {
      const all = item.children.filter((item) => !item.children).every((flag) => flag.checked)
      const some = item.children.some((flag) => flag.checked)
      // 部分选中半选择状态
      if (some) {
        if (!all) {
          item.isIndeterminate = true
        } else {
          item.checked = true
          item.isIndeterminate = false
        }
      } else {
        item.checked = false
        item.isIndeterminate = false
      }
    }
  })

  const selection = getAllCheckedItems(convertAnalyResTableData.value)
  getanalyResRowLength.value = selection.length
  if (selection.length > 0) {
    selection.forEach((selected) => {
      const exists = tableColumnsPreview.value.some(
        (item) => item.prop === selected.name && item.value === selected.value
      )
      if (!exists && !selected.children) {
        tableColumnsPreview.value.push({
          prop: `${selected.name}${selected.value}`,
          label: selected.name,
          value: selected.value
        })
      }
    })
    tableDataPreview.value = [
      tableColumnsPreview.value.reduce((result, col) => {
        result[col.prop] = col?.value
        return result
      }, {})
    ]
  } else {
    tableColumnsPreview.value = []
    tableDataPreview.value = []
  }
}

//多选预览表格
const tableDataPreview = ref([])
const tableColumnsPreview = ref([])
//row-class-name添加下标
const tableRowClassName = (row, index) => {
  row.index = row.rowIndex
}

const isDone = ref(true)
const isAuto = ref(false)
const isDay = ref(false)
const handleOptionChange = () => {
  isAuto.value = !isAuto.value
}
const handleSubOptionChange = () => {
  isDay.value = !isDay.value
}
//表格数据转换
const updateAnalyseData = (convertData, targetData) => {
  convertData.forEach((convertItem) => {
    const targetIndex = targetData.findIndex((targetItem) => targetItem.id === convertItem.id)
    if (targetIndex !== -1) {
      targetData[targetIndex].originName = convertItem.originName
      targetData[targetIndex].type = convertItem.type

      if (convertItem.children) {
        updateAnalyseData(convertItem.children, targetData)
      }
    }
  })
}
const done = async () => {
  // 将表格中的originName和name数据同步给analyResTableData
  updateAnalyseData(convertAnalyResTableData.value, analyResTableData.value)

  const requestContent = {
    headerMap: {},
    argumentMap: {},
    bodyMap: body.value || {},
    authorizationStatus: form.authorizationStatus === 'ZERO' ? 0 : 1
  }
  tableData.value.forEach((item) => {
    const key = item.name
    const value = item.nameKey
    requestContent.argumentMap[key] = value
  })
  headerTableData.value.forEach((item) => {
    const key = item.name
    const value = item.nameKey
    requestContent.headerMap[key] = value
  })

  const convertFields = (data) => {
    return data.map((item) => {
      const fieldsItem = {
        name: item.name || '',
        originName: item.originName || item.name || '',
        type: item.type || item.originType || '',
        originType: item.originType || '',
        checked: item.checked ? 0 : 1
      }
      if (item.children) {
        fieldsItem.children = convertFields(item.children)
      }

      return fieldsItem
    })
  }
  const fieldsRequest = convertFields(convertAnalyResTableData.value)
  //保存API
  const formatCronHM = (timeH, timeM) => {
    if (timeH.length > 1) {
      timeH = timeH.join(':')
    }
    return `${timeH}:${timeM}`
  }
  const valid = await formSelf.value.validate()
  if (valid) {
    const result = await datasourceApi.saveApiDatasource.send({
      id: query?.id || '',
      name: form.name,
      type: 'API',
      url: form.url,
      method: form.method,
      updateMethod: form.updateMethod,
      cronType: form.updateMethod === 'AUTO' ? form.cronType : '',
      cronValue: form.cronType === 'DAY' ? form.cronValue : formatCronHM(form.cronH, form.cronM),
      requestContent: requestContent,
      fieldsRequest: fieldsRequest
    })
    isDone.value = !isDone.value
    if (result) {
      if (query.id) {
        ElMessage.success('修改成功！')
        router.push({ name: 'DataSourceList' })
      }
      emits('handlerApiActiveName')
    }
  }
}

const swag = ref(null)
watch(
  () => ({ ...form }),
  (n, o) => {
    if (o.url && o.method && o != n) {
      swag.value = {}
    }
  },
  {
    deep: true
  }
)
watch(
  () => ({ tableData, headerTableData, editorContent }),
  () => {
    swag.value = {}
  },
  {
    deep: true
  }
)
</script>
<style lang="scss" scoped>
.step-block {
  height: 100%;
}
.source-create-step-basic {
  &__title {
    height: size(44);
    border: size(16);
  }
  &__content {
    min-width: size(704);
    // height: size(704);
    height: calc(100% - 44px);
    display: flex;
    flex-direction: column;
    &__form {
      max-width: size(704);
    }
    &__title {
      display: inline-block;
      padding-bottom: size(16);
    }
    &-param {
      flex: 1;
      max-width: size(784);
      &.param__tabs {
        background: #f5f7fa;
        border-bottom: size(1) solid #dcdfe6;
        .gx-tabs__item {
          height: size(52);
        }
      }
      &__form {
        padding-top: size(16);
        :deep(.el-select) {
          min-width: size(308);
        }
      }
      &.param__content {
        // min-height: size(455);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100% - 40px);

        .table-list {
          max-height: size(520);
          overflow-y: auto;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .gx-actions {
          padding: size(16) 0;
          justify-content: flex-end;
          @include plain-text;
          color: #606266;
        }
        &.content__equl {
          background: #f5f7fa;
          height: size(500);
          .sql__editor {
            margin: size(5) auto;
            width: size(455);
            height: size(320);
            background: rgba(51, 51, 51, 0.22);
          }
        }
      }
    }
  }
}
.preview-check {
  width: size(784);
  min-height: 0;
  .table-list {
    width: 100%;
  }
}
.source-create-step-parameter {
  &__title {
    @include plain-text;
    color: $secondary-text-color;
    display: inline-block;
    padding: size(16) 0;
  }
  &__content {
    width: size(800);
    height: calc(100% - 230px);
    display: flex;
    .el-table--fit {
      height: 100%;
    }
  }
}
.source-create-step-struct {
  height: size(744);
  :deep(.el-select) {
    min-width: size(308);
  }
  .sub-item {
    :deep(.el-select) {
      min-width: size(80);
    }
  }
}
.monacoeditor {
  margin: size(5) auto;
  width: size(455);
  height: size(320);
  background: rgba(51, 51, 51, 0.22);
}
:deep(.el-table) {
  .el-table__header-wrapper {
    .cell .el-checkbox {
      display: none;
    }
  }
}
</style>
