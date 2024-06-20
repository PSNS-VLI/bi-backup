<template>
  <div class="sql-create">
    <div class="header">
      <div class="header-name">
        <span class="iconfont"> SQL</span>
        <el-input v-model="SQLTitle"> </el-input>
      </div>
      <div class="header-option">
        <GxActions :actions="actions"></GxActions>

        <template v-if="!showPopconfirm">
          <i class="iconfont icon-close" @click="handlerCloseSqlDrawer"></i>
        </template>
        <template v-else>
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="Are you sure to delete this?"
            @confirm="confirmEvent"
            @cancel="cancelEvent"
          >
            <template #reference>
              <div>
                <i class="iconfont icon-close" @click="handlerCloseSqlDrawer"></i>
              </div>
            </template>
          </el-popconfirm>
        </template>
      </div>
    </div>
    <div class="body">
      <!--    左侧抽屉-->
      <!-- 关闭后 -->
      <div
        v-if="!drawer"
        style="
          width: 20px;
          margin: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <i class="iconfont icon-duiji1" @click="handlerDrawerIsShow"></i>
        <p>数据表</p>
      </div>
      <div class="drawer" v-show="drawer">
        <div class="drawer-header">
          <span>数据表</span>
          <i class="iconfont icon-duiji1" @click="handlerDrawerIsShow"></i>
        </div>
        <div class="drawer-title">
          <div class="title">当前数据源</div>
          <div class="sql" v-if="isSqlSource">
            <span class="sql-title">{{ showCheckedSql || props.sqlSource.name }}</span>
            <span class="sql-option" @click="handlerChange" v-if="!dragItems.length > 0">切换</span>
          </div>
        </div>
        <div class="drawer-tab">
          <GxTabs
            arrangeMode="row"
            v-model:initial="initial"
            :tabsData="showTabsData"
            itemHeight="38px"
            item-width="56px"
            @changeClick="handlerTabChange"
          >
          </GxTabs>
          <!--        tab栏搜索框-->
          <div class="drawer-tab-search">
            <el-input
              v-model="dataSourceKey"
              placeholder="搜索数据表/文件"
              @input="dataSourceKeyChange"
            >
              <template #prefix>
                <i class="iconfont icon-search"></i>
              </template>
              <template #suffix>
                <span class="iconfont icon-refresh-right" @click="handleSuffixIconClick"></span>
              </template>
            </el-input>
          </div>
          <div class="file-list" v-show="initial === 0">
            <ul class="file-lists" v-if="fieldsList.length > 0">
              <li v-for="(item, index) in fieldsList" :key="item">
                <el-tooltip
                  effect="dark"
                  :content="item.name"
                  placement="right-end"
                  hide-after="0"
                  offset="60"
                >
                  <div class="li-name" @dblclick="handleDbClickNode(item, index)">
                    <span class="iconfont icon-biaoge"></span>
                    <span>{{ item.name }}</span>
                  </div>
                </el-tooltip>

                <div class="li-option">
                  <span class="iconfont icon-copy-document" @click="handlerCopy(item)"></span>
                  <el-popover
                    placement="right"
                    :width="400"
                    trigger="click"
                    @before-enter="handlerPopover(item)"
                  >
                    <template #reference>
                      <span class="iconfont icon-QuestionCircle"></span>
                    </template>
                    <div>{{ item.name }}</div>
                    <div>{{ item.description || '无相关描述' }}</div>
                    <div>{{ item.databaseName }}</div>

                    <el-table height="268px" :data="popoverData" :show-header="false">
                      <el-table-column
                        v-for="columnItem in popoverColumn"
                        :key="columnItem.prop"
                        :label="columnItem.name"
                        :prop="columnItem.prop"
                      >
                      </el-table-column>
                    </el-table>
                  </el-popover>
                </div>
              </li>
            </ul>
            <template v-else>
              <span class="hint">暂无数据</span>
            </template>
          </div>
        </div>
      </div>
      <!-- 切换数据源弹框 -->
      <el-dialog
        v-model="sqlSourceChange"
        :close-on-click-modal="false"
        :show-close="false"
        width="500"
      >
        <template #header>
          <div class="change-source">
            <span>切换数据源</span>
            <el-input
              v-model="searchKey"
              style="width: 200px"
              placeholder="搜索数据源"
              @input="searchDataSource"
            >
              <template #prefix>
                <i class="iconfont icon-search"></i>
              </template>
            </el-input>
          </div>
        </template>
        <ul class="content-source">
          <li
            v-for="item in allDataSource"
            :key="item.id"
            @click="checkedSql = item"
            :class="{ isChecked: item.name === checkedSql.name }"
          >
            <span>
              {{ item.name + ' (' + `${item.type}` + ')' }}
            </span>
            <span
              class="iconfont"
              :class="[{ 'icon-check': item.name === checkedSql.name }]"
            ></span>
          </li>
        </ul>
        <template #footer>
          <el-button @click="sqlSourceChange = false">取消</el-button>
          <el-button type="primary" @click="sqlSourceConfirm(checkedSql)">确定</el-button>
        </template>
      </el-dialog>
      <!--    右侧内容-->
      <div class="drag-table" :class="{ 'open-left-drawer': drawer, 'close-left-drawer': !drawer }">
        <div class="drag">
          <monaco-editor
            :code="code"
            @update:code="updateCode"
            @editor-instance-ready="handlerInstanceReady"
          ></monaco-editor>
        </div>
        <div class="table">
          <div class="table-tab">
            <GxTabs
              arrangeMode="row"
              v-model:initial="dragTableInitial"
              :tabsData="tabsTableData"
              @change-click="handlerTabChange"
            >
              <template #Header>
                <div class="table-tab__title">
                  <el-input
                    v-model="fieldList"
                    clearable
                    placeholder="请输入字段名称或物理字段"
                    v-if="dragTableInitial === 0"
                    @input="searchKeyChange"
                  >
                    <template #prefix>
                      <i class="iconfont icon-search"></i>
                    </template>
                  </el-input>
                </div>
              </template>
            </GxTabs>
          </div>
          <!--        运行结果-->
          <div class="preview" v-show="dragTableInitial === 0">
            <template v-if="runFlag">
              <div class="fail" :class="{ active: resultFlag === false }" v-if="!resultFlag">
                <el-result icon="error" title="运行失败" sub-title="SQL存在错误,请修改代码">
                  <template #extra>
                    <div class="extra">
                      <div class="extra__top">
                        <span class="fail-title">报错详情</span>
                        <span class="dup-title" @click="handlerCopyDetail(resultDetail)"
                          >复制详情</span
                        >
                      </div>
                      <div class="extra__bottom">{{ resultDetail }}</div>
                    </div>
                  </template>
                </el-result>
              </div>
              <div class="success" :class="{ active: resultFlag === true }" v-else>
                <GxTable
                  :table-columns="resultTableColumns"
                  :table-data="resultTableData"
                ></GxTable>
              </div>
            </template>
            <template v-else>
              <span class="preview__tips">编辑完代码后，点击上方 运行 按钮即可查看运行结果</span>
            </template>
          </div>
          <!--        历史记录-->
          <div class="batch" v-show="dragTableInitial === 1">
            <div class="batch-table">
              <GxTable
                :table-columns="historyTableColumns"
                :table-data="historyTableData"
                ref="elTableSelf"
              ></GxTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { GxActions, GxTabs, GxTable } from '@gxhs/ui'
