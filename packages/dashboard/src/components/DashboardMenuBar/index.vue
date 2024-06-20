<template>
  <gx-layout-header class="bi-dashboard-menu-bar">
    <template #logo>
      <gx-icon-group
        v-show="!barInstance.previewMode"
        :icons="iconsLeftStart"
        icon-size="large"
      ></gx-icon-group>
      <div class="bi-dashboard-menu-bar__title">
        <el-input size="small" v-model="dashboard.name"></el-input>
        <span>最近保存于 {{ formatDateTomDHM(dashboard.updateTime) }}</span>
      </div>
      <gx-icon-group
        v-show="!barInstance.previewMode"
        :icons="iconsLeftEnd"
        icon-size="large"
      ></gx-icon-group>
    </template>
    <template #toolbar>
      <gx-icon-group
        v-show="!barInstance.previewMode"
        :icons="iconsRightStart"
        icon-size="large"
      ></gx-icon-group>
      <gx-button-group :buttons="buttonsRight"></gx-button-group>
      <gx-icon-group :icons="iconsRightEnd" icon-size="large"></gx-icon-group>
      <el-dialog v-model="dialog.open" :title="dialog.title" :before-close="closeDialog">
        <template
          v-if="
            dialog.openFor === OpenDialogFor.SHARE ||
            dialog.openFor === OpenDialogFor.SAVE_AS ||
            dialog.openFor === OpenDialogFor.EXPORT
          "
        >
          <el-row justify="space-between">
            <el-col :span="21">
              <el-form :model="dialog.form">
                <el-form-item prop="input" :required="dialog.form.inputRequired">
                  <el-input
                    v-model="dialog.form.input"
                    :disabled="dialog.form.inputDisabled"
                    :placeholder="dialog.form.inputPlaceholder"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="2">
              <dialog-button></dialog-button>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="dialog.openFor === OpenDialogFor.IMPORT">
          <template v-if="dialog.form?.items?.length">
            <el-row>
              <el-col>
                <el-form label-width="auto">
                  <el-form-item
                    v-for="item in dialog.form.items"
                    :key="item.label"
                    :label="item.label"
                  >
                    <el-input v-model="item.value" disabled></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row justify="end">
              <el-col :span="2">
                <dialog-button></dialog-button>
              </el-col>
            </el-row>
          </template>

          <el-upload
            v-else-if="dialog.onFileUploaded"
            action="#"
            accept=".json"
            :limit="1"
            :before-upload="dialog.onFileUploaded"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip> 请选择 JSON 配置文件 </template>
          </el-upload>
        </template>
      </el-dialog>
    </template>
  </gx-layout-header>
</template>

<script setup lang="ts">
import { reactive, onUnmounted, computed, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type Action, type UploadFile, ElButton } from 'element-plus'

import { GxLayoutHeader, GxIconGroup, GxGroupItemSeparator, GxButtonGroup } from '@gxhs/ui'
import type { GxIconGroupItem, GxButtonGroupItem } from '@gxhs/ui'

import { DashboardBlockName } from '../../blocks'
import { useDashboardStore } from '../../store'
import { DashboardStatus } from '../../types/app/dashboard'
import { BIDashboardEngine } from '../../engine'
import { copyText } from '../../utils'

import { DashboardApi } from '../DashboardInterface'
import { useBar } from '../composables'

import { DashboardMenuBar } from './dashboard-menu-bar'

defineOptions({
  name: 'BIDashboardMenuBar'
})

/**
 * init
 */
const router = useRouter()
const route = useRoute()
const dashboardStore = useDashboardStore()

/**
 * instance
 */
const { barInstance } = useBar(DashboardMenuBar, 'DashboardMenuBar')
defineExpose({
  instance: barInstance
})

/**
 * dashboard about
 */
// dashboard info
const dashboard = reactive<{
  id?: number
  pid?: number
  status: DashboardStatus
  name: string
  updateTime: string
}>({
  id: Number.isNaN(Number(route.query.pageId)) ? undefined : Number(route.query.pageId),
  pid: dashboardStore.pid,
  status: DashboardStatus.SAVE_UNPUBLISHED,
  name: `未命名__${new Date().getTime()}`,
  updateTime: new Date().toLocaleString()
})
watch(
  () => barInstance.dashboardData,
  (n) => {
    n && Object.assign(dashboard, n)
  },
  {
    immediate: true
  }
)
watch(
  () => dashboard.name,
  (name) => {
    document.title = name
    const configData = barInstance.getContext()?.globalConfigBar?.configData
    if (configData) {
      if (configData.__BI_GLOBAL_CONFIG__) {
        configData.__BI_GLOBAL_CONFIG__.name = name
      } else {
        configData.__BI_GLOBAL_CONFIG__ = {
          name
        }
      }
    }
  }
)
onUnmounted(() => {
  dashboardStore.pid = undefined
})

