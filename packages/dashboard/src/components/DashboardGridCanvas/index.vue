<template>
  <div
    class="bi-dashboard-grid-canvas"
    ref="canvasDom"
    v-loading="canvas.isLoading"
    element-loading-text="Loading..."
  >
    <div class="bi-dashboard-grid-canvas__layout" :style="canvas.getStyle()" @dragover.prevent>
      <div
        class="bi-dashboard-grid-canvas__layout-overlay"
        :style="{
          pointerEvents: canvas.isReceiving ? 'auto' : 'none'
        }"
        @dragenter="(e) => canvas.onDragElementEnter(e)"
        @dragover.prevent="(e) => canvas.onDragElementOver(e)"
        @dragleave="(e) => canvas.onDragElementLeave(e)"
        @drop="(e) => canvas.onDragElementDrop(e)"
      ></div>
      <div
        v-show="canvas.showGrid"
        class="bi-dashboard-grid-canvas__layout-indicator"
        :style="{ gap: canvas.canvasConfig.grid.colGap + 'px' }"
      >
        <div v-for="item in canvas.canvasConfig.grid.colNum" :key="item"></div>
      </div>
      <div class="bi-dashboard-grid-canvas__layout-assist">
        <div class="bi-dashboard-grid-canvas__layout-resizer" :style="canvas.resizer.getStyle()">
          <div
            draggable="true"
            class="right middle"
            style="width: 10px; height: 100%; right: -5px"
            @dragstart="(e) => canvas.onDragElementStart(e)"
            @drag="(e) => canvas.onDragElement(e, CanvasEditingElementIntention.HORIZONTAL_SIZE)"
            @dragend="(e) => canvas.onDragElementEnd(e)"
          ></div>
          <div
            draggable="true"
            class="bottom center"
            style="width: 100%; height: 10px; bottom: -5px"
            @dragstart="(e) => canvas.onDragElementStart(e)"
            @drag="(e) => canvas.onDragElement(e, CanvasEditingElementIntention.VERTICAL_SIZE)"
            @dragend="(e) => canvas.onDragElementEnd(e)"
          ></div>
          <div
            draggable="true"
            class="left middle"
            style="width: 10px; height: 100%; left: -5px"
            @dragstart="(e) => canvas.onDragElementStart(e)"
            @drag="
              (e) => canvas.onDragElement(e, CanvasEditingElementIntention.HORIZONTAL_SIZE_POS)
            "
            @dragend="(e) => canvas.onDragElementEnd(e)"
          ></div>
          <div
            draggable="true"
            class="bottom left"
            style="width: 10px; height: 10px; left: -5px; bottom: -5px"
            @dragstart="(e) => canvas.onDragElementStart(e)"
            @drag="
              (e) => canvas.onDragElement(e, CanvasEditingElementIntention.BOTH_SIZE_HORIZONTAL_POS)
            "
            @dragend="(e) => canvas.onDragElementEnd(e)"
          ></div>
          <div
            draggable="true"
            class="bottom right"
            style="width: 10px; height: 10px; bottom: -5px; right: -5px"
            @dragstart="(e) => canvas.onDragElementStart(e)"
            @drag="(e) => canvas.onDragElement(e, CanvasEditingElementIntention.BOTH_SIZE)"
            @dragend="(e) => canvas.onDragElementEnd(e)"
          ></div>
        </div>
      </div>
      <div
        v-for="element in canvas.elements"
        :key="element.key"
        class="bi-dashboard-grid-canvas__layout-item"
        :style="canvas.getElementStyle(element.key)"
        draggable="true"
        @mouseenter="(e) => canvas.onMouseEnterElement(e, element.key)"
        @dragstart="
          (e) => canvas.onDragElementStart(e, CanvasEditingElementMethod.DRAG, element.key)
        "
        @drag="(e) => canvas.onDragElement(e)"
        @dragend="(e) => canvas.onDragElementEnd(e, element.key)"
        @click="(e) => canvas.onClickElement(e, element.key)"
        @mouseleave="(e) => canvas.onMouseLeaveElement(e, element.key)"
      >
        <div v-if="!(element as any).isFerryman" class="bi-dashboard-grid-canvas__layout-item-box">
          <slot
            name="element"
            :element="element"
            :remove-element="() => canvas.removeElement(element.key)"
          ></slot>
        </div>
      </div>
    </div>
    <div v-show="!canvas.elements.length" class="bi-dashboard-grid-canvas__guid">
      <span>点击左侧面板中的图表将其添加至画布，进行应用服务创建吧</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'

import { CanvasEditingElementIntention, CanvasEditingElementMethod } from '../../types/canvas'

import { DashboardGridCanvas } from './dashboard-grid-canvas'

defineOptions({
  name: 'BIDashboardGridCanvas'
})

// initialize canvas
const canvasDom = ref<HTMLElement | null>(null)
const canvas = reactive(new DashboardGridCanvas())
onMounted(() => canvas.bindContainer(canvasDom.value as HTMLElement))
onUnmounted(() => {
  canvas.recycle()
})

defineExpose({
  canvas
})
</script>

<style lang="scss">
.bi-dashboard-grid-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  // background-color: var(--bi-dashboard-canvas-background, #fafafa);

  &__layout {
    position: relative;
    width: 100%;
    padding-bottom: 300px;

    &-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: none;
      z-index: 999;
    }

    &-item {
      cursor: move;

      &-box {
        width: 100%;
        height: 100%;
      }
    }

    &-indicator {
      position: absolute;
      display: flex;
      width: 100%;
      height: 100%;

      div {
        flex: 1;
        background-color: rgba(46, 116, 255, 0.02);
        border: 1px solid rgba(46, 116, 255, 0.15);
      }
    }

    &-assist {
      position: absolute;
      width: 100%;
    }

    &-resizer {
      position: absolute;
      z-index: 100;
      pointer-events: none;

      div {
        position: absolute;
        pointer-events: auto;
        &::before {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      div.right.middle,
      div.left.middle {
        &::before {
          cursor: ew-resize;
        }
      }
      div.bottom.center {
        &::before {
          cursor: ns-resize;
        }
      }
      div.bottom.left {
        &::before {
          cursor: nesw-resize;
        }
      }
      div.bottom.right {
        &::before {
          cursor: nwse-resize;
        }
      }
    }
  }

  &__guid {
    position: absolute;
    top: 50%;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    z-index: 99;
  }
}
</style>
