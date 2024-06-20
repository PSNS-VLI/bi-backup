<template>
  <div class="bi-config-item bi-config-radio-group-nest">
    <template v-if="config.levelOneType === ConfigItemType.RADIO_GROUP">
      <b-i-config-radio-group
        :config="(() => levelOneConfig as unknown as ConfigRadioGroup<any>)()"
        :model-value="data.levelOne"
        @update:model-value="emitUpdate({ level: 'levelOne', value: $event })"
      ></b-i-config-radio-group>
    </template>
    <template v-else-if="config.levelOneType === ConfigItemType.RADIO_ICON_GROUP">
      <b-i-config-radio-icon-group
        :config="(() => levelOneConfig as unknown as ConfigRadioIconGroup<any>)()"
        :model-value="data.levelOne"
        @update:model-value="emitUpdate({ level: 'levelOne', value: $event })"
      ></b-i-config-radio-icon-group>
    </template>
    <template v-else>
      <b-i-config-radio-tab
        :config="(() => levelOneConfig as unknown as ConfigRadioTab<any>)()"
        :model-value="data.levelOne"
        @update:model-value="emitUpdate({ level: 'levelOne', value: $event })"
      ></b-i-config-radio-tab>
    </template>

    <!-- level two -->
    <template v-if="config.levelTwoType === ConfigItemType.RADIO_GROUP">
      <b-i-config-radio-group
        :config="(() => levelTwoConfig as unknown as ConfigRadioGroup<any>)()"
        :model-value="data.levelTwo"
        @update:model-value="emitUpdate({ level: 'levelTwo', value: $event })"
      ></b-i-config-radio-group>
    </template>
    <template v-else-if="config.levelTwoType === ConfigItemType.RADIO_ICON_GROUP">
      <b-i-config-radio-icon-group
        :config="(() => levelTwoConfig as unknown as ConfigRadioIconGroup<any>)()"
        :model-value="data.levelTwo"
        @update:model-value="emitUpdate({ level: 'levelTwo', value: $event })"
      ></b-i-config-radio-icon-group>
    </template>
    <template v-else>
      <b-i-config-radio-tab
        :config="(() => levelTwoConfig as unknown as ConfigRadioTab<any>)()"
        :model-value="data.levelTwo"
        @update:model-value="emitUpdate({ level: 'levelTwo', value: $event })"
      ></b-i-config-radio-tab>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { genComponentName } from '../../../../utils'
import { ConfigItemType } from '../../../../types/configuration'
import type {
  ConfigRadioGroup,
  ConfigRadioIconGroup,
  ConfigRadioTab,
  ConfigRadioGroupNest
} from '../../../../types/configuration'

import BIConfigRadioGroup from '../ConfigRadioGroup'
import BIConfigRadioIconGroup from '../ConfigRadioIconGroup'
import BIConfigRadioTab from '../ConfigRadioTab'

defineOptions({
  name: genComponentName('ConfigRadioGroupNest')
})
const props = withDefaults(
  defineProps<{
    config: ConfigRadioGroupNest<any, any>
    modelValue: any
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])
const data = computed<{ levelOne: any; levelTwo: any }>(() => {
  const { levelOne, levelTwo } = props.config.keyMap

  return {
    levelOne: props.modelValue[levelOne],
    levelTwo: props.modelValue[levelTwo]
  }
})
const emitUpdate = (val: { level: 'levelOne' | 'levelTwo'; value: any }) => {
  const res = Object.assign({}, props.modelValue, {
    [props.config.keyMap[val.level]]: val.value
  })
  emit('update:modelValue', res)
}

const levelOneConfig = computed(() => {
  const config = props.config

  return {
    type: config.levelOneType,
    options: config.options,
    hideOptionLabel: true,
    default: config.default?.levelOne
  }
})
const levelTwoConfig = computed(() => {
  const config = props.config
  const levelOneVal = data.value.levelOne

  return {
    type: config.levelOneType,
    options: config.options.find((option) => option.value === levelOneVal)?.options ?? [],
    hideOptionLabel: true,
    default: config.default?.levelOne
  }
})
</script>

<style lang="scss">
@use '../style/radio-nest.scss' as *;
</style>
