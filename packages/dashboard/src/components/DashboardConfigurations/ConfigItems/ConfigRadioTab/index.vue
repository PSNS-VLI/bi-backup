<template>
  <b-i-config-radio-group
    :config="(() => config as unknown as ConfigRadioGroup<any>)()"
    v-model="data"
    class="bi-config-radio-tab"
  >
    <template v-slot="{ option }">
      <div class="bi-config-radio-icon-tab__item">
        <b-i-config-label :label="option"></b-i-config-label>
      </div>
    </template>
  </b-i-config-radio-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { genComponentName } from '../../../../utils'
import type { ConfigRadioTab, ConfigRadioGroup } from '../../../../types/configuration'

import BIConfigLabel from '../ConfigLabel'
import BIConfigRadioGroup from '../ConfigRadioGroup'

defineOptions({
  name: genComponentName('ConfigRadioTab')
})
const props = withDefaults(
  defineProps<{
    config: ConfigRadioTab<any>
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
@use '../style/radio-tab.scss' as *;
</style>
