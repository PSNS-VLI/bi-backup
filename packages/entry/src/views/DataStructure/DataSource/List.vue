<template>
  <div class="block-card">
    <div class="block__header">
      <span class="left-border"></span>
      {{ route.meta.title }}
    </div>
    <div class="block__content">
      <div class="block__content-tabs">
        <div class="block__content-tabs__title">
          <div>我的数据源</div>
          <el-input
            v-model="inputList"
            clearable
            :prefix-icon="Search"
            @input="handlerListChange"
            :placeholder="placeholder"
            maxlength="50"
          ></el-input>
        </div>
        <el-tabs
          v-model="tabsDataValue.id"
          tab-position="left"
          @tab-change="() => handlerTabChange(tabsDataValue)"
        >
          <el-tab-pane
            v-for="(tabItem, index) in searchList"
            :key="index"
            :label="tabItem.name"
            :name="tabItem.id"
          >
            <template #label>
              <div class="tabs__name">
                <i :class="['iconfont', tabItem.icon]"></i>
                {{ tabItem.name }}
              </div>
              <div class="tabs__options" v-show="tabItem.edit">
                <i class="iconfont icon-edit-outline" @click.stop="handlerEditorTab(tabItem)"></i>
                <i class="iconfont icon-delete" @click.stop="handlerDeleteTab(tabItem)"></i>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--        右侧tabs展示内容-->
      <!--        探索空间-->
      <div class="block__content-content" v-if="tabsDataValue.type === 'EXPLOR_SPACE'">
        <div class="block__content-content-tabs">
          <GxTabs
            arrangeMode="row"
            v-model:initial="initialFirst"
            :tabsData="tabsDataFirst"
            @changeClick="handlerChangeClick"
          >
            <template #Header>
              <div class="block__content-content-tabs__title">
                <div class="title-order">
                  <el-input
                    v-model="inputListFile"
                    clearable
                    :prefix-icon="Search"
                    @input="inputListFileContent"
                    :placeholder="placeholderFile"
                    v-show="!initialFirst"
                  ></el-input>
                  <el-button type="primary" @click="handleCreateDataSource">新建数据源</el-button>
                </div>
              </div>
            </template>
          </GxTabs>
        </div>

        <!--          上传文件-->
        <div class="tabs__content" v-show="initialFirst === 0">
          <GxTable :table-data="tableDataFile" :tableColumns="tableColumnsFile">
            <template v-slot:areaType="{ row }"
              ><slot>{{ row.areaType }}</slot></template
            >
          </GxTable>
          <div style="display: flex; justify-content: flex-end">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[5, 10, 15, 20]"
              @sizeChange="handlerSizeChange"
              @currentChange="handlerCurrentChange"
            ></el-pagination>
          </div>
        </div>
        <!--          API数据-->
        <div class="tabs__content" v-show="initialFirst === 1">
          <GxTable :table-data="tableDataApi" :tableColumns="tableColumnsApi">
            <template v-slot:lastExecStatus="{ row }">
              <slot>
                {{ row.lastExecStatus }}
                <div class="success-btn" v-if="row.lastExecStatus === 'SUCCESS'">更新成功</div>
                <div class="fall-btn" v-if="row.lastExecStatus === 'FAIL'">更新失败</div>
              </slot>
            </template>
          </GxTable>
          <div style="display: flex; justify-content: flex-end">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[5, 10, 15, 20]"
              @sizeChange="handlerSizeChange"
              @currentChange="handlerCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!--        MySQL数据库内容     -->
      <div
        class="block__content-content mysql-content"
        v-show="tabsDataValue.type === 'MYSQL' || tabsDataValue.type === 'DM'"
      >
        <div class="title-mysql">
          <el-input
            v-model="inputListDb"
            clearable
            :prefix-icon="Search"
            @input="inputListDbContent"
            :placeholder="placeholderSql"
          ></el-input>
          <el-button type="primary" @click="handleCreateDataSource">新建数据源</el-button>
        </div>

        <div class="table-mysql">
          <GxTable :table-data="tableDataMySql" :tableColumns="tableColumnsMySql"> </GxTable>
          <div style="display: flex; justify-content: flex-end">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[5, 10, 15, 20]"
              @sizeChange="handlerSizeChange"
              @currentChange="handlerCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>

      <!--          详情弹出框-->
      <el-dialog v-model="showDetail" :close-on-click-modal="false" modal-class="sql-dialog">
        <template #header>
          <span class="iconfont icon-Line"></span>
          <span>表详情</span>
        </template>
        <div class="detail-content">
          <div class="name">
            <span>表名称：</span>
            <span class="name__content">{{ tableName }}</span>
          </div>
          <div class="desc">
            <span>表描述：</span>
            <span class="name__content">{{ tableDesc }}</span>
          </div>
          <div class="table">
            <GxTable :table-data="tableDetailMySql" :tableColumns="tableColumnsDetailMySql">
            </GxTable>
          </div>
          <div class="btn">
            <GxActions :actions="detailAction"></GxActions>
          </div>
        </div>
      </el-dialog>

      <!-- API数据源更新日志弹出框 -->
      <el-dialog v-model="showLog" modal-class="api-dialog">
        <template #header>
          <span class="iconfont icon-Line"></span>
          <span>查看日志</span>
          <div class="block">
            <el-date-picker
              v-model="valuelog"
              type="daterange"
              :format="'YYYY-MM-DD'"
              :value-format="'YYYY-MM-DD'"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="handlerDateChange"
            />
          </div>
        </template>
        <div class="detail-content">
          <div class="table">
            <GxTable :table-data="tableLog" :tableColumns="tableColumnsLog">
              <template v-slot:lastExecStatus="{ row }">
                <slot>
                  <div class="success-btn" v-if="row.lastExecStatus === 'SUCCESS'">更新成功</div>
                  <div class="fall-btn" v-if="row.lastExecStatus === 'FAIL'">更新失败</div>
                </slot>
              </template>
            </GxTable>
          </div>
          <div style="display: flex; justify-content: flex-end">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[5, 10, 15, 20]"
              @sizeChange="handlerSizeChange"
              @currentChange="handlerCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </el-dialog>
      <GxDialog
        v-if="showDelete"
        title="提示"
        attach="确定"
        @clickConfirm="clickConfirmBack"
        @clickCancel="clickCancelBack"
        :content="content"
      >
      </GxDialog>
    </div>
  </div>
