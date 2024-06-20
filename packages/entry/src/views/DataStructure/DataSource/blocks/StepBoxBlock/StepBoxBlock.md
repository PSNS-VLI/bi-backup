> **_author:_** YuJinlu **_createTime:_** 2023-10-30 **_updateTime_** 2023-10-31

# StepBoxBlock 进度块

进度分页快捷组件

## Examples

### 进度条分页

```vue
<template>
  <div class="box">
    <step-box-block :steps-data="stepsData" :handlerDone="handlerDone">
      <template #basicInfo> 基础信息 </template>
      <template #parameterInfo> 参数信息 </template>
      <template #structureInfo> 结构信息 </template>
    </step-box-block>
  </div>
</template>

<script setup>
import StepBoxBlock from './StepBoxBlock/StepBoxBlock.vue'
const b = function a() {
  return new Promise((resolve) => {
    setTimeout(() => {
      //需要返回的数据
      resolve('a')
    }, 3000)
  })
}
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
const handlerDone = () => {
  console.log('已完成')
}
</script>
```

## API

### Attributes

| 属性名    | 说明       | 类型        | 可选值 | 默认值 |
| --------- | ---------- | ----------- | ------ | ------ |
| stepsData | 步骤条配置 | Array<Step> | --     | --     |

### Step步骤条

| 键名   | 说明                              | 类型     | 可选值 | 默认值 |
| ------ | --------------------------------- | -------- | ------ | ------ |
| name   | 步骤名称                          | String   | --     | --     |
| value  | 步骤值（插槽名称）                | String   | --     | --     |
| verify | 下一步/完成按钮回调（返回布尔值） | Function | --     | --     |

### Event

| 事件名 | 说明         | 回调参数 |
| ------ | ------------ | -------- |
| done   | 步骤全部完成 | --       |
