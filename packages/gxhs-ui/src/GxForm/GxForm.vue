<template>
  <div class="gx-form">
    <el-form
      ref="formSelf"
      :model="formData"
      v-bind="filterAttrs($attrs, ['model'], { labelWidth: 100 })"
    >
      <template v-for="item in formItems" :key="item.key">
        <slot :form-item="item" :form-data="formData" :set-data="setData">
          <el-tooltip :disabled="!item.tooltip" :content="item.tooltip">
            <el-form-item
              :label="item.label"
              :prop="item.key"
              :rules="formRules[item.key] || []"
              :style="Object.assign({}, props.formItemStyle, item.itemStyle)"
            >
              <template v-if="(item.itemType || FORM_ITEM_TYPE.INPUT) === FORM_ITEM_TYPE.INPUT">
                <GxInput
                  style="height: 100%"
                  :model-value="formData[item.key]"
                  @update:model-value="setData(item.key, $event)"
                  @change="onFormItemComplete(item, $event)"
                  v-bind="filterAttrs(item, ['style'])"
                >
                  <template #prepend v-if="item.prependMode === 'custom'">
                    <slot :name="`${item.prepend || item.key}-prepend`"></slot>
                  </template>
                  <template #append v-if="item.appendMode === 'custom'">
                    <slot :name="`${item.append || item.key}-append`"></slot>
                  </template>
                </GxInput>
              </template>
              <template v-else-if="item.itemType === FORM_ITEM_TYPE.SELECT">
                <GxSelect
                  style="height: 100%"
                  :model-value="formData[item.key]"
                  @update:model-value="setData(item.key, $event)"
                  :options="item.remote ? formAttach?.[item.key]?.options : item.options"
                  :remote-method="getAttach(item.key, 'remoteMethod')"
                  :loading="getAttach(item.key, 'loading')"
                  @change="onFormItemComplete(item, $event)"
                  @clear="onFormItemComplete(item, $event)"
                  v-bind="filterAttrs(item, ['options', 'remoteMethod', 'loading', 'style'])"
                >
                </GxSelect>
              </template>
              <template v-else-if="item.itemType === FORM_ITEM_TYPE.CASCADER">
                <el-cascader
                  clearable
                  :model-value="formData[item.key]"
                  @update:model-value="setData(item.key, $event)"
                  :props="{ checkStrictly: true }"
                  @change="onFormItemComplete(item, $event)"
                  v-bind="filterAttrs(item)"
                ></el-cascader>
              </template>
              <template v-else-if="item.itemType === 'date'">
                <el-date-picker
                  :model-value="formData[item.key]"
                  @update:model-value="setData(item.key, $event)"
                  start-placeholder="开始时间"
                  range-separator="-"
                  end-placeholder="结束时间"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="onFormItemComplete(item, $event)"
                  v-bind="filterAttrs(item)"
                />
              </template>
              <template v-else-if="item.itemType === FORM_ITEM_TYPE.TEXT">
                <div class="gx-form-item--text" v-bind="filterAttrs(item, ['formatter'])">
                  <span>{{
                    typeof item.formatter === 'function'
                      ? item.formatter(formData[item.key])
                      : formData[item.key]
                  }}</span>
                </div>
              </template>
              <template v-else-if="item.itemType === FORM_ITEM_TYPE.RADIO">
                <el-radio-group v-model="formData[item.key]">
                  <el-radio v-for="radios in item.children" :key="radios" :label="radios">
                  </el-radio>
                </el-radio-group>
              </template>
              <template v-else-if="item.itemType === FORM_ITEM_TYPE.CUSTOM">
                <div class="gx-form-item--custom">
                  <slot
                    :item-data="formData[item.key]"
                    :set-data="(val) => setData(item.key, val)"
                    :item-complete="(curVal) => onFormItemComplete(item, curVal)"
                    :name="item.scopeName || item.key"
                    v-bind="filterAttrs(item, ['scopeName'])"
                  ></slot>
                </div>
              </template>
            </el-form-item>
          </el-tooltip>
        </slot>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import { computed, readonly, watch, watchEffect, ref } from 'vue'
import GxInput from '../GxInput'
import GxSelect from '../GxSelect'

import FORM_ITEM_TYPE from './form-item-type'
import { filterAttrs as originFilter } from '../utils/attribute-filter'
import cloneDeep from 'lodash/cloneDeep'

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  form: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  formItemStyle: {
    type: Object
  }
})
const emit = defineEmits(['update:modelValue', 'complete'])

