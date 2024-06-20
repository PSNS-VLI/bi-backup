<template>
  <div class="transfer" @mousedown="shouldHideTransfer = false">
    <div class="container">
      <div class="container-left" style="border-right: 1px solid rgba(51, 51, 51, 0.17)">
        <span class="container-title">字段</span>
        <el-input v-model="searchValue" placeholder="请输入查询内容" @input="handleSearchField">
          <template #prefix>
            <i class="iconfont icon-search"></i>
          </template>
        </el-input>
        <ul class="container-left__fields">
          <li
            :class="{ active: isItemActive(item) }"
            v-for="item in props.filedsItem"
            :key="item"
            @click="addToRight(item)"
          >
            <span :class="{ active: !isItemActive(item) }">√</span>
            <span>{{ item }}</span>
          </li>
        </ul>
        <div class="btn">
          <el-button @click="addAllToRight">添加左侧全部字段值</el-button>
        </div>
      </div>
      <div class="container-right">
        <span class="container-title">已添加({{ addedItems?.length || 0 }})</span>
        <ul class="container-right__fields" style="max-height: 456px; min-height: 456px">
          <li v-for="item in addedItems" :key="item" @click="deleteToLeft(item)">{{ item }}</li>
        </ul>
        <div class="btn" @click="deleteAllfields">
          <span class="iconfont icon-delete"></span>
          <span>清空</span>
        </div>
      </div>
    </div>
    <div class="operation">
      <GxActions :actions="inputFocusedAction"></GxActions>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
import { GxActions } from '@gxhs/ui'
const emits = defineEmits(['handlerLeave', 'handleSearchChange'])
const props = defineProps({
  filedsItem: {
    type: Array
  },
  exitFields: {
    type: Array
  }
})

const searchValue = ref('')
const addedItems = ref(props.exitFields || []) //存储已添加项
const shouldHideTransfer = ref(true)

const handleSearchField = (val) => {
  emits('handleSearchChange', val)
}
const addToRight = (item) => {
  //右侧不存在添加，存在删除
  const isExit = addedItems.value.includes(item)
  if (isExit) {
    const findIndex = addedItems.value.findIndex((exit) => exit === item)
    addedItems.value.splice(findIndex, 1)
  } else {
    addedItems.value.push(item) // 将被点击的项添加到 addedItems 数组中
  }
}

const isItemActive = (item) => {
  return addedItems.value.includes(item)
}

const addAllToRight = () => {
  const allFields = JSON.parse(JSON.stringify(props.filedsItem))
  console.log('添加全部')
  addedItems.value = allFields
}

const deleteToLeft = (item) => {
  const findIndex = addedItems.value.findIndex((exit) => exit === item)
  addedItems.value.splice(findIndex, 1)
}

const deleteAllfields = () => {
  addedItems.value = [] //清空所有字段
}

const inputFocusedAction = [
  {
    type: 'normal',
    transparent: true,
    label: '取消',
    handler: () => {
      addedItems.value = props.exitFields
      emits('handlerLeave')
    }
  },
  {
    type: 'normal',
    label: '确定',
    handler: () => {
      const addedItem = JSON.parse(JSON.stringify(addedItems.value))

      // 关闭popover,将选中的参数传递给父组件
      emits('handlerLeave', addedItem)
    }
  }
]
</script>
<style lang="scss" scoped>
.transfer {
  display: flex;
  flex-direction: column;
  color: #333;
  .container {
    display: flex;
    flex: 1;
    &-left,
    &-right {
      flex: 1;
    }
    &-left {
      max-width: 50%;
      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-button {
          display: flex;
          background: transparent;
          width: 100%;
          height: size(24);
        }
      }
    }
    &-right {
      max-width: 50%;
      .btn {
        border-top: size(1) solid rgba(51, 51, 51, 0.13);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: size(8);
        span {
          font-size: size(14);
          color: $theme-text-color;
          &:hover {
            cursor: pointer;
          }
        }
        .iconfont {
          margin-right: size(2);
        }
      }
    }
    &-title {
      display: block;
      border-bottom: size(1) solid rgba(51, 51, 51, 0.17);
      width: 100%;
      font-size: size(16);
    }
    &-left__fields,
    &-right__fields {
      list-style: none;
      margin: 0;
      max-height: size(421);
      min-height: size(421);
      overflow-y: auto;
      padding: 0;
      &::-webkit-scrollbar {
        display: none;
      }
      li {
        display: flex;
        align-items: center;
        gap: size(8);
        padding: size(8) size(8);
        transition: rgba(51, 51, 51, 0.08) 0.3s ease;
        &:hover {
          cursor: pointer;
        }
        &.active {
          background-color: rgba(51, 51, 51, 0.08);
        }
        .active {
          visibility: hidden;
          background-color: rgba(51, 51, 51, 0.08);
        }
        &:hover {
          background: rgba(51, 51, 51, 0.08);
        }
      }
    }
  }
  .operation {
    height: size(45);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: size(1) solid rgba(51, 51, 51, 0.11);
    padding-right: size(8);
  }
}
</style>