import { defineProps, defineEmits, computed, watch, ref } from 'vue'
import MonacoEditor from '@/views/DataStructure/DataSet/blocks/MonacoEditor.vue'
import { decrypt, encrypt } from '@/utils/ebcrypt'
import { format } from 'sql-formatter'
import api from '@/api'
const { datasourceApi, datasetApi } = api
const props = defineProps({
  sqlDrawer: {
    type: Boolean,
    default: false
  },
  sqlList: {
    type: Array
  },
  sqlSource: {
    type: Object
  },
  dragItems: {
    type: Array
  },
  sqlDetail: {
    type: Object
  }
})
const datasource = ref({}) //当前数据源
const fieldsList = ref(props.sqlList)
watch(
  () => props.sqlSource,
  (n, _) => {
    datasource.value = n
  }
)

const dataSourceKey = ref('') //搜索
let copyFieldsList = JSON.parse(JSON.stringify(props.sqlList))
const dataSourceKeyChange = (val) => {
  if (val) {
    fieldsList.value = copyFieldsList.filter((item) => item.name.includes(val))
  } else {
    fieldsList.value = copyFieldsList
  }
}

const emit = defineEmits(['update:sqlDrawer', 'handlerAddItems', 'drawerSqlClose'])
const sqlDrawer = computed({
  get: () => props.sqlDrawer,
  set: (val) => emit('update:sqlDrawer', val)
})
const dragItems = computed(() => {
  return props.dragItems
})

