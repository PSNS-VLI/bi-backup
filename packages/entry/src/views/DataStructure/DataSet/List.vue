<template>
  <div class="data-set">
    <div class="data-set-card__header">
      <div class="data-set-card__header-title">
        <span class="left-border"></span>
        {{ route.meta.title }}
      </div>
      <div class="data-set-card__header-title__operation">
        <el-input
          v-model="inputList"
          clearable
          :prefix-icon="Search"
          @input="inputListChange"
          :placeholder="dataSetSearchPlaceholder"
        ></el-input>
        <el-button @click="addNewFile">新建文件夹</el-button>
        <el-button type="primary" @click="handleCreateDataSet">新建数据集</el-button>
        <gx-dialog
          v-if="show"
          attach="确定"
          @clickConfirm="clickConfirm"
          @clickCancel="clickCancel"
          edit
        >
          <template #title>{{ showTitle }}文件夹</template>
          <GxForm v-model="formDataDialog" :form="formDialog" ref="formFilterSelf" />
        </gx-dialog>
      </div>
    </div>
    <div class="data-set-card__body">
      <el-table
        v-if="tableLoading"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        lazy
        :load="loadChildren"
        :indent="16 + 8"
        style="width: 100%"
        height="100%"
        ref="elTableSelf"
        :row-class-name="setTableRowClass"
      >
        <template v-for="column in tableColumns" :key="column.prop">
          <el-table-column
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            class-name="class_name"
          />
        </template>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <gx-icon-group :icons="getOperationIcons(row)"></gx-icon-group>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="showDelete" width="500" align-center>
        <span>确定删除“{{ showDeleteRow.name }}”吗</span>
        <!-- showDeleteRow.name?.length > 10
          ? showDeleteRow.name.slice(0, 10) + '...'
          : showDeleteRow.name -->
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showDelete = false">取消</el-button>
            <el-button type="primary" @click="deleteRowData(showDeleteRow)"> 确定 </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <el-drawer v-model="drawer" title="资源移动到" @close="drawerClose">
      <el-input
        v-model="inputSearch"
        :prefix-icon="Search"
        placeholder="搜索"
        @input="inputSearchChange"
      ></el-input>
      <el-tree
        highlight-current
        default-expand-all
        :data="toMoveData"
        :props="defaultProps"
        node-key="id"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div :class="{ 'disabled-text': data.disabled }">
            <span>{{ node.label }}</span>
          </div>
        </template>
      </el-tree>
      <GxActions :actions="drawerAction" :attach="targetId"></GxActions>
    </el-drawer>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import api from '@/api'
import { GxActions, GxDialog, GxForm, GxIconGroup } from '@gxhs/ui'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed, nextTick } from 'vue'

const route = useRoute()
const router = useRouter()
const { datasetApi } = api

const Operation = {
  ReName: 'ReName',
  AddDataSet: 'AddDataSet',
  AddFloder: 'AddFloder',
  Move: 'Move',
  Edit: 'Edit',
  Preview: 'Preview',
  Share: 'Share',
  Delete: 'Delete'
}

const defaultProps = {
  children: 'children',
  label: 'name'
}

const inputList = ref('')
const inputListChange = (val) => {
  loadData(-1, val, (data) => {
    tableLoading.value = false
    nextTick(() => {
      tableLoading.value = true
      tableData.value = data
    })
  })
}
const dataSetCounts = ref(0)
const dataSetSearchPlaceholder = computed(() => {
  return '共' + `${dataSetCounts.value}` + '个文件'
})
const addNewFile = () => {
  formDataDialog.value.folderList = ''
  show.value = true
  showTitle.value = '新建'
}
const handleCreateDataSet = () => {
  router.push({ name: 'DataSetCreate' })
}
//新建文件夹提示框状态
const showTitle = ref('新建')
const show = ref(false)

