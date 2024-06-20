<template>
  <el-container
    :class="[
      'gx-layout',
      layoutStatus.hideAside && 'gx-layout--hide-aside',
      layoutStatus.hideHeader && 'gx-layout--hide-header'
    ]"
    :direction="judgeDirection(true)"
  >
    <layout-section></layout-section>

    <el-container class="gx-layout__inner" :direction="judgeDirection()">
      <layout-section-reverse></layout-section-reverse>

      <el-main>
        <el-scrollbar>
          <slot></slot>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {
  reactive,
  provide,
  h,
  useSlots,
  type VNode,
  watch,
  onUnmounted,
  onDeactivated,
  watchEffect
} from 'vue'

import GxLayoutAside from './blocks/GxLayoutAside.vue'
import GxLayoutHeader from './blocks/GxLayoutHeader.vue'

import { throttle } from '../../utils/utils'

import { ChageGxLayoutStatusKey, GetGxLayoutStatusKey } from './types'
import type { GxLayoutProps, GxLayoutStatus, ChageLayoutStatus, GetLayoutStatus } from './types'

const props = withDefaults(defineProps<GxLayoutProps>(), {
  asideFill: false,
  autoCollapse: false
})

const layoutStatus = reactive<GxLayoutStatus>({
  hideHeader: false,
  hideAside: false,
  collapse: props.collapse
})
const innerStatus = {
  isAutoCollapse: false
}
watch(
  () => props.collapse,
  (n) => {
    if (!innerStatus.isAutoCollapse) {
      layoutStatus.collapse = n
    }
  }
)

const slots = useSlots()
const LayoutAside = () =>
  h(GxLayoutAside, {
    menus: props.menus,
    collapse: layoutStatus.collapse
  })
const LayoutHeader = () =>
  h(
    GxLayoutHeader,
    {
      logo: props.logo,
      title: props.title,
      icons: props.icons
    },
    {
      logo: slots.logo,
      toolbar: slots.toolbar
    }
  )
const LayoutSectionFactory =
  (reverse: boolean = false) =>
  () => {
    let render: VNode | null = null

    if (props.asideFill) {
      render = reverse ? h(LayoutHeader) : h(LayoutAside)
    } else {
      render = reverse ? h(LayoutAside) : h(LayoutHeader)
    }

    return render
  }
const LayoutSection = LayoutSectionFactory()
const LayoutSectionReverse = LayoutSectionFactory(true)

function judgeDirection(reverse: boolean = false): string {
  return (reverse ? !props.asideFill : props.asideFill) ? 'vertical' : 'horizontal'
}

const autoCollapseAside = throttle(() => {
  if (!props.autoCollapse) return
  innerStatus.isAutoCollapse = true

  const threshold =
    typeof props.autoCollapse === 'number' && props.autoCollapse ? props.autoCollapse : 992
  if (window.innerWidth <= threshold) {
    layoutStatus.collapse = true
  } else {
    layoutStatus.collapse = false
  }

  innerStatus.isAutoCollapse = false
}, 500)
function attachAutoCollapseAside(reverse: boolean = false) {
  if (reverse) {
    window.removeEventListener('resize', autoCollapseAside)
  } else {
    window.addEventListener('resize', autoCollapseAside)
  }
}
watchEffect(() => {
  if (props.autoCollapse) {
    attachAutoCollapseAside()

    onDeactivated(() => attachAutoCollapseAside(true))
    onUnmounted(() => attachAutoCollapseAside(true))
  } else {
    layoutStatus.collapse = props.collapse
    attachAutoCollapseAside(true)
  }
})

const changeStatus: ChageLayoutStatus = (key, status) => {
  layoutStatus[key] = status
}
const getStatus: GetLayoutStatus = (key) => layoutStatus[key]
provide(ChageGxLayoutStatusKey, changeStatus)
provide(GetGxLayoutStatusKey, getStatus)

defineExpose({
  changeStatus,
  getStatus
})
</script>

<style lang="scss">
.gx-layout {
  height: 100vh;

  &__inner {
    min-height: 0;

    .el-scrollbar__view {
      height: 100%;
      min-height: 0;
    }
  }

  .gx-layout-header,
  .gx-layout-aside {
    position: relative;
    transition: all 0.3s;
  }

  &--hide-header {
    .gx-layout-header {
      top: -100%;
      height: 0;
    }
  }

  &--hide-aside {
    .gx-layout-aside {
      left: -100%;
      width: 0;
    }
  }
}
</style>