//编辑器
let editorInstances = null
const handlerInstanceReady = (editorInstance) => {
  editorInstances = editorInstance
}

const code = ref(props.sqlDetail?.tableSql ?? '') //编辑器的值
const updateCode = (val) => {
  code.value = val
  editorInstances.setValue(code.value)
}

//抽屉

const resultFlag = ref(true) //运行结果
const resultDetail = ref('')
const resultTableColumns = ref([])
const resultTableData = ref([])
const SQLTitle = ref(props.sqlDetail?.name ?? '未命名数据集')

const previewFields = ref([]) //sql 创建表的字段
const runFlag = ref(false) //运行标志
const confirmFlag = ref(false)
const showPopconfirm = ref(false) //气泡确认框标志

const actions = [
  {
    type: 'normal',
    transparent: true,
    prefix: 'Calendar',
    label: '格式化',
    auto: true,
    flow: true,
    handler: () => {
      // 拿到子组件的编辑器实例，获取值后格式化
      updateCode(format(editorInstances.getValue()))
    }
  },
  {
    type: 'normal',
    prefix: 'kaishi',
    label: '运行',
    auto: true,
    flow: true,
    handler: async () => {
      runFlag.value = true
      if (!editorInstances.getValue()) {
        ElMessage.error('自定义SQL不能为空！')
      } else {
        confirmFlag.value = true
        //sql加密
        const resolve = await datasetApi.previewSql.send({
          datasourceId: checkedSql.value.id,
          sql: encrypt(editorInstances.getValue()).replaceAll(/[\r\n]/g, '')
        })
        if (resolve.code === 407) {
          resultDetail.value = resolve.msg
          resultFlag.value = false
          ElMessage.error(resolve.msg)
        } else {
          resultFlag.value = true
          //动态表格
          resultTableColumns.value = resolve.fields.map((item) => ({
            prop: item.name,
            label: item.name
          }))
          resultTableData.value = resolve.data
          previewFields.value = resolve.fields
          resultColumns = JSON.parse(JSON.stringify(resultTableColumns.value))
        }
      }
    }
  },
  {
    type: 'normal',
    label: '确认编辑',
    auto: true,
    flow: true,
    handler: async () => {
      runFlag.value = true
      if (!editorInstances.getValue()) {
        ElMessage.error('自定义SQL不能为空 ！')
      } else {
        confirmFlag.value = true
        const resolve = await datasetApi.previewSql.send({
          datasourceId: checkedSql.value.id,
          sql: encrypt(editorInstances.getValue()).replaceAll(/[\r\n]/g, '')
        })
        if (resolve.code === 407) {
          resultDetail.value = resolve.msg
          resultFlag.value = false
          ElMessage.error(resolve.msg)
        } else {
          resultFlag.value = true
          //动态表格
          resultTableColumns.value = resolve.fields.map((item) => ({
            prop: item.name,
            label: item.name
          }))
          resultTableData.value = resolve.data
          previewFields.value = resolve.fields
          ElMessage.success('自定义SQL成功 !')
          resultColumns = JSON.parse(JSON.stringify(resultTableColumns.value))
        }
      }
    }
  }
]
const handlerCopyDetail = async (event) => {
  await navigator.clipboard.writeText(event)
  ElMessage.success('已复制到剪切板！')
}
// 左侧展示
const drawer = ref(true)
const handlerDrawerIsShow = () => {
  drawer.value = !drawer.value
}
//切换数据源
const sqlSourceChange = ref(false)
const allDataSource = ref([])
const checkedSql = ref(props.sqlSource)
const showCheckedSql = ref('')
const searchKey = ref('')
const handlerChange = async () => {
  sqlSourceChange.value = true
  //请求所有数据源
  const result = await datasourceApi.getDatasourceList.send()
  if (result) {
    allDataSource.value = result.filter((item) => item.type === 'MYSQL' || item.type === 'DM')
  }
}

