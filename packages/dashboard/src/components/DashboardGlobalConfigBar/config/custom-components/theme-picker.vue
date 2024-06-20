<template>
  <div class="bi-custom-theme-picker">
    <el-tabs v-model="activeTabName" @tab-click="handleClickTab">
      <el-tab-pane label="官方" :name="ThemePickerTabName.OFFICAL">
        <el-carousel height="200px">
          <el-carousel-item v-for="item in Math.ceil(themes.length / 6)" :key="item">
            <div class="bi-custom-theme-picker__theme">
              <div
                class="bi-custom-theme-picker__theme-previewer"
                v-for="theme in themes.slice((item - 1) * 6, item * 6 + 1)"
                :key="theme.name"
                :class="{
                  'bi-custom-theme-picker__theme-previewer--selected':
                    theme.name === activeThemeName
                }"
                @click="handleClickTheme(theme.name)"
              >
                <el-image :src="theme.thumbnail"></el-image>
                <div class="bi-custom-theme-picker__theme-previewer-banner">
                  <span>{{ theme.name }}</span>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { type TabsPaneContext, ElMessageBox, type Action } from 'element-plus'

import type { ConfigCustom } from '../../../../types/configuration'

const props = withDefaults(
  defineProps<{
    config: ConfigCustom
    modelValue: string
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])
const attrs = computed<{
  themes: Array<{
    name: string
    thumbnail: string
  }>
}>(() =>
  Object.assign(
    {
      themes: []
    },
    props.config.attributes
  )
)

const themes = computed(() => attrs.value.themes)

const enum ThemePickerTabName {
  OFFICAL,
  CUSTOM
}
const activeTabName = ref<ThemePickerTabName>(ThemePickerTabName.OFFICAL)
const handleClickTab = (tab: TabsPaneContext) => {
  activeTabName.value = tab.paneName as ThemePickerTabName
}

const activeThemeName = ref('')
const setActiveThemeName = (name: string) => {
  activeThemeName.value = name
}
const handleClickTheme = (themeName: string) => {
  const actionTag = activeThemeName.value === themeName ? '重置' : '切换'

  ElMessageBox.alert(
    `主题${actionTag}后，原有自定义样式将无法恢复，建议切换前手动另存为副本。`,
    `主题${actionTag}`,
    {
      showClose: false,
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      callback: (action: Action) => {
        if (action === 'confirm') {
          activeThemeName.value = themeName

          emit('update:modelValue', themeName)
        }
      }
    }
  )
}

watchEffect(() => {
  setActiveThemeName(props.modelValue)
})
</script>

<style lang="scss">
.bi-custom-theme-picker {
  &__theme {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    &-previewer {
      position: relative;
      flex-basis: calc((100% - 20px) / 3);
      height: 95px;
      overflow: hidden;
      cursor: pointer;

      .el-image {
        width: 100%;
      }

      &-banner {
        position: absolute;
        bottom: 0;
        width: 100%;
        line-height: 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.75);
        background-color: rgba(0, 0, 0, 0.45);
      }

      &--selected {
        box-shadow: 0 0 0 1px #2e74ff;

        .bi-custom-theme-picker__theme-previewer-banner {
          background-color: rgba(#2e74ff, 0.75);
        }
      }
    }
  }
}
</style>
