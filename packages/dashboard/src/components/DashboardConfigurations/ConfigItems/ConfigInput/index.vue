<template>
  <div class="bi-config-item bi-config-input">
    <el-input v-model="data" :placeholder="config.placeholder"></el-input>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { genComponentName } from '../../../../utils'
import type { ConfigInput } from '../../../../types/configuration'
import type { Nullable } from '../../../../types/common'

defineOptions({
  name: genComponentName('ConfigInput')
})
const props = withDefaults(
  defineProps<{
    config: ConfigInput
    modelValue: Nullable<any>
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
</style>
