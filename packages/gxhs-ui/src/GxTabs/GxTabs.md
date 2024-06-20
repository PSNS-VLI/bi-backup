<!--
 * @Author: zuyiyang
 * @Date: 2023-11-21 11:01:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-12-12 10:51:06
 * @Description:
-->

# GXTabs 标签切换

## 行排列

```js
<template>
  <div class="demo-box">
    <gx-tabs class="gx-gallery" v-model:tabsData="tabsData" v-model:initial="initial"></gx-tabs>
  </div>
</template>

<script setup>
//引入的文件
import { ref } from "vue";
import GxTabs from "@/components/GxTabs/GxTabs.vue";

// 自定义变量-----------------------------------------------------------------------------------------------------------------------------------

const tabsData = ref([
  {
    label: "数据管理员"
  },
  {
    label: "用户管理员"
  }
]);

const initial = ref(0);
</script>
```

## 竖排列

```js
  <template>
  <div class="demo-box">
    <gx-tabs class="gx-gallery" v-model:tabsData="tabsData" edit
      arrangeMode="column" v-model:initial="initial"></gx-tabs>
  </div>
</template>

<script setup>
//引入的文件
import { ref } from "vue";
import GxTabs from "@/components/GxTabs/GxTabs.vue";

// 自定义变量-----------------------------------------------------------------------------------------------------------------------------------

const tabsData = ref([
  {
    label: "数据管理员",
    edit:false,
  },
  {
    label: "用户管理员",
    edit:false,
  }
]);

const initial = ref(0);
```

## **Api**

### Attributes

| 属性名       | 说明                                           | 类型                                                | 默认值  | 可选值     |
| ------------ | ---------------------------------------------- | --------------------------------------------------- | ------- | ---------- |
| tabsData     | 标签数据                                       | Array<<span style="color:#67cdcc;">tabsItem</span>> | --      |
| edit         | 控制是否为编辑模式，编辑模式下有修改和删除按钮 | Boolean                                             | false   |
| arrangeMode  | 控制标签是按照横向排列还是竖向排列             | String                                              | 'row'   | row/column |
| itemWidth    | 标签的宽度                                     | String                                              | '112px' |
| itemHeight   | 标签的高度                                     | String                                              | '40px'  |
| initial      | 标签当前选中的index                            | Number                                              | 0       |
| itemFontSize | 标签当前选中字体大小                           | String                                              | 14px    |

<h4 style="color:#67cdcc;">tabsItem</h4>

| 属性名 | 说明                   | 类型    | 可选值 | 默认值 |
| ------ | ---------------------- | ------- | ------ | ------ |
| label  | 标签名称               | String  | --     | --     |
| edit   | 当前标签是否为编辑状态 | Boolean | ---    | false  |

### Events

| 事件名      | 说明                            | Type     |
| ----------- | ------------------------------- | -------- |
| changeClick | 当点击标签时触发                | Function |
| clickDel    | 编辑状态下点击删除按钮时触发    | Function |
| inputBlur   | 编辑状态下input光标消失的时触发 | Function |

### Slots

| 插槽名 | 说明                                     |
| ------ | ---------------------------------------- |
| Header | 标签开头的内容（列为最上边，行为最左边） |
