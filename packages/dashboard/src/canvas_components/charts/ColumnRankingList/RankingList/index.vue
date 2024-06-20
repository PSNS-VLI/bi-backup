<!-- 排行榜 组件 -->
<template>
  <div class="ranking-list" v-if="transformData">
    <!-- 排序 sort -->
    <div class="column">
      <span
        v-if="columnTxtShow"
        :style="`opacity: ${serialNum.serialNumName === '' ? 0 : 1}; ${columnHeadStyle}`"
        >{{ serialNum.serialNumName || 1 }}</span
      >
      <div :style="itemStyle" v-for="(item, ind) in transformData" :key="ind">
        <div class="item">{{ ind + 1 }}</div>
      </div>
    </div>
    <!-- 类别 category -->
    <div class="column">
      <span v-if="columnTxtShow" :style="columnHeadStyle">{{ categoryName }}</span>
      <div :style="itemStyle" v-for="(item, ind) in transformData" :key="ind">
        <div class="item">{{ item[categoryName] }}</div>
      </div>
    </div>
    <!-- 值 value -->
    <div class="column column-value">
      <!-- 左数字 -->
      <div class="column column-left" v-if="leftNumShow">
        <span v-if="columnTxtShow" :style="columnHeadStyle">{{ valueName }}</span>
        <div :style="itemStyle" v-for="(item, ind) in transformData" :key="ind">
          <div class="item">{{ item[valueName] }}</div>
        </div>
      </div>
      <!-- 数据条 bar -->
      <div class="bar-list" v-if="barShow">
        <span :style="indicator.displayMethod === 'bar' ? 'opacity: 1' : 'opacity: 0'">
          <span v-if="columnTxtShow" :style="columnHeadStyle">{{ valueName }}</span>
        </span>
        <!-- height: ${indicator.parallelTxtSize * 1.26 + 13 + 'px' } -->
        <div class="bar-data" v-for="(item, ind) in transformData" :key="ind">
          <div class="bar-box" :style="itemStyle">
            <div class="bar" :style="backgroundBarStyle">
              <div :style="`width: ${item.widthValue}; ${BarStyle}`">
                <span style="opacity: 0">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右数字 -->
      <div class="column column-right" v-if="rightNumShow">
        <span v-if="columnTxtShow" :style="columnHeadStyle">{{ valueName }}</span>
        <div :style="itemStyle" v-for="(item, ind) in transformData" :key="ind">
          <div class="item">{{ item[valueName] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  },
  // 类别
  categoryName: {
    type: String,
    default: ''
  },
  // 值
  valueName: {
    type: String,
    default: ''
  },
  // 指标数据
  indicator: {
    type: Object,
    default: () => {}
  },
  // 列标题
  columnHead: {
    type: Object,
    default: () => {}
  },
  // 序号
  serialNum: {
    type: Object,
    default: () => {}
  }
})

const transformData = ref([])
const leftNumShow = ref(false)
const barShow = ref(false)
const rightNumShow = ref(false)
const backgroundBarStyle = ref('')
const BarStyle = ref('')
const itemStyle = ref('')

const columnTxtShow = ref(false)
const columnHeadStyle = ref('')
const Style = ref(false)

watch(
  () => [props.chartData, props.indicator.targetValue],
  () => {
    if (props.chartData) {
      getData()
    }
  },
  {
    deep: true
  }
)
watch(
  () => [props.indicator],
  () => {
    indicatorChange()
  },
  {
    deep: true
  }
)
watch(
  () => [props.columnHead],
  () => {
    columnHeadChange()
  },
  {
    deep: true
  }
)

// 处理数据
const getData = () => {
  const { targetValue } = props.indicator
  transformData.value = props?.chartData
  transformData.value?.sort((a, b) => b[props.valueName] - a[props.valueName])
  // 最大值
  const maxValue = transformData.value[0][props.valueName] * 1
  // 目标值
  let target = targetValue && targetValue > maxValue ? targetValue : maxValue

  transformData.value.forEach((ele) => {
    ele.widthValue = (((ele[props.valueName] * 1) / target) * 100).toFixed(2) + '%'
  })
}

// 指标数据
const indicatorChange = () => {
  const {
    displayMethod,
    displayLocation,
    barFillet,
    barColorBackground,
    barHeight,
    barColorJust,
    parallelTxtColor,
    parallelFontWeight,
    parallelFontStyle,
    lineSpace,
    parallelTxtSize
  } = props.indicator
  leftNumShow.value = displayMethod !== 'bar' && displayLocation === 'left' ? true : false
  barShow.value = displayMethod !== 'num' ? true : false
  rightNumShow.value = displayMethod !== 'bar' && displayLocation === 'right' ? true : false
  backgroundBarStyle.value = `width: 100%; border-radius: ${barFillet + 'px'}; background: ${barColorBackground ?? '#e5e7ee'}; height: ${barHeight + '%'};`
  BarStyle.value = `border-radius: ${barFillet + 'px'}; background: ${barColorJust ?? 'rgb(18, 99, 255)'};`
  itemStyle.value = `color: ${parallelTxtColor}; font-weight: ${parallelFontWeight}; font-style: ${parallelFontStyle}; margin-top: ${lineSpace + 'px'}; font-size: ${parallelTxtSize + 'px'};`
}

// 列标题
const columnHeadChange = () => {
  const {
    columnHeadShow,
    columnHeadTxtColor,
    columnHeadTxtSize,
    columnHeadFontWeight,
    columnHeadFontStyle
  } = props.columnHead
  columnTxtShow.value = columnHeadShow
  columnHeadStyle.value = `color: ${columnHeadTxtColor}; font-weight: ${columnHeadFontWeight}; font-style: ${columnHeadFontStyle}; font-size: ${columnHeadTxtSize + 'px'};`
}
</script>

<style lang="scss" scoped>
.ranking-list {
  display: flex;
  font-size: 12px;
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    margin-right: 10px;
    .item {
      margin: 6px 0;
    }
  }
  .column-value {
    flex: 1;
    flex-direction: row;

    .bar-list {
      display: flex;
      flex-direction: column;
      width: calc(100% - 24px);
      height: 100%;
      .bar-data {
        box-sizing: content-box;
        white-space: nowrap;
        .bar-box {
          position: relative;
          padding: 6px 0;
          display: flex;
          align-items: center;

          .bar {
            height: 80%;
          }
        }
      }
    }
  }
  .column-right {
    height: 100%;
    margin-right: 0px;
    margin-left: 10px;
  }
  .column-left {
    height: 100%;
  }
}
</style>