const formFilterSelf = ref(null)
const formDialog = ref([
  {
    label: '文件夹名称',
    key: 'folderList',
    minlength: '0',
    maxlength: '80',
    'show-word-limit': true,
    rules: [
      {
        validator: (_, val, callback) => {
          if (!val.trim()) {
            callback(new Error('文件夹名称不能为空！'))
            return
          }
          if (val.length > 80) {
            callback(new Error('最大长度为80位！'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ]
  }
])
const formDataDialog = ref({
  folderList: []
})

// 表格配置项
const elTableSelf = ref(null)

const toMoveData = ref([])
const tableData = ref([])
let pid = ''
const tableColumns = [
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'datasourceName',
    label: '数据源'
  },
  {
    prop: 'createBy',
    label: '创建者'
  },
  {
    prop: 'updateTime',
    label: '修改时间'
  }
]

const getOperationIcons = (row) => {
  const operationWrapper = (operationId) => clickOperation(operationId, row)
  const icons =
    row.type === 'FOLDER'
      ? [
          {
            iconClass: 'icon-edit-outline',
            tooltip: '重命名',
            onClick: () => operationWrapper(Operation.ReName)
          },
          {
            iconClass: 'icon-circle-plus-outline',
            tooltip: '新建文件夹',
            children: [
              {
                iconClass: 'icon-chart_box-line',
                title: '新建数据集',
                onClick: () => operationWrapper(Operation.AddDataSet)
              },
              {
                iconClass: 'icon-folder-opened',
                title: '创建文件夹',
                onClick: () => operationWrapper(Operation.AddFloder)
              }
            ]
          },
          {
            iconClass: 'icon-moveTo',
            tooltip: '移动',
            onClick: () => operationWrapper(Operation.Move)
          }
        ]
      : [
          {
            iconClass: 'icon-edit-outline',
            tooltip: '编辑',
            onClick: () => operationWrapper(Operation.Edit)
          },
          {
            iconClass: 'icon-data-trend-index',
            tooltip: '新建应用服务',
            onClick: () => operationWrapper(Operation.Preview)
          },
          {
            iconClass: 'icon-adddashboard',
            tooltip: '新建数据大屏',
            onClick: () => operationWrapper(Operation.Share)
          }
        ]
  const postIcons = [
    {
      iconClass: 'icon-more-horizontal',
      children: [
        {
          iconClass: 'icon-delete',
          title: '删除',
          tooltip: '删除',
          onClick: () => operationWrapper(Operation.Delete)
        },
        {
          iconClass: 'icon-moveTo',
          title: '移动到',
          tooltip: '移动',
          onClick: () => operationWrapper(Operation.Move)
        }
      ]
    }
  ]
  return icons.concat(postIcons)
}

//移动文件夹---不可点击节点
function addDisabledToNode(tree, idToDisable) {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.id === idToDisable) {
      node.disabled = true
      if (node.children) {
        node.children.forEach((element) => {
          element.disabled = true
          addDisabledToNode(node.children, element.id)
        })
      }
    }
    if (node.children) {
      addDisabledToNode(node.children, idToDisable)
    }
  }
}
const loadMoveData = async (id) => {
  const result = await datasetApi.folderList.send()
  const convertRes = [{ ...result }]
  addDisabledToNode(convertRes, id)
  toMoveData.value = convertRes
}

const showDelete = ref(false)
const showDeleteRow = ref(null)
const deleteRowData = async (row) => {
  const result = await datasetApi.remove.send({
    id: row.id
  })
  if (result) {
    showDelete.value = false
    if (result.code === 407) {
      ElMessage.warning(result.msg)
      return
    }
    //加载列表数据
    loadData(-1, '', (data) => {
      tableLoading.value = false
      nextTick(() => {
        tableLoading.value = true
        tableData.value = data
      })
    })
    loadCount()
  }
}
const clickOperation = async (operationId, row) => {
  switch (operationId) {
    case 'ReName':
      showTitle.value = show.value ? '新建' : '编辑'
      show.value = true
      formDataDialog.value.folderList = row.name
      rowId.value = row.id
      break
    case 'AddDataSet':
      router.push({ name: 'DataSetCreate', query: { id: row.id, type: 'FOLDER' } })
      break
    case 'AddFloder':
      pid = row.id
      show.value = true
      showTitle.value = '新建'
      break
    case 'Move':
      currentMoveRow.value = row
      drawer.value = true
      //获取文件夹列表
      loadMoveData(row.id)
      break
    case 'Edit':
      router.push({
        name: 'DataSetUpdate',
        query: { id: row.id, name: row.name, datasourceName: row.datasourceName }
      })
      break
    case 'Delete':
      showDeleteRow.value = row
      showDelete.value = true
      break
    default:
      break
  }
}

const setTableRowClass = (data) => {
  const { row } = data

  return row.type === 'FOLDER' ? 'is_folder' : ''
}
const loadChildren = async (row, treeNode, resolve) => {
  loadData(row.id, '', (data) => {
    resolve(data)
  })
}
const tableLoading = ref(true)
const loadData = async (pid = -1, keywords = '', resolve) => {
  const result = await datasetApi.list.send({
    keywords: keywords || '',
    pid
  })
  if (result) {
    const tableData = result.map((item) => {
      const tableRow = {
        ...item,
        createBy: item.createBy || '-',
        datasourceName: item.datasourceName || '-',
        datasourceType: item.datasourceType || '-',
        hasChildren: item.type === 'FOLDER'
      }
      return tableRow
    })
    resolve(tableData)
  }
}
loadData(-1, '', (data) => {
  tableLoading.value = false
  nextTick(() => {
    tableLoading.value = true
    tableData.value = data
  })
})
//数据集数量
const loadCount = async () => {
  const result = await datasetApi.datasetCount.send({})
  if (result) {
    dataSetCounts.value = result
  }
}
loadCount()

const drawer = ref(false)
const inputSearch = ref('')

const toMoveList = ref([])
const targetId = ref(null) //选择移动目标文件夹
const currentMoveRow = ref(null) //选择移动文件夹
const handleNodeClick = (item) => {
  //选择移动的目标树节点
  targetId.value = item
  toMoveList.value.push(item)
}

const fuzzySearchTree = (tree, searchValue) => {
  const resTree = []
  if (searchValue) {
    ;(tree || []).forEach((node) => {
      if (node.name.indexOf(searchValue) > -1) {
        // 父节点 包含搜索字符串
        let arr = []
        if (node.children && node.children.length > 0) {
          arr = fuzzySearchTree(node.children, searchValue) // 再递归查询子节点是否含有搜索字符串
        }
        resTree.push({ ...node, children: arr })
      } else {
        // 父节点 不包含搜索字符串；则还需向下检查子节点是否含有搜索字符串；
        if (node.children && node.children.length > 0) {
          const arr = fuzzySearchTree(node.children, searchValue)
          if (arr && arr.length > 0) {
            resTree.push({ ...node, children: arr })
          }
        }
      }
    })
  }
  return resTree
}

const inputSearchChange = async (val) => {
  if (val) {
    const searchTreeData = fuzzySearchTree(toMoveData.value, val)
    if (searchTreeData.length > 0) {
      toMoveData.value = searchTreeData
    } else {
      toMoveData.value = [{ pid: -1, name: '根节点' }]
    }
  } else {
    //重新请求文件夹数据
    loadMoveData(currentMoveRow.value.id)
  }
}

const drawerClose = () => {
  inputSearch.value = ''
}
const drawerAction = ref([
  {
    transparent: true,
    label: '取消',
    handler: () => {
      drawer.value = false
    }
  },
  {
    label: '确定',
    disabled: true,
    handler: async () => {
      const result = await datasetApi.move.send({
        id: currentMoveRow.value.id,
        targetId: targetId.value.id ? targetId.value.id : null
      })
      if (result) {
        loadData(-1, '', (data) => {
          tableLoading.value = false
          nextTick(() => {
            tableLoading.value = true
            tableData.value = data
          })
        })
      }

      drawer.value = false
      toMoveList.value = []
    }
  }
])
watch(
  () => toMoveList.value.length,
  (length) => {
    drawerAction.value[1].disabled = length <= 0
  }
)

//dialog确定和取消
const rowId = ref('') //当前操作行id

const clickConfirm = async () => {
  const isValid = await formFilterSelf.value.submit()
  if (!isValid.valid) return
  //添加tableData的文件夹数据行
  const inputValue = formDataDialog.value.folderList
  if (showTitle.value === '新建') {
    //保存文件夹
    const result = await datasetApi.saveFolder.send({
      id: '',
      pid: pid || '',
      name: inputValue
    })
    if (result) {
      if (result.code !== 407) {
        ElMessage.success('创建成功！')
        formDataDialog.value.folderList = ''
        loadData(-1, '', (data) => {
          tableLoading.value = false
          nextTick(() => {
            tableLoading.value = true
            tableData.value = data
          })
        })
        loadCount()
      } else {
        ElMessage.warning(result.msg)
      }
      show.value = false
    }
  } else {
    const result = await datasetApi.renameFolder.send({
      id: rowId.value,
      name: formDataDialog.value.folderList
    })
    if (result) {
      if (result.code !== 407) {
        ElMessage.success('修改成功！')
        loadData(-1, '', (data) => {
          tableLoading.value = false
          nextTick(() => {
            tableLoading.value = true
            tableData.value = data
          })
        })
      } else {
        ElMessage.warning(result.msg)
      }
      show.value = false
    } else {
      show.value = true
    }
  }
}
const clickCancel = () => {
  show.value = false
}
</script>
<style lang="scss" scoped>
@use '@gxhs/ui/GxIcon/style/icon.scss' as *;
.data-set {
  width: 100%;
  height: 100%;
  :deep(.el-drawer) {
    .el-drawer__header {
      margin: 0;
      padding-bottom: size(18);
      border-bottom: size(1) solid rgba(51, 51, 51, 0.25);
    }
    .el-drawer__body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .el-tree {
        height: calc(100% - size(100));
        flex: 1;
        padding: size(16) 0;
      }
      .gx-actions {
        justify-content: flex-end;
      }
    }
  }
  &-card__header {
    display: flex;
    justify-content: space-between;
    &-title {
      @include plain-text;
      font-weight: 500;
      color: $secondary-text-color;
      display: flex;
      align-items: center;
      &__operation {
        display: flex;
        .el-input {
          max-width: size(280);
          margin-right: size(16);
        }
      }
      .left-border {
        display: inline-block;
        width: size(4);
        height: size(16);
        background: $theme-complementary-color;
        border-radius: size(20);
        margin-right: size(8);
      }
    }
  }
  .data-set-card__body {
    height: calc(100% - size(32));
    flex: 1;
    :deep(.el-table) {
      td.el-table__cell,
      th.el-table__cell.is-leaf {
        border-bottom: none;
      }
      th.el-table__cell {
        color: var(--el-text-color-primary);
      }
      .cell {
        height: size(36);
        line-height: size(36);
        padding: 0 size(32);
      }
      [class*='el-table__row--level'] .el-table__expand-icon {
        display: inline-flex;
        width: auto;
        @include iconfont;
        transition: none;
        .el-icon {
          display: none;
        }
        &::before {
          content: '\e648';
          display: inline-block;
          margin-right: size(8);
          transition: transform var(--el-transition-duration-fast) ease-in-out;
        }
        &::after {
          content: '\e686';
        }
      }
      .el-table__expand-icon--expanded {
        transform: none;
        &::before {
          transform: rotate(90deg);
        }
      }
      .el-table__placeholder {
        @include iconfont;
        // double the icon's width and plus the doubled left padding.
        width: size(16 + 8 + 16 + 8);
        &::after {
          content: '\e7e7';
          position: relative;
          right: calc(-100% + size(16 + 8));
        }
      }

      .el-table__row.is_folder {
        .el-table__placeholder {
          &::after {
            content: '\e686';
          }
        }
      }
    }
  }
}

.disabled-text {
  /* 添加表示禁用的样式，如颜色、透明度等 */
  color: #ccc;
  cursor: not-allowed;
}
</style>