const prefixZero = (num: number): string => `${num < 10 ? 0 : ''}${num}`
const formatDateTomDHM = (dateStr: string) => {
  let date = new Date()
  if (!Number.isNaN(Date.parse(dateStr))) {
    date = new Date(dateStr)
  }

  const m = prefixZero(date.getMonth() + 1)
  const D = prefixZero(date.getDate())
  const H = prefixZero(date.getHours())
  const M = prefixZero(date.getMinutes())

  return `${m}-${D} ${H}:${M}`
}
const withEngine = (callback: (engine: BIDashboardEngine) => void) => {
  const globalConfigBar = barInstance.getContext()

  if (globalConfigBar) {
    const engine = new BIDashboardEngine(globalConfigBar as any)
    callback(engine)
  }
}

// dashboard operation
// export config data
const exportDashboard = (justifySpace: number = 0) => {
  let dashboardData = ''

  withEngine((engine) => {
    dashboardData = engine.generate({
      justifySpace
    })
  })

  return dashboardData
}

// [dashboard operation] save
const saveDashboard = async (
  option: {
    name?: string
    pid?: number
    saveAs?: boolean
    publish?: boolean
    callback?: (status: boolean) => void
  } = {}
) => {
  const { name = '', pid, saveAs = false, publish = false, callback = () => {} } = option

  const dashboardData = exportDashboard()

  if (!dashboardData) return

  const data = {
    name: name || dashboard.name,
    content: dashboardData,
    pid: dashboard.pid
  }

  if (saveAs) {
    if (pid) {
      Object.assign(data, { pid })
    }
  } else {
    if (dashboard.id !== undefined) {
      Object.assign(data, {
        id: dashboard.id
      })
    }
  }

  const dashboardId = await DashboardApi.saveDashboard(data)

  if (dashboardId) {
    callback(true)
  } else {
    callback(false)
  }

  if (!saveAs && dashboardId) {
    ElMessage.success('保存成功')

    if (!window.location.href.includes('pageId')) {
      try {
        window.history.pushState(null, '', `${window.location.href}?pageId=${dashboardId}`)
      } catch (err) {
        console.log()
      }
    }
    dashboard.id = dashboardId
    dashboard.updateTime = new Date().toLocaleString()

    if (
      publish &&
      (await DashboardApi.publishDashboard({ id: dashboardId, status: DashboardStatus.PUBLISH }))
    ) {
      ElMessage.success('发布成功')
      dashboard.status = DashboardStatus.PUBLISH
    }
  }
}

// [dashboard operation] preview
const previewDashboard = () => {
  barInstance.previewMode = !barInstance.previewMode
}

// [dashboard operation] others
const goBack = () => {
  router.replace({ name: DashboardBlockName.DashboardList })
}
const openGlobalConfig = () => {
  const context = barInstance.getContext()

  if (context) {
    context.hideBar('chartConfigBar')
    context.hideBar('datasetBar')
    context.showBar('globalConfigBar')
    context.globalConfigBar?.open()
  }
}

// [dashboard operation] dialog
const enum OpenDialogFor {
  SHARE,
  SAVE_AS,
  EXPORT,
  IMPORT
}
type Dialog = {
  open: boolean
  openFor?: OpenDialogFor
  title: string
  form: {
    input?: string
    inputPlaceholder?: string
    inputDisabled?: boolean
    inputRequired?: boolean

    items?: Array<{
      label: string
      value: string
    }>
  }
  button: {
    text?: string
    action?: (input?: string) => void
  }
  onFileUploaded?: (rawFile: UploadFile) => false
}
const getDialogInit = (): Dialog => {
  return {
    open: false,
    title: '',
    form: {
      input: ''
    },
    button: {}
  }
}
const dialog = reactive<Dialog>(getDialogInit())
const closeDialog = () => {
  Object.assign(dialog, getDialogInit())
}
const DialogButton = () =>
  h(
    ElButton,
    {
      disabled: dialog.form.inputRequired && !dialog.form.input,
      onClick: () => dialog.button?.action && dialog.button.action(dialog.form.input)
    },
    {
      default: () => dialog.button.text
    }
  )

