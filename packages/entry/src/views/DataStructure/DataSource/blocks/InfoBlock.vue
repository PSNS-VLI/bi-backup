<template>
  <div class="create-source">
    <div class="create-source_content">
      <GxCard class="source-create-card">
        <el-drawer
          v-model="innerDrawer"
          :title="title"
          :append-to-body="true"
          :before-close="handleClose"
          direction="btt"
          :modal="false"
          @close="close"
          size="90%"
          modal-class="create-Source-drawer"
        >
          <el-container>
            <el-aside v-if="!queryId">
              <Aside :active="active" @handlerActive="handlerActive"></Aside>
            </el-aside>
            <el-main>
              <template v-if="componentId === 'FileSource'">
                <File
                  ref="fileSelf"
                  :queryId="queryId"
                  :detailData="props.detailData"
                  :buttonHint="buttonHint"
                  @handlerButtonHint="handlerButtonHint"
                ></File>
              </template>
              <template v-if="componentId === 'ApiSource'">
                <Api
                  :detailData="props.detailData"
                  @handlerApiActiveName="handlerApiActiveName"
                ></Api>
              </template>
              <template v-if="componentId === 'SqlSource'">
                <Sql
                  ref="sqlInfoSelf"
                  :detailData="props.detailData"
                  :componentId="componentId"
                ></Sql>
              </template>
              <template v-if="componentId === 'DaMengSource'">
                <Sql
                  ref="sqlInfoSelf"
                  :detailData="props.detailData"
                  :componentId="componentId"
                ></Sql>
              </template>
            </el-main>
          </el-container>
          <template #footer v-if="componentId !== 'ApiSource'">
            <hr />
            <GxActions :actions="convertActions"></GxActions>
          </template>
        </el-drawer>
      </GxCard>
    </div>
  </div>
</template>

<script setup>
import Aside from './Aside.vue'
import File from './File.vue'
import Api from './Api.vue'
import Sql from './Sql.vue'
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import { GxActions } from '@gxhs/ui'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const { datasourceApi } = api
const router = useRouter()
const query = useRoute().query
const queryId = Object.values(query).length !== 0 ? Number(query.id) : null
const props = defineProps({
  isAside: {
    type: Boolean,
    default: true
  },
  title: {
    type: String
  },
  componentId: {
    type: String
  },
  detailData: {
    type: Array
  },
  active: {
    type: String
  }
})

const active = computed(() => props.active)
// //菜单更改active
const menuComponentId = ref(null)
const handlerActive = (val) => {
  menuComponentId.value = val
  emits('handlerAsideComponentId', val)
}
const componentId = computed(() => {
  if (menuComponentId.value) {
    return menuComponentId.value
  } else {
    return props.componentId
  }
})

const route = useRoute()
const innerDrawer = ref(true)
const buttonHint = ref('选择待上传文件')

const title = computed(() => (props.title ? props.title : route.meta.title))

const fileSelf = ref(null)
const handlerButtonHint = (fileName) => {
  buttonHint.value = fileName.value
}
const saveSourceData = async () => {
  let result = null
  if (props.componentId === 'FileSource') {
    if (
      (!fileSelf.value.saveData.completePath || !fileSelf.value.saveData.relativePath) &&
      !queryId
    ) {
      ElMessage.warning('请先上传文件')
    } else {
      const isValid = await fileSelf.value.formTableSelf.submit(fileSelf.value.form)
      const ToUpdateFileUploadFields = fileSelf.value.tableData.map((item) => ({
        name: item.name,
        originName: item.originName,
        type: item.type,
        originType: item.originType,
        columnIndex: item.columnIndex
      }))
      //修改-保存
      Object.assign(fileSelf.value.saveData, {
        ...fileSelf.value.filePath,
        fileName: fileSelf.value.fileName,
        type: 'FILE',
        fieldRequest: ToUpdateFileUploadFields
      })
      if (isValid.valid) {
        result = await datasourceApi.saveFileDatasource.send({
          id: queryId || '',
          ...fileSelf.value.saveData,
          name: fileSelf.value.form.fileSelfName
        })
      } else {
        fileSelf.value.submit(fileSelf.value.form)
        ElMessage.warning('请输入正确格式！')
      }
    }
  } else if (props.componentId === 'SqlSource') {
    const parmaSQL = Object.assign({}, sqlInfoSelf.value.sqlForm, {
      id: queryId ? queryId : '',
      type: sqlInfoSelf.value.sqlForm.dbType,
      ssl: sqlInfoSelf.value.sqlForm.ssl ? 1 : 0
    })

    result = await datasourceApi.saveDbDatasource.send({ ...parmaSQL })
  } else if (props.componentId === 'DaMengSource') {
    const paramDM = Object.assign({}, sqlInfoSelf.value.sqlForm, {
      id: queryId ? queryId : '',
      dbType: 'DM',
      type: sqlInfoSelf.value.sqlForm.dbType,
      ssl: sqlInfoSelf.value.sqlForm.ssl ? 1 : 0
    })

    result = await datasourceApi.saveDbDatasource.send({ ...paramDM })
  } //api这里没有保存按钮
  if (result) {
    if (props.detailData) {
      ElMessage.success('操作成功')
      router.push({ name: 'DataSourceList' })
    } else {
      emits('activeName')
    }
  }
}
const handlerApiActiveName = () => {
  emits('activeName')
}

