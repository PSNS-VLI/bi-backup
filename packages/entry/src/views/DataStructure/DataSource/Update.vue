<template>
  <div class="parent" v-for="(item, index) in tree" :key="index">
    <div
      class="item"
      v-for="(sub, index) in item"
      :key="index"
      @click="(componentId = sub.componentId) && (name = sub.title)"
    >
      <span class="iconfont" :class="`icon-${sub.icon}`"></span>
      {{ sub.title }}
    </div>
  </div>

  <InfoBlock :componentId="componentId" :detailData="detailData"></InfoBlock>
</template>

<script setup>
import InfoBlock from './blocks/InfoBlock.vue'
import StepSuccess from './blocks/StepSuccess.vue'
import useInfoBlock from './useInfoBlock'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
const query = useRoute().query

const componentId = ref(null)
const queryIdMap = {
  API: 'ApiSource',
  FILE: 'FileSource',
  MYSQL: 'SqlSource',
  DM: 'DaMengSource'
}
watch(
  () => query.type,
  (n, _) => {
    console.log(queryIdMap[n])
    componentId.value = queryIdMap[n]
  },
  {
    immediate: true
  }
)
const { detailData } = useInfoBlock(true, { id: query.id, componentId: queryIdMap[query.type] })
</script>

<style lang="scss" scoped>
.create-source {
  width: 100%;
  height: 100%;
  &__header {
    max-width: size(676);
    margin: 0 auto;
  }
  :deep(.el-steps) {
    .el-step.is-horizontal {
      display: flex;
      justify-content: center;
      .el-step__line {
        right: size(15);
      }
      &.is-flex {
        .el-step__main {
          .el-step__title {
            min-width: size(50);
          }
        }
      }
      .el-step__main {
        background: #f5f7fa;
        position: absolute;
        left: size(24);
        padding: 0 size(15);
      }
    }
  }
  &__content {
    height: 100%;
    .con-title {
      @include plain-text;
      color: #909399;
    }
  }
}
.iconfont {
  font-size: size(32);
}

// 步骤条
.success {
  padding: size(100) 0 0 0;
}
</style>
