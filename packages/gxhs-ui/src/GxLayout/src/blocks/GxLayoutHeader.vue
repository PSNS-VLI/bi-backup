<template>
  <el-header class="gx-layout-header">
    <div class="gx-layout-header__item">
      <slot name="logo">
        <a class="logo" href="/">
          <img v-if="logo" class="logo__img" :src="logo" />
          <span v-if="title" class="logo__text">{{ title }}</span>
        </a>
      </slot>
    </div>
    <div class="gx-layout-header__item">
      <slot name="toolbar">
        <div class="toolbar">
          <gx-icon-group :icons="icons"></gx-icon-group>
        </div>
      </slot>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import GxIconGroup from '../../../GxIconGroup'
import logoImg from './logo.png'

import type { GxLayoutHeaderProps } from '../types'

withDefaults(defineProps<GxLayoutHeaderProps>(), {
  logo: logoImg,
  icons: () => []
})
</script>

<style lang="scss">
.gx-layout-header {
  --gx-layout-header-bg-color: var(--el-color-primary-light-3);
  --gx-layout-header-color: var(--el-text-color-primary);
  --gx-layout-header-logo-height: #{size(40)};
  --gx-layout-header-logo-width: auto;
}

.gx-layout-header {
  display: flex;
  justify-content: space-between;
  background-color: var(--gx-layout-header-bg-color);
  color: var(--gx-layout-header-color);

  @at-root &__item {
    display: flex;
  }

  .logo,
  .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .logo {
    gap: size(16);
    &:link,
    &:visited,
    &:hover,
    &:active {
      text-decoration: none;
      color: var(--gx-layout-header-color);
    }

    &__img {
      height: var(--gx-layout-header-logo-height);
      width: var(--gx-layout-header-logo-width);
    }
  }

  .toolbar {
    gap: size(8);
  }
}
</style>