</template>

<script setup>
import { GxActions, GxTabs, GxTable, GxDialog } from '@gxhs/ui'
import { Search } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { formatDataSize } from './useInfoBlock'

const { datasourceApi } = api
const route = useRoute()
const router = useRouter()

const inputListFileContent = async () => {
  //上传文件 模糊搜索
  const result = await datasourceApi.getDataSourceFilePage.send({
    keywords: inputListFile.value,
    currentPage: currentPage.value,
    pageSize: pageSize.value
  })
  tableDataFile.value = result.list.map((item) => {
    return {
      ...item,
      dataSize: formatDataSize(item.dataSize)
    }
  })
  total.value = result.totalElements
}
const inputListDbContent = async () => {
  //数据库 模糊搜索
  const result = await datasourceApi.getDataSourceDbPage.send({
    keywords: inputListDb.value,
    id: tabsDataValue.value.id,
    currentPage: currentPage.value,
    pageSize: pageSize.value
  })
  tableDataMySql.value = result.list
  total.value = result.totalElements
}
const handleCreateDataSource = () => {
  router.push({ name: 'DataSourceCreateSource' })
}
const inputList = ref('')
const inputListFile = ref('')
const inputListDb = ref('')
const tabsDataValue = ref({
  id: 'EXPLOR_SPACE',
  name: '探索空间',
  type: 'EXPLOR_SPACE'
}) //选中tab的标识
const tabsData = ref([
  {
    name: '探索空间',
    id: 'EXPLOR_SPACE',
    type: 'EXPLOR_SPACE',
    icon: 'icon-biaodan',
    edit: false
  }
])
const initialFirst = ref(0)
const tabsDataFirst = [
  {
    label: '上传文件',
    value: 'FILE'
  }
  // {
  //   label: 'API数据',
  //   value: 'API'
  // }
]
const placeholder = computed(() => {
  return `当前页共${tabsData.value.length}个文件`
})
const placeholderFile = computed(() => {
  return `当前页共${tableDataFile.value.length}个文件`
})
const placeholderSql = computed(() => {
  return `当前页共${tableDataMySql.value.length}个文件`
})

