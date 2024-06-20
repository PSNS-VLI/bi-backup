<template>
  <el-steps finish-status="success" :active="active" class="steps" align-center>
    <el-step title="Step 1" active="1">
      <template #title> 选择数据源 </template>
    </el-step>
    <el-step title="Step 2" active="2">
      <template #title> 配置连接 </template>
    </el-step>
    <el-step title="Step 3" active="3">
      <template #title> 完成 </template>
    </el-step>
  </el-steps>

  <div class="create-source__content" v-if="active == 1">
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
    <GxCard>
      <span class="con-title">最近创建</span>
      <ImgCard :cards="lastestCards"></ImgCard>

      <span class="con-title">本地文件</span>
      <ImgCard :cards="localCards"></ImgCard>

      <span class="con-title">数据库</span>
      <ImgCard :cards="sqlCards"></ImgCard>
      <!-- <span class="con-title">API数据</span>
      <ImgCard :cards="apiCards"></ImgCard> -->
    </GxCard>
  </div>

  <div v-else-if="active == 2">
    <!-- 组件  -->
    <InfoBlock
      :componentId="componentId"
      @active-name="activeName"
      @handlerAsideComponentId="handlerAsideComponentId"
      :active="componentId"
    ></InfoBlock>
  </div>

  <div v-else-if="active == 3" class="success">
    <StepSuccess v-show="componentId == 'FileSource'"></StepSuccess>
    <StepSuccess v-show="componentId == 'SqlSource'"></StepSuccess>
    <StepSuccess v-show="componentId == 'DaMengSource'"></StepSuccess>
    <StepSuccess v-show="componentId == 'ApiSource'"></StepSuccess>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InfoBlock from './blocks/InfoBlock.vue'
import { GxCard } from '@gxhs/ui'
import ImgCard from '@/views/DataStructure/DataSource/blocks/ImgCard.vue'
import StepSuccess from './blocks/StepSuccess.vue'
import api from '@/api'
const dataSourceApi = api.datasourceApi
const toConfig = (id) => {
  active.value = 2
  componentId.value = id
}

const active = ref(1)

const createCard = (type) => {
  const contentMap = {
    FILE: '文件上传',
    API: 'API数据',
    DM: 'DaMeng',
    MYSQL: 'MYSQL'
  }
  const contentAppendMap = {
    FILE: '本地文件（.csv、.xlsx、.xls）',
    API: 'API数据',
    DM: 'DaMeng',
    MYSQL: 'MYSQL'
  }
  const iconMap = {
    FILE: 'iconfont icon-a-Uploadfiles',
    API: 'iconfont icon-API', // 注意：这里API的icon已更改为iconfont icon-API，原代码中是iconfont icon-Mysql
    DM: 'iconfont icon-damengshujuku',
    MYSQL: 'iconfont icon-Mysql'
  }
  const toConfigMap = {
    FILE: 'FileSource',
    API: 'ApiSource',
    DM: 'DaMengSource',
    MYSQL: 'SqlSource'
  }

  return {
    content: contentMap[type],
    contentAppend: contentAppendMap[type],
    icon: iconMap[type],
    jump: () => toConfig(toConfigMap[type])
  }
}

const localCards = [createCard('FILE')]
const sqlCards = [createCard('MYSQL'), createCard('DM')]
const apiCards = [createCard('API')]
const activeName = () => {
  active.value = 3
}
const componentId = ref(null)
const lastestCards = ref([])

const handlerAsideComponentId = (val) => {
  componentId.value = val
}

;(async () => {
  const res = await dataSourceApi.getLastDatasource.send()
  if (res) {
    const lastRes = res.map((item) => createCard(item))
    lastestCards.value = lastRes
  }
})()
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
    height: calc(100% - 57px);
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
