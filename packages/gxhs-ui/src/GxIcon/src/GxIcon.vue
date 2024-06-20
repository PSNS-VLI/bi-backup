<template>
  <div v-if="iconClass" class="gx-icon" :class="[iconSize && `gx-icon--${iconSize}`]">
    <el-tooltip placement="top" :content="tooltip" :disabled="!tooltip">
      <!-- <span class="gx-icon__inner" :class="[fontClass, iconClass]"></span> -->
      <svg class="gx-icon__inner gx-icon__inner--svg" aria-hidden="true">
        <use :xlink:href="`#${iconClass}`"></use>
      </svg>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import type { GxIconProps } from './types'

withDefaults(defineProps<GxIconProps>(), {
  fontClass: 'iconfont',
  iconSize: 'medium'
})
</script>

<style lang="scss">
@use '../style/icon' as *;

.gx-icon {
  --gx-icon-padding: #{size(4)};
  --gx-icon-border-radius: var(--el-border-radius-base);
  --gx-icon-hover-bg-color: var(--gx-hover-bg-color);
  --gx-icon-text-color: var(--el-color-primary);
  --gx-icon-text-size: inherit;

  @at-root &--small {
    --gx-icon-text-size: var(--el-font-size-extra-small);
  }

  @at-root &--large {
    --gx-icon-text-size: var(--el-font-size-extra-large);
  }
}

.gx-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: var(--gx-icon-padding);
  border-radius: var(--gx-icon-border-radius);
  color: var(--gx-icon-text-color);
  cursor: pointer;

  &:hover {
    background-color: var(--gx-icon-hover-bg-color);
  }

  .gx-icon__inner {
    font-size: var(--gx-icon-text-size, inherit);

    &--svg {
      width: 1em;
      height: 1em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
