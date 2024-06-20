<template>
  <div class="bi-config-item bi-config-item--collapse bi-config-keymap-wrapper">
    <b-i-config-item
      :config="config.mapper"
      v-model="currentKeyStore"
      @options-lose="handleSelectOptionsLose"
    ></b-i-config-item>
    <div class="bi-config-keymap-wrapper__spliter"></div>
    <template v-if="currentKey">
      <b-i-config-item
        v-for="subConfig in config.children"
        :key="subConfig.key"
        :config="subConfig"
        v-model="keymapData"
      ></b-i-config-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { genComponentName, initConfigItem } from '../../../../utils'
import type { ConfigKeymapWrapper } from '../../../../types/configuration'
import type { Key } from '../../../../types/common'

import BIConfigItem from '../ConfigItem'

defineOptions({
  name: genComponentName('ConfigKeymapWrapper')
})

const props = withDefaults(
  defineProps<{
    config: ConfigKeymapWrapper
    modelValue: Record<Key, any>
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])

const currentKeyStore = ref<Record<Key, Key>>({})
const currentKey = computed(() => currentKeyStore.value[props.config.mapper.key])
const keymapData = computed<Record<Key, any>>({
  get: () => {
    const modelValue = props.modelValue
    const data: Record<Key, any> = {}

    if (!modelValue[currentKey.value]) {
      initConfigItem(props.config.children, data)
      emit(
        'update:modelValue',
        Object.assign(modelValue, {
          [currentKey.value]: data
        })
      )
    }

    return modelValue[currentKey.value]
  },
  set: (val) => {
    emit(
      'update:modelValue',
      Object.assign(props.modelValue, {
        [currentKey.value]: val
      })
    )
  }
})

const handleSelectOptionsLose = (options: Array<{ label: any; value: Key }>) => {
  const keysLose = options.map((option) => option.value)
  const modelValue = props.modelValue
  keysLose.forEach((key) => {
    delete modelValue[key]
  })
  emit('update:modelValue', modelValue)
}
</script>

<style lang="scss">
.bi-config-keymap-wrapper {
  &__spliter {
    height: 0;
    padding: 8px 0;
    border-bottom: solid 1px var(--bi-color-border-divider-weak, rgba(0, 0, 0, 0.06));
  }
}
</style>
