<template>
  <div
    class="bi-field-config"
    :class="{
      'bi-field-config--hovering': hovering
    }"
    @dragover.prevent
    @dragenter="hovering = true"
    @dragleave="hovering = false"
    @drop="onDataDrop($event, config)"
  >
    <b-i-config-label class="bi-field-config__label" :label="config">
      <template #title-prefix>
        <span v-if="config.required" class="bi-field-config__label-required">*</span>
      </template>
      <template #behind>
        <div class="bi-field-config-label__behind">
          <span v-if="config.fieldsNumLimit" class="bi-field-config__label-limit"
            >{{ fieldsData.length }} / {{ config.fieldsNumLimit }}</span
          >
          <gx-icon
            v-if="config.type !== FieldConfigType.FIELD_FILTER"
            icon-class="icon-setting"
          ></gx-icon>
        </div>
      </template>
    </b-i-config-label>
    <div class="bi-field-config__fields">
      <span
        v-if="!fieldsData.length"
        class="bi-field-config__fields-placeholder"
        title="拖动数据字段到此处"
      >
        拖动数据字段到此处
      </span>
      <template v-else>
        <div
          v-for="(fieldData, index) in fieldsData"
          :key="fieldData"
          class="bi-field-config__field"
          draggable="true"
        >
          <slot
            :fieldConfig="config"
            :fieldData="fieldData"
            :index
            :addField="addField"
            :deleteField="(fieldIndex?: number) => deleteField(fieldIndex ?? index)"
            :updateField="
              (field: any, fieldIndex?: number) => updateField(fieldIndex ?? index, field)
            "
          ></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

import { GxIcon } from '@gxhs/ui'

import { BIConfigLabel } from '../ConfigItems'

import { FieldConfigType, type FieldConfig } from '../../../types/configuration'

defineOptions({
  name: 'BIFieldConfig'
})
const props = withDefaults(
  defineProps<{
    config: FieldConfig
    modelValue: Array<any>
    onDataDropHook?: (event: DragEvent, fieldConfig: FieldConfig) => any
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])

const fieldsData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const addField = (field: any, index?: number) => {
  const fieldsLimit = props.config.fieldsNumLimit ?? 0
  if (fieldsLimit > 0 && fieldsData.value.length === fieldsLimit) {
    ElMessage.warning({
      message: `已超过[${props.config.label}]最多可添加项数量（${fieldsLimit}）`
    })
  } else {
    fieldsData.value.splice(index ?? fieldsData.value.length, 0, field)
  }
}
const deleteField = (index: number) => {
  fieldsData.value.splice(index, 1)
}
const updateField = (index: number, field: any) => {
  fieldsData.value.splice(index, 1, field)
}

const hovering = ref(false)

const onDataDrop = (event: DragEvent, fieldConfig: FieldConfig) => {
  if (typeof props.onDataDropHook === 'function') {
    const data = props.onDataDropHook(event, fieldConfig)
    if (data) {
      addField(data)
    }
  }
  hovering.value = false
}
</script>

<style lang="scss">
.bi-field-config {
  position: relative;
  padding: 8px 12px 16px;
  border-bottom: 1px solid var(--bi-color-border-divider-weak, rgba(0, 0, 0, 0.06));
  font-size: 12px;

  @at-root &--hovering {
    background-color: rgba(0, 0, 0, 0.06);

    & * {
      pointer-events: none;
    }
  }

  @at-root &__label {
    margin: 4px 0 8px;

    @at-root &-required {
      margin-right: 6px;
      color: #f23c3c;
    }

    @at-root &-limit {
      padding-right: 4px;
      color: var(--bi-color-font-secondary, rgba(0, 0, 0, 0.65));
    }
  }

  @at-root &__fields {
    display: flex;
    flex-direction: column;
    min-height: 28px;
    margin: 4px 0 4px;
    border: 1px dashed var(--bi-color-border-divider, rgba(0, 0, 0, 0.1));
    border-radius: 4px;
  }

  @at-root &__fields-placeholder {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--bi-color-font-hint, rgba(0, 0, 0, 0.25));
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @at-root &__field {
    margin-bottom: 6px;
  }
}
</style>
