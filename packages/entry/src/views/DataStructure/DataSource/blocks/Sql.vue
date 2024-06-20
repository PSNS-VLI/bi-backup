<template>
  <div class="mysql-update">
    <GxCard class="mysql-update-card">
      <div class="mysql-update-card__content">
        <el-form :model="sqlForm" label-width="150px" ref="formSelf" :rules="rules">
          <el-form-item label="显示名称" prop="name" :required="true">
            <el-input
              placeholder="请输入名称"
              v-model="sqlForm.name"
              label-width="664px"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据库地址" prop="url">
            <el-input
              placeholder="请输入数据库地址"
              v-model="sqlForm.url"
              label-width="664px"
            ></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input
              placeholder="请输入端口号"
              v-model="sqlForm.port"
              label-width="664px"
            ></el-input>
          </el-form-item>
          <el-form-item label="Schema" prop="schema" v-if="props.componentId === 'DaMengSource'">
            <el-input
              placeholder="请输入Schema"
              v-model="sqlForm.schema"
              label-width="664px"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据库" prop="database">
            <el-input
              placeholder="请输入数据库名称"
              v-model="sqlForm.database"
              label-width="664px"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              placeholder="请输入用户名"
              v-model="sqlForm.username"
              label-width="664px"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="sqlForm.password"
              label-width="664px"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据库版本" prop="version">
            <el-select v-model="sqlForm.version">
              <el-option
                v-for="opt in versionMap"
                :key="opt.label"
                :label="opt.label"
                :value="opt.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SSL" prop="ssl">
            <el-checkbox v-model="sqlForm.ssl"></el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </GxCard>
  </div>
</template>
<script setup>
import { ref, defineProps, defineExpose, watch, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
const query = useRoute().query
const queryType = query.type
console.log(query, typeof queryType, queryType === 'DM')

const props = defineProps({
  title: {
    type: String
  },
  detailData: {
    type: Array
  },
  componentId: {
    type: String
  }
})
watch(
  () => props.detailData,
  (n, _) => {
    Object.assign(sqlForm.value, n, {
      ssl: n.ssl ? true : false
    })
  }
)

const sqlForm = ref({
  name: '',
  url: '',
  port: '',
  schema: '',
  database: '',
  username: '',
  password: '',
  version: '',
  ssl: false
})
const versionMap = computed(() => {
  if (queryType === 'DM' || props.componentId === 'DaMengSource') {
    return [
      {
        label: '5.0版本',
        value: 5.0
      },
      {
        label: '8.0版本',
        value: 8.0
      }
    ]
  } else {
    return [
      {
        label: '5.7版本',
        value: 5.7
      },
      {
        label: '8.7版本',
        value: 8.7
      }
    ]
  }
})

const rules = reactive({
  name: [
    { required: true, message: '名称是必填项', trigger: 'blur' },
    { min: 1, max: 20, message: '长度不得超过20字符', trigger: 'blur' }
  ],
  url: [
    {
      required: true,
      message: '数据库地址是必填项',
      trigger: 'blur'
    }
  ],
  port: [
    {
      required: true,
      message: '端口是必填项',
      trigger: 'blur'
    },
    {
      pattern: /^[0-9]+$/,
      message: '只能填写数字',
      trigger: 'change'
    },
    {
      validator: (rule, value, callback) => {
        if (value < 0 || value > 65535) {
          callback(new Error('端口号必须在0到65535之间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  schema: [
    {
      required: true,
      message: 'schema 是必填项',
      trigger: 'blur'
    }
  ],
  database: [{ required: true, message: '数据库名称是必填项', trigger: 'blur' }],
  username: [{ required: true, message: '用户名是必填项', trigger: 'blur' }],
  password: [{ required: true, message: '密码是必填项', trigger: 'blur' }],
  version: [{ required: true, message: '数据库版本是必填项', trigger: 'blur' }]
})
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
const resetFields = () => formSelf.value.resetFields()

defineExpose({
  sqlForm,
  submit,
  resetFields
})
</script>
<style lang="scss" scoped>
.mysql-update {
  width: 100%;
  height: 100%;
  &-card {
    &__content {
      height: 100%;
      width: size(524);
      border-right: size(1) solid #dcdfe6;
      padding-right: size(16);
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.el-drawer__header {
  color: $secondary-text-color;
}
:deep(.el-drawer__footer) {
  .gx-actions {
    justify-content: flex-end !important;
  }
  hr {
    background-color: $input-border-color;
    height: size(1);
    border: none;
  }
}
</style>
