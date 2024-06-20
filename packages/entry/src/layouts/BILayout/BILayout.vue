<template>
  <gx-layout
    class="bi-layout"
    ref="gxLayoutSelf"
    :logo="logo"
    :menus="menus"
    :icons="icons"
    auto-collapse
  >
    <router-view></router-view>
  </gx-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { GxLayout, getMenusFromVueRouter, type GxIconGroupItem } from '@gxhs/ui'

import { useRouterStore } from '@/stores'

import logo from './logo.jpg'

const routerStore = useRouterStore()

const menus = computed(() =>
  getMenusFromVueRouter(routerStore.menuRouters, 'icon', 'title', 'hide', 'hideChildren')
)

const gxLayoutSelf = ref<typeof GxLayout | null>(null)
const icons: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-setting',
    children: [
      {
        iconClass: 'icon-LoginOutlined',
        title: '退出登录'
      }
    ]
  }
]
</script>

<style lang="scss">
.bi-layout {
  .gx-layout-header {
    --gx-layout-header-bg-color: #222f48;
  }

  .gx-layout-aside {
    --gx-layout-aside-color: #fff;
    --gx-layout-aside-bg-color: #2c3951;
    .gx-menu {
      --gx-menu-active-bg-color: #f5f7fa;
      --gx-menu-active-color: #2468f2;
      --gx-menu-hover-bg-color: #{rgba(#f5f7fa, 0.5)};
    }
  }
}
</style>
