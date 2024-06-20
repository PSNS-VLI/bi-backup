<template>
  <div
    v-if="groupItem.iconClass === 'Separator'"
    :class="[
      'gx-icon-group__item',
      'gx-icon-group__item--separator',
      iconSize && `gx-icon-group__item--icon-${iconSize}`
    ]"
  >
    <span></span>
  </div>
  <div
    v-else
    class="gx-icon-group__item"
    :class="[
      groupItem.title && 'gx-icon-group__item--with-title',
      iconSize && `gx-icon-group__item--icon-${iconSize}`,
      groupItem.disabled && 'gx-icon-group__item--disabled'
    ]"
    @click="
      () => !groupItem.disabled && typeof groupItem.onClick === 'function' && groupItem.onClick()
    "
  >
    <gx-icon
      v-if="groupItem.iconClass"
      :icon-class="groupItem.iconClass"
      :tooltip="groupItem.tooltip"
    ></gx-icon>
    <span class="gx-icon-group__item-title"> {{ groupItem.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { GxIcon } from '@gxhs/ui'

import { type GxIconGroupItemProps } from './types'

withDefaults(defineProps<GxIconGroupItemProps>(), {
  iconSize: 'medium'
})
</script>

<style lang="scss">
.gx-icon-group__item {
  display: flex;
  align-items: center;
  // gap: size(4);
  border-radius: var(--gx-icon-group-border-radius);
  cursor: pointer;

  &-title {
    height: size(24);
    line-height: size(24);
    font-size: var(--gx-icon-group-font-size);
    color: var(--gx-icon-group-text-color);
  }

  &--with-title {
    padding-right: size(8);
    &:hover {
      background-color: var(--gx-icon-group-hover-bg-color);
    }
    .gx-icon {
      --gx-icon-hover-bg-color: transparent;
    }
  }

  &--separator {
    cursor: default;
    span {
      width: 0;
      height: size(16);
      border-right: size(0.5) solid var(--gx-icon-group-separator-color);
      margin: 0 size(4);
    }
  }

  &--icon-small {
    --gx-icon-group-icon-size: var(--el-font-size-extra-small);
  }

  &--icon-large {
    --gx-icon-group-icon-size: var(--el-font-size-extra-large);
  }

  &--disabled {
    opacity: 0.5;

    .gx-icon,
    .gx-icon-group__item-title {
      cursor: not-allowed;
    }
  }
}
</style>