const handlerEditorTab = (tabItem) => {
  router.push({
    name: 'DataSourceUpdateSource',
    query: { id: tabItem.id, type: tabItem.type }
  })
}
const tabDeleFlag = ref(false)
const tabDataDele = ref(null)
const handlerDeleteTab = async (tabItem) => {
  tabDeleFlag.value = true
  content.value = '确认删除 ' + tabItem.name
  showDelete.value = true
  tabDataDele.value = tabItem
  // const result = await datasourceApi.deleteDatasource.send({
  //   id: tabItem.id
  // })
  // if (result) {
  //   loadTabsData()
  // }
}

const dataMap = {
  EXPLOR_SPACE: {
    API: 'getDataSourceApiPage',
    FILE: 'getDataSourceFilePage'
  },
  MYSQL: 'getDataSourceDbPage',
  DM: 'getDataSourceDbPage'
}
//分页器配置
const total = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizes = [5, 10, 15, 20]
const handlerSizeChange = (value) => {
  pageSize.value = value
  currentPage.value = 1
  loadData(null, tabsDataValue.value.type)
}
const handlerCurrentChange = async (value) => {
  currentPage.value = value
  loadData(null, tabsDataValue.value.type)
}

const handlerChangeClick = (index) => {
  //切换右侧 tab
  loadData(null, tabsDataValue.value.type, tabsDataFirst[index].value)
}
const loadData = async (name, type, fileOrApi) => {
  //探索空间 源列表
  if (type === 'EXPLOR_SPACE') {
    let fieldsData = []
    if (fileOrApi) {
      fieldsData = await datasourceApi[
        dataMap.EXPLOR_SPACE[tabsDataFirst[initialFirst.value].value]
      ].send({
        keywords: fileOrApi === 'FILE' ? inputListFile.value : '',
        currentPage: currentPage.value,
        pageSize: pageSize.value
      })
    } else {
      fieldsData = await datasourceApi[
        dataMap.EXPLOR_SPACE[tabsDataFirst[initialFirst.value].value]
      ].send({
        keywords: tabsDataFirst[initialFirst.value].value === 'FILE' ? inputListFile.value : '',
        currentPage: currentPage.value,
        pageSize: pageSize.value
      })
    }
    tableDataFile.value = fieldsData.list.map((item) => {
      return {
        ...item,
        dataSize: formatDataSize(item.dataSize)
      }
    })
    tableDataApi.value = fieldsData.list.map((item) => {
      return {
        ...item,
        dataSize: formatDataSize(item.dataSize)
      }
    })
    total.value = fieldsData.totalElements
  } else {
    const fieldsSqlData = await datasourceApi[dataMap[type]].send({
      id: tabsDataValue.value.id,
      keywords: inputListDb.value || '',
      currentPage: currentPage.value,
      pageSize: pageSize.value
    })
    tableDataMySql.value = fieldsSqlData.list
    total.value = fieldsSqlData.totalElements
  }
}
loadData(null, tabsDataValue.value.type)
//我的数据源搜索
const searchList = ref([])
const handlerListChange = (val) => {
  let queryStringArr = val.split('')
  let str = '(.*?)'
  searchList.value = []
  let regStr = str + queryStringArr.join(str) + str
  let reg = RegExp(regStr, 'i')
  tabsData.value.map((item) => {
    if (reg.test(item.name)) {
      searchList.value.push(item)
    }
  })
}
const handlerTabChange = (value) => {
  inputListDb.value = ''
  Object.assign(
    tabsDataValue.value,
    tabsData.value.find((item) => item.id === value.id)
  )
  if (value.type === 'EXPLOR_SPACE') {
    pageSize.value = 10
    loadData(value.name, value.type)
  } else {
    pageSize.value = 10
    loadData(value.name, value.type)
  }
}

