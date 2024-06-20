<template>
  <div class="gx-dialog-mask">
    <div class="gx-dialog" v-bind="$attrs">
      <slot name="title">{{ title }}</slot>
      <div class="gx-dialog__content">
        <slot>{{ props.content }}</slot>
      </div>
      <GxActions
        v-if="props.cancelText || props.confirmText"
        :actions="actions"
        align="end"
      ></GxActions>
    </div>
  </div>
</template>

<script setup>
import GxActions from '../GxActions'
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['clickConfirm', 'clickCancel'])

const actions = computed(() => {
  const res = []
  props.cancelText &&
    res.push({
      transparent: true,
      label: props.cancelText,
      handler: () => emit('clickCancel')
    })
  props.confirmText &&
    res.push({
      type: 'main',
      disabled: props.disabled,
      label: props.confirmText,
      handler: () => emit('clickConfirm')
    })
  return res
})
</script>

<style lang="scss">
@use '../style/index' as *;

.gx-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $modal-color;
  z-index: 999;
}

.gx-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  gap: size(16);
  padding: size(24);
  border: size(2) #{rgba($theme-text-color, 0.05)} solid;
  background-color: $dialog-color;
  transform: translate(-50%, -50%);
  &__content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: size(80);
    min-width: size(464);
    @include second-text;
    color: $title-text-color;
  }
}
</style>
