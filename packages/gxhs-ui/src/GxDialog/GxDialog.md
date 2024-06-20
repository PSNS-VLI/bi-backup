> **_author:_** yuhongliang **_createTime:_** 2023-11-16 14:21:56 **_updateTime_** 2023-11-16 14:22:00

# GxDialog 对话提示框

项目通用的的对话提示框

## Examples

### 基本用法

```vue
<template>
  <GxDialog v-if="show" title="提示" content="请确认是否删除 材料1?" @click-confirm="confirm" />
</template>

<script setup>
import GxDialog from '@/components/GxDialog'
import { ref } from 'vue'

const show = ref(true)
const confirm = () => {
  show.value = false
}
</script>
```

## API

### <a name="Attributes"> Attributes </a>

| 属性名      | 说明                 | 类型   | 可选值 | 默认值 |
| ----------- | -------------------- | ------ | ------ | ------ |
| cancelText  | 取消按钮文本         | String | --     | 取消   |
| confirmText | 确定按钮文本         | String | --     | 确定   |
| title       | 标题文本             | String | --     | --     |
| content     | 对话框中间显示的内容 | String | --     | --     |

### Slots

| 插槽名  | 说明                 |
| ------- | -------------------- |
| title   | 标题文本             |
| default | 对话框中间显示的内容 |

### <a name="Events"> Events </a>

| 键名         | 说明                       |
| ------------ | -------------------------- |
| clickCancel  | 默认点击取消按钮触发的事件 |
| clickConfirm | 默认点击确定按钮触发的事件 |
