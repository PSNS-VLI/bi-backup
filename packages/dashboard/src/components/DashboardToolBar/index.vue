<template>
  <b-i-tool-bar
    class="bi-dashboard-tool-bar"
    :icons-left="toolBarIconsLeft"
    :icons-right="toolBarIconsRight"
  >
  </b-i-tool-bar>
</template>

<script setup lang="ts">
import { GxGroupItemSeparator } from '@gxhs/ui'
import type { GxIconGroupItem } from '@gxhs/ui'

import BIToolBar from '../ToolBar'
import { useBar } from '../composables'

import { DashboardToolBar } from './dashboard-tool-bar'

const { barInstance } = useBar(DashboardToolBar, 'DashboardToolBar')

defineExpose({
  instance: barInstance
})

const toolBarIconsLeft: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-chart_box-line',
    title: '添加图表',
    onClick: () => {
      const context = barInstance.getContext()
      if (context) {
        context.barsDisplayStatus.componentsBar = !context.barsDisplayStatus.componentsBar
      }
    }
  },
  {
    iconClass: 'icon-search',
    title: '添加查询控件'
  },
  GxGroupItemSeparator,
  {
    iconClass: 'icon-folder-opened',
    tooltip: ''
  },
  {
    iconClass: 'icon-picture-outline',
    tooltip: ''
  }
]
const toolBarIconsRight: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-arrow-down',
    title: '100%',
    children: [
      {
        iconClass: '',
        title: '100%'
      }
    ]
  },
  {
    iconClass: 'icon-s-grid'
  }
]
</script>

<style lang="scss"></style>
