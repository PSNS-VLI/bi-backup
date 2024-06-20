> **_author:_** yuhongliang **_createTime:_** 2023-11-20 14:39:22 **_updateTime_** 2023-11-20 14:39:26

# GxActions 动作组

将有关按钮样式的**_通用逻辑_**(注册事件,监听事件的步骤...)和样式封装起来,让用户专注于具体的业务逻辑

## Examples

### 按钮模式或文本模式

#### 按钮模式

```vue
<template>
  <GxActions :actions="actions"></GxActions>
</template>

<script setup>
import GxActions from '@/components/GxActions'

const actions = [
  {
    transparent: true,
    label: '取消',
    handler: () => {
      console.log('点击了取消')
    }
  },
  {
    label: '完成'
  }
]
</script>
```

#### 文本模式

```vue
<template>
  <GxActions type="text" :actions="actions"></GxActions>
</template>

<script setup>
import GxActions from '@/components/GxActions'

const actions = [
  {
    label: '详情'
  },
  {
    warn: true,
    label: '删除',
    handler: () => {
      console.log('点击了删除')
    }
  }
]
</script>
```

## API

### <a name="Attributes">Attributes</a>

| 属性名  | 说明                                              | 类型                                                  | 可选值           | 默认值 |
| ------- | ------------------------------------------------- | ----------------------------------------------------- | ---------------- | ------ |
| actions | 定义组件渲染的按钮组                              | Array<[GxAction](#GxAction)>/Array<[GxText](#GxText)> | --               | --     |
| attach  | 附加到组件的数据，将会被当作 handler 的第二个参数 | Object                                                | --               | --     |
| align   | 控制主轴对齐方式                                  | String                                                | start/center/end | center |
| type    | 组件类型是文本组还是按钮组                        | String                                                | button/text      | button |

### <a name="Action"> Action </a>

| 键名     | 说明         | 类型                                                                                                 | 可选值            | 默认值 |
| -------- | ------------ | ---------------------------------------------------------------------------------------------------- | ----------------- | ------ |
| handler  | 回调方法     | Function(action: [GxAction](#GxAction)\|[GxText](#GxText), attach: [Attributes.attach](#Attributes)) | --                | --     |
| prefix   | 前缀图标类型 | String                                                                                               | [GxIcon](#GxIcon) | --     |
| label    | 按钮文本     | String                                                                                               | --                | --     |
| disabled | 禁用按钮     | Boolean                                                                                              | true/false        | false  |
| download | 下载模式     | Boolean                                                                                              | true/false        | false  |
| upload   | 上传模式     | Boolean                                                                                              | true/false        | false  |

> [download]()为[true]()时，期待[handler]()调用后返回一个长度为2的字符串数组，第一项为期待下载的内容，第二项为下载后保存的文件名

> [upload]()为[true]()时，[handler]()会在文件成功被选中后触发，此时将会携带第三个参数，为[input]()元素[change]()事件触发时的事件对象

### <a name="GxAction">GxAction</a> extends [Action](#Action)

> 您可以控制[GxAction](./GxAction.vue)的所有属性。

> 单个按钮可以使用[GxAction](./GxAction.vue)组件，除了label使用slot传参，其他控制参数一样，使用起来更加灵活。

### <a name="GxText">GxText</a> extends [Action](#Action)

| 键名 | 说明             | 类型    | 可选值     | 默认值 |
| ---- | ---------------- | ------- | ---------- | ------ |
| warn | 为文本添加警告色 | Boolean | true/false | false  |

### <a name="GxIcon">GxIcon</a>

> GxIcon源于iconfont,可选值请查看[icon.scss](../icon.scss),注意icon-这种前缀已经不需要传递了。