const COMMON_KEYS = ['itemType', 'key', 'label', 'required', 'rules', 'cleaner', 'tooltip']
const filterAttrs = (formItem, keys = [], reserve) => {
  return originFilter(formItem, COMMON_KEYS.concat(keys), reserve)
}
const formItems = computed(() =>
  props.form.map((item) => {
    const placeholderSuffix = item.label
    let placeholderPrefix = ''
    switch (item.itemType) {
      case 'input':
        placeholderPrefix = '请输入'
        break
      case 'select':
        placeholderPrefix = '请选择'
        break
      case 'cascader':
        placeholderPrefix = '请选择'
        break
      default:
        placeholderPrefix = '请完善'
        break
    }
    return Object.assign({ placeholder: placeholderPrefix + placeholderSuffix }, item)
  })
)
const formCleaner = {}
const formRules = ref({})
const formAttach = ref({})
const getAttach = (key, attachKey) => {
  const attach = formAttach.value[key]
  return attach ? attach[attachKey] : null
}
const setAttach = (key, attachKey, val) => {
  formAttach.value[key][attachKey] = val
}
const clearOptions = (keys) => {
  keys.forEach((key) => setAttach(key, 'options', []))
}
const formBasic = computed(() =>
  props.form.reduce((pre, cur) => {
    if (cur.itemType === 'select' && cur.remote) {
      const attachOption = formAttach.value[cur.key]?.options || []
      const initOption = (cur.options?.length ? cur.options.concat(attachOption) : []).reduce(
        (options, option) => {
          if (!options.map((item) => item?.value || '').includes(option?.value))
            options.push(option)
          return options
        },
        []
      )
      formAttach.value[cur.key] = {
        remoteMethod: async (val) => {
          formAttach.value[cur.key]['loading'] = true
          formAttach.value[cur.key]['options'] =
            typeof cur.remoteMethod === 'function'
              ? await cur.remoteMethod(val, readonly(props.modelValue), clearOptions)
              : initOption
          formAttach.value[cur.key]['loading'] = false
        },
        options: initOption,
        loading: false
      }
    }
    const rules = cur.rules?.length
      ? cur.rules.map((item) => {
          return item.validator
            ? {
                ...item,
                validator: (rule, value, callback) =>
                  item.validator(rule, value, callback, readonly(props.modelValue))
              }
            : item
        })
      : []
    if (cur.required) rules.push({ required: true, message: `${cur.label || '此项'}是必填项` })
    formRules.value[cur.key] = rules
    if (typeof cur.cleaner === 'function') formCleaner[cur.key] = cur.cleaner
    pre[cur.key] = ''
    return pre
  }, {})
)
const formData = computed({
  get: () => Object.assign({}, formBasic.value, props.modelValue),
  set: (val) => emit('update:modelValue', val)
})
const setData = (key, value) => {
  formData.value = Object.assign({}, formData.value, { [key]: value ?? '' })
}

let formDataBackup = cloneDeep(props.modelValue)
watchEffect(() => {
  Object.assign(formDataBackup, formBasic.value)
})

const formSelf = ref(null)
const onFormItemComplete = (formItem, current) => {
  const key = formItem.key

  // 这里解决级联校验异常的情况，这是临时解决方案
  if (formItem.itemType === FORM_ITEM_TYPE.CASCADER) {
    setTimeout(() => formSelf.value.validateField(formItem.key))
  }

  const previous = cloneDeep(formDataBackup[key])
  if (previous == current) return
  formDataBackup[key] = current
  emit('complete', {
    trigger: cloneDeep(formItem),
    previous,
    current,
    formData: cloneDeep(formDataBackup)
  })
}
watch(
  () => props.form,
  () => {
    setTimeout(() => formSelf.value.clearValidate())
  }
)
const submit = async () => {
  let data = {}
  let effective = false
  await formSelf.value.validate((valid) => {
    effective = valid
    if (valid) {
      const tmpFormData = JSON.parse(JSON.stringify(formData.value))
      data = Object.keys(tmpFormData).reduce((pre, cur) => {
        const val = tmpFormData[cur]
        const clr = formCleaner[cur]
        pre[cur] = clr ? clr(val) : val
        return pre
      }, {})
    }
  })
  return {
    valid: effective,
    data
  }
}
defineExpose({
  submit,
  resetFields: () => formSelf.value.resetFields()
})
</script>

<style lang="scss" scoped>
@use '../style/index' as *;
@use '../GxInput/gx-input' as *;

.gx-form {
  flex: 1;
  --gx-item-height: #{size(38)};
  .gx-form-item {
    &--text {
      color: $secondary-text-color;
      @include plain-text;
    }
    &--custom {
    }
  }
  :deep(.el-form) {
    --el-text-color-regular: #{$title-text-color};
    --el-form-label-font-size: #{size(14)};
    .el-form-item {
      height: var(--gx-item-height);
      &__label {
        color: $secondary-text-color;
        height: var(--gx-item-height);
        line-height: var(--gx-item-height);
      }
    }
    &.el-form--inline {
      display: flex;
      flex-wrap: wrap;
      gap: size(24);
      .el-form-item {
        min-width: size(300);
        width: size(300);
        margin: 0;
      }
    }
  }
  :deep(.el-date-editor) {
    height: 100%;
    --el-fill-color-blank: #{$input-fill-color};
    --el-input-bg-color: #{$input-fill-color};
    --el-input-text-color: #{$secondary-text-color};
    --el-input-border-color: #{$input-border-color};
    --el-input-hover-border-color: #{$input-border-color};
    --el-input-focus-border-color: #{$input-border-color};
    --el-font-size-base: #{size(14)};
    .el-input__icon {
      display: flex;
    }
  }
  :deep(.el-cascader) {
    flex: 1;
    height: 100%;
    .el-input {
      @include gx-input;
    }
  }
  :deep(.el-radio) {
    --el-radio-text-color: #606266;
  }
}
</style>
