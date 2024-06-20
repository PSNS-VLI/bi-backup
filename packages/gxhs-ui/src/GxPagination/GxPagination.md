> **_author:_** qiyafang **_createTime:_** 2023-10-31 14:09:06

# GxPagination 分页器组件

实现项目中通用的分页逻辑

## Examples

### 基本使用

```vue
<template>
  <GxPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import GxPagination from './components/GxPagination'
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const pageSizes = [5, 10, 15, 20]
const handleSizeChange = (event) => {
  // emit("sizeChange", event);
  console.log('emit每页展示多少条数据发生变化时触发的事件', event)
}
const handleCurrentChange = (event) => {
  // emit("currentChange", event);
  console.log('emit当前页码发生变化时触发的事件', event)
}
</script>
```

## API

### Attributes

| 属性名      | 说明               | 类型   | 可选值 | 默认值          |
| ----------- | ------------------ | ------ | ------ | --------------- |
| currentPage | 当前页码           | Number | --     | 1               |
| pageSize    | 每页显示数据条数   | Number | --     | 5               |
| totalNum    | 总条目数           | Number | --     | --              |
| pageSizes   | 每页显示条数选择器 | Array  | --     | [5, 10, 15, 20] |

### Event

| 事件名             | 说明                           | 回调参数            |
| ------------------ | ------------------------------ | ------------------- |
| update:currentPage | 当前页码改变时触发             | --                  |
| update:pageSize    | 每页显示数据条数发生变化时触发 | --                  |
| sizeChange         | 显示数据条数发生变化时触发     | val(新的页面数据量) |
| currentChange      | 当前页码发生变化时触发         | val(新的当前页面值) |
