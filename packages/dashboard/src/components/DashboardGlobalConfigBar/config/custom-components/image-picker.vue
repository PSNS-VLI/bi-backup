<template>
  <div class="bi-custom-image-picker" v-click-outside="onClickOutside">
    <div ref="triggerSelf" class="bi-custom-image-picker__trigger">
      <el-image :src="getCurrentImageThumbnail(currentImgSrc)">
        <template #error>
          <gx-icon icon-class="icon-picture-outline"></gx-icon>
        </template>
      </el-image>
    </div>

    <el-popover
      popper-class="bi-custom-image-picker__popper"
      ref="popoverSelf"
      :virtual-ref="triggerSelf"
      trigger="click"
      virtual-triggering
      placement="top"
      width="365"
    >
      <div class="bi-custom-image-picker__picker">
        <el-tabs v-model="activeTab" @tab-click="handleClickTab">
          <el-tab-pane
            v-if="attrs.materials?.length"
            label="使用素材"
            :name="ImagePickerTab.MATERIAL"
          >
            <div class="bi-custom-image-picker__picker-material">
              <div><span>图片背景</span></div>

              <el-scrollbar>
                <div class="bi-custom-image-picker__picker-material-previewer">
                  <el-image
                    v-for="imgSrc in materialUrls"
                    :key="imgSrc"
                    :src="imgSrc"
                    :class="{
                      'is-selected': currentImgSrc === imgSrc
                    }"
                    @click="
                      () => {
                        imgSrcPicked = `${imgSrc}${ImageSource.MATERIAL}`
                        imgSrcInput = ''
                      }
                    "
                  ></el-image>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="自定义图片" :name="ImagePickerTab.CUSTOM">
            <div class="bi-custom-image-picker__picker-custom">
              <el-upload
                v-if="attrs.uploadApi"
                class="bi-custom-image-picker__picker-custom-upload"
                accept="image/*"
                action="#"
                :limit="1"
                :before-upload="handleBeforeFileUpload"
              >
                <el-button>
                  <template v-if="currentImageSource === ImageSource.UPLOAD">
                    <gx-icon icon-class="icon-refresh-right"></gx-icon>重新上传
                  </template>
                  <template v-else> <gx-icon icon-class="icon-upload"></gx-icon>点击上传 </template>
                </el-button>
                <template #tip>
                  <span>只支持jpg,jpeg,png,gif,svg格式,最大1M</span>
                </template>
              </el-upload>
              <div>
                <span v-if="attrs.uploadApi && !attrs.disableLink" style="padding-right: 4px"
                  >或</span
                >
                <span>通过图片链接上传</span>
              </div>
              <div class="bi-custom-image-picker__picker-custom-input">
                <el-input placeholder="请输入图片网址" v-model="imgSrcInput"></el-input>
                <el-button
                  :disabled="!imgSrcInput.length"
                  @click="imgSrcPicked = `${imgSrcInput}${ImageSource.INPUT}`"
                  type="primary"
                  >使用</el-button
                >
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="bi-custom-image-picker__picker-footer">
          <div>
            <!-- <span>显示方式</span>
            <el-select></el-select> -->
          </div>
          <el-button text plain type="primary" @click="resetImgSrcPicked">恢复默认</el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ClickOutside as vClickOutside,
  ElPopover,
  type TabsPaneContext,
  type UploadRawFile
} from 'element-plus'

import { GxIcon } from '@gxhs/ui'

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
  materials?: Array<{
    url: string
    thumbnail?: string
  }>
  disableLink?: boolean
  uploadApi?: (file: File) => Promise<string>
}>(() =>
  Object.assign(
    {
      materials: [],
      disableLink: false
    },
    props.config.attributes
  )
)

const materialUrls = computed(() => {
  return attrs.value.materials?.map((material) => material.url) ?? []
})
const getCurrentImageThumbnail = (currentImgSrc: string) => {
  const currentMaterial = attrs.value.materials?.find((material) => material.url === currentImgSrc)
  if (currentMaterial) {
    return currentMaterial.thumbnail || currentMaterial.url
  }

  return currentImgSrc
}