// [dashboard operation dialog] share
const openDialogForShare = () => {
  if (dashboard.id) {
    Object.assign(dialog, {
      open: true,
      title: '分享应用服务',
      openFor: OpenDialogFor.SHARE,
      form: {
        inputDisabled: true,
        inputRequired: true,
        input: `${window.location.origin}/#${
          router.resolve({
            name: DashboardBlockName.DashboardView,
            query: {
              pageId: dashboard.id
            }
          }).fullPath
        }`
      },
      button: {
        text: '复制',
        action: async (url: string) => {
          if (url) {
            if (await copyText(url)) {
              ElMessage.success('链接成功复制到剪切板！')
              closeDialog()
            } else {
              ElMessage.error('分享失败！')
            }
          }
        }
      }
    } as Dialog)
  }
}

// [dashboard operation dialog] save as
const openDialogForSaveAs = () => {
  Object.assign(dialog, {
    open: true,
    title: '保存为副本',
    openFor: OpenDialogFor.SAVE_AS,
    form: {
      input: `${dashboard.name}__副本`,
      inputRequired: true,
      inputPlaceholder: '请输入应用服务名称'
    },
    button: {
      text: '保存',
      action: async (name: string) => {
        saveDashboard({
          name,
          saveAs: true,
          callback: (status) => {
            if (status) {
              ElMessage.success('保存副本成功！')
            } else {
              ElMessage.warning('保存副本失败！')
            }
            closeDialog()
          }
        })
      }
    }
  } as Dialog)
}

// [dashboard operation dialog] export
const openDialogForExport = () => {
  Object.assign(dialog, {
    open: true,
    title: '导出配置文件',
    openFor: OpenDialogFor.EXPORT,
    form: {
      input: `${dashboard.name}`,
      inputRequired: true,
      inputPlaceholder: '请输入导出文件的名称'
    },
    button: {
      text: '导出',
      action: () => {
        try {
          const dashboardConfigDataJson = exportDashboard(2)
          const dashboardConfigDataURI = encodeURIComponent(dashboardConfigDataJson)
          const dashboardDownloadLink = document.createElement('a')
          dashboardDownloadLink.setAttribute('style', 'display:none;')
          dashboardDownloadLink.setAttribute(
            'href',
            'data:application/json;charset=utf-8,' + dashboardConfigDataURI
          )
          dashboardDownloadLink.setAttribute('download', `${dialog.form.input}.json`)
          document.body.appendChild(dashboardDownloadLink)
          dashboardDownloadLink.click()
          document.body.removeChild(dashboardDownloadLink)

          ElMessage.success('导出成功！')
          closeDialog()
        } catch (e) {
          ElMessage.warning('导出失败！')
        }
      }
    }
  } as Dialog)
}

// [dashboard operation dialog] import
const openDialogForImport = () => {
  let dashbaordData: string = ''

  const importDashbard = () => {
    closeDialog()
    if (dashbaordData) {
      withEngine((engine) => {
        try {
          engine.inject(dashbaordData)
          ElMessage.success('导入成功！')
        } catch (e) {
          console.log(e)
          ElMessage.warning('导入失败！')
        }
      })
    }
  }

  Object.assign(dialog, {
    open: true,
    title: '导入配置文件',
    openFor: OpenDialogFor.IMPORT,
    form: {
      items: []
    },
    onFileUploaded: (rawFile) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const target = e.target

        if (target) {
          try {
            withEngine((engine) => {
              const data = engine.parse(target.result as string)

              if (data) {
                const versionInfo = engine.parseVersion(data.version)

                dialog.form.items = [
                  {
                    label: '文件名',
                    value: rawFile.name
                  },
                  {
                    label: '引擎名称',
                    value: versionInfo.engineName
                  },
                  {
                    label: '引擎标识',
                    value: data.version
                  },
                  {
                    label: '版本号',
                    value: `${versionInfo.major}.${versionInfo.minor}.${versionInfo.patch}`
                  },
                  {
                    label: '标签',
                    value: versionInfo.label
                  },
                  {
                    label: '浏览器名称',
                    value: versionInfo.browserName
                  },
                  {
                    label: '浏览器版本',
                    value: versionInfo.browserVersion
                  },
                  {
                    label: '是否与当前版本兼容',
                    value: '是'
                  }
                ]

                dashbaordData = target.result as string
              }
            })
          } catch (e) {
            dashbaordData = ''
          }
        }

        if (dashbaordData) {
          ElMessage.success('文件解析成功！')
        } else {
          ElMessage.warning('文件解析失败！')
        }
      }

      reader.onerror = (e) => {
        console.log(e)
        ElMessage.warning('文件解析失败！')
      }

      reader.readAsText(rawFile as unknown as File)

      return false
    },
    button: {
      text: '确认导入',
      action: () => {
        const canvas = barInstance.getDashboardCanvas()

        if (canvas) {
          const elementNum = canvas.elements.length
          if (elementNum) {
            ElMessageBox.confirm(
              `当前页面已经配置了${elementNum}个图表，导入配置后将无法恢复，是否继续`,
              '配置导入提醒',
              {
                confirmButtonText: '继续导入',
                cancelButtonText: '取消导入',
                callback: (action: Action) => {
                  if (action === 'confirm') {
                    importDashbard()
                  }
                }
              }
            )
          } else {
            importDashbard()
          }
        }
      }
    }
  } as Dialog)
}

