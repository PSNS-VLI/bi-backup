<template>
  <div class="bi-fields-config-panel">
    <div class="bi-fields-config-panel__config">
      <el-scrollbar>
        <div class="bi-fields-config-panel__config-fields">
          <b-i-field-config
            v-for="field in configs"
            :key="field.key"
            v-model="data[field.key]"
            :config="field"
            :on-data-drop-hook="onFieldDataDropHook"
          >
            <template v-slot="fieldAttributes">
              <slot
                v-bind="fieldAttributes"
                :fieldsConfig="configs"
                :fieldsData="data"
                name="field"
              ></slot>
            </template>
          </b-i-field-config>
        </div>
        <div class="bi-fields-config-panel__config-auto-update">
          <el-checkbox v-model="requestConfig.autoUpdate">自动刷新</el-checkbox>
          <b-i-config-input-number
            v-show="requestConfig.autoUpdate"
            :config="
              (() =>
                ({
                  attribute: {
                    min: requestConfig.autoUpdateGapToSecond === 60 ? 1 : 5
                  }
                }) as unknown as ConfigInputNumber)()
            "
            v-model="requestConfig.autoUpdateGap"
          ></b-i-config-input-number>
          <el-select
            v-show="requestConfig.autoUpdate"
            v-model="requestConfig.autoUpdateGapToSecond"
          >
            <el-option label="分" :value="60"></el-option>
            <el-option label="秒" :value="1"></el-option>
          </el-select>
        </div>
      </el-scrollbar>
    </div>
    <div class="bi-fields-config-panel__request">
      <div class="bi-fields-config-panel__request__res-num">
        <span>结果展示</span>
        <b-i-config-input-number
          :config="(() => ({}) as ConfigInputNumber)()"
          v-model="requestConfig.resultNum"
        ></b-i-config-input-number>
      </div>
      <el-button
        class="bi-fields-config-panel__request__update-button"
        type="primary"
        @click="$emit('updateData')"
        >更新</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BIFieldConfig from '../FieldConfig'

import type { FieldConfig, ConfigInputNumber } from '../../../types/configuration'
import type { Key } from '../../../types/common'

import { BIConfigInputNumber } from '../ConfigItems'

defineOptions({
  name: 'BIFieldsConfigPanel'
})
const props = withDefaults(
  defineProps<{
    configs: Array<FieldConfig>
    modelValue: Record<Key, any>
    requestConfigData: Record<Key, any>
    onFieldDataDropHook?: (event: DragEvent, fieldConfig: FieldConfig) => any
  }>(),
  {
    configs: () => []
  }
)
const emit = defineEmits(['update:modelValue', 'updateData', 'update:requestConfigData'])
const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

type RequestConfigData = {
  resultNum: number
  autoUpdate: boolean
  autoUpdateGap: number
  autoUpdateGapToSecond: number
}
const requestConfig = computed<RequestConfigData>({
  get: () => {
    const data = props.requestConfigData
    const dataTemp = {
      resultNum: 100,
      autoUpdate: false,
      autoUpdateGap: 5,
      autoUpdateGapToSecond: 60
    }

    if (!data) {
      emit('update:requestConfigData', dataTemp)
    }

    return (data ?? dataTemp) as RequestConfigData
  },
  set: (val) => {
    emit('update:requestConfigData', Object.assign(props.requestConfigData, val))
  }
})
</script>

<style lang="scss">
.bi-fields-config-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  &__config {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    &-auto-update {
      display: flex;
      gap: 4px;
      padding: 8px 12px;

      .bi-config-input-number {
        flex: 1;
      }
      .el-select {
        --el-select-width: 60px;
      }
    }
  }

  &__request {
    &__res-num {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      height: 40px;
      background: var(--bi-color-surface-hovereffect, rgba(0, 0, 0, 0.04));
      font-size: 12px;
    }

    &__update-button {
      width: 100%;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
