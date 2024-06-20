> **_author:_** YuJinlu **_createTime:_** 2023-11-2 **_updateTime_** 2023-11-3

> **_author:_** yuhongliang **_updateTime_** 2023-11-30 09:31:29

# GxInput 输入框

对el-input组件进行便于项目使用的封装

## Examples

### 基本使用

```vue
<template>
  <GxInput v-model="input"></GxInput>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
</script>
```

### 上传文件

```vue
<template>
  <!--  当然支持accep等原生input属性!-->
  <GxInput v-model="input" type="file" @file-change="onFileChange" accept=".igs" multiple></GxInput>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const onFileChange = (event) => {
  console.log('这是文件内容', event.target.files)
}
</script>
```

### 使用前置后置插槽

#### 使用组件内置模板

```vue
<template>
  <GxInput
    v-model="input"
    prepend="dangan1 dangan1"
    prepend-mode="text icon"
    append="dangan1 text"
    append-mode="icon text"
    append-transparent
    @clickPrepend="() => console.log('click prepend')"
    @clickAppend="() => console.log('click append')"
  ></GxInput>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
</script>
```

#### 使用插槽客制化

> 您应当了解使用插槽后带来的影响！

```vue
<template>
  <!--  本例中使用空格对prepend/append/prependMode/appendMode进行分割-->
  <GxInput
    v-model="input"
    prepend="dangan1 dangan1"
    prepend-mode="text icon"
    append="dangan1 text"
    append-mode="icon text"
    append-transparent
    @clickPrepend="() => console.log('click prepend')"
    @clickAppend="() => console.log('click append')"
  >
    <!-- 请注意，此时的prepend/prependMode/append/appendMode/clickPrepend/clickAppend均失效 -->
    <template #prepend>prepend</template>
    <template #append>append</template>
  </GxInput>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
</script>
```

## API

### <a name="Attributes">Attributes</a>

| 属性名             | 说明                                        | 类型                  | 可选值                 | 默认值 |
| ------------------ | ------------------------------------------- | --------------------- | ---------------------- | ------ |
| type               | input原生type属性                           | String                | text/textarea/file/... | text   |
| prepend            | 前置内容，详见[PendMode](#PendMode)         | String                | --                     | --     |
| prependMode        | 前置内容匹配模式，详见[PendMode](#PendMode) | [PendMode](#PendMode) | icon/text              | --     |
| prependTransparent | 前置内容取消背景色                          | Boolean               | true/false             | false  |
| append             | 后置内容，详见[PendMode](#PendMode)         | String                | --                     | --     |
| appendMode         | 后置内容匹配模式，详见[PendMode](#PendMode) | [PendMode](#PendMode) | icon/text              | --     |
| appendTransparent  | 后置内容取消背景色                          | Boolean               | true/false             | false  |
| tooltip            | 悬浮时展示的消息                            | string                | --                     | --     |

> TIPS: 除此之外的任何[el-input](https://element-plus.org/zh-CN/component/input.html#attributes)属性均支持

> TIPS: 当您使用插槽客制化前/后置内容时，[prepend/prependMode/append/appendMode]将不可用

### <a name="Events">Events</a>

| 事件名       | 说明                                                       | 回调参数                                   |
| ------------ | ---------------------------------------------------------- | ------------------------------------------ |
| fileChange   | [Attributes.type](#Attributes)为file时，文件选择变化时触发 | (event)event是原生input change事件的属性值 |
| clickPrepend | 点击前置内容触发的事件                                     | ()                                         |
| clickAppend  | 点击后置内容触发的内容                                     | ()                                         |

> TIPS: 当您使用了插槽来客制化内容时，[clickPrepend]与[clickAppend]事件均不可用

### <a name="Slots">Slots</a>

| 名字    | 说明           |
| ------- | -------------- |
| prepend | 输入框前置内容 |
| append  | 输入框后置内容 |

### <a name="PendMode">PendMode</a>

> 这是组件方便用户使用插槽规定的内置类型，本质为[String]类型，但要求每一项使用除空格(" ")外的任意字符分割。

> [Attributes.prepend/Attributes.prependMode/Attributes.append/Attributes.appendMode](#Attributes)的格式均为此种。

> 值得强调的是，[Attributes.prepend/Attributes.append](#Attributes)是为[Attributes.prependMode/Attributes.appendMode](#Attributes)提供值。

> 可选项如下

| 可选值 | 说明                                                                                                                                                                                    |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| icon   | 选择此值代表您期望插槽中渲染一个图标，此时[Attributes.prepend/Attributes.append](#Attributes)对应的分割项应该是[GxIcon](#GxIcon)中的一部分                                              |
| text   | 选择此值代表您期望插槽中渲染普通文本，意料之外的值将被转换为此值，包括falsy值，**_但请注意_**falsy带来的后果是只能识别[Attributes.prepend/Attributes.append](#Attributes)分割后的第一项 |
