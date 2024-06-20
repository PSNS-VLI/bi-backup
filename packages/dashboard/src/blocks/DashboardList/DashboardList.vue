<template>
  <div class="bi-dashboard-list">
    <div class="bi-dashboard-list__header">
      <div class="bi-dashboard-list__title">
        <!-- icon "line" has extra padding. -->
        <!-- <span class="iconfont icon-Line"></span> -->
        <span class="bi-dashboard-list__title-icon"></span>
        <span class="bi-dashboard-list__title-text">{{ title }}</span>
      </div>
      <div class="bi-dashboard-list__actions">
        <el-input placeholder="全局搜索应用服务" v-model="searchInput">
          <template #prefix>
            <span class="iconfont icon-search"></span>
          </template>
        </el-input>
        <el-button @click="createFolderDialog.visible = true">新建文件夹</el-button>
        <el-button type="primary" @click="() => openDashboardPage()">新建应用服务</el-button>
      </div>
    </div>
    <div class="bi-dashboard-list__body">
      <el-scrollbar>
        <!-- TODO stylesheet's unit about size are based "rem" 
        which javascript don't support, so now need shims to resove this. -->
        <el-table
          v-if="!tableDataLoading"
          v-model:data="tableData"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          lazy
          :load="loadTableChildren"
          :indent="16 + 8"
          style="width: 100%"
          height="100%"
          :row-class-name="setTableRowClass"
        >
          <template v-for="column in tableColumns" :key="column.prop">
            <el-table-column :prop="column.prop" :label="column.label" :width="column.width" />
          </template>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <gx-icon-group :icons="getOperationIcons(row)"></gx-icon-group>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <div class="bi-dashboard-list__popup">
      <!-- create folder -->
      <el-dialog
        v-model="createFolderDialog.visible"
        title="Tips"
        width="500"
        @close="handleCreateFolderClose"
      >
        <template #title> 编辑文件夹 </template>
        <el-form ref="createFolderDialogFormSelf" :model="createFolderDialog">
          <el-form-item prop="folderName" label="文件夹名称" required>
            <el-input
              v-model="createFolderDialog.folderName"
              placeholder="请输入文件夹名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeCreateFolderDialog">取消</el-button>
            <el-button type="primary" @click="handleCreateFolderConfirm"> 确定 </el-button>
          </div>
        </template>
      </el-dialog>
      <!-- move folder -->
      <el-drawer v-model="moveFolderDrawer.visible" @close="handleMoveFolderClose">
        <template #header>
          <h4>移动至</h4>
        </template>
        <template #default>
          <el-tree
            :data="folderTreeDataFiltered"
            default-expand-all
            node-key="id"
            :current-node-key="moveFolderDrawer.targetId"
            :props="{
              label: 'name'
            }"
            @node-click="(data: FolderTree) => (moveFolderDrawer.targetId = data.id)"
          ></el-tree>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="closeMoveFolderDrawer()">取消</el-button>
            <el-button type="primary" @click="handleMoveFolderConfirm()">确定</el-button>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElMessage } from 'element-plus'

import { type GxIconGroupItem, GxIconGroup } from '@gxhs/ui'

import { DashboardApi } from '../../components/DashboardInterface'
import { useDashboardStore } from '../../store'
import { DashboardStatus, DashboardType } from '../../types/app/dashboard'
import { debounce, boolArray, copyText } from '../../utils'

import type { DashboardListProps, ColumnProps, RowData } from './types'
import { DashboardBlockName } from '../'

const enum Operation {
  Edit,
  AddDashboard,
  AddFloder,
  Move,
  Preview,
  Share,
  Delete,
  Offline
}

withDefaults(defineProps<DashboardListProps>(), {
  title: '应用服务'
})

const router = useRouter()
const dashboardStore = useDashboardStore()

/**
 * dashboard table config
 */
const loadData: (
  param: { pid?: number; keywords?: string },
  resolve?: (data: Array<RowData>) => void
) => void = debounce(
  async (param: { pid?: number; keywords?: string }, resolve?: (data: Array<RowData>) => void) => {
    const data = await DashboardApi.loadDashboardList(param)

    if (data) {
      if (typeof resolve === 'function') {
        const tableData = data.map((item) => {
          const tableRow = {
            ...item,

            hasChildren: item.type === DashboardType.FOLDER
          }

          if (item.type === DashboardType.DASHBOARD) {
            Object.assign(tableRow, {
              publishStatus:
                item.status === DashboardStatus.OFF_LINE
                  ? '已下线'
                  : item.status === DashboardStatus.SAVE_UNPUBLISHED
                    ? '未发布'
                    : '已发布'
            })
          }

          return tableRow
        })

        resolve(tableData)
      }
    }
  }
)
const tableColumns: ColumnProps[] = [
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'publishStatus',
    label: '发布状态'
  },
  {
    prop: 'createBy',
    label: '创建者'
  },
  {
    prop: 'updateBy',
    label: '修改者'
  },
  {
    prop: 'updateTime',
    label: '修改时间'
  }
]

