<template>
  <div
    class="bi-dashboard-component-container"
    :class="{
      'bi-dashboard-component-container--focused': element.focused
    }"
    :style="container.containerStyle"
  >
    <div class="bi-dashboard-component-container__options" @click.stop>
      <gx-icon-group :icons="options"></gx-icon-group>
    </div>
    <div
      v-show="container.showHeader"
      class="bi-dashboard-component-container__header"
      :style="(() => container.headerStyle as any)()"
    >
      <div
        v-show="container.showTitle || container.showAnchor"
        class="bi-dashboard-component-container__header-title"
      >
        <b-i-config-label
          v-show="container.showTitle"
          :label="
            Object.assign(
              {
                label: container.title
              },
              container.showTooltip
                ? {
                    tooltip: {
                      description: container.commentContent
                    }
                  }
                : {}
            )
          "
          :style="container.titleStyle"
        ></b-i-config-label>
        <div v-show="container.showAnchor" class="bi-dashboard-component-container__header-anchor">
          <a :href="container.anchorAddress" :target="container.anchorOpenMethod">
            {{ container.anchorText }}
          </a>
          >
        </div>
      </div>
    </div>
    <div v-show="container.showHeaderComment" class="bi-dashboard-component-container__comment">
      {{ container.commentContent }}
    </div>
    <div class="bi-dashboard-component-container__component-wrapper">
      <div v-show="cover" class="bi-dashboard-component-container__component-cover">
        <el-image
          v-show="cover"
          :src="cover"
          style="width: 100%; height: 100%"
          fit="contain"
        ></el-image>
        <div class="bi-dashboard-component-container__component-cover-placeholder">
          <span>当前图表无数据</span>
        </div>
      </div>
      <component
        v-show="!cover"
        class="bi-dashboard-component-container__component"
        :is="element.source?.component"
        :store="element.store"
        :runtime-unikey="element.key"
        :provide-cover="provideCover"
      ></component>
    </div>
    <div v-show="container.showEndnote" class="bi-dashboard-component-container__endnote">
      {{ container.endNoteContent }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'

import { GxIconGroup, type GxIconGroupItem } from '@gxhs/ui'

import type { GridCanvasElementInterface } from '../../types/canvas'
import type { DashboardGlobalConfigStore } from '../../types/app/dashboard'
import type { DashboardChartComponent } from '../../types/component'
import { genComponentName } from '../../utils'

import { BIConfigLabel } from '../DashboardConfigurations'
import { useComponentContainerConfig } from '../DashboardGlobalConfigBar'

import { getComponentContainerConfigData, setCardRadius } from './config'

defineOptions({
  name: genComponentName('DashboardComponentContainer')
})

const props = withDefaults(
  defineProps<{
    element: GridCanvasElementInterface<DashboardChartComponent>
    removeElement: () => void
    globalConfigStore?: DashboardGlobalConfigStore
  }>(),
  {}
)

const container = computed(() => getComponentContainerConfigData(props.element.store.styles ?? {}))
const watchStopHandle = watch(
  () => ({
    configStore: props.globalConfigStore,
    elementStore: props.element.store.styles
  }),
  ({ configStore, elementStore }) => {
    if (configStore && elementStore) {
      useComponentContainerConfig(configStore, (configData) => {
        setCardRadius(props.element.store.styles, configData.cardRadius)
      })
      setTimeout(() => watchStopHandle())
    }
  },
  { immediate: true }
)

const options: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-more-horizontal',
    children: [
      {
        iconClass: 'icon-delete',
        title: '删除',
        onClick: () => {
          props.removeElement()
        }
      }
    ]
  }
]

const cover = ref('')
const provideCover = (coverUrl: string) => {
  cover.value = coverUrl
}
</script>

<style lang="scss">
.bi-dashboard-component-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: size(8) size(12);
  background-color: #fff;

  &__options {
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
    z-index: 1;
    cursor: pointer;
  }

  &:hover {
    box-shadow: 0 6px 10px 0 #d8d7dc;

    .bi-dashboard-component-container__options {
      display: block;
    }
  }

  &--focused::after {
    position: absolute;
    content: '';
    border-radius: inherit;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 0 1px #468cff;
    pointer-events: none;
  }

  &__header {
    &-title {
      position: relative;
      min-height: 20px;
      margin-bottom: 4px;
    }

    &-anchor {
      position: absolute;
      top: 50%;
      right: 30px;
      height: 20px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.8);
      z-index: 1;
      transform: translateY(-50%);
      cursor: pointer;

      &:hover {
        opacity: 0.5;
      }
    }
  }

  &__component-wrapper {
    position: relative;
    flex: 1;
    min-height: 10px;
    overflow: hidden;
  }

  &__component {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    cursor: auto;

    &-cover {
      position: relative;
      width: 100%;
      height: 100%;

      &-placeholder {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }

  &__comment,
  &__endnote {
    font-size: 12px;
  }
}
</style>
