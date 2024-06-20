<template>
  <el-aside class="gx-layout-aside">
    <gx-menu v-if="menus.length" :menus="menus" :collapse="collapse"></gx-menu>
  </el-aside>
</template>

<script setup lang="ts">
import GxMenu from '../../../GxMenu'

import type { GxLayoutAsideProps } from '../types'

withDefaults(defineProps<GxLayoutAsideProps>(), {
  menus: () => [],
  collapse: false
})
</script>

<style lang="scss">
.gx-layout-aside {
  --gx-layout-aside-color: var(--el-text-color-primary);
  --gx-layout-aside-bg-color: var(--el-color-primary-light-7);
}

.gx-layout-aside {
  width: auto;
  color: var(--gx-layout-aside-color);
  background-color: var(--gx-layout-aside-bg-color);

  transition: width 0.3s;

  .gx-menu {
    --gx-menu-bg-color: #{var(--gx-layout-aside-bg-color)};
  }
}
</style>