const emits = defineEmits([
  'handlerCancle',
  'handlerConfirm',
  'activeName',
  'handlerAsideComponentId'
])
const convertActions = ref([
  {
    type: 'main',
    transparent: true,
    label: '取消',
    handler: () => {
      router.push({ name: 'DataSourceList' })
      innerDrawer.value = false
      emits('handlerCancle')
    }
  },
  {
    type: 'main',
    label: '保存',
    handler: async () => {
      saveSourceData()
    }
  }
])
//关闭抽屉到首页
const close = () => {
  router.push({ name: 'DataSourceList' })
}
//数据库界面-连接测试
const sqlInfoSelf = ref(null)
let isTestLinkAdded = false
let testLinkIndex = -1 // 记录测试连接按钮的索引

watch(
  () => ({ componentId: props.componentId, sqlForm: sqlInfoSelf.value?.sqlForm }),
  (n) => {
    const { componentId } = n
    if (componentId === 'SqlSource' || componentId === 'DaMengSource') {
      if (!isTestLinkAdded) {
        // 添加测试连接按钮
        convertActions.value.splice(1, 0, {
          type: 'main',
          transparent: true,
          label: '测试连接',
          handler: async () => {
            Object.assign(sqlInfoSelf.value.sqlForm, {
              dbType: componentId === 'SqlSource' ? 'MYSQL' : 'DM'
            })
            const sqlParam = { ...sqlInfoSelf.value.sqlForm }
            delete sqlParam.name
            const isValid = await sqlInfoSelf.value.submit(sqlParam)
            if (isValid.valid) {
              const result = await datasourceApi.analyseDbDatasource.send(
                Object.assign({}, { ...sqlParam }, { ssl: sqlInfoSelf.value.sqlForm.ssl ? 1 : 0 })
              )
              if (result) {
                ElMessage.success('测试连接成功！')
                convertActions.value[2].disabled = false
              } else {
                ElMessage.warning('测试连接失败，请重试！')
                if (isTestLinkAdded) {
                  convertActions.value[2].disabled = true
                } else {
                  convertActions.value[2].disabled = false
                }
              }
            } else {
              ElMessage.warning('请输入正确格式')
            }
          }
        })
        convertActions.value[2].disabled = true
        isTestLinkAdded = true
        testLinkIndex = 1 // 记录测试连接按钮的索引
      } else {
        convertActions.value[2].disabled = true
      }
    } else {
      if (isTestLinkAdded && componentId === 'FileSource') {
        convertActions.value[1].disabled = false
        // 移除测试连接按钮
        convertActions.value.splice(testLinkIndex, 1)
        isTestLinkAdded = false
        testLinkIndex = -1
      }
      if (componentId !== 'SqlSource' && componentId !== 'DaMengSource') {
        // 更新保存按钮的 label 和 disabled
        // convertActions.value[1].label = '保存'
        convertActions.value[1].disabled = false
      }
    }
  },
  {
    deep: true
  }
)
</script>
<style lang="scss">
.create-Source-drawer {
  .el-drawer {
    .el-drawer__body {
      .el-container {
        height: 100%;
        .el-aside {
          .el-menu {
            height: 100%;
          }
        }
        .el-main {
          height: 100%;
        }
      }
    }
    .el-drawer__footer {
      .gx-actions {
        justify-content: flex-end;
      }
    }
  }
}
</style>