//表格列配置
const tableColumnsFile = [
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'lastExecTime',
    label: '最近同步时间'
  },
  {
    prop: 'dataSize',
    label: '大小'
  },
  {
    type: 'operate',
    prop: 'operate',
    label: '操作',
    icon: [
      {
        iconfont: 'iconfont icon-schema',
        handleClick: (row) => {
          router.push({
            name: 'DataSetCreate',
            query: {
              id: row.id,
              name: row.name,
              type: 'FILE'
            }
          })

          if (typeof row.children === 'object') {
            console.log('schema')
          }
        }
      },
      {
        iconfont: 'iconfont icon-setting',
        handleClick: (row, column, index) => {
          router.push({
            name: 'DataSourceUpdateSource',
            query: { id: row.id, type: 'FILE' }
          })
        }
      },
      {
        iconfont: 'iconfont icon-delete',
        handleClick: async (row) => {
          tabDeleFlag.value = false
          content.value = '确认删除 ' + row.name
          rowData.value.idFile = row.id
          showDelete.value = true
        }
      }
    ]
  }
]

// 防抖函数
function debounce(func, delay) {
  let timeoutId

  return function () {
    const context = this
    const args = arguments

    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}
const debouncedHandleInput = debounce(inputList, 2000)
document.addEventListener('DOMContentLoaded', function () {
  const inputElement = document.getElementById('inputElement')
  inputElement.addEventListener('input', debouncedHandleInput)
})

const loadTabsData = async () => {
  const result = await datasourceApi.getDatasourceList.send()
  if (result) {
    const filterItems = result
      .filter((item) => item.type === 'MYSQL' || item.type === 'DM')
      .map((tab) => {
        if (tab.type === 'MYSQL') {
          return Object.assign(tab, { icon: 'icon-shujuku', edit: true })
        } else if (tab.type === 'DM') {
          return Object.assign(tab, {
            icon: 'icon-suyaniconchanpinleibufenzuodaohangbufen84',
            edit: true
          })
        }
      })
    tabsData.value = [
      {
        name: '探索空间',
        id: 'EXPLOR_SPACE',
        type: 'EXPLOR_SPACE',
        icon: 'icon-biaodan',
        edit: false
      }
    ].concat(filterItems)
    searchList.value = tabsData.value
    tabsDataValue.value.id = tabsData.value[0]?.type
  }
}
loadTabsData()

const apiRowData = ref(null)
const loadLog = async (row, timeRange) => {
  const result = await datasourceApi.getApiSyncPage.send({
    id: row.id,
    startTime: timeRange?.startTime || '',
    endTime: timeRange?.endTime || '',
    currentPage: logCurrentPage.value,
    pageSize: logPageSize.value
  })
  logTotal.value = result.totalElements
  tableLog.value = result.list
}
const logTotal = ref(100)
const logCurrentPage = ref(1)
const logPageSize = ref(5)
const timeRange = ref(null)
const handlerDateChange = (val) => {
  timeRange.value = {
    startTime: val ? val[0] + ' 00:00:00' : '',
    endTime: val ? val[1] + ' 23:59:59' : ''
  }
  loadLog(apiRowData.value, timeRange.value)
}

const tableDataFile = ref([])
const rowData = ref({
  idFile: '',
  idApi: ''
})
const tableColumnsApi = [
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'lastExecTime',
    label: '最近同步时间'
  },
  {
    prop: 'lastExecStatus',
    type: 'custom',
    label: '状态'
  },
  {
    prop: 'dataSize',
    label: '大小'
  },
  {
    type: 'operate',
    prop: 'operate',
    label: '操作',
    icon: [
      {
        iconfont: 'iconfont icon-schema',
        handleClick: (row) => {
          router.push({ name: 'DataSetCreate', query: { id: row.id, name: row.name, type: 'API' } })
          if (typeof row.children === 'object') {
            console.log('schema')
          }
        }
      },
      {
        iconfont: 'iconfont icon-kaishi',
        handleClick: async (row, column, index) => {
          const result = await datasourceApi.updateApiData.send({
            id: row.id
          })
          if (result) {
            ElMessage.success('更新成功')
            loadData(null, 'EXPLOR_SPACE', 'API')
          }
        }
      },
      {
        iconfont: 'iconfont icon-edit-outline',
        handleClick: (row, column, index) => {
          //调用删除接口、数据集接口刷新列表数据
          router.push({
            name: 'DataSourceUpdateSource',
            query: { id: row.id, type: 'API' }
          })
        }
      },
      {
        iconfont: 'iconfont icon-more',
        popoverIcon: [
          {
            label: '更新记录',
            handleClick: async (row, column, $index) => {
              apiRowData.value = row
              showLog.value = true
              valuelog.value = ''
              loadLog(row)
            }
          },
          {
            label: '删除',
            handleClick: async (row) => {
              tabDeleFlag.value = false
              content.value = '确认删除 ' + `${row.name}`
              rowData.value.idApi = row.id
              showDelete.value = true
            }
          }
        ]
      }
    ]
  }
]
const tableDataApi = ref([])
const tableColumnsMySql = [
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'description',
    label: '备注'
  },
  {
    type: 'operate',
    prop: 'areaType',
    label: '操作',
    icon: [
      {
        iconfont: 'iconfont icon-schema',
        handleClick: (row) => {
          router.push({
            name: 'DataSetCreate',
            query: { id: row.id, name: row.name, type: tabsDataValue.value.type }
          })
        }
      },
      {
        iconfont: 'iconfont icon-tishi',
        // 请求数据源详情接口
        handleClick: async (row) => {
          showDetail.value = true
          const result = await datasourceApi.getDatasourceDbTableFields.send({
            datasourceId: row.id,
            tableName: row.name
          })
          tableName.value = result.name
          tableDesc.value = result.description
          tableDetailMySql.value = result.fields
        }
      }
    ]
  }
]
const tableDataMySql = ref([
  {
    code: 'MySql1',
    ddType: 'mysql备注1'
  },
  {
    code: 'MySql2',
    ddType: 'mysql备注2'
  }
])

