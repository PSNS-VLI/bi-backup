<template>
  <div class="bi-config-item bi-config-color-picker">
    <el-color-picker
      v-model="data"
      show-alpha
      :predefine="config.predefineColors ?? predefineColors"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { genComponentName } from '../../../../utils'
import type { ConfigColorPicker } from '../../../../types/configuration'
import type { Nullable } from '../../../../types/common'

defineOptions({
  name: genComponentName('ConfigColorPicker')
})
const props = withDefaults(
  defineProps<{
    config: ConfigColorPicker
    modelValue: Nullable<string>
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])
const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const predefineColors = [
  'rgb(46, 116, 255)',
  'rgb(88, 202, 244)',
  'rgb(134, 126, 236)',
  'rgb(252, 188, 61)',
  'rgb(69, 208, 181)',
  'rgb(91, 123, 186)',
  'rgb(231, 142, 91)',
  'rgb(181, 112, 216)',
  'rgb(238, 153, 255)',
  'rgb(159, 117, 99)',
  'rgb(115, 160, 182)',
  'rgb(138, 179, 229)'
]
</script>

<style lang="scss">
@use '../style/common' as *;
</style>