const searchDataSource = async (val) => {
  const result = await datasourceApi.getDatasourceList.send()
  const allSource = result.filter((item) => item.type === 'MYSQL' || item.type === 'DM')
  allDataSource.value = allSource.filter((item) => item.name.includes(val))
}

const sqlTypeMap = {
  MYSQL: 'getDataSourceDbPage',
  DM: 'getDataSourceDbPage'
}
const sqlSourceConfirm = async (item) => {
  sqlSourceChange.value = false
  showCheckedSql.value = item.name
  if (props.sqlSource.name !== checkedSql.value.name) {
    //更新切换后的列表
    dataSourceKey.value = '' //搜索框清空
    const result = await datasourceApi[sqlTypeMap[checkedSql.value.type]].send({
      id: checkedSql.value.id,
      keywords: dataSourceKey.value,
      currentPage: 1,
      pageSize: 100
    })
    if (result) {
      fieldsList.value = result.list
      copyFieldsList = JSON.parse(JSON.stringify(result.list))
    }
  }
}

const handleDbClickNode = async (item, index) => {
  //双击左侧栏中的表
  const result = await datasourceApi.getDatasourceDbTableFields.send({
    datasourceId: item.id,
    tableName: item.name
  })
  const tableName = result.databaseName + '.' + fieldsList.value[index].name
  if (tableName) {
    const currentContent = editorInstances.getValue()
    const newContent = currentContent ? currentContent + tableName : tableName
    updateCode(newContent)
  }
}

const isSqlSource = ref(true)

const initial = ref(0)
const tabsData = [
  {
    label: '数据表',
    value: 'EXPLOR_SPACE1'
  },
  {
    label: '上传文件',
    value: 'EXPLOR_SPACE'
  },
  {
    label: 'API数据',
    value: 'MYSQL_DATABASE'
  }
]

const showTabsData = computed(() => {
  if (isSqlSource.value) {
    return tabsData.slice(0, 1) // 返回第一个对象
  } else {
    content = '上传文件'
    return tabsData.slice(1) // 去掉第一个对象
  }
})

const handleSuffixIconClick = async () => {
  dataSourceKey.value = ''
  const result = await datasourceApi.getDataSourceDbPage.send({
    keywords: dataSourceKey.value,
    id: checkedSql.value.id,
    currentPage: 1,
    pageSize: 100
  })
  if (result) {
    fieldsList.value = result.list
  }
}