const imgSrcInput = ref<string>('')
const imgSrcPicked = ref<string>('')
const resetImgSrcPicked = () => {
  imgSrcPicked.value = ''
  imgSrcInput.value = ''
}
watch(imgSrcPicked, (n) => {
  currentImgSrc.value = n
})

const enum ImageSource {
  MATERIAL = '?bi_image_soure=material',
  UPLOAD = '?bi_image_soure=upload',
  INPUT = '?bi_image_soure=input'
}
const currentImageSource = ref<ImageSource>(ImageSource.INPUT)
const setImageSource = (imgSrc: string) => {
  if (!imgSrc) return ''

  if (imgSrc.includes(ImageSource.MATERIAL) || materialUrls.value.includes(imgSrc)) {
    currentImageSource.value = ImageSource.MATERIAL
  } else if (imgSrc.includes(ImageSource.UPLOAD)) {
    currentImageSource.value = ImageSource.UPLOAD
  } else {
    currentImageSource.value = ImageSource.INPUT
  }

  if (currentImageSource.value) imgSrc = imgSrc.replace(currentImageSource.value, '')

  if (currentImageSource.value === ImageSource.INPUT) {
    imgSrcInput.value = imgSrc
  }

  return imgSrc
}

// upload file
const handleBeforeFileUpload = async (rawFile: UploadRawFile) => {
  const uploadApi = attrs.value.uploadApi

  if (!uploadApi) return false

  const fileUrl = await uploadApi(rawFile)
  if (fileUrl) {
    currentImgSrc.value = `${fileUrl}${ImageSource.UPLOAD}`
  }

  return false
}

const currentImgSrc = computed({
  get: () => {
    const imgSrc = props.modelValue
    return setImageSource(imgSrc)
  },
  set: (val) => emit('update:modelValue', val)
})

const triggerSelf = ref<HTMLElement | null>(null)
const popoverSelf = ref<InstanceType<typeof ElPopover> | null>(null)
const onClickOutside = () => {
  if (popoverSelf.value) {
    ;(popoverSelf.value.popperRef as any)?.delayHide?.()
  }
}

const enum ImagePickerTab {
  MATERIAL,
  CUSTOM
}
const activeTab = ref<ImagePickerTab>(
  attrs.value.materials?.length ? ImagePickerTab.MATERIAL : ImagePickerTab.CUSTOM
)
const handleClickTab = (tab: TabsPaneContext) => {
  activeTab.value = tab.paneName as ImagePickerTab
}
</script>

<style lang="scss">
.bi-custom-image-picker {
  display: inline-block;

  .gx-icon {
    --gx-icon-padding: 0;
    --gx-icon-border-radius: 0;
    --gx-icon-hover-bg-color: none;
    --gx-icon-text-color: none;
  }

  &__trigger {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 24px;
    border: 1px solid var(--bi-color-border-divider, rgba(0, 0, 0, 0.1));
    border-radius: 2px;
    cursor: pointer;

    .el-image {
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
    }
  }

  &__popper {
    --el-popover-padding: 0;
  }

  &__picker {
    display: flex;
    flex-direction: column;
    height: 286px;

    .el-tabs {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;

      &__nav-scroll {
        padding-left: 20px;
      }

      &__content {
        flex: 1;
        min-height: 0;
      }

      .el-tab-pane {
        height: 100%;
        overflow: hidden;
      }
    }

    &-material {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0 15px;

      .el-scrollbar {
        flex: 1;
        min-height: 0;
      }

      &-previewer {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;

        .el-image {
          height: 60px;
          padding: 4px;
          flex-basis: calc(100% / 3);
          cursor: pointer;

          &.is-selected {
            box-shadow: inset 0 0 0 1px #468cff;
          }
        }
      }
    }

    &-custom {
      padding: 0 20px;

      &-upload {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;

        span {
          font-size: 12px;
        }
      }

      &-input {
        display: flex;
        margin-top: 10px;
      }
    }

    &-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid var(--bi-color-border-divider, rgba(0, 0, 0, 0.1));
    }
  }
}
</style>
