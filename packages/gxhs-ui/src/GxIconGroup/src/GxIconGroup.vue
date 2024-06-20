<template>
  <div class="gx-icon-group">
    <template v-for="(icon, index) in icons" :key="icon.key || index">
      <el-dropdown
        v-if="icon.children?.length"
        :popper-class="'gx-icon-group__popper ' + popperClass"
        trigger="click"
      >
        <slot v-bind="icon">
          <gx-icon-group-item :group-item="icon" :icon-size="iconSize"></gx-icon-group-item>
        </slot>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(dropdownMenu, index) in icon.children"
              :key="dropdownMenu.key || index"
            >
              <slot v-bind="dropdownMenu">
                <gx-icon-group-item
                  :group-item="dropdownMenu"
                  :icon-size="dropdownIconSize"
                ></gx-icon-group-item>
              </slot>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <slot v-else v-bind="icon">
        <gx-icon-group-item :group-item="icon" :icon-size="iconSize"></gx-icon-group-item>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import GxIconGroupItem from './GxIconGroupItem.vue'
import { type GxIconGroupProps } from './types'

withDefaults(defineProps<GxIconGroupProps>(), {
  icons: () => [],
  iconSize: 'medium',
  dropdownIconSize: 'medium'
})
</script>

<style lang="scss">
.gx-icon-group,
.gx-icon-group__popper {
  --gx-icon-group-hover-bg-color: var(--gx-hover-bg-color);
  --gx-icon-group-border-radius: var(--el-border-radius-base);
  --gx-icon-group-font-size: var(--el-font-size-base);
  --gx-icon-group-text-color: var(--el-text-color-regular);
  --gx-icon-group-separator-color: var(--el-text-color-placeholder);
  --gx-icon-group-icon-size: var(--el-font-size-medium);
  --gx-icon-group-gap: 8px;
}

.gx-icon-group {
  display: inline-flex;
  gap: var(--gx-icon-group-gap);
  line-height: normal;

  .gx-icon .gx-icon__inner {
    font-size: var(--gx-icon-group-icon-size);
  }
}

.gx-icon-group__popper {
  .gx-icon .gx-icon__inner {
    font-size: var(--gx-icon-group-dropdown-icon-size, --gx-icon-group-icon-size);
  }
}

.el-dropdown__popper {
  --el-dropdown-menuItem-hover-fill: transparent;
  --el-dropdown-menuItem-hover-color: inherit;
}

.el-dropdown-menu {
  padding: 0;
  &__item {
    padding: size(5) size(8);
    color: var(--gx-icon-group-text-color);
  }

  .gx-icon-group__item {
    flex: 1;
  }
}
</style>