const showDetail = ref(false)
const tableName = ref('')
const tableDesc = ref('')

// 查看日志弹出框
const valuelog = ref('')
const showLog = ref(false)
const showDelete = ref(false)
const tableColumnsLog = [
  {
    prop: 'lastExecTime',
    label: '时间'
  },
  {
    prop: 'lastExecStatus',
    type: 'custom',
    label: '状态'
  },
  {
    prop: 'durationTime',
    label: '耗时(s)'
  },
  {
    prop: 'logInfo',
    label: '日志'
  }
]
const tableLog = ref([])

const tableColumnsDetailMySql = [
  {
    prop: 'name',
    label: '字段名称'
  },
  {
    prop: 'type',
    label: '字段类型'
  },
  {
    prop: 'description',
    label: '字段描述'
  }
]
const tableDetailMySql = ref([
  {
    name: '',
    fieldType: '',
    description: ''
  }
])
const detailAction = [
  {
    type: 'main',
    label: '关闭',
    transparent: true,
    handler: () => {
      showDetail.value = false
      showLog.value = false
      showDelete.value = false
    }
  }
]
//GxDialog确认、取消
const content = ref('')
const clickConfirmBack = async () => {
  showDelete.value = false
  if (tabDeleFlag.value) {
    //tab栏删除
    const result = await datasourceApi.deleteDatasource.send({
      id: tabDataDele.value.id
    })
    if (result) {
      loadTabsData()
      initialFirst.value = 0
      tabsDataValue.value.type = 'EXPLOR_SPACE'
    }
  } else {
    if (rowData.value.idFile) {
      const resultFile = await datasourceApi.deleteDatasource.send({
        id: rowData.value.idFile
      })
      if (resultFile) {
        loadData(null, 'EXPLOR_SPACE', 'FILE')
      }
    } else {
      const resultApi = await datasourceApi.deleteDatasource.send({
        id: rowData.value.idApi
      })
      if (resultApi) {
        loadData(null, 'EXPLOR_SPACE', 'API')
      }
    }
  }
}
const clickCancelBack = () => {
  showDelete.value = false
}
</script>

