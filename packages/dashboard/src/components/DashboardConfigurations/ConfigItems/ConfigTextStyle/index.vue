<template>
  <div class="bi-config-item bi-config-text-style">
    <div class="bi-config-text-style__inner">
      <div
        v-for="itemType in layouts"
        :key="itemType"
        class="bi-config-text-style__item"
        :class="{
          'bi-config-text-style__item-switch':
            itemType === ConfigTextStyleType.FONT_WEIGHT ||
            itemType === ConfigTextStyleType.FONT_STYLE,
          'bi-config-text-style__item-radio': itemType === ConfigTextStyleType.TEXT_ALIGN
        }"
      >
        <template v-if="itemType === ConfigTextStyleType.FONT_WEIGHT">
          <gx-icon
            :class="{
              'bi-config-text-style__item--checked':
                data.fontWeight === ConfigTextStyleFontWeight.BOLD
            }"
            icon-class="icon-Bold"
            @click="
              updateData({
                fontWeight:
                  data.fontWeight === ConfigTextStyleFontWeight.NORMAL
                    ? ConfigTextStyleFontWeight.BOLD
                    : ConfigTextStyleFontWeight.NORMAL
              })
            "
          ></gx-icon>
        </template>
        <template v-else-if="itemType === ConfigTextStyleType.FONT_STYLE">
          <gx-icon
            :class="{
              'bi-config-text-style__item--checked':
                data.fontStyle === ConfigTextStyleFontStyle.ITALIC
            }"
            icon-class="icon-Italic"
            @click="
              updateData({
                fontStyle:
                  data.fontStyle === ConfigTextStyleFontStyle.NORMAL
                    ? ConfigTextStyleFontStyle.ITALIC
                    : ConfigTextStyleFontStyle.NORMAL
              })
            "
          ></gx-icon>
        </template>
        <template v-else-if="itemType === ConfigTextStyleType.TEXT_ALIGN">
          <gx-icon
            :class="{
              'bi-config-text-style__item--checked':
                data.textAlign === ConfigTextStyleTextAlign.START
            }"
            icon-class="icon-Align-left"
            @click="updateData({ textAlign: ConfigTextStyleTextAlign.START })"
          ></gx-icon>
          <gx-icon
            :class="{
              'bi-config-text-style__item--checked':
                data.textAlign === ConfigTextStyleTextAlign.CENTER
            }"
            icon-class="icon-Align-center"
            @click="updateData({ textAlign: ConfigTextStyleTextAlign.CENTER })"
          ></gx-icon>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { GxIcon } from '@gxhs/ui'

import { genComponentName } from '../../../../utils'
import {
  type ConfigTextStyle,
  ConfigTextStyleType,
  ConfigTextStyleFontWeight,
  ConfigTextStyleFontStyle,
  ConfigTextStyleTextAlign
} from '../../../../types/configuration'

defineOptions({
  name: genComponentName('ConfigTextStyle')
})
const props = withDefaults(
  defineProps<{
    config: ConfigTextStyle
    modelValue: any
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])
const data = computed<{
  fontWeight?: ConfigTextStyleFontWeight
  fontStyle?: ConfigTextStyleFontStyle
  textAlign?: ConfigTextStyleTextAlign
}>(() => {
  const keyMap = props.config.keyMap
  const modelValue = props.modelValue

  return {
    fontWeight: modelValue[keyMap?.fontWeight || 'fontWeight'],
    fontStyle: modelValue[keyMap?.fontStyle || 'fontStyle'],
    textAlign: modelValue[keyMap?.textAlign || 'textAlign']
  }
})
const updateData = (patch: {
  fontWeight?: ConfigTextStyleFontWeight
  fontStyle?: ConfigTextStyleFontStyle
  textAlign?: ConfigTextStyleTextAlign
}) => {
  emit('update:modelValue', Object.assign(props.modelValue, patch))
}

const layouts = computed(() => {
  return props.config.layouts?.length
    ? props.config.layouts.reduce((res: Array<ConfigTextStyleType>, cur) => {
        if (!res.includes(cur)) res.push(cur)
        return res
      }, [])
    : [
        ConfigTextStyleType.FONT_WEIGHT,
        ConfigTextStyleType.FONT_STYLE,
        ConfigTextStyleType.TEXT_ALIGN
      ]
})
</script>

<style lang="scss">
@use '../style/common' as *;

.bi-config-text-style {
  &__inner {
    display: flex;
  }

  &__item {
    display: flex;
    min-width: 24px;
    height: 24px;

    .gx-icon {
      --gx-icon-text-color: rgba(0, 0, 0, 0.65);
    }
  }

  &__item--checked.gx-icon {
    --gx-icon-text-color: var(--el-color-primary);
  }

  &__item-switch + &__item-radio {
    &::before {
      content: '|';
      padding-right: 2px;
      color: #e5e5e5;
    }
  }
}
</style>
