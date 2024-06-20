<template>
  <div class="bi-panel-search">
    <el-popover
      :disabled="!!input"
      v-model:visible="showHistory"
      trigger="click"
      :width="inputPopperWidth"
      popper-class="bi-panel-search__input-popper"
    >
      <template #reference>
        <el-input
          v-model="input"
          ref="elInputSelf"
          class="bi-panel-search__input"
          :prefix-icon="prefixSearch"
          clearable
          placeholder="搜索"
        ></el-input>
      </template>
      <div class="bi-panel-search__history">
        <div class="bi-panel-search__history-header">
          <span>搜索历史</span>
          <div class="bi-panel-search__history-clear" @click="onClickClearAll">
            <gx-icon icon-class="icon-delete"></gx-icon><span>清空历史</span>
          </div>
        </div>
        <div v-show="histories.length" class="bi-panel-search__history-list">
          <div
            v-for="(history, index) in histories"
            :key="history.content"
            class="bi-panel-search__history-item"
            @click="onClickHistory(index)"
          >
            <span>{{ history.content }}</span>
            <gx-icon icon-class="icon-close" @click="onClickClear(index)"></gx-icon>
          </div>
        </div>
      </div>
    </el-popover>
    <gx-icon-group class="bi-panel-search__operation" :icons="icons"></gx-icon-group>
  </div>
</template>

<script setup lang="ts">
import { h, ref, onMounted, watch } from 'vue'
import { ElInput } from 'element-plus'

import { GxIconGroup, type GxIconGroupItem, GxIcon } from '@gxhs/ui'

import { debounce } from '../../../utils'

defineOptions({
  name: 'BIPanelSearch'
})
const props = withDefaults(
  defineProps<{
    storageKey: string
  }>(),
  {}
)
const emit = defineEmits(['change', 'expand', 'collapse'])
const emitChange = debounce((val: string) => {
  emit('change', val)
  val && addHistory(val)
})

/**
 * input
 */
// el-input-prefix
const prefixSearch = () =>
  h(GxIcon, { iconClass: 'icon-search', style: '--gx-icon-padding: 0;line-height: normal;' })

// popper width
const inputPopperWidth = ref<string | number>('auto')
const elInputSelf = ref<InstanceType<typeof ElInput> | null>(null)
onMounted(() => {
  if (elInputSelf.value?.input) {
    new ResizeObserver(() => {
      if (elInputSelf.value) {
        inputPopperWidth.value = elInputSelf.value.$el.getBoundingClientRect().width ?? 'auto'
      }
    }).observe(elInputSelf.value.input)
  }
})

// input value
const input = ref('')
watch(input, (n) => {
  emitChange(n)
  showHistory.value = true
})

// search history
interface SearchHistory {
  timestamp: number
  content: string
}
const histories = ref<Array<SearchHistory>>([])
const showHistory = ref(false)
const addHistory = (content: string) => {
  const index = histories.value.findIndex((history) => history.content === content)
  const timestamp = new Date().getTime()
  if (index > -1) {
    histories.value[index].timestamp = timestamp
  } else {
    histories.value.push({
      timestamp,
      content
    })
  }
  histories.value.sort((a, b) => b.timestamp - a.timestamp)
}
const onClickHistory = (index: number) => {
  input.value = histories.value[index].content
  showHistory.value = false
}
const onClickClear = (index: number) => {
  histories.value.splice(index, 1)
}
const onClickClearAll = () => {
  histories.value = []
}

// search history persistence
;(() => {
  const data = localStorage.getItem(props.storageKey)
  if (data) {
    histories.value = JSON.parse(data) as Array<SearchHistory>
  }
})()
const storage = () => {
  localStorage.setItem(props.storageKey, JSON.stringify(histories.value))
}
watch(
  histories,
  () => {
    storage()
  },
  { deep: true }
)

/**
 * operations
 */
const icons: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-more-horizontal',
    children: [
      {
        iconClass: '',
        title: '展开所有类别',
        onClick() {
          emit('expand')
        }
      },
      {
        iconClass: '',
        title: '收起所有类别',
        onClick() {
          emit('collapse')
        }
      }
    ]
  }
]
</script>

<style lang="scss">
.bi-panel-search {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid var(--bi-color-border-divider-weak, rgba(0, 0, 0, 0.06));

  &__input {
    --el-input-height: 26px;
    --el-input-border-radius: 13px;

    flex: 1;

    &-popper {
      --el-popover-padding: 0;
    }
  }

  &__history {
    overflow: hidden;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 12px 0 12px;
      font-size: 12px;
    }

    &-clear {
      cursor: pointer;
      .gx-icon {
        --gx-icon-hover-bg-color: transparent;
      }
    }

    &-list {
      margin-top: 5px;
    }

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
