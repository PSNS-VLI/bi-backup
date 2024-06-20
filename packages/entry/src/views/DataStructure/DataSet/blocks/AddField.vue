<template>
  <!--      新建计算字段-->
  <div class="add-field" v-if="props.contentType === 'fieldItem'">
    <el-form :model="fieldsForm" label-width="80px">
      <el-form-item label="字段原名" prop="name" required>
        <el-input v-model="fieldsForm.name" />
      </el-form-item>
    </el-form>
    <div class="item-content">
      <!--          字段表达式-->
      <div class="item-content__left">
        <span class="express"> 字段表达式 </span>
        <div class="field-express">
          <div class="field-express__top">
            <monaco-editor
              :code="code"
              @update:code="updateCode"
              @editor-instance-ready="handlerInstanceReady"
              ref="editorInstancesSelf"
            ></monaco-editor>
          </div>
          <div class="field-express__bottom">
            <el-form :model="fieldsForm" label-width="100px">
              <el-form-item label="数据类型">
                <el-radio-group v-model="fieldsForm.dataType">
                  <el-radio
                    v-for="option in dataTypeOptions"
                    :key="option.value"
                    :label="option.value"
                    >{{ option.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="字段类型">
                <el-radio-group v-model="fieldsForm.type">
                  <el-radio
                    v-for="option in typeOptions"
                    :key="option.value"
                    :label="option.value"
                    >{{ option.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <div v-if="isMeasure">
                <el-form-item label="数值格式化">
                  <el-select v-model="fieldsForm.dataFormat" placeholder="请选择">
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in options"
                      :key="item.value"
                    />
                  </el-select>
                  <!--                  手动-->
                  <div class="manual" v-if="isMeasureItem === 'manual'">
                    <el-input
                      v-model="fieldsForm.definiteFormat"
                      placeholder="显示格式，例如#,##0.00%，只能由大小写字母数字和_#,.%组成，长度不超过50个字符"
                    ></el-input>
                    <el-tooltip placement="top">
                      <template #content>
                        显示格式，例如#,##0.00%<br />只能由大小写字母数字和_#,.%组成<br />长度不超过50个字符</template
                      >
                      <span class="iconfont icon-tishi"></span>
                    </el-tooltip>
                  </div>
                  <!--                  自定义-->
                  <div class="self" v-if="isMeasureItem === 'self'">
                    <el-select style="width: 90px" v-model="fieldsForm.definiteSelf">
                      <el-option
                        :label="item.label"
                        :value="item.value"
                        v-for="item in selfOptions"
                        :key="item"
                      />
                    </el-select>
                    <el-input-number
                      v-model="fieldsForm.definiteSelfNum"
                      :min="1"
                      :max="2"
                      size="small"
                      style="width: 80px"
                      controls-position="right"
                    />
                    <el-checkbox v-model="fieldsForm.definiteSelfCheck">千分位</el-checkbox>
                  </div>
                </el-form-item>
              </div>

              <el-form-item label="字段描述">
                <el-input
                  v-model="fieldsForm.description"
                  placeholder="请输入字段描述"
                  type="textarea"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <!--          点击引用字段-->
      <div class="item-content__center">
        点击引用字段
        <div class="fields-refer">
          <el-input
            v-model="inputList"
            clearable
            :prefix-icon="Search"
            placeholder="请输入关键字搜索"
            @input="inputChangeFieldSearch"
          ></el-input>
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
            <el-tab-pane label="维度" name="first">
              <ul>
                <template v-for="(item, index) in detailDataOption" :key="index">
                  <template v-if="item.dataType === 'DIMENSION'">
                    <div>
                      <li class="tab-item__demission" @click="handlerTabItem(item)">
                        <span class="date-span">
                          <i :class="['iconfont', item.icon]"></i>
                          {{ item.name }}
                        </span>
                      </li>
                    </div>
                  </template>
                </template>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="度量" name="second">
              <ul>
                <template v-for="(item, index) in detailDataOption" :key="index">
                  <li
                    class="tab-item__measure"
                    v-if="item.dataType === 'MEASURE'"
                    @click="handlerTabItem(item)"
                  >
                    <span>
                      <i :class="['iconfont', item.icon]"></i>
                      {{ item.name }}
                    </span>
                  </li>
                </template>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!--          点击引用函数-->
      <div class="item-content__right">
        点击引用函数
        <div class="fun-refer">
          <el-input
            v-model="funList"
            clearable
            :prefix-icon="Search"
            placeholder="请输入关键字搜索"
            @input="funChangeFieldSearch"
          ></el-input>
          <Gx-tree
            :data="regularFun"
            :actions="actions"
            @click-btn="onClickBtn"
            @handler-node-click="handlerNodeClick"
          >
          </Gx-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import GxTree from '../blocks/GxTree'
import MonacoEditor from '@/views/DataStructure/DataSet/blocks/MonacoEditor.vue'
import { options } from '../useInfoBlock'
import { Search } from '@element-plus/icons-vue'
import { defineProps, ref, watch, computed } from 'vue'
const props = defineProps({
  contentType: {
    type: String
  },
  data: {
    type: Array
  },
  detailData: {
    type: Object
  }
})

const fieldsForm = ref({
  name: props.detailData?.name ?? '',
  dataType: props.detailData?.dataType ?? 'MEASURE',
  type: props.detailData?.type ?? 'NUMBER',
  dataFormat: props.detailData?.dataFormat ?? 'auto',
  definiteFormat: props.detailData?.definiteFormat ?? '', //手动格式
  definiteSelf: props.detailData?.definiteSelf ?? 'num', //自定义格式
  definiteSelfNum: props.detailData?.definiteSelfNum ?? '1',
  definiteSelfCheck: props.detailData?.definiteSelfCheck ?? true,
  description: props.detailData?.description ?? ''
})
const dataTypeOptions = [
  { label: '度量', value: 'MEASURE' },
  { label: '维度', value: 'DIMENSION' }
]
const basicTypeOptions = ref([
  { label: '数值', value: 'NUMBER' },
  { label: '文本', value: 'STRING' },
  { label: '日期时间', value: 'DATE' }
])
const typeOptions = computed(() => {
  const measureOption = basicTypeOptions.value.slice(0, 2)
  return fieldsForm.value.dataType === 'MEASURE' ? measureOption : basicTypeOptions.value
})

const selfOptions = [
  {
    label: '数值',
    value: 'num'
  },
  {
    label: '百分比',
    value: 'percent'
  }
]

//编辑器
let editorInstances = null
const editorInstancesSelf = ref(null)
const handlerInstanceReady = (editorInstance) => {
  editorInstances = editorInstance
  // 注册 onDidChangeModelContent 事件处理函数
  editorInstances.onDidChangeModelContent(() => {
    // 获取编辑器的新内容
    const newValue = editorInstances.getValue()
    code.value = newValue
  })
}
const code = ref(
  props.detailData?.expression
    ? JSON.parse(props.detailData?.expression)?.calculateMethod ?? ''
    : ''
) //编辑器的值
const updateCode = (val) => {
  code.value = val
  editorInstances.setValue(val)
}

//引用字段搜索
const detailDataOption = ref([])
const inputList = ref('')
const funList = ref('')
const inputChangeFieldSearch = (val) => {
  if (val) {
    detailDataOption.value = detailData.value.filter((item) => item.name.includes(val))
  } else {
    detailDataOption.value = detailData.value
  }
}
const funChangeFieldSearch = (val) => {
  if (val) {
    const result = []

    regularFunBasic[0].children.forEach((item) => {
      if (item.name.includes(val)) {
        result.push(item)
      }
    })
    regularFun.value[0].children = result
  } else {
    regularFun.value[0].children = regularFunBasic[0].children
  }
}

//引用字段相关
const activeName = ref('first')
const handleTabClick = () => {
  activeName.value = 'second'
}

const flattenData = (treeData) => {
  let result = []
  for (const node of treeData) {
    if (node.children) {
      for (const child of node.children) {
        if (child.datasetTableFieldType === 'FIELD') {
          result.push(child)
        } else if (child.datasetTableFieldType === 'FOLDER') {
          if (child?.children) {
            result.push(...child.children)
          }
        }
      }
    }
  }
  return result
}
const detailData = computed(() => {
  console.log(flattenData(props.data))
  return flattenData(props.data)
    .filter((item) => item.checked === 0)
    .filter((item) => item.name !== props.detailData?.name)
})

detailDataOption.value = detailData.value
const regularFunBasic = [
  {
    id: 1,
    name: '常规函数',
    children: [
      {
        name: 'min(x)',
        desc: 'min'
      },
      {
        name: 'max(x)',
        desc: 'max'
      },
      {
        name: 'count(x)',
        desc: 'count'
      },
      {
        name: 'sum(x)',
        desc: 'sum'
      },
      {
        name: 'avg(x)',
        desc: 'avg'
      },
      {
        name: 'abs(x)',
        desc: 'abs'
      },
      {
        name: 'ceil(x)',
        desc: 'ceil'
      },
      {
        name: 'ceilling(x)',
        desc: 'ceilling'
      },
      {
        name: 'exp(x)',
        desc: 'exp'
      },
      {
        name: 'log10(x)',
        desc: 'log10'
      },
      {
        name: 'log2(x)',
        desc: 'log2'
      },
      {
        name: 'PI(x)',
        desc: 'PI'
      },
      {
        name: 'sqrt(x)',
        desc: 'sqrt'
      }
    ]
  }
  // {
  //   id: 2,
  //   name: 'LOD函数',
  //   children: [
  //     {
  //       id: 5,
  //       name: 'lod_fixed{维度：聚合表达式}',
  //       desc: 'lod_fixed'
  //     },
  //     {
  //       id: 6,
  //       name: 'lod_include{维度：聚合表达式}',
  //       desc: 'lod_include'
  //     },
  //     {
  //       id: 7,
  //       name: 'lod_exclude{维度：聚合表达式}',
  //       desc: 'lod_exclude'
  //     }
  //   ]
  // }
]
const regularFun = ref(null)
regularFun.value = JSON.parse(JSON.stringify(regularFunBasic))
const handlerTabItem = (item) => {
  if (item.name) {
    const newContent = item.name
    const position = editorInstances.getPosition()
    editorInstances.executeEdits('', [
      {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: newContent
      }
    ])

    editorInstances.setPosition({
      lineNumber: position.lineNumber,
      column: position.column + newContent.length
    })

    editorInstances.focus()
  }

  Object.assign(fieldsForm.value, {
    originName: fieldsForm.value.name,
    originType: fieldsForm.value.type,
    datasourceId: item.datasetTableId,
    datasetId: null,
    datasetTableName: item.datasetTableName,
    datasetTableOriginName: item.datasetTableOriginName,
    fieldAliasName: null,
    extraField: 1, //1代表新建计算字段
    checked: 0,
    granularities: null,
    convertValue: null,
    aggregation: 'SUM',
    datasetTableFieldType: 'FIELD',
    expression: JSON.stringify({ calculateMethod: code.value }),
    children: null
  })
}
const handlerNodeClick = (data) => {
  if (data.name) {
    const newContent = data.name
    const position = editorInstances.getPosition()
    editorInstances.executeEdits('', [
      {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: newContent
      }
    ])

    editorInstances.setPosition({
      lineNumber: position.lineNumber,
      column: position.column + newContent.length - 2
    })

    editorInstances.focus()
  }
}
const isMeasure = ref(true)
const isMeasureItem = ref('manual')
const disabled = ref(true)
watch(
  () => ({
    name: fieldsForm.value.name,
    dataType: fieldsForm.value.dataType,
    dataFormat: fieldsForm.value.dataFormat
  }),

  (newValue) => {
    const { name, dataType, dataFormat } = newValue
    if (name) {
      disabled.value = false
    } else {
      disabled.value = true
    }
    if (dataType === 'DIMENSION') {
      isMeasure.value = false
    } else {
      isMeasure.value = true
      if (dataFormat === 'manual') {
        isMeasureItem.value = 'manual'
      } else if (dataFormat === 'self') {
        isMeasureItem.value = 'self'
      } else {
        isMeasureItem.value = 'NULL'
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  fieldsForm,
  code,
  disabled
})
</script>
<style lang="scss" scoped>
.add-field {
  display: flex;
  flex-direction: column;
  .item-content {
    display: flex;
    gap: size(16);
    color: #333;
    &__left {
      width: size(471);
      height: size(590);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .express:before {
        content: '*';
        color: red;
      }
      .field-express {
        width: size(471);
        height: size(558);
        border: size(1) solid #333;
        &__top {
          margin: size(5) auto;
          width: size(455);
          height: size(320);
          background: rgba(51, 51, 51, 0.22);
        }

        :deep(.el-form-item__content) {
          flex-wrap: nowrap;
          gap: size(8);
          .el-select {
            width: size(104);
          }
          .manual,
          .self {
            display: flex;
            flex: 1;
            justify-content: space-between;
            gap: size(8);
          }
          .input {
            width: size(40);
          }
          .input-label {
            display: inline-flex;
            width: 48px;
          }
        }
      }
    }
    &__right,
    &__center {
      width: size(212);
      height: size(590);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .fields-refer,
      .fun-refer {
        display: flex;
        width: 100%;
        height: size(558);
        border: size(1) solid #333;
        flex-direction: column;
        padding: size(8);
      }
      :deep(.el-tabs) {
        height: 100%;
        .el-tabs__content {
          height: calc(100% - size(80));
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .el-tabs__item {
          padding: 0 size(10);
        }
        ul {
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .tab-item {
          &__demission {
            @include plain-text;
            background: #eaf0fe;
            height: size(32);
            margin: size(8) 0;
            line-height: size(32);
            border: size(1) solid $theme-text-color;
            color: #606266;
            .iconfont {
              color: $theme-text-color;
              font-size: size(16);
            }
            .date-span {
              width: 100%;
              height: 100%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
          &__measure {
            @include plain-text;
            background: #f0f9eb;
            height: size(32);
            margin: size(8) 0;
            line-height: size(32);
            border: size(1) solid $icon-uploadfiles-color;
            color: #606266;
            .iconfont {
              color: $icon-uploadfiles-color;
              font-size: size(16);
            }
          }
        }
      }
    }
  }
}
:deep(.el-tree-node__children) {
  padding-left: size(2) !important;
  .el-tree-node__content {
    padding-left: size(2) !important;
  }
  .el-icon {
    display: none;
  }
  .el-tree-node__label {
    .tree-node__name {
      max-width: size(180);
      overflow: hidden;
      text-overflow: ellipsis;
      color: $theme-text-color;
    }
    .tree-node__action {
      max-width: size(50);
      display: block !important;
    }
  }
}
:deep(.el-form-item) {
  padding-right: size(4);
}
</style>
