<template>
  <div class="bi-collapse-config-panel">
    <b-i-panel-search :storage-key="historyStorageKey" @change="onChange"></b-i-panel-search>
    <div class="bi-collapse-config-panel__content">
      <el-collapse>
        <template v-for="collapse in collapses" :key="collapse.key">
          <el-collapse-item
            class="bi-collapse-config-panel__level-one"
            :class="{
              'bi-collapse-config-panel__level-one--covered':
                collapse.switcherKey && !data[collapse.switcherKey]
            }"
          >
            <template #title>
              <div class="bi-collapse-config-panel__title">
                <b-i-config-label
                  :label="{ label: collapse.label, tooltip: collapse.tooltip }"
                ></b-i-config-label>
                <el-switch
                  v-if="collapse.switcherKey"
                  v-model="data[collapse.switcherKey]"
                ></el-switch>
              </div>
            </template>
            <template v-for="subCollapse in collapse.children" :key="subCollapse.key">
              <!-- <component v-if="subCollapse.component" :is="subCollapse.component"></component> -->
              <el-collapse class="el-sub-collapse" v-if="isSubCollapse(subCollapse)">
                <el-collapse-item
                  class="bi-collapse-config-panel__level-two"
                  :class="{
                    'bi-collapse-config-panel__level-two--covered':
                      subCollapse.switcherKey && !data[collapse.key][subCollapse.switcherKey]
                  }"
                >
                  <template #title>
                    <div class="bi-collapse-config-panel__title">
                      <b-i-config-label
                        :label="{ label: subCollapse.label, tooltip: subCollapse.tooltip }"
                      ></b-i-config-label>
                      <el-switch
                        v-if="subCollapse.switcherKey"
                        v-model="data[collapse.key][subCollapse.switcherKey]"
                      ></el-switch>
                    </div>
                  </template>
                  <template v-for="config in subCollapse.children" :key="config.key">
                    <!-- <component v-if="config.component" :is="config.component"></component> -->
                    <slot
                      :config="config"
                      :configData="data[collapse.key][subCollapse.key]"
                      :updateConfigData="
                        (val: Record<string, any>) =>
                          Object.assign(data[collapse.key][subCollapse.key], val)
                      "
                    ></slot>
                  </template>
                </el-collapse-item>
              </el-collapse>
              <slot
                v-else
                :config="subCollapse"
                :configData="data[collapse.key]"
                :updateConfigData="
                  (val: Record<string, any>) => Object.assign(data[collapse.key], val)
                "
              ></slot>
            </template>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { isSubCollapse } from '../../../utils/configuration'
import type { CollapseConfig } from '../../../types/configuration'
import type { Key } from '../../../types/common'

import BIPanelSearch from '../PanelSearch'
import { BIConfigLabel } from '../ConfigItems'

defineOptions({
  name: 'BICollapseConfigPanel'
})
const props = withDefaults(
  defineProps<{
    collapses: Array<CollapseConfig>
    modelValue: Record<Key, any>
    historyStorageKey: string
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])
const data = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

/**
 * collapse
 */

/**
 * search bar
 */
const onChange = (val: string) => {
  console.log('history', val)
}
</script>

<style lang="scss">
.bi-collapse-config-panel {
  &__title {
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding-right: 12px;
  }

  .el-collapse {
    --el-collapse-header-height: 36px;
  }

  .el-sub-collapse + .el-sub-collapse {
    margin-top: 9px;
  }

  .el-collapse-item {
    &__header {
      justify-content: flex-end;
      flex-direction: row-reverse;
      border: none;
      line-height: normal;
    }

    &__arrow {
      margin: 0 8px;
    }
  }

  .el-collapse,
  .el-collapse-item__wrap {
    border: none;
  }

  &__level-one {
    border-bottom: 1px solid var(--bi-color-border-divider-weak, rgba(0, 0, 0, 0.06));

    .el-collapse-item__content {
      padding: 0 12px 8px;
    }
  }

  &__level-two {
    --el-collapse-header-bg-color: transparent;
    --el-collapse-content-bg-color: transparent;
    background: var(--bi-color-surface-page-level3, #f7f7f7);
    border-radius: var(--bi-radius-100, 4px);
  }

  &__level-one--covered,
  &__level-two--covered {
    .el-collapse-item__content {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
</style>
