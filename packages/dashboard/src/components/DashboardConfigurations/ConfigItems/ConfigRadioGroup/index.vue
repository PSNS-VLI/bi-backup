<template>
  <div class="bi-config-item bi-config-radio-group">
    <el-radio-group v-model="data">
      <el-radio v-for="option in selectOptions" :key="option.value" :value="option.value">
        <slot :option="option">
          <b-i-config-label :label="option"></b-i-config-label>
        </slot>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { genComponentName } from '../../../../utils'
import type { ConfigRadioGroup } from '../../../../types/configuration'

import BIConfigLabel from '../ConfigLabel'
import { useKeymapMapper } from '../utils'

defineOptions({
  name: genComponentName('ConfigRadioGroup')
})
const props = withDefaults(
  defineProps<{
    config: ConfigRadioGroup<any>
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
@use '../style/radio.scss' as *;
</style>