const tableDataLoading = ref<boolean>(false)
const tableData = ref<Array<RowData>>([])
const loadTableData = () =>
  loadData({}, (data) => {
    tableDataLoading.value = true

    tableData.value = data

    nextTick(() => (tableDataLoading.value = false))
  })
loadTableData()

const setTableRowClass = (data: { row: RowData }) => {
  const { row } = data

  return row.type === DashboardType.FOLDER ? 'is_folder' : ''
}
const loadTableChildren = async (
  row: RowData,
  treeNode: unknown,
  resolve: (data: RowData[]) => void
) => {
  loadData({ pid: row.id }, (data) => {
    resolve(data)
  })
}
const getOperationIcons: (row: RowData) => GxIconGroupItem[] = (row) => {
  const operationWrapper = (operationId: Operation) => clickOperation(operationId, row)
  const editIcon: GxIconGroupItem = {
    iconClass: 'icon-edit-outline',
    tooltip: row.type === DashboardType.DASHBOARD ? '编辑' : '重命名',
    onClick: () => operationWrapper(Operation.Edit)
  }

  const icons: GxIconGroupItem[] =
    row.type === DashboardType.FOLDER
      ? [
          {
            iconClass: 'icon-circle-plus-outline',
            children: [
              {
                iconClass: 'icon-chart_box-line',
                title: '新建应用服务',
                onClick: () => operationWrapper(Operation.AddDashboard)
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
            tooltip: '移动到',
            onClick: () => operationWrapper(Operation.Move)
          }
        ]
      : [
          {
            iconClass: 'icon-monitor',
            tooltip: row.status !== DashboardStatus.PUBLISH ? '请先发布再预览' : '预览',
            disabled: row.status !== DashboardStatus.PUBLISH,
            onClick: () => operationWrapper(Operation.Preview)
          },
          {
            iconClass: 'icon-share',
            tooltip: row.status !== DashboardStatus.PUBLISH ? '请先发布再分享' : '分享',
            disabled: row.status !== DashboardStatus.PUBLISH,
            onClick: () => operationWrapper(Operation.Share)
          }
        ]
  const moreOptions: GxIconGroupItem[] = [
    {
      iconClass: 'icon-more-horizontal',
      children: boolArray([
        row.type === DashboardType.DASHBOARD &&
          row.status === DashboardStatus.PUBLISH && {
            iconClass: 'icon-download',
            title: '下线',
            onClick: () => operationWrapper(Operation.Offline)
          },
        row.type === DashboardType.DASHBOARD && {
          iconClass: 'icon-moveTo',
          title: '移动到',
          onClick: () => operationWrapper(Operation.Move)
        },
        {
          iconClass: 'icon-delete',
          title: '删除',
          onClick: () => operationWrapper(Operation.Delete)
        }
      ])
    }
  ]
  return [editIcon].concat(icons, moreOptions)
}
const openDashboardPage = (
  id?: number,
  option: {
    isSelfId?: boolean
    viewMode?: boolean
  } = {}
) => {
  const { viewMode = false, isSelfId = viewMode } = option

  const routerParam = {
    path: router.resolve({
      name: viewMode ? DashboardBlockName.DashboardView : DashboardBlockName.DashboardWorkspace
    }).path
  }

  if (!isSelfId) {
    if (id !== undefined) {
      dashboardStore.pid = id
    } else {
      dashboardStore.pid = undefined
    }
  } else {
    Object.assign(routerParam, {
      query: {
        pageId: id
      }
    })
  }

  router.push(routerParam)
}
const clickOperation = async (operationId: Operation, row: RowData) => {
  switch (operationId) {
    case Operation.Edit:
      if (row.type === DashboardType.DASHBOARD) {
        openDashboardPage(row.id, {
          isSelfId: true
        })
      } else {
        openCreateFolderDialog({
          id: row.id,
          folderName: row.name
        })
      }
      break
    case Operation.AddFloder:
      openCreateFolderDialog({
        pid: row.id
      })
      break
    case Operation.Delete:
      if (await DashboardApi.deleteDashboardFolder({ id: row.id })) {
        ElMessage.success('删除成功！')
        loadTableData()
      }
      break
    case Operation.AddDashboard:
      openDashboardPage(row.id)
      break
    case Operation.Preview:
      if (row.status === DashboardStatus.PUBLISH) {
        openDashboardPage(row.id, {
          viewMode: true
        })
      } else {
        ElMessage.warning('请发布后再查看')
      }
      break
    case Operation.Share:
      {
        const url = `${window.location.origin}/#${
          router.resolve({
            name: DashboardBlockName.DashboardView,
            query: {
              pageId: row.id
            }
          }).fullPath
        }`

        if (await copyText(url)) {
          ElMessage.success('分享链接已经复制到剪贴板！')
        } else {
          ElMessage.warning('分享失败！')
        }
      }
      break
    case Operation.Move:
      openMoveFolderDrawer({ id: row.id })
      break
    case Operation.Offline:
      if (
        await DashboardApi.publishDashboard({
          id: row.id,
          status: DashboardStatus.OFF_LINE
        })
      ) {
        ElMessage.success('已成功下线！')
        loadTableData()
      }
      break
    default:
      break
  }
}

/**
 * search
 */
const searchInput = ref('')
watch(searchInput, (n) => {
  n !== undefined &&
    loadData({ keywords: n }, (data) => {
      tableData.value = data
    })
})

/**
 * create folder
 */
type FolderDialogData = {
  visible: boolean
  folderName: string
  id?: number
  pid?: number
}
const initFolderDialog = {
  visible: false,
  folderName: '',
  id: undefined,
  pid: undefined
}
const createFolderDialog = reactive<FolderDialogData>({
  ...initFolderDialog
})
const createFolderDialogFormSelf = ref<InstanceType<typeof ElForm> | null>(null)
const handleCreateFolderClose = () => {
  Object.assign(createFolderDialog, initFolderDialog)

  const form = createFolderDialogFormSelf.value

  if (form) {
    form.clearValidate()
  }
}
const closeCreateFolderDialog = () => {
  createFolderDialog.visible = false
}
const openCreateFolderDialog = (data: Partial<Omit<FolderDialogData, 'visible'>>) => {
  Object.assign(createFolderDialog, data, {
    visible: true
  })
}
const handleCreateFolderConfirm = async () => {
  const form = createFolderDialogFormSelf.value

  if (form && (await form.validate())) {
    const { folderName, pid, id } = createFolderDialog
    closeCreateFolderDialog()
    const res = await DashboardApi.saveDashboardFolder({ name: folderName, pid, id })
    if (res) {
      ElMessage.success('创建成功！')
      loadData({}, (data) => (tableData.value = data))
    }
  }
}

/**
 * move folder
 */
// [move folder] folder drawer
type FolderDrawerData = {
  visible: boolean
  id?: number
  targetId?: number
}
const initFolderDrawerData: FolderDrawerData = {
  visible: false,
  id: undefined,
  targetId: undefined
}
const moveFolderDrawer = reactive<FolderDrawerData>({
  ...initFolderDrawerData
})
const handleMoveFolderClose = () => {
  Object.assign(moveFolderDrawer, initFolderDrawerData)
}
const closeMoveFolderDrawer = () => {
  moveFolderDrawer.visible = false
}
const openMoveFolderDrawer = (data: Partial<Omit<FolderDrawerData, 'visible' | 'targetId'>>) => {
  Object.assign(moveFolderDrawer, data, {
    visible: true
  })
}
const handleMoveFolderConfirm = async () => {
  const { id, targetId } = moveFolderDrawer

  if (id !== undefined) {
    if (targetId !== undefined) {
      closeMoveFolderDrawer()
      if (await DashboardApi.moveDashboardFolder({ id, targetId })) {
        ElMessage.success('移动成功')
        loadTableData()
      }
    } else {
      ElMessage.warning('请选择目标文件夹')
    }
  }
}

// [move folder]  folder tree
interface FolderTree {
  name: string
  id: number
  children?: FolderTree[]
}
const folderTreeData = ref<Array<FolderTree>>([])
const filterFolderTreeData = (treeData: Array<FolderTree>, filterId?: number) => {
  return treeData.reduce((treeDataFiltered: Array<FolderTree>, treeNode) => {
    if (treeNode.id === filterId) {
      return treeDataFiltered
    }
    const treeNodeFiltered: FolderTree = { ...treeNode }
    delete treeNodeFiltered.children

    if (treeNode.children?.length) {
      treeNodeFiltered.children = filterFolderTreeData(treeNode.children, filterId)
    }

    treeDataFiltered.push(treeNodeFiltered)

    return treeDataFiltered
  }, [])
}
const folderTreeDataFiltered = computed(() =>
  filterFolderTreeData(folderTreeData.value, moveFolderDrawer.id)
)
const loadFolderTreeData = async () => {
  const folderList = await DashboardApi.loadDashboardFolderList({})

  if (folderList) {
    folderTreeData.value = folderList
  }
}
loadFolderTreeData()
</script>

<style lang="scss">
@use '@gxhs/ui/GxIcon/style/icon.scss' as *;

.bi-dashboard-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: size(16);
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: size(16);
    font-size: size(14);
  }

  &__title {
    &-icon {
      display: inline-block;
      height: size(16);
      width: size(4);
      border-radius: size(2);
      background-color: var(--el-color-primary);
      margin-right: size(12);
      vertical-align: -11%;
    }
  }

  &__actions {
    display: flex;
    gap: size(16);

    .el-input {
      width: size(320);
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }

  &__body {
    flex: 1;
    min-height: 0;

    .el-table {
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

  &__popup {
    .el-tree-node.is-current {
      background-color: #f0f2f5;
    }
  }
}
</style>
