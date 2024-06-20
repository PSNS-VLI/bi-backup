> **_author:_** YuJinlu **_createTime:_** 2023-11-03 **_updateTime_** 2023-11-06

> **_author:_** yuhongliang **_updateTime_** 2023-11-08 15:11:13

# GxSelect

实现项目常用的选择框逻辑

## Examples

### 基本使用

> 除了组件默认配置的选项，这与您使用[el-select](https://element-plus.org/zh-CN/component/select.html)无任何差异

```vue
<template>
  <GxSelect v-model="select" :options="options"></GxSelect>
</template>

<script setup>
import { ref } from 'vue'

const select = ref('')
const options = ref([
  {
    label: 'label1',
    value: 'value1'
  },
  {
    label: 'label2',
    value: 'value2'
  }
])
</script>
```

### 失去焦点自动选择

> 请注意[Attributes.autoSelect](#Attributes)的诸多限制

```vue
<template>
  <GxSelect v-model="select" :options="options" allow-create auto-select></GxSelect>
</template>

<script setup>
import { ref } from 'vue'

const select = ref('')
const options = ref([
  {
    label: 'label1',
    value: 'value1'
  },
  {
    label: 'label2',
    value: 'value2'
  }
])
</script>
```

## API

### <a name="Attributes"> Attributes </a>

| 属性名     | 说明                                        | 类型                                  | 可选值     | 默认值 |
| ---------- | ------------------------------------------- | ------------------------------------- | ---------- | ------ |
| options    | 选择框的选项                                | Array<{label: string, value: string}> | --         | --     |
| autoSelect | 市区焦点自动选择输入的值                    | Boolean                               | true/false | false  |
| append     | 后置内容，详见[PendMode](#PendMode)         | String                                | --         | --     |
| appendMode | 后置内容匹配模式，详见[PendMode](#PendMode) | [PendMode](#PendMode)                 | icon/text  | --     |

> autoSelect依赖于allowCreate，并且您不能指定multiple

> [el-select](https://element-plus.org/zh-CN/component/select.html)所有属性均可使用
