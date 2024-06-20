<template>
  <el-tree
    :data="filteredTreeData"
    default-expand-all
    node-key="id"
    :expand-on-click-node="false"
    :draggable="props.draggable"
    @node-click="nodeClick"
    @node-drop="handleDrop"
    @node-drag-start="nodeDragStart"
    @node-drag-end="nodeDragEnd"
    highlight-current
    :allow-drop="isAllowDrop"
  >
    <template #default="{ node, data }">
      <template v-if="!data.checked">
        <div class="tree-node" @click="handlerNodeClick(node.level, data)">
          <el-tooltip placement="right" hide-after="0" offset="50" :show-arrow="false">
            <template #content>
              <template v-if="data.datasetTableFieldType === 'FIELD'">
                {{ data.name }}<br />
                <span style="color: #999; font-size: 11px">
                  {{ data.name }}
                </span>
                <br />
                <hr />
                {{ data.datasetTableFieldType === 'FIELD' ? data.description : null }}
              </template>
              <template v-else>
                {{ data.name }}
              </template>
            </template>
            <div class="tree-node__name">
              <i class="iconfont" :class="{ [data.icon]: true }" :style="getIconForColor(data)"></i>
              <span class="node-name" :class="node - name__color">{{ data.name }}</span>
            </div>
          </el-tooltip>
          <div class="tree-node__action" v-if="node.level !== 1">
            <div class="desc" v-if="data.desc">{{ data.desc }}</div>
            <div class="icon-dropdown" v-else>
              <GxDropdownMenu
                v-if="editFolder"
                ref="dropdownMenuSelf"
                :menus="getDropdownItems(data)"
              >
                <i class="iconfont icon-setting"></i>
                <template #title="{ label, isActive, value, icon, format }">
                  <div
                    class="tree-node__menu"
                    :class="{
                      'tree-node__menu--active': !!(isActive === data.type)
                    }"
                    @click="
                      () => {
                        hanldeDropdownMenuTitleClick()
                        handlerDropDownMenuItem(data, value, node, format)
                      }
                    "
                  >
                    <i :class="['iconfont', icon]"></i>
                    {{ label }}
                  </div>
                </template>
              </GxDropdownMenu>
            </div>
          </div>
          <div class="tree-node__action" v-else style="visibility: initial">
            <span
              class="iconfont"
              :class="{ 'icon-folder-add': data.name != '常规函数' }"
              @click="handlerAddFolder(data)"
            ></span>
          </div>
        </div>
      </template>
    </template>
  </el-tree>
</template>
<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import { getIconForColor, getDropdownItems } from '@/views/DataStructure/DataSet/useInfoBlock'
import { GxDropdownMenu } from '@gxhs/ui'
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  actions: {
    type: Array,
    required: true
  },
  draggable: {
    type: Boolean,
    default: false
  },
  editFolderName: {
    type: Object
  }
})
function removeCheckedNodes(tree) {
  return tree?.filter((node) => {
    if (node.children) {
      node.children = removeCheckedNodes(node.children)
      if (node.children.length === 0) {
        return false // filter会排除这个节点
      }
    }
    // 只保留checked不为1的节点
    return node.checked !== 1
  })
}
// 删除所有checked为1的节点
const filteredTreeData = computed(() => {
  const jsonData = JSON.parse(JSON.stringify(props.data))
  return jsonData.map((rootNode) => ({
    ...rootNode,
    children: removeCheckedNodes(rootNode.children)
  }))
})

const editFolder = ref(true)
watch(
  () => props.data,
  () => {
    editFolder.value = false
    setTimeout(() => {
      editFolder.value = true
    }, 100)
  },
  {
    deep: true
  }
)
const emit = defineEmits([
  'clickBtn',
  'handlerNodeClick',
  'clickNode',
  'handlerAddFolder',
  'handlerDropItem',
  'nodeDrop', //拖拽成功
  'nodeDragStart',
  'nodeDragEnd' //拖拽结束
])
const handlerNodeClick = (level, data) => {
  //新建计算字段中添加字段
  if (level !== 1) {
    emit('handlerNodeClick', data)
  }
}
const nodeClick = (item, node, treeNode, event) => {
  //点击节点触发，移动资源时用到
  emit('clickNode', item, node, treeNode, event)
}

const handleDrop = (draggingNode, dropNode, dropType, ev) => {
  //拖拽成功
  emit('nodeDrop', draggingNode, dropNode, dropType, ev, filteredTreeData)
}
const nodeDragStart = (draggingNode, ev) => {
  ev.dataTransfer.setDragImage(ev.target.children[0], 10, 10) //拖拽时半透明图片
  emit('nodeDragStart', draggingNode, ev)
}
const nodeDragEnd = (draggingNode, dropNode, dropType, ev) => {
  const draggingNodeData = draggingNode.data
  const dropNodeData = dropNode?.data
  if (draggingNode.level === 1) return
  if (dropNode && dropNode.level === 1 && dropType === 'before') {
    return
  }
  if (draggingNodeData.granularity) return
  if (dropNodeData) {
    if (dropNodeData && dropNodeData.granularity) {
      return
    }
  }
}
const isAllowDrop = (draggingNode, dropNode, type) => {
  const draggingNodeData = draggingNode.data
  const dropNodeData = dropNode.data
  if (draggingNodeData.granularity) {
    return false
  }
  if (
    dropNodeData.granularity ||
    (dropNode.parent.data.length === 2 && dropNode.data.dataType !== draggingNodeData.dataType) ||
    dropNode.data.dataType !== draggingNode.data.dataType
  ) {
    return false
  }
  if (dropNodeData.datasetTableFieldType === 'FIELD') {
    if (dropNodeData.children) {
      return false
    } else {
      if (type === 'inner') {
        return false
      } else {
        return true
      }
    }
  } else {
    return true
  }
}

const handlerAddFolder = (data) => {
  emit('handlerAddFolder', data)
}

const dropdownMenuSelf = ref(null)
const hanldeDropdownMenuTitleClick = () => {
  const controller = dropdownMenuSelf.value?.ref()
  controller && controller.handleClose()
}

const handlerDropDownMenuItem = (data, event, node, format) => {
  emit('handlerDropItem', data, event, node.parent, format)
}
</script>
<style lang="scss" scoped>
.tree-node__menu {
  flex: 1;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 13px;

  &:hover {
    background-color: #f4f4f4;
  }

  &--active {
    background-color: rgba(46, 116, 255, 0.1);
  }
}
:deep(.el-tree-node) {
  .el-tree-node__content {
    display: flex;
    padding: 0 size(4);
    .iconfont.icon-folder-opened {
      padding-right: size(8);
    }
    .tree-node {
      display: flex !important;
      flex: 1;
      justify-content: space-between;
      align-items: center;
      &__action {
        visibility: hidden;
        gap: size(8);
        align-items: center;
        .desc {
          visibility: initial;
        }
      }
      &__name {
        // min-width: 180px;
        max-width: 200px;
        text-overflow: ellipsis;
        overflow: hidden;
        .node-name {
          display: inline;
        }
        .iconfont {
          padding-right: size(8);
        }
      }
    }
    .el-tree-node__label {
      display: flex;
      width: 100%;
      flex: 1;
    }
    .el-tree-node__expand-icon {
      margin-right: size(4);
    }
    &:hover .tree-node__action {
      visibility: initial;
    }
  }
}
</style>
