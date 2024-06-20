> **_author:_** yuhongliang **_createTime:_** 2023-11-06 18:20:29

# GxCard 项目卡片容器

标题内容footer的经典组合

## Examples

### 基本用法

```vue
<template>
  <GxCard title="提示">
    <div>一些内容</div>
    <template #footer>
      <GxActions :actions="actions" />
    </template>
  </GxCard>
</template>

<script setup>
import GxCard from '@/components/GxCard'
import GxActions from '@/components/GxActions'

const actions = [
  {
    type: 'normal',
    label: '取消'
  },
  {
    label: '确认'
  }
]
</script>
```

## API

### Attributes

| 属性名 | 说明       | 类型   | 可选值 | 默认值 |
| ------ | ---------- | ------ | ------ | ------ |
| title  | 对话框标题 | String | --     | --     |

### Slots

| 插槽名      | 说明               |
| ----------- | ------------------ |
| titleAppend | 向标题后面追加内容 |
| default     | 容器中间内容       |
| footer      | 容器底部内容       |
