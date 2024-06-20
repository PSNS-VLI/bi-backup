<template>
  <div class="bi-config-item bi-config-select">
    <el-select v-model="data" :placeholder="config.placeholder">
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { genComponentName } from '../../../../utils'
import type { ConfigSelect } from '../../../../types/configuration'

import { useKeymapMapper } from '../utils'

defineOptions({
  name: genComponentName('ConfigSelect')
})
const props = withDefaults(
  defineProps<{
    config: ConfigSelect<any>
    modelValue: any
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue', 'optionsLose'])
const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const { selectOptions } = useKeymapMapper(props, emit)
</script>

<style lang="scss">
@use '../style/common' as *;
</style>
