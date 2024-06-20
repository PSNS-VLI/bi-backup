<template>
  <div class="gx-input" :class="props.class" :style="props.style">
    <input
      style="display: none"
      type="file"
      ref="inputFileRef"
      @change="handleFileChange($event, $emit)"
      v-bind="filterAttrs($attrs, ['type'])"
    />
    <el-tooltip
      placement="top"
      :disabled="!(props.tooltip || uploadFile)"
      :content="props.tooltip || (uploadFile ? $attrs['model-value'] || $attrs['modelValue'] : '')"
    >
      <el-input
        clearable
        :type="uploadFile ? 'text' : props.type"
        :readonly="uploadFile"
        @click="uploadFile && inputFileRef.click()"
        :class="{
          'prepend-transparent': props.prependTransparent,
          'append-transparent': props.appendTransparent
        }"
        v-bind="$attrs"
      >
        <template #prepend v-if="props.prepend">
          <slot name="prepend">
            <Prepend @click="$emit('clickPrepend')" />
          </slot>
        </template>
        <template #append v-if="props.append">
          <slot name="append">
            <Append @click="$emit('clickAppend')" />
          </slot>
        </template>
      </el-input>
    </el-tooltip>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'

import { filterAttrs } from '../utils/attribute-filter'

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  prepend: {
    type: String
  },
  prependMode: {
    type: String,
    default: 'text'
  },
  prependTransparent: {
    type: Boolean,
    default: false
  },
  append: {
    type: String
  },
  appendMode: {
    type: String,
    default: 'text'
  },
  appendTransparent: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String
  },
  class: {
    type: [String, Array, Object]
  },
  style: {
    type: [String, Object]
  }
})
const emit = defineEmits(['fileChange', 'clickPrepend', 'clickAppend'])

const uploadFile = computed(() => props.type === 'file')
const inputFileRef = ref(null)
const handleFileChange = (e) => {
  emit('update:modelValue', e.target.files[0]?.name || '')
  emit('fileChange', e)
}

const spliter = (mode) => (mode ? mode.split(' ') : [])
const getPend = (modes, paddings) => {
  modes = spliter(modes)
  paddings = spliter(paddings)
  return h(
    'div',
    { class: 'gx-input__pend' },
    modes.map((mode, index) => {
      const padding = paddings?.[index]
      if (!padding) return
      let res
      switch (mode) {
        case 'icon':
          res = h('span', { class: ['iconfont', `icon-${padding}`] })
          break
        default:
          res = h('span', [padding])
          break
      }
      return res
    })
  )
}

const Prepend = computed(() => getPend(props.prependMode, props.prepend))
const Append = computed(() => getPend(props.appendMode, props.append))
</script>

<style lang="scss" scoped>
@use '../style/index' as *;
@use 'gx-input' as *;

.gx-input {
  flex: 1;
  :deep(.gx-input__pend) {
    display: flex;
    align-items: center;
    gap: size(4);
    cursor: pointer;
  }
  :deep(.el-input) {
    @include gx-input;
    .el-input-group__prepend,
    .el-input-group__append {
      --el-fill-color-light: #{rgba($theme-text-color, 0.4)};
      --el-color-info: #{$secondary-text-color};
      padding: 0 size(12);
      &:hover {
        --el-fill-color-light: #{$hover-button-color};
      }
    }
    &.prepend-transparent .el-input-group__prepend,
    &.append-transparent .el-input-group__append {
      --el-fill-color-light: #{$input-fill-color};
      --el-color-info: #{$theme-text-color};
    }
    &.prepend-transparent,
    &.append-transparent {
      .el-input__wrapper {
        box-shadow:
          0 size(1) 0 0 var(--el-input-border-color) inset,
          0 size(-1) 0 0 var(--el-input-border-color) inset;
      }
    }
  }
  :deep(.el-textarea) {
    height: 100%;
    width: 100%;
    --el-input-bg-color: #{$input-fill-color};
    --el-fill-color-blank: #{$input-fill-color};
    --el-input-text-color: #{$secondary-text-color};
    --el-input-border-color: #{$input-border-color};
    --el-input-hover-border-color: #{$input-border-color};
    --el-input-focus-border-color: #{$input-border-color};
    --el-font-size-base: #{size(14)};
    .el-textarea__inner {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
