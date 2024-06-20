<template>
  <div
    v-show="showConfig"
    class="bi-config"
    :class="{
      'bi-config--inline': config.inline,
      'bi-config--without-label': hideLabel || !config.label
    }"
  >
    <b-i-config-label
      v-if="
        !hideLabel &&
        config.label &&
        !isCheckbox(config) &&
        !isCheckboxWrapper(config) &&
        !isKeymapWrapper(config)
      "
      :label="config"
    ></b-i-config-label>
    <component
      :is="getConfigComponent(config)"
      :key="config.key"
      :config="config"
      v-model="data[config.key]"
      v-bind="$attrs"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { ConfigItemBase } from '../../../../types/configuration'
import type { Key } from '../../../../types/common'
import { genComponentName, isCheckbox, isCheckboxWrapper, isKeymapWrapper } from '../../../../utils'

import { getConfigComponent, useChartConfigStore } from '../utils'
import BIConfigLabel from '../ConfigLabel'

defineOptions({
  name: genComponentName('ConfigItem'),
  inheritAttrs: false
})
const props = withDefaults(
  defineProps<{
    config: ConfigItemBase
    modelValue: Record<Key, any>
    hideLabel?: boolean
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])
const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const showConfig = ref<boolean>(true)
const showController = props.config.displayController
if (typeof showController === 'function') {
  useChartConfigStore(
    (configStore) => {
      showConfig.value = showController(configStore, props.modelValue)
    },
    { immediate: true }
  )
}
</script>

<style lang="scss">
@use '../style/common.scss';
</style>