<style lang="scss" scoped>
.block-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .block__header {
    @include plain-text;
    font-weight: 500;
    color: $secondary-text-color;
    display: flex;
    align-items: center;
    .left-border {
      display: inline-block;
      width: size(4);
      height: size(16);
      background: $theme-complementary-color;
      border-radius: size(20);
    }
  }
  .block__content {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: calc(100% - 24px);
    &-tabs {
      min-width: 0;
      border-right: size(1) solid $input-border-color;
      &__title {
        width: size(520);
        @include plain-text;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 size(16) size(8) size(16);
        div {
          flex: 1;
        }
      }
      :deep(.el-tabs) {
        display: flex;
        .el-tabs__nav-wrap::after {
          background-color: unset;
        }
        .el-tabs__header {
          flex: 1;
          &.is-left {
            margin-right: 0;
          }
          .el-tabs__nav-wrap {
            .el-tabs__nav-scroll {
              .el-tabs__item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: size(520);
                height: size(54);
                padding: size(16) size(24);
                &:hover,
                &:active {
                  background: #f5f7fa;
                }
                &:hover .tabs__options {
                  visibility: initial;
                }
                &.is-left.is-active {
                  background: #f5f7fa;
                }
              }
            }
          }
          .tabs__name,
          .tabs__options {
            display: flex;
            gap: 8px;
          }
          .tabs__options {
            visibility: hidden;
          }
        }
      }
    }
    &-content {
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      &-tabs {
        &__title {
          order: 1;
          flex: 1;
          .title-order {
            display: flex;
            justify-content: flex-end;
            gap: size(8);
            .el-input {
              max-width: size(242);
            }
          }
        }
      }
      .tabs__content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100% - size(40));
        .table-list {
          height: calc(100% - size(40));
          .success-btn {
            color: #67c23a;
          }
          .fall-btn {
            color: #f56c6c;
          }
        }
      }
      &.mysql-content {
        gap: size(8);
        .title-mysql {
          display: flex;
          justify-content: flex-end;
          gap: size(8);
          .el-input {
            max-width: size(242);
          }
        }
        .table-mysql {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          justify-content: flex-end;
          overflow: auto;
          .table-list {
            flex: 1;
            height: calc(100% - size(56));
          }
        }

        :deep(.el-dialog) {
          height: size(708);
          .el-dialog__header {
            .iconfont {
              color: $main-button-color;
            }
            span {
              @include plain-text;
            }
          }
          .el-dialog__body {
            padding-top: 0;
            padding-bottom: 0;
            height: calc(100% - size(113));
          }
          .el-dialog__footer {
            display: flex;
            justify-content: flex-end;
          }
          .detail-content {
            @include plain-text;
            width: size(960);
            height: size(800);
            .name,
            .desc {
              color: $secondary-text-color;
            }
            .name__content {
              color: #606266;
            }
            .desc {
              padding: size(16) 0;
            }
            .table {
              height: size(638);
              overflow: auto;
            }
          }
        }
      }
    }
  }
}
//api弹出框
:deep(.api-dialog) {
  .el-dialog {
    max-width: size(960);
    height: size(800);
    .el-dialog__body {
      height: calc(100% - size(53));
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .detail-content {
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;
        .table {
          height: calc(100% - 32px);
          .success-btn {
            color: #67c23a;
          }
          .fall-btn {
            color: #f56c6c;
          }
        }
      }
    }
  }
}
//sql详情
:deep(.sql-dialog) {
  .el-dialog {
    max-width: size(960);
    height: size(730);
    padding: size(16);
    .el-dialog__body {
      height: calc(100% - size(44));
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .detail-content {
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;
        gap: size(16);
        .table {
          height: calc(100% - 44px);
          overflow: auto;
          .success-btn {
            color: #67c23a;
          }
          .fall-btn {
            color: #f56c6c;
          }
        }
        .btn {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
:deep(.gx-dialog) {
  .gx-dialog__content {
    @include plain-text;
    justify-content: flex-start;
    line-height: 22px;
    color: #606266;
  }
}
</style>
