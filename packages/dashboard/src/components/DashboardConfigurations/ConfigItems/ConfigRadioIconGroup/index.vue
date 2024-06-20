<template>
  <b-i-config-radio-group
    :config="(() => config as unknown as ConfigRadioGroup<any>)()"
    v-model="data"
    class="bi-config-radio-icon-group"
  >
    <template v-slot="{ option }">
      <div class="bi-config-radio-icon-group__item">
        <gx-icon :icon-class="(option as any).iconClass" :tooltip="option.label"></gx-icon>
        <b-i-config-label v-if="!config.hideOptionLabel" :label="option"></b-i-config-label>
      </div>
    </template>
  </b-i-config-radio-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { GxIcon } from '@gxhs/ui'

import { genComponentName } from '../../../../utils'
import type { ConfigRadioIconGroup, ConfigRadioGroup } from '../../../../types/configuration'

import BIConfigLabel from '../ConfigLabel'
import BIConfigRadioGroup from '../ConfigRadioGroup'

defineOptions({
  name: genComponentName('ConfigRadioIconGroup')
})
const props = withDefaults(
  defineProps<{
    config: ConfigRadioIconGroup<any>
    modelValue: any
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
@use '../style/radio-icon.scss' as *;
</style>
