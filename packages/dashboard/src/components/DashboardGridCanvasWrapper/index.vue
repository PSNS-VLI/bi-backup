<template>
  <div class="bi-dashboard-grid-canvas-wrapper">
    <el-scrollbar wrap-style="display:flex;flex-direction: column;" view-style="flex: 1;">
      <div class="bi-dashboard-grid-canvas-wrapper__inner" :style="configData.inner?.style">
        <div
          class="bi-dashboard-grid-canvas-wrapper__header"
          :style="configData.header?.style"
        ></div>
        <div class="bi-dashboard-grid-canvas-wrapper__body">
          <div class="bi-dashboard-grid-canvas-wrapper__title">
            <div
              class="bi-dashboard-grid-canvas-wrapper__title-content"
              v-show="configData.header?.title.showTitle"
              :style="configData.header?.title.wrapperStyle"
            >
              <el-image
                class="bi-dashboard-grid-canvas-wrapper__title-logo"
                :style="{
                  width: 'fit-content',
                  height: `${(Number.parseInt(configData.header?.title.textStyle.fontSize) * 4) / 3}px`
                }"
                v-show="configData.header?.title.logo"
                :src="configData.header?.title.logo"
              ></el-image>
              <div
                class="bi-dashboard-grid-canvas-wrapper__title-text"
                :style="configData.header?.title.textStyle"
              >
                <span>{{ props.globalConfigStore?.__BI_GLOBAL_CONFIG__?.name }}</span>
              </div>
            </div>
            <div
              class="bi-dashboard-grid-canvas-wrapper__title-comment"
              :style="configData.header?.comment.style"
              v-show="configData.header?.comment.value"
            >
              <div class="bi-dashboard-grid-canvas-wrapper__comment">
                <span>{{ configData.header?.comment.value }}</span>
              </div>
            </div>
          </div>
          <div class="bi-dashboard-grid-canvas-wrapper__content">
            <slot></slot>
          </div>
          <div
            class="bi-dashboard-grid-canvas-wrapper__endnote"
            :style="configData.footer?.comment.style"
            v-show="configData.footer?.comment.value"
          >
            <div class="bi-dashboard-grid-canvas-wrapper__comment">
              <span>{{ configData.footer?.comment.value }}</span>
            </div>
          </div>
        </div>
        <div
          class="bi-dashboard-grid-canvas-wrapper__footer"
          :style="configData.footer?.style"
        ></div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { genComponentName } from '../../utils'
import { type DashboardGlobalConfigStore } from '../../types/app/dashboard'

import { useDashboardConfig, type DashboardConfigData } from '../DashboardGlobalConfigBar'

defineOptions({
  name: genComponentName('DashboardGridCanvasWrapper')
})
const props = withDefaults(
  defineProps<{
    globalConfigStore?: DashboardGlobalConfigStore
  }>(),
  {}
)

const configData = ref<DashboardConfigData>({})
const watchStopHandle = watch(
  () => props.globalConfigStore,
  (configStore?: DashboardGlobalConfigStore) => {
    if (configStore) {
      useDashboardConfig(configStore, (dashboardConfigData) => {
        configData.value = dashboardConfigData
      })
      watchStopHandle()
    }
  }
)
</script>

<style lang="scss">
.bi-dashboard-grid-canvas-wrapper {
  height: 100%;

  &__inner {
    position: relative;
    height: 100%;
  }

  &__header,
  &__footer {
    position: absolute;
    left: 0;
    right: 0;
    max-height: 50%;
  }

  &__header {
    top: 0;
  }

  &__footer {
    bottom: 0;
  }

  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    z-index: 1;
  }

  &__content {
    flex: 1;
    min-height: 0;
  }

  &__comment {
    padding: 8px;
  }

  &__title {
    &-content {
      display: flex;
    }

    &-comment {
      margin-top: 8px;
    }
  }
}
</style>
