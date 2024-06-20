<template>
  <div class="table-list" :style="tableBoxStyle">
    <div
      class="header"
      :style="`
      ${headerBorderStyle};
      font-size: ${status.headerStyle.headerText.fontSize}px;
      font-weight: ${status.headerStyle.headerText.fontWeight};
      color: ${status.headerStyle.headerText.color};
      background-color: ${status.headerStyle.headerBackground};
      `"
      v-if="!status.headerStyle.noShow"
    >
      <div
        class="header-item"
        v-for="(headerItem, i) in status.header"
        :key="`${headerItem}${i}`"
        :style="`
        width: ${status.widths[i]}px;
      `"
        :align="status.aligns[i]"
        v-html="headerItem"
      />
    </div>
    <el-scrollbar>
      <div class="rows">
        <div
          class="row-item"
          v-for="(row, ri) in status.rows"
          :key="ri"
          :style="`
        ${rowItemStyle}
        height: ${status.heights[ri]}px;
        line-height: ${status.heights[ri]}px;
        background-color: ${ri % 2 !== 0 && frameStyle === 'zebraCrossing' ? evenRowItemStyle : ''}
      `"
        >
          <div
            class="ceil"
            v-for="(ceil, ci) in row.ceils"
            :key="`${ceil}${ri}${ci}`"
            :style="`
          width: ${status.widths[ci]}px;${ceilsStyle}; 
          font-size: ${ci !== 0 ? valueFontSize.fontSize : status.headerRowStyle.headerText.fontSize}px; 
          color: ${ci !== 0 ? valueFontSize.color : status.headerRowStyle.headerText.color};
          font-weight: ${ci !== 0 ? valueFontSize.fontWeight : status.headerRowStyle.headerText.fontWeight};
          background: ${ci === 0 ? status.headerRowStyle.headerBackground : ''}
          `"
            :align="status.aligns[ci]"
            v-html="ceil"
          />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { watch, reactive, ref } from 'vue'
const props = defineProps({
  headers: {
    type: Array
  },
  rowsData: {
    type: Array
  },
  frameStyle: {
    type: String
  },
  mainColor: {
    type: String
  },
  measureValueStyle: {
    type: String
  },
  headerStyle: {
    type: Object
  },
  headerRowStyle: {
    type: Object
  }
})
const status = reactive({
  // mergedConfig: props.chartConfig.option,
  header: [],
  rowsData: [],
  rows: [],
  widths: [],
  heights: [],
  avgHeight: 0,
  aligns: [],
  animationIndex: 0,
  animationHandler: 0,
  updater: 0,
  needCalc: false,
  headerStyle: {
    headerText: {
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.9)',
      fontWeight: 'normal'
    },
    headerBackground: '',
    noShow: false
  },
  headerRowStyle: {
    headerText: {
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.9)',
      fontWeight: 'normal'
    },
    headerBackground: ''
  }
})
const headerBorderStyle = ref()
const rowItemStyle = ref()
const ceilsStyle = ref()
const tableBoxStyle = ref()
const evenRowItemStyle = ref('')
const valueFontSize = ref({
  fontSize: '',
  color: '',
  fontWeight: ''
})
watch(
  () => props,
  () => {
    getTableData()
  },
  {
    deep: true
  }
)
const getTableData = () => {
  // 表格数据
  Object.assign(status.header, props.headers)
  status.rows = [] // 主色系
  evenRowItemStyle.value =
    props.mainColor === 'themeColor'
      ? 'rgba(46, 116, 255, 0.05)'
      : props.mainColor === 'gray'
        ? '#f6f6fb'
        : props.mainColor
  props.rowsData?.forEach((item, index) => {
    status.rows.push({
      ceils: []
    })
    status.header.forEach((headerItem) => {
      status.rows[index].ceils.push(item[headerItem])
    })
  })
  // 表格基础样式
  if (props.frameStyle === 'zebraCrossing') {
    // 斑马线
    headerBorderStyle.value = 'border-bottom: 1px solid rgb(46, 116, 255)'
    rowItemStyle.value = ''
    ceilsStyle.value = ' '
    tableBoxStyle.value = ''
  } else if (props.frameStyle === 'wireFrame') {
    // 线框
    headerBorderStyle.value =
      props.mainColor === 'themeColor'
        ? `background-color:rgba(46, 116, 255); color: #fff;`
        : `background-color:${evenRowItemStyle.value}; color: #000;`
    rowItemStyle.value = 'background:  transform;border-bottom: 1px solid rgba(0,0,0,0.15);'
    ceilsStyle.value = 'border-right: 1px solid rgba(0,0,0,0.15);'
    tableBoxStyle.value = 'border: 1px solid rgba(0,0,0,0.15);'
  } else if (props.frameStyle === 'abridgedEdition') {
    // 简版
    headerBorderStyle.value = 'border-bottom: 1px solid rgb(46, 116, 255)'
    rowItemStyle.value = 'background:  transform;'
    ceilsStyle.value = ' '
    tableBoxStyle.value =
      'border-top: 2px solid rgb(46, 116, 255);border-bottom: 2px solid rgb(46, 116, 255);'
  } else if (props.frameStyle === 'minimalism') {
    // 极简
    headerBorderStyle.value = 'border-bottom: 1px solid #fff;'
    rowItemStyle.value = 'background:  transform;'
    ceilsStyle.value = ' '
    tableBoxStyle.value = ''
  }

  // 列表头样式
  Object.assign(status.headerStyle, props.headerStyle)
  // 行表头样式
  Object.assign(status.headerRowStyle, props.headerRowStyle)
  // 度量的值的文本样式
  ;({
    color: valueFontSize.value.color,
    fontSize: valueFontSize.value.fontSize,
    fontWeight: valueFontSize.value.fontWeight
  } = props.measureValueStyle)
}
</script>
<style lang="scss" scoped>
.table-list {
  position: relative;
  width: 100%;
  height: 100%;
  color: rgba(0, 0, 0, 0.9);
  // background-color: #fff;
  .text {
    padding: 0 10px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    // border-bottom: size(1) solid rgb(46, 116, 255);
    .header-item {
      flex: 1 1 0;
      padding: size(5) size(12);
    }
  }

  .rows {
    flex-direction: column;
    overflow: hidden;
    .row-item {
      display: flex;
      align-items: center;
      width: 100%;
      font-size: 12px;
      overflow: hidden;
      .ceil {
        flex: 1 1 0;
        padding: size(5) size(12);
        &:last-child {
          border-right: none !important;
        }
      }
      &:hover {
        background-color: rgba(46, 116, 255, 0.1) !important;
      }
    }
  }
}
</style>
