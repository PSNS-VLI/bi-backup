<template>
  <div class="source-create">
    <div class="file" :class="{ 'set-file': props.isShowUpload }">
      <div class="source-create-card__content">
        <div class="title">文件上传</div>
        <el-form
          :model="form"
          label-width="150px"
          ref="formSelf"
          :rules="[
            {
              validator: validate,
              trigger: 'blur'
            }
          ]"
        >
          <el-form-item label="请选择文件" :required="true">
            <el-tooltip placement="top" :content="buttonHint">
              <template v-if="!props.queryId">
                <el-upload
                  v-model:file-list="fileList"
                  :show-file-list="false"
                  :http-request="handlerUploadFile"
                  :before-upload="beforeUpload"
                  action
                >
                  <el-button>
                    <i :class="{ 'iconfont icon-download': queryId }"></i>
                    <span>
                      {{ props.queryId ? buttonHint : '请选择待上传文件' }}
                    </span>
                  </el-button>

                  <template #tip>
                    <div class="upload__tip">文件只支持.csv格式</div>
                  </template>
                </el-upload>
              </template>

              <template v-else>
                <div class="download-btn">
                  <GxActions :actions="downActions"></GxActions>
                </div>
              </template>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            label="自定义文件名称"
            :rules="[
              { required: true, message: '请输入名称', trigger: 'blur' },
              {
                validator: validate,
                trigger: 'blur'
              }
            ]"
            prop="fileSelfName"
          >
            <el-tooltip placement="top" :content="form.fileSelfName" :disabled="!form.fileSelfName">
              <el-input
                placeholder="请输入名称"
                v-model="form.fileSelfName"
                style="max-width: 500px"
              >
              </el-input>
            </el-tooltip>
            <div class="customfile__tip">
              名称只能由中英文、数字及下划线（_）、斜线（/）、反斜线（\）、竖线（|）、小括号（()）、中括号（[]）、大括号（{}）、书名号（《》）、双引号（“”）、顿号（、）、电邮应用（@）、中式冒号（：）、中式逗号（，）、句号（。）、点（.）、问号（？）、大于号（>）、小于号（&lt;）、减号（-）、加号（+）组成，不超过50个字符。
            </div>
          </el-form-item>
        </el-form>
      </div>

      <hr />
      <div class="advanced">
        <div class="title">高级配置</div>
        <div class="advanced-title">{{ '字段预览(' + `${tableData.length ?? 0}` + ')' }}</div>
        <div>
          <FormTable
            ref="formTableSelf"
            :table-data="tableData"
            :tableColumns="tableColumns"
            :rules="rules"
          ></FormTable>
        </div>
      </div>
    </div>
    <div v-if="props.isShowUpload">
      <hr />
      <GxActions :actions="actions"></GxActions>
    </div>
  </div>
</template>
<script setup>
import FormTable from './FormTable.vue'
import { GxActions } from '@gxhs/ui'
import { ref, reactive, defineProps, defineExpose, defineEmits, watch } from 'vue'
import { FILE_PREVIEW_SERVER_URL } from '@/config'
import apiData from '@/api/upload-file'

import api from '@/api'

const { datasourceApi } = api

const props = defineProps({
  detailData: {
    type: Array
  },
  buttonHint: {
    type: String
  },
  isShowUpload: {
    type: Boolean,
    default: false
  },
  queryId: {
    type: Number
  }
})
const emits = defineEmits(['handlerCancle', 'handlerConfirm', 'handlerButtonHint'])
const buttonHint = ref(props.buttonHint)
const form = reactive({
  fileSelfName: ''
})
const fileName = ref('')
const filePath = ref({
  completePath: '',
  relativePath: ''
})
const fileList = ref([])
const tableColumns = ref([
  {
    type: 'input',
    label: '文件字段名',
    prop: 'name',
    width: '200',
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
    // type: 'input',
    label: '数据库字段名',
    prop: 'originName',
    width: '200'
  },
  {
    type: 'select',
    prop: 'type',
    label: '字段类型',
    options: [
      {
        type: 'STRING',
        value: 'STRING',
        label: '文本'
      },
      {
        type: 'NUMBER',
        value: 'NUMBER',
        label: '数值'
      },
      {
        type: 'DATE',
        value: 'DATE',
        label: '日期'
      }
    ]
  }
])
const tableData = ref([])
const saveData = ref({
  completePath: '',
  relativePath: '',
  fileName: '',
  type: '',
  fieldRequest: []
})

