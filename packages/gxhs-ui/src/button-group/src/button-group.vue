<template>
  <div class="gx-button-group">
    <el-button
      v-bind="filterAttrs(button, ['onClick'])"
      v-for="(button, index) in buttons"
      :key="button?.key || index"
      @click="typeof button.onClick === 'function' && button.onClick()"
      >{{ button.content }}</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { filterAttrs } from '../../utils/attribute-filter'

import type { GxButtonGroupProps } from './button-group'

withDefaults(defineProps<GxButtonGroupProps>(), {
  buttons: () => []
})
</script>

<style lang="scss">
.gx-button-group {
  --gx-button-group-gap: #{size(12)};
  --gx-button-group-padding: 0 #{size(16)};
}

.gx-button-group {
  display: flex;
  justify-content: flex-start;
  gap: var(--gx-button-group-gap);
  padding: var(--gx-button-group-padding);

  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