const handlerCopy = async (item) => {
  await navigator.clipboard.writeText(item.name)
  ElMessage.success('成功复制文本到剪切板')
}
const popoverData = ref([
  {
    name: '',
    description: ''
  }
])
const popoverColumn = [
  {
    prop: 'name',
    label: '物理字段名'
  },
  {
    prop: 'description',
    label: '描述'
  }
]
const handlerPopover = async (item) => {
  const result = await datasourceApi.getDatasourceDbTableFields.send({
    datasourceId: item.id,
    tableName: item.name
  })
  popoverData.value = result.fields.map((item) => ({
    name: item.name,
    description: item.description
  }))
}

const dragTableInitial = ref(0)
const tabsTableData = [
  {
    label: '运行结果',
    value: 'EXPLOR_SPACE'
  },
  {
    label: '历史记录',
    value: 'MYSQL_DATABASE'
  }
]
const handlerTabChange = async (initial) => {
  if (initial === 1) {
    const result = await datasetApi.getSqlHistoryList.send({
      datasourceId: props.sqlSource.id,
      datasetId: ''
    })
    historyTableData.value = result.map((item) => Object.assign(item, { info: decrypt(item.info) }))
  }
}
//搜索列
let resultColumns = []
const searchKeyChange = (val) => {
  if (val) {
    resultTableColumns.value = resultColumns.filter((item) => item.prop.includes(val))
  } else {
    resultTableColumns.value = resultColumns
  }
}

//历史记录
const historyTableColumns = [
  {
    prop: 'createTime',
    label: '开始时间'
  },
  {
    prop: 'info',
    label: 'SQL语句'
  },
  {
    prop: 'durationTime',
    label: '耗时(ms)'
  },
  {
    prop: 'status',
    label: '运行结果'
  },
  {
    type: 'operation',
    prop: 'analyseaaa',
    label: '操作',
    actions: () => {
      return [
        {
          label: '复制',
          handler: (action, attach) => {
            handlerCopyDetail(attach.row.info)
          }
        }
      ]
    }
  }
]
const historyTableData = ref([])

const fieldList = ref('')

const sqlData = ref({})

