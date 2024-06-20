<template>
  <div class="bi-field-label">
    <el-tooltip v-bind="Object.assign({ disabled: true }, tooltipAttributes)">
      <template #content>
        <slot name="tooltip-content"></slot>
      </template>
      <div class="bi-field-label__inner" v-bind="$attrs">
        <gx-icon class="bi-field-label__icon" :icon-class="icon ?? ''"></gx-icon>
        <span class="bi-field-label__title">{{ title }}</span>
        <gx-icon-group class="bi-field-label__operations" :icons="operations"></gx-icon-group>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { GxIcon, GxIconGroup, type GxIconGroupItem } from '@gxhs/ui'

defineOptions({
  inheritAttrs: false
})

withDefaults(
  defineProps<{
    icon?: string
    title?: string
    operations?: Array<GxIconGroupItem>
    tooltipAttributes?: Record<string, any>
  }>(),
  {}
)
</script>

<style lang="scss">
.bi-field-label {
  --bi-field-label-icon-color: #{var(--el-color-primary)};
  --bi-field-label-text-size: #{var(--el-font-size-extra-small)};
}

.bi-field-label {
  &__inner {
    display: flex;
    align-items: center;
    font-size: var(--bi-field-label-text-size);

    .gx-icon {
      --gx-icon-text-color: #{var(--bi-field-label-icon-color)};
    }

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .gx-icon-group {
      --gx-icon-group-font-size: #{var(--bi-field-label-text-size)};
      --gx-icon-group-icon-size: #{var(--bi-field-label-text-size)};
      --gx-icon-group-gap: 0;
    }
  }

  &__title {
    flex: 1;
  }
}
</style>
