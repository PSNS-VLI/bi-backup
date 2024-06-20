<template>
  <div
    class="bi-config-item bi-config-text-wrapper"
    :class="{
      'bi-config-text-wrapper--flex': !config.flexColumn
    }"
  >
    <div class="bi-config-text-wrapper__inner">
      <b-i-config-item
        v-for="subConfig in config.children"
        :key="subConfig.key"
        :config="subConfig"
        v-model="data"
      ></b-i-config-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { genComponentName } from '../../../../utils'
import type { ConfigTextWrapper } from '../../../../types/configuration'

import BIConfigItem from '../ConfigItem'

defineOptions({
  name: genComponentName('ConfigTextWrapper')
})
const props = withDefaults(
  defineProps<{
    config: ConfigTextWrapper
    modelValue: Record<string, any>
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

.bi-config-text-wrapper {
  &--flex {
    .bi-config-text-wrapper__inner {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}
</style>
