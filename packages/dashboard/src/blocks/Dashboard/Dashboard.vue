<template>
  <div class="bi-dashboard">
    <b-i-dashboard-menu-bar
      v-show="dashboard.barsDisplayStatus.menuBar"
      ref="menuBar"
    ></b-i-dashboard-menu-bar>
    <div class="bi-dashboard__content">
      <div class="bi-dashboard__content-inner">
        <b-i-dashboard-tool-bar
          v-show="dashboard.barsDisplayStatus.toolBar"
          ref="toolBar"
        ></b-i-dashboard-tool-bar>
        <div class="bi-dashboard__content-main">
          <div
            class="bi-dashboard__components-panel"
            :class="{
              'bi-dashboard__components-panel--fixed': dashboard.componentsPanelFixed
            }"
          >
            <b-i-dashboard-components-bar
              v-show="dashboard.barsDisplayStatus.componentsBar"
              ref="componentsBar"
            ></b-i-dashboard-components-bar>
          </div>
          <b-i-dashboard-grid-canvas-wrapper
            class="bi-dashboard__canvas-wrapper"
            :global-config-store="globalConfigStore"
          >
            <b-i-dashboard-grid-canvas ref="canvasSelf">
              <template #element="{ element, removeElement }">
                <b-i-dashboard-component-container
                  :element="element"
                  :remove-element="removeElement"
                  :global-config-store="globalConfigStore"
                ></b-i-dashboard-component-container>
              </template>
            </b-i-dashboard-grid-canvas>
          </b-i-dashboard-grid-canvas-wrapper>
        </div>
      </div>

      <div class="bi-dashboard__side-bars">
        <b-i-dashboard-global-config-bar
          v-show="dashboard.barsDisplayStatus.globalConfigBar"
          ref="globalConfigBar"
        ></b-i-dashboard-global-config-bar>
        <b-i-dashboard-chart-config-bar
          v-show="dashboard.barsDisplayStatus.chartConfigBar"
          ref="chartConfigBar"
        ></b-i-dashboard-chart-config-bar>
        <b-i-dashboard-dataset-bar
          v-show="dashboard.barsDisplayStatus.datasetBar"
          ref="datasetBar"
        ></b-i-dashboard-dataset-bar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BIDashboardMenuBar from '../../components/DashboardMenuBar'
import BIDashboardToolBar from '../../components/DashboardToolBar'
import BIDashboardComponentsBar from '../../components/DashboardComponentsBar'
import BIDashboardGlobalConfigBar from '../../components/DashboardGlobalConfigBar'
import BIDashboardChartConfigBar from '../../components/DashboardChartConfigBar'
import BIDashboardDatasetBar from '../../components/DashboardDatasetBar'
import BIDashboardGridCanvasWrapper from '../../components/DashboardGridCanvasWrapper'
import BIDashboardGridCanvas from '../../components/DashboardGridCanvas'
import BIDashboardComponentContainer from '../../components/DashboardComponentContainer'
import { DashboardApi } from '../../components/DashboardInterface'
import { BIDashboardEngine } from '../../engine'

import { DashboardBlockName } from '../types'

import { DashboardContainer } from './dashboard'

defineOptions({
  name: 'BIDashboard'
})

/**
 * init
 */
const router = useRouter()
const route = useRoute()
const devMode = route.path === router.resolve({ name: DashboardBlockName.DashboardWorkspace }).path

/**
 * [container] dashboard
 */
const dashboard = reactive(new DashboardContainer(devMode ? 'DEVELOPMENT' : 'PRODUCT'))

/**
 * [menubar]
 */
const menuBar = ref<InstanceType<typeof BIDashboardMenuBar> | null>(null)

/**
 * [toolBar]
 */
const toolBar = ref<InstanceType<typeof BIDashboardToolBar> | null>(null)

/**
 * [sideBar]
 */
// [sideBar] components bar
const componentsBar = ref<InstanceType<typeof BIDashboardComponentsBar> | null>(null)

//[sideBar] configurations bar
const globalConfigBar = ref<InstanceType<typeof BIDashboardGlobalConfigBar> | null>(null)
const globalConfigStore = computed(() => {
  return globalConfigBar.value?.instance.configData
})
const chartConfigBar = ref<InstanceType<typeof BIDashboardChartConfigBar> | null>(null)
const datasetBar = ref<InstanceType<typeof BIDashboardDatasetBar> | null>(null)

/**
 * [content] canvas
 */
const canvasSelf = ref<InstanceType<typeof BIDashboardGridCanvas> | null>(null)

onMounted(async () => {
  if (menuBar.value) {
    dashboard.bindBar('menuBar', menuBar.value.instance)
  }

  if (toolBar.value) {
    dashboard.bindBar('toolBar', toolBar.value.instance)
  }

  if (componentsBar.value) {
    dashboard.bindBar('sideBars', componentsBar.value.instance)
  }

  if (globalConfigBar.value) {
    dashboard.bindBar('sideBars', globalConfigBar.value.instance)
    dashboard.globalConfigBarKey = globalConfigBar.value.instance.key
  }

  if (chartConfigBar.value) {
    dashboard.bindBar('sideBars', chartConfigBar.value.instance)
    dashboard.chartConfigBarKey = chartConfigBar.value.instance.key
  }
  if (datasetBar.value) {
    dashboard.bindBar('sideBars', datasetBar.value.instance)
    dashboard.datasetBarKey = datasetBar.value.instance.key
  }

  if (canvasSelf.value) {
    const canvas = canvasSelf.value.canvas

    dashboard.setContent(canvas)
    canvas.injectContext(dashboard as DashboardContainer)

    // load canvas data
    const dashboardId = route.query.pageId
    if (dashboardId !== undefined) {
      const dashboardDataRes = await DashboardApi.loadDashboard({ id: Number(dashboardId) })
      if (dashboardDataRes) {
        const engine = new BIDashboardEngine(dashboard as DashboardContainer)
        engine.inject(dashboardDataRes.content)
        dashboard.menuBar?.inject({
          dashboardData: dashboardDataRes,
          previewMode: dashboard.mode === 'PREVIEW'
        })
      }
    }
  }
})
</script>

<style lang="scss">
.bi-dashboard {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__content {
    flex: 1;
    display: flex;
    min-height: 0;

    &-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    &-main {
      position: relative;
      flex: 1;
      display: flex;
      min-height: 0;
    }
  }

  &__components-panel {
    position: absolute;
    height: 100%;
    z-index: 1001;

    &--fixed {
      position: static;
    }
  }

  &__canvas-wrapper {
    flex: 1;
    height: 100%;
  }

  &__side-bars {
    display: flex;
    height: 100%;
  }
}
</style>
