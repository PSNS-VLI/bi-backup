<template>
  <div class="drag-card" v-for="(item, index) in props.data" :key="item.name">
    <div class="node">
      <div class="node-top">
        <!-- 实际节点 -->
        <div v-if="item.type !== 'virtual'" class="reality-start">
          <div class="line-before" v-if="item.pId !== '-1'" @click="handlerRelation(item)">
            <div class="vertical" v-if="index > 0"></div>
            <hr />
            <div style="width: 90px; display: flex; justify-content: center; align-items: center">
              <i
                v-if="item?.unionToParent?.unionType"
                :class="['iconfont', `${ICONMAP[item?.unionToParent?.unionType]}`]"
              ></i>
              <hr style="width: 100%" v-else />
            </div>
            <hr />
          </div>
          <div class="node-name" @click="clickOpenField(item)">
            <i class="iconfont icon-biaoge"></i>
            <span class="name">{{ item.name }}</span>
            <el-dropdown @command="handlerCommand">
              <i class="iconfont icon-more-horizontal" ref="iconRef"></i>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="item.type === 'SQL'"
                    :command="{ type: 'sqlEdit', data: item }"
                  >
                    <i class="iconfont icon-edit-outline"></i>
                    编辑代码</el-dropdown-item
                  >
                  <el-dropdown-item :command="{ type: 'fieldSelect', data: item }">
                    <i class="iconfont icon-setting"></i>
                    字段选择</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ type: 'deletion', data: item }"
                    v-if="item.children.length <= 0"
                  >
                    <i class="iconfont icon-delete"></i>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <!-- 虚拟节点 -->
        <!-- <div class="virtual"> -->
        <div v-else class="virtual">
          <div class="line-before__virtual">
            <div class="vertical" v-if="index > 0"></div>
            <hr />
          </div>
          <div class="node-virtual" @drop="handlerDropVitrual(item.name)" @dragover.prevent>
            <span class="name">{{ '拖拽左侧表至此添加关联表' }}</span>
          </div>
        </div>
        <!-- 递归入口 -->
        <div v-if="item.type !== 'virtual' && item.children?.length" class="grand-child">
          <drag-card
            :data="item.children"
            @handlerDrop="handlerDropVitrual"
            @handlerFieldSelect="handlerCommand"
            @handlerRelationOpen="handlerRelation"
            @handleFieldDelete="handlerCommand"
            @handleSqlEdit="handlerCommand"
            @clickOpenFieldSelect="clickOpenField"
          ></drag-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, watchEffect } from 'vue'
const emits = defineEmits(
  'handlerDrop',
  'handlerFieldSelect',
  'handleFieldDelete',
  'handleSqlEdit',
  'handlerRelationOpen',
  'clickOpenFieldSelect'
)
const props = defineProps({
  data: {
    type: Array
  }
})

watchEffect(() => {
  console.log(props.data)
})
const clickOpenField = (item) => {
  emits('clickOpenFieldSelect', { data: item })
}
const handlerDropVitrual = (name) => {
  emits('handlerDrop', name)
}
const handlerCommand = (command) => {
  command = JSON.parse(JSON.stringify(command))
  if (command.type === 'fieldSelect') {
    emits('handlerFieldSelect', command)
  } else if (command.type === 'deletion') {
    emits('handleFieldDelete', command)
  } else {
    emits('handleSqlEdit', command)
  }
}
const handlerRelation = (item) => {
  emits('handlerRelationOpen', item)
}
const ICONMAP = {
  RIGHT: 'icon-union',
  LEFT: 'icon-Left-outer-join',
  INNER: 'icon-intersection'
}
</script>
<style lang="scss" scoped>
.drag-card {
  display: flex;
  flex-direction: row;
  .node {
    .node-top {
      justify-content: flex-start;
      display: flex;
    }
  }

  .line-before {
    width: 150px;
    // height: 100%;
    height: size(25);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .vertical {
      position: relative;
      top: -33px;
      min-height: 0;
      height: 66px;
      width: 150px;
      display: flex;
      border-right: 1px solid #c1c1c1;
    }
    hr {
      width: 100%;
    }
    .iconfont {
      color: $theme-complementary-color;
    }
    &:hover {
      cursor: pointer;
    }
  }

  .reality-start {
    display: flex;
    margin: size(20) 0;

    .node-name {
      width: size(200);
      height: size(25);
      padding: size(4) size(16);
      background: #ffffff;
      display: flex;
      justify-content: space-around;
      align-items: center;
      gap: size(8);
      .iconfont {
        color: $theme-complementary-color;
      }
      .name {
        display: inline-block;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  .virtual {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: size(20) 0;
    .line-before__virtual {
      width: 150px;
      height: 100%;
      display: flex;
      // flex: 1;
      justify-content: flex-end;
      align-items: center;
      .vertical {
        position: relative;
        top: -33px;
        height: 66px;
        width: 150px;
        display: flex;
        flex: 1;
        border-right: 1px dotted $theme-complementary-color;
      }
      hr {
        flex: 1;
        border: 1px dotted $theme-complementary-color;
      }
    }

    .node-virtual {
      width: size(210);
      height: size(25);
      border: 2px dotted $theme-complementary-color;
      background: #ffffff;
      @include plain-text;
      opacity: 0.6;
      .name {
        display: inline-block;
        flex: 1;
      }
    }
  }
}
</style>
