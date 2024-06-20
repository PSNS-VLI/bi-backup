<template>
  <div class="bi-field-tree-node-tooltip">
    <div class="bi-field-tree-node-tooltip__caption">
      <span>{{ field.name }}</span>
    </div>
    <div v-show="field.originName" class="bi-field-tree-node-tooltip__column">
      <span>{{ field.originName }}</span>
    </div>
    <div class="bi-field-tree-node-tooltip__line"></div>
    <div class="bi-field-tree-node-tooltip__comments">
      {{ field.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Field } from '../../../types/dataset'

withDefaults(
  defineProps<{
    field: Field
  }>(),
  {}
)
</script>

<style lang="scss">
.bi-field-tree-node-tooltip {
  color: var(--bi-color-font-convert, #fff);

  &__caption {
    font-size: 14px;
  }

  &__column {
    font-size: 12px;
    margin-top: 5px;
    opacity: 0.45;
  }

  &__line {
    background: var(--bi-color-font-convert, #fff);
    height: 1px;
    margin: 5px -8px;
    opacity: 0.06;
  }

  &__comments {
    font-size: 12px;
    opacity: 0.65;
  }
}
</style>
