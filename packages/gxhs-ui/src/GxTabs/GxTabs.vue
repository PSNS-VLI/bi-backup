<template>
  <div class="gx-tabs" :style="arrangeStyle">
    <slot name="Header"></slot>
    <div
      class="gx-tabs__item"
      v-for="(item, index) in tabsData"
      :key="index"
      :style="itemStyle"
      :class="{
        'gx-tabs__item-columnsed': isItem('column', index),
        'gx-tabs__item-rowsed': isItem('row', index)
      }"
      @click="changeClick(index, item)"
    >
      <div class="title">
        <template v-if="item.label">
          <i :class="['iconfont', item.icon]"></i>
          <div class="title__name" :style="{ fontSize: props.itemFontSize }" v-if="!item?.edit">
            {{ item.label }}
          </div>
          <el-input
            v-show="item?.edit"
            :ref="(el) => (inputRefs[index] = el)"
            v-model="item.label"
            class="tabs-el-input"
            @blur="inputBlur(index)"
          />
        </template>
        <template v-else>
          <slot name="label"></slot>
        </template>
      </div>
      <div class="edit" v-if="edit && index !== 0">
        <div class="edit_icon iconfont icon-edit-outline" @click="clickEdit(index)"></div>
        <div class="edit_icon iconfont icon-delete" @click="clickDel(index)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
//引入的文件
import { defineProps, defineEmits, computed, ref } from 'vue'

const emit = defineEmits([
  'update:tabsData',
  'update:initial',
  'changeClick', //点击事件
  'inputBlur', //可编辑状态下 光标消失事件
  'clickDel', //删除事件
  'handlerEdit' //编辑tab事件
])

const props = defineProps({
  tabsData: {
    //当前绑定数据 必选
    type: Array,
    default: () => []
  },
  edit: {
    type: Boolean,
    default: false //是否启用编辑模式
  },
  arrangeMode: {
    type: String,
    default: 'row' // row 行 column 列
  },
  itemWidth: {
    type: String, // 每一个item的宽度
    default: ''
  },
  itemHeight: {
    type: String, // 每一个item的高度
    default: ''
  },
  initial: {
    //当前选择的tab 必选
    type: Number,
    default: 0
  },
  itemFontSize: {
    type: String,
    default: '14px'
  }
})

const tabsData = computed({
  get: () => props.tabsData,
  set: (val) => {
    emit('update:tabsData', val)
  }
})
const initial = computed({
  get: () => props.initial,
  set: (val) => {
    emit('update:initial', val)
  }
})
const arrangeMode = computed(() => props.arrangeMode)
const arrangeStyle = computed(() => {
  return { flexDirection: props.arrangeMode === 'row' ? '' : 'column' }
})

const itemStyle = computed(() => {
  const width = props.itemWidth
  const height = props.itemHeight

  if (props.arrangeMode === 'row') {
    return {
      height: height ? height : '40px',
      width: width ? width : '112px',
      justifyContent: props.edit ? 'space-between' : 'center',
      textAlign: 'center'
    }
  }
  // else if (props.arrangeMode === "column") {
  //   return {
  //     height: height ? height : "37px",
  //     width: width ? width : "168px",
  //     justifyContent: "space-between"
  //   };
  // }
  else {
    return {}
  }
})

// 自定义变量-----------------------------------------------------------------------------------------------------------------------------------
const inputRefs = ref([])
// 自定义方法-----------------------------------------------------------------------------------------------------------------------------------

const changeClick = (index, item) => {
  initial.value = index
  emit('changeClick', index, item)
}

const isItem = (val, index) => {
  return arrangeMode.value === val && initial.value === index
}

const clickEdit = (index) => {
  emit('handlerEdit', index)
}

const inputBlur = (index) => {
  if (Object.keys(tabsData.value[index]).includes('edit')) tabsData.value[index].edit = false

  emit('inputBlur', index)
}
const clickDel = (index) => {
  emit('clickDel', index)
}
</script>
<style lang="scss" scoped>
@use '../style/index' as *;

.gx-tabs {
  display: flex;
  &__item {
    @include plain-text;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: size(56);
    line-height: size(32);
    padding: size(16) size(24);
    border-radius: size(2);
    cursor: pointer;
    .title {
      display: flex;
      overflow: hidden;
      &__name {
        @include regular-text;
        padding-left: size(8);
        color: $secondary-text-color;
      }
      &:hover {
        cursor: pointer;
      }
    }
    &:hover,
    &:active {
      background-color: #f5f7fa;
      color: $theme-complementary-color;
      .title__name {
        color: $theme-complementary-color;
      }

      .edit_icon {
        display: block;
      }
    }
    &-columnsed {
      display: flex;
      justify-content: space-between;
      .title__name {
        color: $theme-complementary-color;
      }
      border-left: size(2) solid $theme-text-color;
      background: #f5f7fa;
    }
    &-rowsed {
      .title__name {
        color: $theme-complementary-color;
      }
      background: linear-gradient(180deg, rgba(36, 104, 242, 0) 0%, rgba(36, 104, 242, 0.16) 100%);
      border-bottom: size(2) solid $theme-text-color;
    }
  }
}

.disabled-add {
  opacity: 0.5;
  &-icon {
    cursor: not-allowed;
  }
}
.edit {
  display: flex;
  gap: size(8);
  &_icon {
    display: none;
    font-size: size(16);
    color: $main-button-color;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