const handlerCloseSqlDrawer = () => {
  if (runFlag.value === false && confirmFlag.value === false) {
    if (!editorInstances.getValue()) {
      sqlDrawer.value = false
    } else {
      showPopconfirm.value = true
    }
  } else {
    sqlDrawer.value = false
    const collectNames = (node, names = []) => {
      if (node?.name) {
        names.push(node.name)
      }
      if (node?.children) {
        for (const child of node.children) {
          collectNames(child, names)
        }
      }
      return names
    }
    const treeNames = collectNames(dragItems.value[0])
    const findUniqueName = (names, baseName) => {
      let counter = 1
      let uniqueName = baseName
      const nameMap = {}
      if (names.length === 0 || !names.includes(baseName)) {
        return uniqueName
      }
      // 哈希表来记录每个名字出现的次数
      names.forEach((name) => {
        if (nameMap[name]) {
          nameMap[name]++
        } else {
          nameMap[name] = 1
        }
      })
      // 检查名字及其递增名字是否存在
      while (nameMap[uniqueName]) {
        uniqueName = `${baseName}${counter++}`
      }
      return uniqueName
    }
    const uniqueSQLName = findUniqueName(treeNames, SQLTitle.value)

    Object.assign(
      sqlData.value,
      {
        SQLTitle: uniqueSQLName,
        tableSql: editorInstances.getValue(),
        fields: previewFields.value,
        id: props.sqlSource.id
      },
      {
        datasetTableName: uniqueSQLName,
        datasetTableOriginName: uniqueSQLName
      }
    )
    emit('handlerAddItems', sqlData.value, checkedSql.value)
  }
}
const confirmEvent = () => {
  sqlDrawer.value = false
  emit('drawerSqlClose')
}
const cancelEvent = () => {
  console.log('取消了')
}
</script>
<style lang="scss" scoped>
.sql-create {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: size(16);
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    &-name {
      display: flex;
      align-items: center;
      gap: size(8);
      .iconfont {
        color: $theme-text-color;
      }
      .el-input {
        width: size(300);
      }
    }
    &-option {
      display: flex;
      gap: size(16);
      justify-content: center;
      align-items: center;
      .iconfont.icon-close {
        font-size: size(16);
        &:hover {
          cursor: pointer;
        }
      }
      .gx-actions .gx-actions-item:nth-child(4)::before {
        content: '';
        top: 0;
        bottom: 0;
        width: size(1);
        height: size(30);
        margin-left: size(10);
        margin-right: size(30);
        background: rgba(51, 51, 51, 0.27);
      }
    }
  }
  .body {
    width: 100%;
    height: calc(100% - size(42));
    background: #f5f7fa;
    display: flex;
    border: size(1) solid #dcdfe6;
    .change-source {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .content-source {
      list-style: none;
      max-height: 150px;
      overflow: auto;
      padding-left: size(8);
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        padding-left: size(8);
        &.isChecked {
          background: #f5f7fa;
        }
        cursor: pointer;
        user-select: none;
        &:hover {
          background: #f5f7fa;
        }
      }
    }
    .drawer {
      width: size(320);
      height: 100%;
      background: #f5f7fa;
      padding: size(16);
      .drawer-header {
        display: flex;
        justify-content: space-between;
      }

      &-title {
        min-height: size(65);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        //sql创建表
        .sql {
          display: flex;
          align-items: center;
          &-title {
            max-width: size(150);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &-option {
            color: $theme-text-color;
            margin-left: size(4);
            &:hover {
              cursor: pointer;
            }
          }
        }
        .title {
          @include plain-text;
          color: #909399;
        }
      }
      &-tab {
        //sql创建表
        height: calc(100% - size(80));
        .gx-tabs {
          border-bottom: 1px solid #dcdfe6;
        }
        :deep(.gx-tabs__item) {
          padding: 0;
          .title__name {
            padding: 0;
          }
        }
        &-search {
          //搜索框
          :deep(.el-input__wrapper) {
            box-shadow: unset;
            background: transparent;
            border-radius: 0;
            border-bottom: 1px solid #dcdfe6;
          }
          &:hover {
            cursor: pointer;
          }
          .icon-refresh-right {
            cursor: pointer;
            &:hover {
              color: $theme-text-color;
            }
          }
        }
        .file-list {
          display: flex;
          flex: 1;
          height: calc(100% - size(62));
          padding-bottom: size(8);
          &s {
            flex: 1;
            padding-left: 0;
            overflow-y: auto;
            &::-webkit-scrollbar {
              display: none;
            }
            li {
              list-style: none;
              display: flex;
              min-width: size(288);
              justify-content: space-between;
              padding: size(6) 0;
              cursor: pointer;
              user-select: none;
              .li-name {
                flex: 1;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                span:first-child {
                  padding-right: size(8);
                }
                span:last-child {
                  display: inline;
                }
              }
              .li-option {
                display: none;
                span:first-child {
                  padding-right: size(8);
                }
                span:hover {
                  color: $theme-text-color;
                  cursor: pointer;
                }
              }
              &:hover .li-option {
                display: block;
              }
              &:hover {
                background: rgba(51, 51, 51, 0.14);
              }
            }
          }
          .hint {
            width: 100%;
            text-align: center;
            padding-top: size(20);
            color: #777;
          }
        }
      }
    }
    .drag-table {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      &.open-left-drawer {
        max-width: calc(100% - size(320));
      }
      &.close-left-drawer {
        max-width: calc(100% - size(40));
      }
      .drag {
        height: 40%;
        background: #e6e8eb;
        &-content {
          // width: 100%;
          height: 100%;
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
        }

        .el-drawer__header {
          margin-bottom: 0;
        }
        .relate {
          display: flex;
          flex: 1;
          flex-direction: column;
          &-table {
            min-width: size(372);
            min-height: size(550);
            border-top: size(1) solid $input-border-color;
            border-bottom: size(1) solid $input-border-color;
            padding: size(16) 0;
            display: flex;
            flex: 1;
            gap: size(16);
            &__left {
              @include plain-text;
              display: flex;
              flex-direction: column;
              flex: 1;
              gap: size(16);
              .title {
                display: block;
              }
              .filter {
                padding: size(16) 0;
                color: #606266;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .el-input {
                  width: size(178);
                  height: size(29);
                }
              }
              // .table {
              //   height: size(460);
              // }
            }
          }
          &-fields {
            min-height: size(550);
            border-top: size(1) solid $input-border-color;
            border-bottom: size(1) solid $input-border-color;
            padding: size(16) 0;
            margin-bottom: size(16);
            display: flex;
            flex-direction: column;
            gap: size(16);
            .filter {
              min-height: size(32);
              display: flex;
              justify-content: space-between;
              .header-left {
                display: block;
              }
              .header-right {
                display: flex;
                gap: size(16);
                justify-content: flex-end;
              }
            }
            // .table {
            //   height: size(480);
            //   overflow-y: hidden;
            // }
          }
          .close {
            display: flex;
            justify-content: flex-end;
          }
        }
      }
      .table {
        width: 100%;
        height: 60%;
        background: $dialog-color;
        border-radius: 0px 0px 4px 0px;
        border: 1px solid #dcdfe6;
        flex: 1;
        &-tab {
          border-radius: size(0);
          border-bottom: size(1) solid #dcdfe6;
          background: #f5f7fa;
        }
        .table-tab__title {
          order: 1;
          display: flex;
          flex: 1;
          justify-content: flex-end;
          align-items: center;
          margin-right: size(10);
          .el-input {
            max-width: size(242);
            max-height: size(30);
            margin-right: size(16);
          }
        }
        .preview {
          width: 100%;
          overflow: auto;
          flex: 1;
          height: calc(100% - size(50));
          display: flex;
          position: relative;
          &::-webkit-scrollbar {
            /*高宽分别对应横竖滚动条的尺寸*/
            width: size(6);
            height: size(6);
          }

          /*滚动条里面小方块*/
          &::-webkit-scrollbar-thumb {
            border-radius: size(10);
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
            background: #ededed;
          }
          :deep(.el-tabs__header) {
            width: 100%;
            margin-right: 0;
          }

          &__tips {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #909399;
          }
          &-tree {
            min-width: size(264);
            border-right: size(1) solid $input-border-color;
            overflow: auto;
            &::-webkit-scrollbar {
              //树结构滚动条
              display: none;
            }
            .el-tree {
              height: 100%;
            }
          }
          &-table {
            width: 100%;
            height: 100%;
            overflow: auto;
            flex: 1;
            .action {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .el-table {
              width: 100%;
              height: 100%;
              .el-table__body-wrapper {
                height: calc(100% - 126px);
                overflow: auto;
              }
            }
            .text {
              display: inline-block;
              width: 200px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .fail {
            margin: 0 auto;
            display: none;
            &.active {
              display: block;
            }
            .el-result__extra {
              margin-top: unset;
              .extra {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: size(600);
                height: size(300);
                gap: size(8);
                &__top {
                  display: flex;
                  justify-content: space-between;
                  .fail-title {
                    color: #909399;
                  }
                  .dup-title {
                    color: $theme-text-color;
                    &:hover {
                      cursor: pointer;
                    }
                  }
                  span {
                    display: inline-flex;
                  }
                }
                &__bottom {
                  @include regular-text;
                  color: #606266;
                  max-height: size(300);
                  overflow: auto;
                  border: size(1) solid #fcd3d3;
                  background: #fef0f0;
                  flex: 1;
                }
              }
            }
          }
          .success {
            flex: 1;
            display: none;
            &.active {
              display: block;
              min-width: 0;
            }
          }
        }
        .batch {
          height: calc(100% - size(40));
          &-table {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
