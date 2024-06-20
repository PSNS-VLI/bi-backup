<template>
  <div
    class="bi-side-bar"
    :class="[
      `bi-side-bar--${direction === 'left' ? 'left' : 'right'}`,
      {
        'bi-side-bar--opened': opened
      }
    ]"
  >
    <div class="bi-side-bar__header">
      <div class="bi-side-bar__title">
        <div v-show="opened" class="bi-side-bar__title-inner">
          <slot name="header-title">
            <span>{{ title }}</span></slot
          >
        </div>
        <gx-icon icon-class="icon-s-unfold" @click="() => setOpened(!opened)"></gx-icon>
      </div>
      <div v-show="opened" class="bi-side-bar__header-append">
        <slot name="header-append"></slot>
      </div>
    </div>
    <div v-show="opened" class="bi-side-bar__body">
      <template v-if="tabs.length">
        <b-i-tabs-bar
          :tabs="tabs"
          v-model="activeTab"
          @update:model-value="$emit('update:activeTabName', $event)"
        ></b-i-tabs-bar>
        <div
          class="bi-side-bar__body-content"
          v-for="tab in tabs"
          v-show="tab.name === activeTab"
          :key="tab.name"
        >
          <slot :name="`content-${tab.name}`"></slot>
        </div>
      </template>
      <template v-else>
        <div class="bi-side-bar__body-content">
          <slot name="content"></slot>
        </div>
      </template>
    </div>
    <div v-show="!opened" class="bi-side-bar__shortcuts">
      <template v-if="tabs.length">
        <div
          class="bi-side-bar__shortcut"
          v-for="tab in tabs"
          :key="tab.name"
          @click="onClickShortcut(tab)"
        >
          <slot name="shortcut" :tab="tab">
            <div class="bi-side-bar__shortcut-text">
              <span>{{ tab.label }}</span>
            </div>
          </slot>
        </div>
      </template>
      <template v-else>
        <div class="bi-side-bar__shortcut" @click="setOpened(true)">
          <div class="bi-side-bar__shortcut-text">
            <span>{{ title }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

import { GxIcon } from '@gxhs/ui'

import BITabsBar from '../TabsBar'

import type { BITabsBarTab } from '../types'

defineOptions({
  name: 'BISideBar'
})
interface BISideBarProps {
  modelValue?: boolean
  tabs?: Array<BITabsBarTab>
  activeTabName?: string
  direction?: 'left' | 'right'
  title: string
}
const props = withDefaults(defineProps<BISideBarProps>(), {
  tabs: () => [],
  direction: 'right'
})
const emit = defineEmits(['update:modelValue', 'update:activeTabName'])

/**
 * status
 */
const opened = ref(false)
const setOpened = (val: boolean) => {
  opened.value = val
  emit('update:modelValue', val)
}
watchEffect(() => {
  opened.value = props.modelValue ?? ''
})

/**
 * Tabs
 */
const activeTab = ref('')
watchEffect(() => {
  activeTab.value = props.activeTabName || (props.tabs.length ? props.tabs[0].name : '')
})

/**
 * shortcuts
 */
const onClickShortcut = (tab: BITabsBarTab) => {
  activeTab.value = tab.name
  setOpened(true)
}
</script>

<style lang="scss">
.bi-side-bar {
  --bi-side-bar-width: 240px;
}

.bi-side-bar {
  $bi-side-bar-border: 1px solid var(--bi-color-border-divider, rgba(0, 0, 0, 0.12));

  display: flex;
  flex-direction: column;
  height: 100%;

  @at-root &--left {
    border-right: $bi-side-bar-border;
  }

  @at-root &--right {
    border-left: $bi-side-bar-border;
  }

  @at-root &__header,
    &__body,
    &__shortcuts {
    display: flex;
    flex-direction: column;
  }

  @at-root &__header {
    padding: 0 size(12);
    border-bottom: size(1) solid var(--bi-color-border-divider-weak, rgba(0, 0, 0, 0.06));
  }

  @at-root &__title {
    position: relative;
    display: flex;
    height: size(40);
    align-items: center;

    .gx-icon {
      --gx-icon-padding: 0;
      --gx-icon-hover-bg-color: transparent;

      position: absolute;
      right: 0;
      transform: rotateZ(180deg);
      transition: transform 0.3s;
    }

    @at-root &-inner {
      flex: 1;
      margin-right: size(28);
    }
  }

  @at-root &--opened {
    .bi-side-bar__title {
      .gx-icon {
        transform: rotateZ(0);
      }
    }
  }

  @at-root &__body,
    &__shortcuts {
    flex: 1;
    min-height: 0;
  }

  @at-root &__body-content {
    flex: 1;
    width: var(--bi-side-bar-width);
    min-height: 0;
  }

  @at-root &__shortcut-text {
    width: size(40);
    height: size(60);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    writing-mode: vertical-lr;
  }
}
</style>
