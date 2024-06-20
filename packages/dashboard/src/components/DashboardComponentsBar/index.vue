<template>
  <div
    class="bi-dashboard-components-bar"
    @mouseenter="barInstance.onMouseenter"
    @mouseleave="barInstance.onMouseleave"
  >
    <div class="bi-dashboard-components-bar__tool-bar">
      <b-i-tabs-bar
        class="bi-dashboard-components-bar__tool-bar-tabs"
        v-model="toolBarActiveTab"
        :tabs="toolBarTabs"
      ></b-i-tabs-bar>
      <gx-icon-group
        class="bi-dashboard-components-bar__tool-bar-icons"
        :icons="toolBarIcons"
      ></gx-icon-group>
    </div>
    <el-scrollbar>
      <div class="bi-dashboard-components-bar__content">
        <div
          v-for="component in components"
          :key="component.name"
          class="bi-dashboard-components-bar__component-container"
        >
          <div class="bi-dashboard-components-bar__component-category">
            <span>{{ component.name }}</span>
          </div>
          <div class="bi-dashboard-components-bar__component-grid">
            <div
              v-for="chart in component.charts"
              :key="chart.id"
              class="bi-dashboard-components-bar__component-item"
              draggable="true"
              @mouseenter="componentBoard = chart"
              @dragstart="barInstance.onDragComponentStart(chart)"
              @dragend="barInstance.onDragComponentEnd()"
              @mouseleave="componentBoard = null"
            >
              <gx-icon :icon-class="chart.icon"></gx-icon>
              <span>{{ chart.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div v-show="componentBoard" class="bi-dashboard-components-bar__board">
      <p class="bi-dashboard-components-bar__board-title">
        {{ componentBoard?.title || componentBoard?.name }}
      </p>
      <p>{{ componentBoard?.description }}</p>
      <p v-show="componentBoard?.dimensionDescription">
        <span
          class="bi-dashboard-components-bar__board-tag bi-dashboard-components-bar__board-tag--blue"
          >维度</span
        >{{ componentBoard?.dimensionDescription }}
      </p>
      <p v-show="componentBoard?.measureDescription">
        <span
          class="bi-dashboard-components-bar__board-tag bi-dashboard-components-bar__board-tag--green"
          >度量</span
        >{{ componentBoard?.measureDescription }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

import { GxIconGroup, GxIcon } from '@gxhs/ui'
import type { GxIconGroupItem } from '@gxhs/ui'

import { getDashboardChartComponents, genComponentName } from '../../utils'
import type { DashboardChartComponent } from '../../types/component'

import BITabsBar from '../TabsBar'
import { useBar } from '../composables'

import { DashboardComponentsBar } from './dashboard-component-bar'

defineOptions({
  name: genComponentName('DashboardComponentsBar')
})

const { barInstance } = useBar(DashboardComponentsBar, 'DashboardComponentsBar')
defineExpose({
  instance: barInstance
})

/**
 * toolBar
 */

// tabs
const toolBarTabs = [{ name: 'offical', label: '官方' }]
const toolBarActiveTab = ref('offical')

// icons
const toolBarIcons: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-search',
    tooltip: '搜索图表'
  },
  {
    iconClass: 'icon-filter',
    tooltip: '筛选图表'
  },
  {
    iconClass: 'icon-loudoutu',
    tooltip: '固定面板',
    onClick: () => {
      barInstance.fixedComponentsPanel()
    }
  }
]

/**
 * tab content(charts)
 */
const components = ref<
  Array<{
    name: string
    charts: Array<DashboardChartComponent>
  }>
>([])
watchEffect(async () => {
  if (toolBarActiveTab.value === 'offical') {
    components.value = await getDashboardChartComponents()
  }
})

/**
 * board
 */
const componentBoard = ref<DashboardChartComponent | null>(null)
</script>

<style lang="scss">
$grey-border: size(1) solid var(--bi-color-border-divider-weak, rgba(0, 0, 0, 0.06));

.bi-dashboard-components-bar {
  position: relative;
  width: size(244);
  height: 100%;
  border-right: 1px solid var(--bi-color-border-divider, rgba(0, 0, 0, 0.12));
  background-color: #fff;

  &__tool-bar,
  &__board {
    position: absolute;
    z-index: 10;
    padding: 0 12px;
    background-color: #fff;
  }

  &__tool-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: size(40);
    border-bottom: $grey-border;
    margin-bottom: size(8);

    &-tabs {
      border: none;
    }
  }

  &__content {
    padding: calc(size(40) + size(12)) 8px 200px;
  }

  &__component {
    &-container {
      padding-bottom: size(12);
    }

    &-category {
      padding-bottom: size(4);
      line-height: size(20);
      font-size: size(12);
    }

    &-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: size(4);
      border-radius: size(4);
      font-size: size(12);
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .gx-icon {
        --gx-icon-hover-bg-color: transparent;
        --gx-icon-text-size: #{size(30)};
        --gx-icon-text-color: inherit;
      }
    }
  }

  &__board {
    bottom: 0;
    width: 100%;
    height: 200px;
    border-top: $grey-border;
    font-size: 12px;

    &-title {
      font-size: 14px;
    }

    &-tag {
      display: inline-block;
      height: 16px;
      line-height: 16px;
      padding: 0 6px;
      margin-right: 8px;
      border-radius: 8px;
      color: #fff;

      &--blue {
        background-color: var(--el-color-primary);
      }

      &--green {
        background-color: var(--el-color-success);
      }
    }
  }
}
</style>