// open in newtab
const openDashboardInNewTab = () => {
  if (dashboard.id) {
    router.push({
      name: DashboardBlockName.DashboardView,
      query: {
        pageId: dashboard.id
      }
    })
  }
}

const handleDashboardOffline = () => {
  ElMessageBox.confirm('确定下线此应用服务?', '下线提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        const dashboardId = dashboard.id
        if (dashboardId === undefined) return

        if (
          await DashboardApi.publishDashboard({
            id: dashboardId,
            status: DashboardStatus.OFF_LINE
          })
        ) {
          ElMessage.success('已成功下线！')
          dashboard.status = DashboardStatus.OFF_LINE
        }
      }
    }
  })
}

/**
 * buttons
 */
const iconsLeftStart: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-arrow-left',
    onClick: goBack
  }
]
const iconsLeftEnd: Array<GxIconGroupItem> = [
  GxGroupItemSeparator,
  {
    iconClass: 'icon-fanhui',
    tooltip: '撤销'
  },
  {
    iconClass: 'icon-xiayibu',
    tooltip: '重做'
  }
]
const iconsRightStart: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-setting',
    title: '页面设置',
    onClick: openGlobalConfig
  }
]
const buttonsRight = computed<Array<GxButtonGroupItem>>(() => {
  const dashboardStatus = dashboard.status
  const previewMode = barInstance.previewMode

  return [
    {
      content: previewMode ? '继续编辑' : '预览',
      onClick: previewDashboard
    },
    {
      content: '保存',
      onClick: saveDashboard
    },
    {
      content: dashboardStatus === DashboardStatus.PUBLISH ? '重新发布' : '保存并发布',
      type: 'primary',
      onClick: () =>
        saveDashboard({
          publish: true
        })
    }
  ]
})
const iconsRightEnd = computed<Array<GxIconGroupItem>>(() => {
  const published = dashboard.status === DashboardStatus.PUBLISH

  return [
    {
      iconClass: 'icon-share',
      disabled: !published,
      tooltip: published ? '分享 ' : '请先发布再分享',
      onClick: openDialogForShare
    },
    {
      iconClass: 'icon-more-horizontal',
      children: [
        {
          iconClass: 'icon-lingcunwei',
          title: '另存为',
          onClick: openDialogForSaveAs
        },
        {
          iconClass: 'icon-monitor',
          tooltip: published ? '' : '请先发布再查看',
          disabled: !published,
          title: '新标签页查看',
          onClick: openDashboardInNewTab
        },
        {
          iconClass: 'icon-xiaxian',
          title: '下线',
          tooltip: published ? '' : '请先发布再下线',
          disabled: !published,
          onClick: handleDashboardOffline
        },
        {
          iconClass: 'icon-daochupeizhi-copy',
          title: '导出配置',
          onClick: openDialogForExport
        },
        {
          iconClass: 'icon-daorupeizhi',
          title: '导入配置',
          onClick: openDialogForImport
        },
        {
          iconClass: 'icon-a-relitu1-copy',
          title: '快捷键'
        }
      ]
    }
  ]
})
</script>

<style lang="scss">
.bi-dashboard-menu-bar {
  // --gx-layout-header-bg-color: #222f48;
  --gx-layout-header-bg-color: #fff;

  align-items: center;
  border-bottom: 1px solid var(--bi-color-border-divider, rgba(0, 0, 0, 0.1));

  &__title {
    display: flex;
    flex-direction: column;
    gap: size(4);
    margin: 0 size(12);

    .el-input {
      --el-input-border-color: transparent;
      --el-input-hover-border-color: transparent;
      --el-input-focus-border-color: transparent;

      &__wrapper {
        padding: 0;

        &:hover {
          background-color: #f0f2f5;
        }
      }
    }

    span {
      color: var(--el-text-color-placeholder);
      font-size: size(12);
    }
  }
}
</style>
