<template>
  <div class="gx-action" :class="gxActionClass" v-bind="filterAttrs($attrs)">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { filterAttrs as originFilter } from '../utils/attribute-filter'

defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  auto: {
    type: Boolean,
    default: false
  },
  flow: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  transparent: {
    type: Boolean,
    default: false
  }
})

const gxActionClass = computed(() => ({
  transparent: props.transparent,
  auto: props.auto,
  flow: props.flow,
  disabled: props.disabled
}))
const filterAttrs = (origin, dross = []) =>
  originFilter(origin, (props.disabled ? ['onClick'] : []).concat(dross))
</script>

<style scoped lang="scss">
@use '../style/index' as *;

.gx-action {
  @include plain-text;
  display: flex;
  justify-content: center;
  align-items: center;
  width: size(80);
  height: size(30);
  border: size(2) #{rgba($theme-text-color, 0.4)} solid;
  color: $main-text-color;
  background-color: $main-button-color;
  border-radius: 4px;
  cursor: pointer;
  &.transparent {
    background-color: unset;
    color: #606266;
    border: 1px solid $input-border-color;
  }
  &:hover,
  &:active {
    background-color: $hover-button-color;
  }
  &.auto {
    width: auto;
    padding: 0 size(8);
  }
  &.flow {
    width: 100%;
  }
  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
