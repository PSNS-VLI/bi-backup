<template>
  <div class="bi-tool-bar">
    <div class="bi-tool-bar-item">
      <gx-icon-group :icons="iconsLeft"></gx-icon-group>
    </div>
    <div class="bi-tool-bar-item">
      <gx-icon-group :icons="iconsRight"></gx-icon-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GxIconGroup } from '@gxhs/ui'
import type { GxIconGroupItem } from '@gxhs/ui'

defineOptions({
  name: 'BIToolBar'
})

interface ToolbarProps {
  iconsLeft: Array<GxIconGroupItem>
  iconsRight: Array<GxIconGroupItem>
}

defineProps<ToolbarProps>()
</script>

<style lang="scss">
.bi-tool-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: size(40);
  padding: 0 size(20);
  background-color: #fff;
  border-bottom: size(1) solid var(--bi-color-border-divider, rgba(0, 0, 0, 0.12));
}
</style>
