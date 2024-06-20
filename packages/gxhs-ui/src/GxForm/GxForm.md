> **_author:_** YuJinlu **_createTime:_** 2023-11-03 **_updateTime_** 2023-11-06

> **_author:_** yuhongliang **_updateTime_** 2023-11-29 17:43:30

# GxForm 表单

实现项目常用的表单逻辑

## Examples

### 基本使用

> 您可以通过[FormItem.itemType](#FormItem)配置项指定在[FormItemType](#FormItemType)枚举中存在的表单项，除此之外您可以客制化[FormItemType.CUSTOM](#FormItemType)您的表单项

```vue
<template>
  <GxForm v-model="formData" :form="form">
    <template #custom> <span style="color: white">custom</span> </template>
  </GxForm>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  text: '嗨，我是文本'
})
const form = [
  {
    itemType: 'input',
    key: 'input',
    label: 'input',

    append: 'shanchu1',
    appendMode: 'icon',
    onClickAppend: () => {
      console.log('ok')
    }
  },
  {
    itemType: 'select',
    key: 'select',
    label: 'select',

    options: [
      {
        label: 'label1',
        value: 'value1'
      },
      {
        label: 'label2',
        value: 'value2'
      }
    ],
    allowCreate: true,
    autoSelect: true
  },
  {
    itemType: 'cascader',
    key: 'cascade',
    label: 'cascade',

    options: [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines',
            children: [
              {
                value: 'consistency',
                label: 'Consistency'
              },
              {
                value: 'feedback',
                label: 'Feedback'
              },
              {
                value: 'efficiency',
                label: 'Efficiency'
              },
              {
                value: 'controllability',
                label: 'Controllability'
              }
            ]
          },
          {
            value: 'navigation',
            label: 'Navigation',
            children: [
              {
                value: 'side nav',
                label: 'Side Navigation'
              },
              {
                value: 'top nav',
                label: 'Top Navigation'
              }
            ]
          }
        ]
      },
      {
        value: 'resource',
        label: 'Resource',
        children: [
          {
            value: 'axure',
            label: 'Axure Components'
          },
          {
            value: 'sketch',
            label: 'Sketch Templates'
          },
          {
            value: 'docs',
            label: 'Design Documentation'
          }
        ]
      }
    ]
  },
  {
    itemType: 'date',
    key: 'date',
    label: 'date',
    type: 'daterange'
  },
  {
    itemType: 'text',
    key: 'text',
    label: 'text'
  },
  {
    itemType: 'custom',
    key: 'custom',
    label: 'custom'
  }
]
</script>
```

### 行内模式

> 默认情况下，表单在一列呈现，每个表单项独占一行，您可以通过指定[Attributes.inline](#Attributes)改变此行为

```vue
<template>
  <GxForm inline v-model="formData" :form="form">
    <template #custom> <span style="color: white">custom</span> </template>
  </GxForm>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  text: '嗨，我是文本'
})
const form = [
  {
    itemType: 'input',
    key: 'input',
    label: 'input',
    append: 'shanchu1',
    appendMode: 'icon',
    onClickAppend: () => {
      console.log('ok')
    }
  },
  {
    itemType: 'select',
    key: 'select',
    label: 'select',
    options: [
      {
        label: 'label1',
        value: 'value1'
      },
      {
        label: 'label2',
        value: 'value2'
      }
    ],
    allowCreate: true,
    autoSelect: true
  },
  {
    itemType: 'cascader',
    key: 'cascade',
    label: 'cascade',
    options: [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines',
            children: [
              {
                value: 'consistency',
                label: 'Consistency'
              },
              {
                value: 'feedback',
                label: 'Feedback'
              },
              {
                value: 'efficiency',
                label: 'Efficiency'
              },
              {
                value: 'controllability',
                label: 'Controllability'
              }
            ]
          },
          {
            value: 'navigation',
            label: 'Navigation',
            children: [
              {
                value: 'side nav',
                label: 'Side Navigation'
              },
              {
                value: 'top nav',
                label: 'Top Navigation'
              }
            ]
          }
        ]
      },
      {
        value: 'resource',
        label: 'Resource',
        children: [
          {
            value: 'axure',
            label: 'Axure Components'
          },
          {
            value: 'sketch',
            label: 'Sketch Templates'
          },
          {
            value: 'docs',
            label: 'Design Documentation'
          }
        ]
      }
    ]
  },
  {
    itemType: 'date',
    key: 'date',
    label: 'date',
    type: 'daterange'
  },
  {
    itemType: 'text',
    key: 'text',
    label: 'text'
  },
  {
    itemType: 'custom',
    key: 'custom',
    label: 'custom'
  }
]
</script>
```

### 自动提交表单

> 在某些情况下，您可能希望用户完成表单输入并且与上一次输入有差异的情况下自动做一些动作。别担心！我们内置了此实现！

```vue
<template>
  <GxForm v-model="formData" :form="form" @complete="handleComplete">
    <template #custom> <span style="color: white">custom</span> </template>
  </GxForm>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  text: '嗨，我是文本'
})
const form = [
  {
    itemType: 'input',
    key: 'input',
    label: 'input',
    append: 'shanchu1',
    appendMode: 'icon',
    onClickAppend: () => {
      console.log('ok')
    }
  },
  {
    itemType: 'select',
    key: 'select',
    label: 'select',

    options: [
      {
        label: 'label1',
        value: 'value1'
      },
      {
        label: 'label2',
        value: 'value2'
      }
    ],
    allowCreate: true,
    autoSelect: true
  },
  {
    itemType: 'cascader',
    key: 'cascade',
    label: 'cascade',
    options: [
      {
        value: 'guide',
        label: 'Guide',
        children: [
          {
            value: 'disciplines',
            label: 'Disciplines',
            children: [
              {
                value: 'consistency',
                label: 'Consistency'
              },
              {
                value: 'feedback',
                label: 'Feedback'
              },
              {
                value: 'efficiency',
                label: 'Efficiency'
              },
              {
                value: 'controllability',
                label: 'Controllability'
              }
            ]
          },
          {
            value: 'navigation',
            label: 'Navigation',
            children: [
              {
                value: 'side nav',
                label: 'Side Navigation'
              },
              {
                value: 'top nav',
                label: 'Top Navigation'
              }
            ]
          }
        ]
      },
      {
        value: 'resource',
        label: 'Resource',
        children: [
          {
            value: 'axure',
            label: 'Axure Components'
          },
          {
            value: 'sketch',
            label: 'Sketch Templates'
          },
          {
            value: 'docs',
            label: 'Design Documentation'
          }
        ]
      }
    ]
  },
  {
    itemType: 'date',
    key: 'date',
    label: 'date',
    type: 'daterange'
  },
  {
    itemType: 'text',
    key: 'text',
    label: 'text'
  },
  {
    itemType: 'custom',
    key: 'custom',
    label: 'custom'
  }
]
const handleComplete = ({ trigger, previous, current, formData }) => {
  console.log('这是触发源头', trigger)
  console.log('这是上一次数据', previous)
  console.log('这是当前的数据', current)
  console.log('这是最终的表单数据', formData)
}
</script>
```

### 表单校验

> 表单校验可以通过[FormItem.required/FormItem.rules](#Attributes)进行控制，[FormItem.required](#Attributes)是一个语法糖

```vue
<template>
  <GxForm v-model="formData" :form="form">
    <template #custom> <span style="color: white">custom</span> </template>
  </GxForm>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({})
const form = [
  {
    itemType: 'input',
    key: 'input',
    label: 'input',
    append: 'shanchu1', // 快来看，我在这里控制了输入框的图标，这不是GxInput组件的功能吗！！！
    appendMode: 'icon',
    onClickAppend: () => {
      formData.value['input'] = ''
    },
    required: true,
    rules: [
      {
        validator: (_, value, callback) => {
          if (value !== 'ok') {
            callback(new Error("Value isn't equaled 'ok'."))
          }
          callback()
        }
      }
    ]
  }
]
</script>
```

### 探索更多可能

> 通过[Attributes.form](#Attributes)配置项，我们将您所期望的目标元素的所有能力都暴漏给了js，包括客制化项[FormItemType.CUSTOM](#FormItemType)

> 这意味着您可以随心所欲的控制任何属性以达到您所期望的效果，即便这些属性在本文档中并没有呈现!

```vue
<template>
  <GxForm v-model="formData" :form="form">
    <template #custom> <span style="color: white">custom</span> </template>
  </GxForm>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  text: '嗨，我是文本'
})
const form = [
  {
    itemType: 'input',
    key: 'input',
    label: 'input',
    append: 'shanchu1', // 快来看，我在这里控制了输入框的图标，这不是GxInput组件的功能吗！！！
    appendMode: 'icon',
    onClickAppend: () => {
      console.log('ok')
    }
  },
  {
    itemType: 'select',
    key: 'select',
    label: 'select',
    options: [
      {
        label: 'label1',
        value: 'value1'
      },
      {
        label: 'label2',
        value: 'value2'
      }
    ],
    allowCreate: true,
    autoSelect: true
  },
  {
    itemType: 'date',
    key: 'date',
    label: 'date',
    type: 'daterange'
  },
  {
    itemType: 'text',
    key: 'text',
    label: 'text',
    style: {
      // 快来看！我在这里控制了它的颜色和点击事件，文档里可没有写呀！！！
      color: 'red'
    },
    onClick: () => {
      console.log('球球了，别点我!')
    }
  },
  {
    itemType: 'custom',
    key: 'custom',
    label: 'custom'
  }
]
</script>
```

## API

### <a name="Attributes"> Attributes </a>

| 属性名    | 说明             | 类型                         | 可选值 | 默认值 |
| --------- | ---------------- | ---------------------------- | ------ | ------ |
| form      | 表单的配置项     | Array<[FormItem](#FormItem)> | --     | --     |
| itemStyle | 控制表单项的样式 | Object                       | --     | --     |

> 您可以使用任何[el-form](https://element-plus.org/zh-CN/component/form.html)支持的配置

### <a name="Slots"> Slots </a>

| 插槽名                                                    | 说明                                                                                                                                                                          |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ([FormItem.prepend \|\| FormItem.key](#FormItem))-prepend | [GxInput](../GxInput/GxInput.md#Slots)的前缀插槽，仅[FormItem.itemType](#FormItem)为[FormItemType.CUSTOM](#FormItemType)且[FormItem.prependMode](#FormItem)为['custom']时有效 |
| ([FormItem.append \|\| FormItem.key](#FormItem))-append   | [GxInput](../GxInput/GxInput.md#Slots)的后缀插槽，仅[FormItem.itemType](#FormItem)为[FormItemType.CUSTOM](#FormItemType)且[FormItem.appendMode](#FormItem)为['custom']时有效  |
| ([FormItem.scopeName \|\| FormItem.key](#FormItem))       | [FormItem.itemType](#FormItem)为[FormItemType.CUSTOM](#FormItemType)的插槽                                                                                                    |

> 在[GxInput.Attributes.prependMode/appendMode](../GxInput/GxInput.md#Attributes)的原有值基础上，表单新增了可选值['custom']，代表您期望在表单中客制化输入框的插槽

### <a name="Events"> Events </a>

| 事件名   | 说明                   | 回调参数                                                                        |
| -------- | ---------------------- | ------------------------------------------------------------------------------- |
| complete | 表单数据变化稳定时触发 | (trigger: [FormItem](#FormItem), previous: any, current: any, formData: Object) |

### <a name="Exposes"> Exposes </a>

| 属性名      | 说明                         | 类型                                           | 描述                                                                                                                                                                                                                                                                                                                                                        |
| ----------- | ---------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| submit      | 调用表单验证并导出数据的函数 | Function(fields?: [FormItem.key[]](#FormItem)) | 函数会调用表单验证方法,[FormItem.required](#FormItem)标识为 true 但未填写的将导致验证不通过,返回值为{ valid: Boolean, data: Object },其中 valid 表征是否通过验证,data 为对配置了[FormItem.cleaner](#FormItem)调用[FormItem.cleaner](#FormItem)函数且键为[FormItem.key](#FormItem)的新对象。如果指定了参数fields，那么不包含在内的所有表单项将不会进行验证。 |
| resetFields | 重置表单项                   | Function                                       | 重置该表单项，将其值重置为初始值，并移除校验结果                                                                                                                                                                                                                                                                                                            |

### <a name="FormItem"> FormItem </a>

| 属性名    | 说明                                            | 类型                                                                                                                                                     | 可选值                        | 默认值 |
| --------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------ |
| itemType  | 表单项类型                                      | String<[FormItemType](#FormItemType)>                                                                                                                    | [FormItemType](#FormItemType) | input  |
| itemStyle | 表单项样式                                      | Object                                                                                                                                                   | --                            | --     |
| key       | 表单项数据标识                                  | String                                                                                                                                                   | --                            | --     |
| required  | 是否必填                                        | Boolean                                                                                                                                                  | true/false                    | false  |
| rules     | 校验规则                                        | 自定义表单校验，请见[自定义校验规则](https://element-plus.org/zh-CN/component/form.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99) | Array                         | --     |
| cleaner   | 触发提交动作(详见 submit())时调用的数据整理函数 | Function(val)                                                                                                                                            | --                            | --     |
| tooltip   | 鼠标悬浮提示消息                                | string                                                                                                                                                   | --                            | --     |

### <a name="FormItemType"> FormItemType </a>

> 详见[form-item-type.js](form-item-type.js)

| 属性名   | 属性值     | 说明                                                                                            |
| -------- | ---------- | ----------------------------------------------------------------------------------------------- |
| INPUT    | "input"    | 您可以控制[GxInput](../GxInput/GxInput.md#Attributes)的所有属性                                 |
| SELECT   | "select"   | 您可以控制[GxSelect](../GxSelect/GxSelect.md#Attributes)的所有属性                              |
| CASCADER | "cascader" | 您可以控制[el-cascader](https://element-plus.org/zh-CN/component/cascader.html)的所有属性       |
| DATE     | "date"     | 您可以控制[el-date-picker](https://element-plus.org/zh-CN/component/date-picker.html)的所有属性 |
| TEXT     | "text"     | 渲染一个文本，您可以控制其父盒子所有HTML属性                                                    |
| CUSTOM   | "custom"   | 渲染一个自定义插槽，[FormItem](#FormItem)会向其传递您注册的所有属性                             |
