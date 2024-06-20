<template>
  <div class="bi-config-item bi-config-item--collapse bi-config-checkbox">
    <el-checkbox v-model="data">
      <b-i-config-label :label="config"></b-i-config-label>
    </el-checkbox>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BIConfigLabel from '../ConfigLabel'

import { genComponentName } from '../../../../utils'
import type { ConfigCheckbox } from '../../../../types/configuration'
import type { Nullable } from '../../../../types/common'

defineOptions({
  name: genComponentName('ConfigCheckbox')
})
const props = withDefaults(
  defineProps<{
    config: ConfigCheckbox
    modelValue: Nullable<boolean>
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
@use '../style/checkbox' as *;
</style>
