<template>
  <div class="indicator-board">
    <div class="indicator-board-card">
      <div class="indicator-board-card-container">
        <div
          :class="[{ line: line }, 'indicator-container']"
          v-for="(item, index) in indicatorData"
          :key="index"
          :style="`${background} ${contentPosition} ${line ? lineSetting : ''};
          flex:${columnWidth};
          `"
        >
          <div style="display: flex">
            <div v-show="isShowIcon === 'left'" class="icon-container" style="margin-right: 20px">
              <div
                class="indicator-icon-wrapper"
                :style="`
                    width: ${iconWrapper.width}px;
                    height: ${iconWrapper.height}px;
                    background-color: ${isAlpha ? colorAlphaSetting[index % 12] : colorSetting[index % 12]};
                    `"
              >
                <i
                  :class="['icon-revenue', 'iconfont', iconSetting[index]]"
                  :style="`color: ${isAlpha ? colorSetting[index % 12] : '#fff'}`"
                ></i>
              </div>
            </div>
            <div class="indicator-item" :style="`${indicatorAlign}`">
              <!-- 维度 -->
              <div class="indicator-name dimension-value" v-if="dimensionShow">
                <div v-show="isShowIcon === 'top'" class="icon-container" style="margin-right: 8px">
                  <div
                    class="indicator-icon-wrapper"
                    :style="`
                    width: ${iconWrapper.width}px;
                    height: ${iconWrapper.height}px;
                    background-color: ${isAlpha ? colorAlphaSetting[index % 12] : colorSetting[index % 12]};
                    `"
                  >
                    <i
                      :class="['iconfont', iconSetting[index]]"
                      :style="`color: ${isAlpha ? colorSetting[index % 12] : '#fff'}; font-size: ${dimensionStyleFontSize}px;`"
                    ></i>
                  </div>
                </div>
                <span :style="dimensionDataStyle">{{ item.title }}</span>
              </div>
              <!-- 指标 -->
              <div
                v-for="(subItem, subIndex) in item.measureInfo"
                :class="['measure-info', !subIndex ? (!displayShow ? 'display-show' : '') : '']"
                :key="subIndex"
                :style="indicatorSpace"
              >
                <div
                  :class="[
                    'measure-info-content',
                    { 'main-measure': subIndex === 0 && !indicatorRelationValue }
                  ]"
                >
                  <div
                    class="measure-name"
                    :style="`${primaryTextCss(subIndex)};${indicatorAlign}`"
                  >
                    <span :style="indicatorRelationValue ? totalTextStyle : ''">{{
                      subItem.name
                    }}</span>
                  </div>

                  <div class="measure-value" :style="primaryNumberCss(subIndex)">
                    <span class="prefix">{{ subItem.prefix }}</span>
                    <span :style="indicatorRelationValue ? totalNumberStyle : ''">{{
                      subItem.value
                    }}</span>
                    <span class="suffix">{{ subItem.suffix }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
const props = defineProps({
  data: {
    type: Array
  },
  // 指标布局
  indicatorLayout: {
    type: Object,
    default: () => {}
  },
  // 指标内容
  indicatorContent: {
    type: Object,
    default: () => {}
  },
  // 系列设置
  seriesSetting: {
    type: Object,
    default: () => {}
  }
})
const indicatorData = ref([])

const line = ref(false)
const lineSetting = ref()
const background = ref('')
const contentPosition = ref('')
const indicatorAlign = ref('')
const indicatorSpace = ref('')
const dimensionShow = ref(true)
const displayShow = ref(true)
const dimensionDataStyle = ref('')
const dimensionStyleFontSize = ref('')
const primaryTextStyle = ref('')
const primaryNumberStyle = ref('')
const assistantTextStyle = ref('')
const assistantNumberStyle = ref('')
const totalTextStyle = ref('')
const totalNumberStyle = ref('')
const indicatorRelationValue = ref(false)

const columnWidth = ref()
// icon
const iconWrapper = ref({
  width: 58,
  height: 58,
  backgroundColor: ''
})
const isShowIcon = ref()
const isAlpha = ref([])
const colorSetting = [
  'rgb(46, 116, 255)',
  'rgb(88, 202, 244)',
  'rgb(134, 126, 236)',
  'rgb(252, 188, 61)',
  'rgb(69, 208, 181)',
  'rgb(91, 123, 186)',
  'rgb(231, 142, 91)',
  'rgb(181, 112, 216)',
  'rgb(238, 153, 255)',
  'rgb(159, 117, 99)',
  'rgb(115, 160, 182)',
  'rgb(138, 179, 229)'
]
const colorAlphaSetting = [
  'rgb(46, 116, 255,0.2)',
  'rgb(88, 202, 244,0.2)',
  'rgb(134, 126, 236,0.2)',
  'rgb(252, 188, 61,0.2)',
  'rgb(69, 208, 181,0.2)',
  'rgb(91, 123, 186,0.2)',
  'rgb(231, 142, 91,0.2)',
  'rgb(181, 112, 216,0.2)',
  'rgb(238, 153, 255,0.2)',
  'rgb(159, 117, 99,0.2)',
  'rgb(115, 160, 182,0.2)',
  'rgb(138, 179, 229,0.2)'
]
const iconSetting = [
  'icon-HelpFilled',
  'icon-List',
  'icon-rongqi-5',
  'icon-view1',
  'icon-a-rongqi151',
  'icon-Promotion',
  'icon-List',
  'icon-rongqi-4',
  'icon-stack-fill',
  'icon-Menu',
  'icon-Connect',
  'icon-cluster',
  'icon-Opportunity',
  'icon-Briefcase',
  'icon-star-on',
  'icon-rongqi-2',
  'icon-rongqi-6'
]
onMounted(() => {
  indicatorData.value = props.data
})
watch(
  () => props.data,
  (n) => {
    indicatorData.value = n
  },
  {
    deep: true
  }
)
watch(
  () => [props.indicatorLayout],
  () => {
    indicatorLayoutChange()
  },
  {
    deep: true
  }
)
watch(
  () => [props.indicatorContent],
  () => {
    indicatorContentChange()
  },
  {
    deep: true
  }
)
watch(
  () => [props.seriesSetting],
  () => {
    seriesSettingChange()
  },
  {
    deep: true
  }
)

const primaryTextCss = (index) => {
  if (index == 0) {
    return primaryTextStyle.value
  } else {
    return assistantTextStyle.value
  }
}

const primaryNumberCss = (index) => {
  if (index == 0) {
    return primaryNumberStyle.value
  } else {
    return assistantNumberStyle.value
  }
}

// 指标布局
const indicatorLayoutChange = () => {
  const {
    indicatorRelation,
    indicatorSegmentation,
    indicatorMargin,
    indicatorDisplayNumber,
    indicatorSplitColor
  } = props.indicatorLayout
  indicatorRelationValue.value = indicatorRelation === 'parataxis' ? true : false

  columnWidth.value = `1 1 calc(100% / ${indicatorDisplayNumber ? indicatorDisplayNumber : 3} - 30px)`

  if (indicatorSegmentation === 'line') {
    line.value = true
    background.value = ''
    lineSetting.value = `border-color:${indicatorSplitColor}`
  } else if (indicatorSegmentation === 'background') {
    background.value = `background-color: rgba(0, 0, 0, 0.03); margin: ${indicatorMargin + 'px'};`
    line.value = false
  } else {
    line.value = false
    background.value = ''
  }
}
// 指标内容
const indicatorContentChange = () => {
  const {
    indicatorContentPosition,
    indicatorDataAlign,
    indicatorValueSpace,
    dimensionName,
    indicatorDisplayName,
    dimensionColor,
    dimensionSize,
    dimensionWeight,
    dimensionStyle,
    indicatorPrimaryTextColor,
    indicatorPrimaryTextSize,
    indicatorPrimaryTextWeight,
    indicatorPrimaryTextStyle,

    // 主指标 - 数值
    indicatorPrimaryNumberColor,
    indicatorPrimaryNumberSize,
    indicatorPrimaryNumberWeight,
    indicatorPrimaryNumberStyle,

    indicatorAssistantTextSizeStyle,
    indicatorAssistantTextStyle,
    indicatorAssistantName,
    indicatorAssistantNumber,

    indicatorTotalTextSizeStyle,
    indicatorTotalTextStyle,
    indicatorTotalName,
    indicatorTotalNumber,

    modifiedPosition,
    modifiedStyle
  } = props.indicatorContent
  contentPosition.value =
    indicatorContentPosition === 'center'
      ? 'justify-content: center;'
      : 'justify-content: flex-start;'
  indicatorAlign.value =
    indicatorDataAlign === 'center' ? 'justify-content: center;text-align: center;' : ''
  indicatorSpace.value = indicatorValueSpace === 'moderate' ? 'margin-top: 8px;' : ''
  dimensionShow.value = dimensionName
  displayShow.value = indicatorDisplayName

  primaryTextStyle.value = `color: ${indicatorPrimaryTextColor}; font-size: ${indicatorPrimaryTextSize}px; font-weight: ${indicatorPrimaryTextWeight}; font-style: ${indicatorPrimaryTextStyle}; `
  primaryNumberStyle.value = `color: ${indicatorPrimaryNumberColor}; font-size: ${indicatorPrimaryNumberSize}px; font-weight: ${indicatorPrimaryNumberWeight}; font-style: ${indicatorPrimaryNumberStyle};`

  assistantTextStyle.value = `color: ${indicatorAssistantName}; font-weight: ${indicatorAssistantTextStyle?.fontWeight}; font-style: ${indicatorAssistantTextStyle?.fontStyle}; font-size: ${indicatorAssistantTextSizeStyle + 'px'};`
  assistantNumberStyle.value = `color: ${indicatorAssistantNumber}; font-weight: ${indicatorAssistantTextStyle?.fontWeight}; font-style: ${indicatorAssistantTextStyle?.fontStyle}; font-size: ${indicatorAssistantTextSizeStyle + 'px'};`
  console.log(indicatorTotalTextStyle?.fontWeight)
  totalTextStyle.value = `color: ${indicatorTotalName}; font-weight: ${indicatorTotalTextStyle?.fontWeight}; font-style: ${indicatorTotalTextStyle?.fontStyle}; font-size: ${indicatorTotalTextSizeStyle + 'px'};`
  totalNumberStyle.value = `color: ${indicatorTotalNumber}; font-weight: ${indicatorTotalTextStyle?.fontWeight}; font-style: ${indicatorTotalTextStyle?.fontStyle}; font-size: ${indicatorTotalTextSizeStyle + 'px'};`

  // 指标修饰符
  isShowIcon.value = modifiedPosition
  isAlpha.value = modifiedStyle === 'bright' ? true : false
  dimensionDataStyle.value = `color: ${dimensionColor}; font-weight: ${dimensionWeight}; font-style: ${dimensionStyle}; font-size: ${dimensionSize}px;`
  dimensionStyleFontSize.value = dimensionSize
  if (isShowIcon.value === 'left') {
    iconWrapper.value.width = 58
    iconWrapper.value.height = 58
  } else {
    let size = 0
    if (dimensionSize) {
      size = dimensionSize - 12
    }
    iconWrapper.value.width = size * 2 + 24
    iconWrapper.value.height = size * 2 + 24
  }
}

// 系列设置
const seriesSettingChange = () => {
  const { seriesSelect, indicatorDataPrefix, indicatorDataSuffix } = props.seriesSetting
  indicatorData.value.forEach((item) => {
    item.measureInfo.forEach((ele) => {
      if (ele.name === seriesSelect) {
        ele.prefix = indicatorDataPrefix
        ele.suffix = indicatorDataSuffix
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.indicator-board {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  color: rgba(0, 0, 0, 0.8);
  .indicator-board-card {
    height: 100%;
  }
  &::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: size(6);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
    box-shadow: inset 0 0 size(6) rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar {
    width: size(4);
  }
  &-card {
    display: flex;
    &-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    .icon-container {
      .indicator-icon-wrapper {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: contain;
        border: size(1) solid transparent;
        border-radius: 50%;
        overflow: hidden;
        .icon-revenue {
          font-size: size(30);
        }
      }
    }
    .indicator-container {
      display: flex;
      justify-content: flex-start;
      min-height: size(100);
      min-width: size(180);
      padding: size(12);
      font-size: size(12);
      .indicator-item {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
        .indicator-name {
          display: flex;
          align-items: center;
          width: 100%;
          span {
            width: 100%;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .measure-info {
          .measure-info-content {
            display: flex;
            .measure-value {
              display: flex;
              align-items: center;
              .prefix,
              .suffix {
                font-size: size(12) !important;
              }
            }

            .measure-name {
              display: flex;
              align-items: center;
              margin-right: size(12);
            }
          }
          &.display-show {
            .measure-name {
              display: none;
            }
          }
        }
        .main-measure {
          display: flex;
          flex-direction: column !important;
          .measure-value {
            display: flex;
            align-items: center;
            font-size: size(24);
            color: #000;
          }
        }
      }
    }
    .line {
      position: relative;
      border-bottom: size(1) solid #e8e8e8;
      &::before {
        content: '';
        bottom: 0;
        position: absolute;
        right: size(-8);
        top: 0;
        width: size(1);
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
