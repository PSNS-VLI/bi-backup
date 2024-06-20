<template>
  <div class="gx-card">
    <div class="gx-card__title" v-if="props.title">
      <GxTitle>
        <div class="gx-card__title-inner">
          <span>{{ props.title }}</span>
          <div class="slot"><slot name="titleAppend"></slot></div>
        </div>
      </GxTitle>
    </div>
    <div class="gx-card__content">
      <slot></slot>
    </div>
    <div class="gx-card__action">
      <slot name="footer">
        <div></div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import GxTitle from '../GxTitle'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
@use '../style/index' as *;

.gx-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: size(24);
  border: size(2) solid rgba($theme-text-color, 0.05);
  font-size: size(16);
  background-color: #fff;
  overflow: hidden;
  &__title {
    margin-bottom: size(16);
    &-inner {
      display: flex;
      align-items: center;
      .slot {
        flex: 1;
      }
    }
  }
  &__content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
