<template>
  <div class="gx-actions" :style="actionsStyle">
    <div
      class="gx-actions-item"
      v-for="(action, index) in props.actions"
      :key="action"
      @click="handleClickAction(action, index)"
    >
      <input
        v-if="action.upload"
        type="file"
        style="display: none"
        :accept="action.accept"
        :ref="(el) => setRef('input', el, index)"
        @change="
          typeof action.handler === 'function' && action.handler(action, props.attach, $event)
        "
      />
      <a
        v-if="action.download"
        style="display: none"
        :ref="(el) => setRef('a', el, index)"
        @click.stop
      ></a>
      <ActionContent
        v-if="props.type === ACTION_TYPE.TEXT"
        :action-type="ACTION_TYPE.TEXT"
        :action="action"
      />
      <GxAction v-else v-bind="filterAttrs(action, ['handler', 'accept', 'upload', 'download'])">
        <ActionContent :action-type="ACTION_TYPE.BUTTON" :action="action" />
        <div class="amount" v-show="action.isAmount">{{ action.amount || '' }}</div>
      </GxAction>
    </div>
  </div>
</template>

<script setup>
import GxAction from './GxAction.vue'
import { h, computed, defineComponent } from 'vue'
import { filterAttrs } from '../utils/attribute-filter'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  actions: {
    type: Array,
    required: true
  },
  attach: {
    type: Object,
    default: () => ({})
  },
  align: {
    type: String,
    default: 'center'
  }
})

const actionsStyle = computed(() => ({
  'justify-content': ['center', 'start', 'end'].includes(props.align)
    ? `${['start', 'end'].includes(props.align) && 'flex-'}${props.align}`
    : 'center'
}))

class ACTION_TYPE {
  static TEXT = 'text'
  static BUTTON = 'button'
}
const ActionContent = defineComponent(
  (props) => {
    const { actionType, action } = props
    return () =>
      h(
        'span',
        {
          class: [
            'iconfont',
            `gx-actions-item--${actionType}`,
            { warn: action.warn, disabled: action.disabled }
          ]
        },
        [action.prefix && h('span', { class: ['iconfont', `icon-${action.prefix}`] }), action.label]
      )
  },
  {
    props: {
      actionType: {
        type: ACTION_TYPE,
        required: true
      },
      action: {
        type: Object,
        required: true
      }
    }
  }
)

const inputSelf = {}
const anchorSelf = {}
const setRef = (target, refSelf, index) => {
  if (target === 'input') {
    inputSelf[index] = refSelf
  } else if (target === 'a') {
    anchorSelf[index] = refSelf
  }
}
const handleClickAction = (action, actionIndex) => {
  if (action.disabled) return
  if (action.upload) {
    inputSelf[actionIndex].click()
  } else if (action.download) {
    handleFileDownload(action, actionIndex)
  } else if (typeof action.handler === 'function') {
    action.handler(action, props.attach)
  }
}
const handleFileDownload = async (action, actionIndex) => {
  const url = await action.handler(action, props.attach)
  if (url instanceof Array && url.length && typeof url[0] === 'string') {
    const anchor = anchorSelf[actionIndex]
    const x = new window.XMLHttpRequest()
    x.open('GET', url[0], true)
    x.responseType = 'blob'
    x.onload = () => {
      anchor.href = window.URL.createObjectURL(x.response)
      anchor.download = url.length > 1 ? url[1] : url[0].split('/').pop()
      anchor.click()
      anchor.href = ''
      anchor.download = ''
    }
    x.send()
  }
}
</script>

<style lang="scss" scoped>
@use '../style/index' as *;

.gx-actions {
  display: flex;
  gap: size(16);
  justify-content: center;
  align-items: center;
  @at-root &-item {
    display: flex;
    align-items: center;
    @at-root &--text,
      &--button {
      display: flex;
      align-items: center;
      gap: size(8);
    }
    @at-root &--text {
      @include plain-text;
      display: flex;
      align-items: center;
      height: size(21);
      line-height: size(21);
      color: $theme-text-color;
      cursor: pointer;
      &.warn {
        color: $warn-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.6;
      }
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.iconfont {
  font-size: $normal-text-size;
}
</style>
