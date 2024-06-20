<template>
  <gx-layout-header class="bi-header">
    <template #logo>
      <gx-icon-group :icons="iconsLeftStart" icon-size="large"></gx-icon-group>
      <div class="bi-header__title">
        <el-input size="small"></el-input>
        <span>最近保存于03-04 09:50</span>
      </div>
      <gx-icon-group :icons="iconsLeftEnd" icon-size="large"></gx-icon-group>
    </template>
    <template #toolbar>
      <gx-icon-group :icons="iconsRightStart" icon-size="large"></gx-icon-group>
      <gx-button-group :buttons="buttonsRight"></gx-button-group>
      <gx-icon-group :icons="iconsRightEnd" icon-size="large"> </gx-icon-group>
    </template>
  </gx-layout-header>
</template>

<script setup lang="ts">
import { GxLayoutHeader, GxIconGroup, GxGroupItemSeparator, GxButtonGroup } from '@gxhs/ui'
import type { GxIconGroupItem, GxButtonGroupItem } from '@gxhs/ui'

defineOptions({
  name: 'BIHeader'
})

const iconsLeftStart: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-arrow-left'
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
    iconClass: 'icon-close'
  },
  GxGroupItemSeparator,
  {
    iconClass: 'icon-qiehuan',
    title: '切换数据集'
  },
  {
    iconClass: 'icon-setting',
    title: '页面设置'
  }
]
const buttonsRight: Array<GxButtonGroupItem> = [
  {
    content: '预览',
    onClick: () => {
      console.log('预览')
    }
  },
  {
    content: '保存'
  },
  {
    content: '保存并发布',
    type: 'primary'
  }
]
const iconsRightEnd: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-share',
    tooltip: '分享'
  },
  {
    iconClass: 'icon-more-horizontal',
    children: [
      {
        iconClass: 'icon-lingcunwei',
        title: '另存为'
      },
      {
        iconClass: 'icon-monitor',
        title: '新标签页查看'
      }
    ]
  }
]
</script>

<style lang="scss">
.bi-header {
  align-items: center;

  @at-root &__title {
    display: flex;
    flex-direction: column;
    gap: size(4);
    margin-right: size(12);
    span {
      color: var(--el-text-color-placeholder);
      font-size: size(12);
    }
  }
}
</style>
