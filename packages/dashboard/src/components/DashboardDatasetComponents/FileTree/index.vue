<template>
  <div class="bi-file-tree">
    <el-scrollbar>
      <el-tree :data="data" :indent="6">
        <template v-slot="{ node, data }">
          <div
            class="bi-file-tree__node"
            :class="{
              'bi-file-tree__node--checked': dragableChecked[node.id],
              'bi-file-tree__node--hovering': nodeHoverStatus[node.id]
            }"
            :draggable="
              callMethodInPropsWithNodeInfo(
                judgeNodeDragable,
                data.draggable ? 'true' : 'false',
                node,
                data
              )
            "
            @click="onClickNode(node, data)"
            @dragstart="handleDragStart($event, node, data)"
            @dragend="
              (event) => {
                nodeHoverStatus[node.id] = nodeHoverStatusBackup
                emit('dragNodeEnd', event, node, data)
              }
            "
            @mouseenter="nodeHoverStatus[node.id] = true"
            @mouseleave="nodeHoverStatus[node.id] = false"
          >
            <slot :node="node" :data="data"></slot>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

import type { FileTreeProps } from './types'

defineOptions({
  name: 'BIFileTree'
})

const props = withDefaults(defineProps<FileTreeProps>(), {
  data: () => []
})
const emit = defineEmits(['dragNodeStart', 'dragNodeEnd'])

const nodeHoverStatusBackup = ref(false)
const nodeHoverStatus = reactive<Record<string, boolean>>({})
const dragableChecked = ref<Record<string | number, boolean>>({})

let callMethodResCache: Record<string, any> = {}
watch(
  () => [props.data, props.judgeNodeDragable],
  () => (callMethodResCache = {}),
  {
    deep: true
  }
)
const callMethodInPropsWithNodeInfo = (
  func?: (...args: any[]) => any,
  defaultVal?: any,
  node?: any,
  data?: any
) => {
  let res = defaultVal
  if (typeof func === 'function') {
    let cache = callMethodResCache[func.name]
    if (!cache) {
      callMethodResCache[func.name] = {}
      cache = callMethodResCache[func.name]
    }
    if (!cache[node.id]) {
      res = func(data, node)
      Object.assign(callMethodResCache[func.name], {
        [node.id]: res
      })
    } else {
      res = cache[node.id]
    }
  }

  return res
}

const onClickNode = (node: any, data: any) => {
  const dragable = callMethodInPropsWithNodeInfo(
    props.judgeNodeDragable,
    data.draggable ? 'true' : 'false',
    node,
    data
  )
  if (dragable === 'true') {
    dragableChecked.value = { [node.id]: !dragableChecked.value[node.id] }
  }
}

const handleDragStart = (event: DragEvent, node: any, data: any) => {
  const dragStartHook = props.dragStartHook
  nodeHoverStatusBackup.value = nodeHoverStatus[node.id]
  nodeHoverStatus[node.id] = false

  typeof dragStartHook === 'function' && dragStartHook(event, data, node)
  emit('dragNodeStart', event, node, data)
  return false
}
</script>

<style lang="scss">
.bi-file-tree {
  --bi-file-tree-check-indicator-color: #{var(--el-color-primary)};
  --bi-file-tree-text-size: #{var(--el-font-size-small)};

  .el-tree {
    --el-tree-expand-icon-color: #{var(--el-text-color-placeholder)};
    font-size: var(--bi-file-tree-text-size);
  }
}

.bi-file-tree {
  font-size: var(--bi-file-tree-text-size);

  &__node {
    flex: 1;
    border: 1px solid transparent;
    overflow: hidden;

    &--checked {
      border: 1px solid var(--bi-file-tree-check-indicator-color);
    }
  }

  .el-tree-node__expand-icon {
    padding: 0;
  }
}
</style>
