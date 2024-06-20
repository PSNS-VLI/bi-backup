<template>
  <div
    class="bi-config-item bi-config-input-number"
    :class="{
      'bi-config-input-number--without-prefix': !(config.prefix || config.prefixIcon)
    }"
  >
    <div class="bi-config-input-number__inner">
      <template v-if="config.prefix || config.prefixIcon">
        <div class="bi-config-input-number__prefix">
          <gx-icon v-if="config.prefixIcon" :icon-class="config.prefixIcon"></gx-icon>
          <span v-else>{{ config.prefix }}</span>
        </div>
      </template>
      <el-input-number
        v-model="data"
        :placeholder="config.placeholder"
        v-bind="config.attribute"
        controls-position="right"
      />
      <span v-if="config.suffix" class="bi-config-input-number__suffix">{{ config.suffix }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { GxIcon } from '@gxhs/ui'

import { genComponentName } from '../../../../utils'
import type { ConfigInputNumber } from '../../../../types/configuration'
import type { Nullable } from '../../../../types/common'

defineOptions({
  name: genComponentName('ConfigInputNumber')
})
const props = withDefaults(
  defineProps<{
    config: ConfigInputNumber
    modelValue: Nullable<number>
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])
const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style lang="scss">
@use '../style/common' as *;

.bi-config-input-number {
  .el-input-number.is-controls-right .el-input__wrapper {
    padding-left: calc(24px + 4px);
  }

  &--without-prefix {
    .el-input-number.is-controls-right .el-input__wrapper {
      padding-left: 4px;
    }
  }

  &__inner {
    max-width: 90px;
    position: relative;
    height: var(--bi-config-form-item-height);

    .el-input-number__decrease,
    .el-input-number__increase {
      display: none;
    }

    &:hover {
      .bi-config-input-number__suffix {
        display: none;
      }

      .el-input-number__decrease,
      .el-input-number__increase {
        display: inline-flex;
      }
    }
  }

  &__prefix,
  &__suffix {
    position: absolute;
    top: 0;
    bottom: 0;
    display: inline-flex;
    justify-content: center;
    z-index: 1;
  }

  &__prefix {
    left: 0;
    width: 24px;
    border-right: 1px solid var(--el-border-color);
  }

  &__suffix {
    right: 0;
    width: 32px;
  }
}
</style>
