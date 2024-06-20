> **_author:_** yuhongliang **_createTime:_** 2023-11-06 16:05:17

# GxBreadcrumb 面包屑导航

对面包屑导航做了适应于项目的适配

## Examples

### 基本使用

```vue
<template>
  <gx-breadcrumb></gx-breadcrumb>
</template>

<script setup></script>
```

### 同级路由表

> 在某些情况下，路由表放弃了使用children进行嵌套的结构，转变为同级结构，此时需要补充路由文件，方便组件自动补全

```vue
<template>
  <gx-breadcrumb :routes="routes"></gx-breadcrumb>
</template>

<script setup>
const routes = [] //这里可以引入定义路由的文件
</script>
```

### 过滤器

> 客制化路由meta或其它字段以决定是否显示在面包屑中

```vue
<template>
  <gx-breadcrumb :filter="breadcrumbFilter"></gx-breadcrumb>
</template>

<script setup>
const breadcrumbFilter = (route) => route.meta.hideInBreadcrumb && route.meta.title
</script>
```

### 格式化器

> 客制化显示在面包屑中的字段

```vue
<template>
  <gx-breadcrumb :formatter="breadcrumbFormatter"></gx-breadcrumb>
</template>

<script setup>
// 这是默认值
const breadcrumbFormatter = (route) => route.meta.title
</script>
```

## API

### Attributes

| 属性名    | 说明                                                     | 类型                                   | 可选值 | 默认值     |
| --------- | -------------------------------------------------------- | -------------------------------------- | ------ | ---------- |
| title     | 面包屑开头的标题                                         | String                                 | --     | 当前位置： |
| filter    | 过滤器，期待返回一个布尔值，为true则被显示在面包屑组件中 | (route, index, matched): Boolean => {} | --     | --         |
| formatter | 格式化器，用于格式化显示在面包屑中的内容                 | (route, index, matched): String => {}  | --     | --         |
| routes    | 需要显示的路径数组                                       | Array                                  | --     | --         |
