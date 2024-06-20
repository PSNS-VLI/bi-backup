<template>
  <div class="bi-styles-config-panel">
    <el-scrollbar>
      <b-i-collapse-config-panel
        :collapses="configs"
        v-model="data"
        :history-storage-key="historyStorageKey"
      >
        <template v-slot="{ config, configData, updateConfigData }">
          <b-i-config-item
            :config="(() => config as ConfigItemBase)()"
            :model-value="configData"
            @update:model-value="updateConfigData"
          ></b-i-config-item>
        </template>
      </b-i-collapse-config-panel>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { StyleConfig, ConfigItemBase } from '../../../types/configuration'
import { genComponentName } from '../../../utils'

import BICollapseConfigPanel from '../CollapseConfigPanel'
import { BIConfigItem } from '../ConfigItems'

defineOptions({
  name: genComponentName('StylesConfigPanel')
})
const props = withDefaults(
  defineProps<{
    configs: Array<StyleConfig>
    modelValue: any
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])

const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const historyStorageKey = 'styles-panel-history'
</script>

<style lang="scss">
.bi-styles-config-panel {
  height: 100%;
}
</style>
