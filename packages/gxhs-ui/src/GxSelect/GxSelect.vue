<template>
  <div class="gx-select" :class="props.class" :style="props.style">
    <el-select
      clearable
      filterable
      @blur="
        booleanVueAttribute($attrs, 'allowCreate') &&
          props.autoSelect &&
          !booleanVueAttribute($attrs, 'multiple') &&
          autoUpdate($emit, $event)
      "
      v-bind="$attrs"
      :class="{ 'has-prefix': props.append }"
    >
      <el-option
        v-for="item in props.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
      <template #prefix v-if="props.append">
        <slot name="prefix">
          <Prefix @click="$emit('clickAppend')" />
        </slot>
      </template>
    </el-select>
  </div>
</template>

<script setup>
import { booleanVueAttribute } from '../utils/attribute-convert'
import { computed, h } from 'vue'

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  autoSelect: {
    type: Boolean,
    default: false
  },
  class: {
    type: [String, Array, Object]
  },
  style: {
    type: [String, Object]
  },
  append: {
    type: String
  },
  appendMode: {
    type: String,
    default: 'text'
  }
})
const autoUpdate = ($emit, $event) => {
  $emit('update:model-value', $event.target.value)
  $emit('change', $event.target.value)
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
const Prefix = computed(() => getPend(props.appendMode, props.append))
</script>
<style scoped lang="scss">
@use '../style/index' as *;

.gx-select {
  flex: 1;
  :deep(.el-select) {
    --el-fill-color: #{rgba($theme-text-color, 0.4)};
    --el-color-info: #{$title-text-color};
    --el-disabled-bg-color: #{$input-fill-color};
    --el-disabled-border-color: #{$input-border-color};
    width: 100%;
    height: 100%;
    &.has-prefix {
      .el-input__prefix {
        flex: 1;
        height: 100%;
        display: inline-flex;
        justify-content: center;
        position: absolute;
        background: $main-button-color;
        border-radius: 5%;
        padding: size(10);
        margin: size(1);
        color: $secondary-text-color;
        align-items: center;
        right: 0;
        &:hover {
          background: #{rgba($main-button-color, 0.85)};
        }
        .el-input__prefix-inner > :last-child {
          margin-right: 0;
        }
      }
      //×尾缀固定宽度了，后期优化
      .el-input__suffix {
        margin-right: size(40);
      }
    }
    .select-trigger {
      height: 100%;
    }
    .el-input {
      height: 100%;
      min-height: size(32);
      --el-input-bg-color: #{$input-fill-color};
      --el-input-text-color: #{$secondary-text-color};
      --el-input-border-color: #{$input-border-color};
      --el-select-border-color-hover: #{$input-border-color};
      --el-select-input-focus-border-color: #{$input-border-color};
      --el-font-size-base: #{size(14)};
    }
    .el-tag {
      height: size(28);
      padding: 0 size(8);
      border: size(1) #{rgba($theme-text-color, 0.4)} solid;
      border-radius: size(2);
      --el-tag-font-size: #{size(14)};
      --el-tag-hover-color: transparent;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.6;
      }
    }
    .el-tag__content {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .el-icon {
      height: 100%;
      display: flex;
      align-items: center;
      width: max-content;
      svg {
        height: size(12);
        width: size(12);
      }
    }
    .el-tag__close:before {
      font-family: 'Courier New', Courier, monospace;
      content: '|';
      width: size(16);
      font-size: size(18);
      line-height: 100%;
      color: rgba(white, 0.2);
    }
  }
}
</style>
