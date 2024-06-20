<template>
  <div class="breadcrumb">
    <span>{{ props.title }}</span>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in matched"
        :key="index"
        v-show="props.filter(item, index, matched)"
        :to="item.path"
      >
        <span>{{ props.formatter(item, index, matched) }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  routes: {
    type: Array,
    default: () => []
  },
  filter: {
    type: Function,
    default: (route) => route.meta?.title
  },
  formatter: {
    type: Function,
    default: (route) => route.meta.title
  },
  title: {
    type: String,
    default: ''
  }
})

const matched = computed(() =>
  props.routes?.length
    ? useRoute().matched.reduce((pre, cur, index, array) => {
        const prePath = index ? array[index - 1]?.path : ''
        const curPath = cur.path
        const subs = [...curPath.replace(prePath, '').matchAll(/\/*?([a-zA-Z-]+?)\//g)].map(
          (item) => item.pop()
        )
        subs.reduce((p, c) => {
          p = `${p}${p ? '/' : ''}${c}`
          const res = getRouteByPath(p)
          if (res) pre.push(Object.assign({}, res, { path: `${prePath}/${res.path}` }))
          return p
        }, '')

        pre.push(cur)
        return pre
      }, [])
    : useRoute()?.matched
)

const getRouteByPath = (path, routes) => {
  routes = routes || props.routes
  return routes.reduce((pre, cur) => {
    if (pre) return pre
    if (cur?.path === path) return cur
    if (cur?.children?.length) return getRouteByPath(path, cur.children)
    return null
  }, null)
}
</script>

<style lang="scss" scoped>
@use '../style/index' as *;

.breadcrumb {
  display: flex;
  justify-content: flex-start;
  line-height: 1;
  :deep(span) {
    color: #303133;
    font-weight: normal;
  }
}
</style>
