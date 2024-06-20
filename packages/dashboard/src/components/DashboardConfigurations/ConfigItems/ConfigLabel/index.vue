<template>
  <div class="bi-config-label">
    <div class="bi-config-label__front">
      <div class="bi-config-label__title-prefix">
        <slot name="title-prefix"></slot>
      </div>
      <span class="bi-config-label__title">{{ label.label }}</span>
      <div class="bi-config-label__tooltip">
        <gx-icon
          v-if="label.tooltip?.description"
          icon-class="icon-tishi"
          :tooltip="label.tooltip.description"
        ></gx-icon>
      </div>
    </div>
    <div class="bi-config-label__behind">
      <slot name="behind"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GxIcon } from '@gxhs/ui'

import type { ConfigLabel } from '../../../../types/configuration'
import { genComponentName } from '../../../../utils'

defineOptions({
  name: genComponentName('ConfigLabel')
})

withDefaults(
  defineProps<{
    label: ConfigLabel
  }>(),
  {}
)
</script>

<style lang="scss">
.bi-config-label {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @at-root &__front {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
