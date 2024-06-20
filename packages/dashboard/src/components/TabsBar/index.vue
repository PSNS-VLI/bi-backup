<template>
  <div class="bi-tabs-bar">
    <div
      v-for="tab in tabs"
      :key="tab.name"
      class="bi-tabs-bar__tab"
      @click="activeName = tab.name"
    >
      <span
        class="bi-tabs-bar__tab-label"
        :class="{
          active: tab.name === activeName
        }"
        >{{ tab.label }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { BITabsBarTab } from '../types'

defineOptions({
  name: 'BITabsBar'
})

interface BITabsBarProps {
  tabs: Array<BITabsBarTab>
  modelValue: string
}

const props = withDefaults(defineProps<BITabsBarProps>(), {
  tabs: () => []
})

const emit = defineEmits(['update:modelValue'])

const activeName = computed<string>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style lang="scss">
.bi-tabs-bar {
  display: flex;
  gap: size(8);
  height: size(40);
  border-bottom: size(1) solid var(--bi-color-border-divider-weak, rgba(0, 0, 0, 0.06));

  @at-root &__tab {
    flex: 1;
    display: flex;
    justify-content: center;
    height: 100%;

    cursor: pointer;

    @at-root &-label {
      position: relative;
      display: inline-block;
      line-height: size(40);
      color: var(--bi-color-font-secondary, rgba(0, 0, 0, 0.65));
      font-size: size(14);

      &:hover,
      &.active {
        color: var(--bi-color-font-primary, rgba(0, 0, 0, 0.85));
      }

      &.active::after {
        content: '';
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        height: 2px;
        background: var(--bi-color-border-intelligent, linear-gradient(to right, #4671ff, #4da0ff));
      }
    }
  }
}
</style>
