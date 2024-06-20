<template>
  <div class="title-bar">
    <span class="title-bar__icon iconfont" :class="`icon-${props.icon}`"></span>
    <div class="title-bar__text">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: 'icon-xz'
  }
})
</script>

<style scoped lang="scss">
@use '../style/index' as *;

span {
  display: inline-block;
}

.title-bar {
  display: flex;
  align-items: center;
  gap: size(8);
  @include second-text;
  &__icon {
    color: $theme-text-color;
  }
  &__text {
    flex: 1;
    color: $main-text-color;
  }
}
</style>
