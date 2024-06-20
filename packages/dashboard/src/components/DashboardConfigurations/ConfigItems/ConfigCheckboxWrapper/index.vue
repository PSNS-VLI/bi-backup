<template>
  <div class="bi-config-item bi-config-item--collapse bi-config-checkbox-wrapper">
    <b-i-config-checkbox
      :config="{
        key: checkboxKey,
        label: config.label,
        type: ConfigItemType.CHECKBOX,
        default: config.defaultCheckbox
      }"
      v-model="data[checkboxKey]"
    ></b-i-config-checkbox>
    <div class="bi-config-checkbox-wrapper__inner">
      <template v-for="subConfig in config.children" :key="subConfig.key">
        <b-i-config-item
          :class="{
            'bi-config-checkbox-wrapper__item--hide':
              includeKeys.includes(subConfig.key) && !data[checkboxKey] && config.hideChildren,
            'bi-config-checkbox-wrapper__item--covered':
              includeKeys.includes(subConfig.key) && !data[checkboxKey]
          }"
          :config="{
            ...subConfig,
            key:
              includeKeys.includes(subConfig.key) && enableBackup
                ? `${defBackupKeyPrefix}${subConfig.key.toString()}__`
                : subConfig.key
          }"
          v-model="data"
        ></b-i-config-item
      ></template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'

import { genComponentName } from '../../../../utils'
import { type ConfigCheckboxWrapper, ConfigItemType } from '../../../../types/configuration'

import BIConfigCheckbox from '../ConfigCheckbox'
import BIConfigItem from '../ConfigItem'

defineOptions({
  name: genComponentName('ConfigCheckboxWrapper')
})
const props = withDefaults(
  defineProps<{
    config: ConfigCheckboxWrapper
    modelValue: Record<string | symbol, any>
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])

const defCheckboxKey = '__checkbox-wrapper__enable__'
const defBackupKeyPrefix = '__checkbox-wrapper__backup__'
const checkboxKey = computed(() => {
  return props.config.checkboxKey ?? defCheckboxKey
})
const includeKeys = computed(() => {
  const keyFilters = props.config.excludeKeys ?? []
  const keys = props.config.children
    .map((item) => item.key)
    .filter((key) => !keyFilters.includes(key))
  return keys
})
const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const enableBackup = ref(false)

if (!props.config.checkboxKey && props.config.hideChildren) {
  watch(
    () => data.value[checkboxKey.value],
    (enable) => {
      const copyData = { ...data.value }
      const delKeys: Array<string | symbol> = []

      includeKeys.value.forEach((key) => {
        if (enable) {
          const backupVal = copyData[`${defBackupKeyPrefix}${key.toString()}__`]
          if (backupVal) copyData[key] = backupVal
        } else {
          if (copyData[key]) {
            copyData[`${defBackupKeyPrefix}${key.toString()}__`] = copyData[key]
          }
          delKeys.push(key)
        }
      })

      data.value = copyData
      enableBackup.value = !enable

      if (enable) {
        delKeys.forEach((key) => {
          delete copyData[key]
        })
      }
    }
  )
}
</script>

<style lang="scss">
@use '../style/common' as *;

.bi-config-checkbox-wrapper {
  &__inner {
    padding-left: var(--bi-config-nest-item-padding-left);
  }

  &__item {
    &--hide {
      display: none;
    }

    &--covered {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
</style>
