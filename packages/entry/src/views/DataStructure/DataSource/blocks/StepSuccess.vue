<template>
  <div class="step-success">
    <div class="step-success-content">
      <el-image class="step-success-content__img" :src="imgPath" :fit="'cover'" />
      <span class="step-success-content__title">您的{{ name }}数据源已创建成功</span>
    </div>
    <div class="step-success-actions">
      <GxActions :actions="actions"></GxActions>
    </div>
  </div>
</template>
<script setup>
import { GxActions } from '@gxhs/ui'
import successImage from '../assets/images/success.png'
// import {ref} from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const imgPath = successImage
const actions = [
  {
    label: '返回数据源列表',
    auto: true,
    handler: () => {
      router.push({ name: 'DataSourceList' })
    }
  }
]
</script>
<style lang="scss">
.step-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-content {
    display: flex;
    padding-bottom: size(16);
    &__img {
      max-width: size(48);
      max-height: size(48);
    }
    &__title {
      @include typo-text;
      color: $secondary-text-color;
    }
  }
}
</style>
