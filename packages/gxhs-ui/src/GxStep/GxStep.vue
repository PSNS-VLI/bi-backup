<template>
  <div class="steps-box">
    <div
      v-for="(item, index) in stepsData"
      :class="['steps-card', index <= stepsIndex ? 'on' : '']"
      :key="index"
    >
      <div class="card-content">
        <span v-if="index <= stepsIndex" class="iconfont icon-dian"></span>
        <span v-else class="iconfont icon-dian"></span>
        <div>{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps({
  stepsIndex: {
    type: Number,
    default: 0
  },
  stepsData: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:stepIndex', 'update:stepsData'])
const stepsIndex = computed({
  get: () => props.stepsIndex,
  set: (val) => emit('update:stepIndex', val)
})
const stepsData = computed({
  get: () => props.stepsData,
  set: (val) => emit('update:stepsData', val)
})
</script>

<style lang="scss" scoped>
@use '../style/index' as *;

.steps-box {
  padding: size(16) size(16) 0;
  display: flex;
  justify-content: left;
  align-items: center;
  .steps-card {
    width: size(418);
    height: size(24);
    display: flex;
    align-items: center;
    position: relative;
    @include plain-text;
    color: $secondary-text-color;

    text-align: center;
    line-height: size(24);
    .card-content {
      display: flex;
      gap: size(8);
      color: #909399;
      .iconfont {
        color: rgba($theme-text-color, 0.4);
      }
    }
  }
  .steps-card:after {
    position: relative;
    margin: 0 size(16);
    content: '';
    height: size(1);
    flex: 1;
    background: #{rgba($theme-text-color, 0.4)};
  }
  .steps-card:last-of-type {
    width: auto;
  }
  .steps-card:last-of-type:before {
    width: 0;
  }
  .steps-card.on {
    .card-content {
      color: $secondary-text-color;
    }
    .iconfont {
      color: rgba($theme-text-color, 0.8);
    }
  }
}
</style>
