<template>
  <div class="bi-config-item bi-config-checkbox-group">
    <el-checkbox-group v-model="data">
      <el-checkbox v-for="option in config.options" :key="option.value" :value="option.value">
        <b-i-config-label :label="option"></b-i-config-label>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BIConfigLabel from '../ConfigLabel'

import type { ConfigCheckboxGroup } from '../../../../types/configuration'
import { genComponentName } from '../../../../utils'

defineOptions({
  name: genComponentName('ConfigCheckboxGroup')
})

const props = withDefaults(
  defineProps<{
    config: ConfigCheckboxGroup<any>
    modelValue: Array<any>
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
