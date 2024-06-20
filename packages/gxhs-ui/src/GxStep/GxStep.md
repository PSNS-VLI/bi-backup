> **_author:_** qiyafang **_createTime:_** 2023-11-07 11:10:48

# GxStep 步骤条

## Examples

### 进度条分页

```vue
<template>
  <GxStep ref="stepsSelf" :stepsData="stepsData" :stepsIndex="stepsIndex"></GxStep>
  <GxActions :actions="getActions()" @click-btn="onClickBtn"></GxActions>
</template>

<script setup>
import GxStep from '@/components/GxStep/GxStep.vue'
import { GxActions } from '@gxhs/ui'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const stepsSelf = ref()
const stepsData = [
  {
    name: '基础信息',
    value: 'basicInfo',
    verify: () => {
      return { proceed: true }
    }
  },
  {
    name: '参数信息',
    value: 'parameterInfo',
    verify: async () => {
      let c = await b()
      if (c) return { proceed: true }
    }
  },
  {
    name: '结构信息',
    value: 'structureInfo',
    verify: () => {
      return { proceed: false, message: '请填写完整' }
    }
  }
]
//第一步
const stepsIndex = ref(0)
//按钮
const actions = [
  {
    label: '取消',
    type: 'normal',
    handler: () => {}
  },
  {
    label: '上一步',
    type: 'normal',
    handler: () => prevSteps()
  },
  {
    label: '下一步',
    type: 'main',
    handler: () => nextSteps()
  },
  {
    label: '完成',
    type: 'main'
  }
]

const getActions = () => {
  if (stepsIndex.value === 0) return [actions[0], actions[2]]
  else if (stepsIndex.value === stepsData.length - 1) return [actions[0], actions[1], actions[3]]
  else return [actions[0], actions[1], actions[2]]
}
const onClickBtn = async (button) => {
  if (button.label === '下一步' || button.label === '完成') {
    let verified = await props.stepsData[stepsIndex.value].verify()
    if (verified.proceed) {
      if (stepsIndex.value === props.stepsData.length - 1) emit('done')
      else nextSteps()
    } else ElMessage.error(verified.message)
  }
}

const prevSteps = () => {
  stepsIndex.value--
  nextTick(() => {
    stepsSelf.value.stepsFun()
  })
}
const nextSteps = () => {
  stepsIndex.value++
  nextTick(() => {
    stepsSelf.value.stepsFun()
  })
}
</script>
```

## API

### Attributes

| 属性名     | 说明               | 类型        | 可选值 | 默认值 |
| ---------- | ------------------ | ----------- | ------ | ------ |
| stepsData  | 步骤条所需数据     | Array<Step> | --     | --     |
| stepsIndex | 记录当前步骤条位置 | Number      | --     | --     |

### Step步骤条

| 键名   | 说明                              | 类型     | 可选值 | 默认值 |
| ------ | --------------------------------- | -------- | ------ | ------ |
| name   | 步骤名称                          | String   | --     | --     |
| value  | 步骤值（插槽名称）                | String   | --     | --     |
| verify | 下一步/完成按钮回调（返回布尔值） | Function | --     | --     |

### Event

| 事件名   | 说明     | 回调参数 |
| -------- | -------- | -------- |
| stepsFun | 步骤进度 | --       |