//只能上传.csv文件
const beforeUpload = (file) => {
  if (file.type !== 'text/csv') {
    ElMessage.warning('文件格式不支持')
    return false
  }
  return true
}
//上传文件
const handlerUploadFile = async (file) => {
  fileName.value = file.file.name //按钮

  const fileUploadPath = await apiData.uploadFile.send({ file: file.file })
  const fileUploadFields = await datasourceApi.analyseFile.send({
    filePath: fileUploadPath.path
  })
  if (!fileUploadFields) return
  if (!form.fileSelfName) {
    form.fileSelfName = fileName.value
  } //表单---上传文件名
  tableData.value = fileUploadFields
  Object.assign(filePath.value, {
    completePath: fileUploadPath.path,
    relativePath: fileUploadPath.url
  })

  const ToFileUploadFields = fileUploadFields.map((item) => ({
    name: item.name,
    originName: item.originName,
    type: item.type,
    originType: item.originType,
    columnIndex: item.columnIndex
  }))

  Object.assign(saveData.value, {
    completePath: fileUploadPath.path,
    relativePath: fileUploadPath.url,
    fileName: file.file.name,
    type: 'FILE',
    fieldRequest: ToFileUploadFields
  })
  emits('handlerButtonHint', fileName.value)
}
const validate = (rule, value, callback) => {
  const nameValidationRule =
    /^[\u4e00-\u9fa5a-zA-Z0-9_\\/\\|(){}\\[\]{}《》“”、@：，。.？><\-+]{1,50}$/
  if (value && !nameValidationRule.test(value)) {
    callback(new Error('名称格式不符合要求'))
  } else {
    callback()
  }
}

const formSelf = ref(null)
const submit = async (fields) => {
  let valid
  if (fields?.length) {
    valid = await formSelf.value.validateField(fields, () => {})
  } else {
    valid = await formSelf.value.validate(() => {})
  }
  return {
    valid
  }
}
//点击保存时校验相关
const formTableSelf = ref(null)

//文件相关
const downActions = ref([
  {
    label: buttonHint.value,
    flow: true,
    auto: true,
    prefix: 'download',
    download: true,
    transparent: true,
    handler: async () => {
      const { relativePath } = filePath.value
      const exportConfig = [`${FILE_PREVIEW_SERVER_URL}${relativePath}`]
      const exportFileName = buttonHint.value
      if (exportFileName) exportConfig.push(exportFileName)
      return exportConfig
    }
  }
])
const actions = ref([
  {
    type: 'main',
    transparent: true,
    label: '取消',
    handler: () => {
      emits('handlerCancle')
    }
  },
  {
    type: 'main',
    label: '保存',
    handler: async () => {
      const result = await datasourceApi.saveFileDatasource.send({
        id: '',
        ...saveData.value,
        name: form.fileSelfName
      })
      if (result) {
        emits('handlerConfirm')
      }
    }
  }
])
watch(
  () => props.detailData,
  (n, _) => {
    fileName.value = n.originName
    form.fileSelfName = n.name
    tableData.value = n.fields
    buttonHint.value = n.originName
    downActions.value[0].label = n.originName
    Object.assign(filePath.value, {
      completePath: n.completePath,
      relativePath: n.relativePath
    })
  }
)
defineExpose({
  tableData,
  form,
  fileName,
  filePath,
  saveData,
  submit,
  formTableSelf
})
</script>
<style lang="scss" scoped>
.source-create {
  height: 100%;
  .file {
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #f5f7fa;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #f1f2fb;
      cursor: pointer;
    }
    // 滚动条宽度
    &.set-file {
      height: calc(100% - 40px);
    }
  }
}
.download-btn {
  :deep(.gx-action) {
    display: flex;
    justify-content: flex-start;
    max-width: 500px;
    white-space: nowrap;
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
  }
}
.title {
  @include plain-text;
  color: $secondary-text-color;
}
.el-input__wrapper {
  max-width: size(500);
}
.upload__tip,
.customfile__tip {
  @include plain-text;
  color: $upfile-text-color;
  font-size: size(12);
  font-style: normal;
}
.advanced {
  max-width: size(784);
  &-title {
    &:before {
      content: '*';
      color: red;
    }
  }
}
:deep(.el-form-item__content) {
  flex-direction: column;
  align-items: flex-start;
}
</style>
