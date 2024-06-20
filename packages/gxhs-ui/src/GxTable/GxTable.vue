<template>
  <el-table>
    <el-table-column>
      <el-image></el-image>
      <el-input></el-input>
    </el-table-column>
  </el-table>
</template>

<script>
import { computed, ref, nextTick, watchEffect, h, onUnmounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElImage,
  ElSelect,
  ElInput,
  ElOption,
  ElPopover
} from 'element-plus'

import GxActions from '../GxActions'

export default {
  props: {
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      required: true,
      default: () => []
    },
    tableColumns: {
      type: Array,
      required: true
    },
    tableIndex: {
      type: [Boolean, String],
      default: false
    },
    tableOperations: {
      type: Array,
      default: () => []
    },
    tableRowNum: {
      type: Number,
      default: 10
    },
    rowStyle: {
      type: [Object, Function]
    },
    headerRowStyle: {
      type: [Object, Function]
    },
    headerCellStyle: {
      type: [Function, Object]
    }
  },
  emits: ['operateTable', 'selectionChange', 'select', 'selectAll', 'rowClick'],
  setup(props, { slots, emit, expose }) {
    const tableIndex = computed(() => {
      const a = props.tableIndex
      return a ? (typeof a === 'string' ? a : '编号') : false
    })
    const rowStyleInit = ref({})
    const rowStyle = computed(() =>
      Object.assign(
        {},
        typeof props.rowStyle === 'function' ? {} : props.rowStyle,
        rowStyleInit.value
      )
    )

    const elTableWrapperSelf = ref()
    let rowHeightTimer = null
    const clearTimer = () => {
      rowHeightTimer && clearInterval(rowHeightTimer)
      rowHeightTimer = null
    }
    onUnmounted(() => {
      clearTimer()
    })
    const getRowHeight = (rows) => {
      const tableHeight = elTableWrapperSelf.value?.clientHeight
      if (!tableHeight) return false
      const tableHeaderHeight = document.querySelector('.el-table__header-wrapper').clientHeight
      rowStyleInit.value = {
        height: `${(tableHeight - tableHeaderHeight) / rows}px`
      }
      return true
    }
    const setRowHeight = (rows) => {
      clearTimer()
      nextTick(() => {
        if (!getRowHeight(rows))
          rowHeightTimer = setInterval(() => {
            if (getRowHeight(rows)) clearInterval(rowHeightTimer)
          }, 100)
      })
    }
    watchEffect(() => setRowHeight(props.tableRowNum))

    const getImgSrc = (item, row) => {
      let src = row[item.prop]
      if (item.prefix && src.slice(0, 4) !== 'http') src = item.prefix + src
      return src
    }
    const spCols = ['index', 'operation']

    const getTableColumn = (columns) =>
      columns.map((col) =>
        col.type === 'selection'
          ? h(ElTableColumn, {
              type: col.type,
              width: col.width
            })
          : col.children?.length
            ? h(
                ElTableColumn,
                {
                  label: col.label, //一级表头label
                  align: col.align || 'center',
                  prop: col.prop,
                  width: col.width
                },
                {
                  default: () => getTableColumn(col.children)
                }
              )
            : h(
                ElTableColumn,
                {
                  align: col.align || 'center',
                  prop: col.prop,
                  label: col.label,
                  width: col.width,
                  fixed: spCols.includes(col.type) ? col.fixed : false
                },
                {
                  default: ({ row, column, $index }) => {
                    //返回图标类名
                    const getIconForValue = (value) => {
                      switch (value) {
                        case 'STRING':
                          return { icon: 'iconfont icon-str', color: '#2468F2' }
                        case 'INTEGER':
                          return { icon: 'iconfont icon-num', color: '#67C23A' }
                        case 'DOUBLE':
                          return { icon: 'iconfont icon-num', color: '#67C23A' }
                        case 'DATE':
                          return { icon: 'iconfont icon-date', color: '#2468F2' }
                        default:
                          break // 如果没有匹配的值，可以设置默认的图标类名或者留空
                      }
                    }
                    switch (col.type) {
                      case 'index':
                        return h('span', `${$index + 1}`)
                      case 'img':
                        return h(ElImage, {
                          previewSrcList: [getImgSrc(col, row)],
                          previewTeleported: true,
                          src: getImgSrc(col, row),
                          fit: 'cover',
                          style: { width: col.imgWidth, height: col.imgHeight }
                        })
                      case 'custom':
                        return slots[col.scopeName || col.prop]({
                          row,
                          column,
                          $index
                        })
                      case 'operation':
                        return h(GxActions, {
                          type: 'text',
                          align: 'center',
                          actions:
                            typeof col.actions === 'function'
                              ? col.actions({
                                  row,
                                  column,
                                  $index
                                })
                              : col.actions,
                          attach: { row: row, $index: $index },
                          onClickBtn: (e) => emit('operateTable', e, row, $index)
                        })
                      case 'input':
                        return h(ElInput, {
                          style: {
                            width: col.customWidth || '280px'
                          },
                          clearable: true,
                          'model-value': row[col.prop],
                          'onUpdate:modelValue': (value) => {
                            row[col.prop] = value
                          },
                          placeholder: col.placeholder
                        })
                      case 'select':
                        return h(
                          ElSelect,
                          {
                            modelValue: row[col.prop],
                            'onUpdate:modelValue': (value) => {
                              console.log(value, row[col.prop])
                              row[col.prop] = value
                              console.log(value, row[col.prop])
                            },
                            style: {
                              width: col.customWidth || '120px'
                            },
                            placeholder: col.placeholder,
                            clearable: col.clearable
                          },
                          {
                            prefix: () =>
                              h('i', {
                                class: getIconForValue(row[col.prop]?.type)?.icon,
                                style: {
                                  color: getIconForValue(row[col.prop]?.type)?.color
                                }
                              }),
                            default: () =>
                              col.options && col.options.length > 0
                                ? col.options.map((option) =>
                                    h(
                                      ElOption,
                                      {
                                        value: option.label,
                                        label: option.label
                                      },
                                      {
                                        default: () => {
                                          return h('span', [
                                            h('i', {
                                              class: getIconForValue(option.type).icon,
                                              style: {
                                                height: '34px',
                                                lineHeight: '34px',
                                                marginRight: '7px',
                                                display: 'inline-block',
                                                color: getIconForValue(option.type).color
                                              }
                                            }),
                                            h('span', option.label || option.name)
                                          ])
                                        }
                                      }
                                    )
                                  )
                                : null
                          }
                        )
                      case 'operate':
                        return h(
                          'div',
                          {
                            style: {
                              display: 'flex',
                              justifyContent: 'center',
                              padding: '0 8px'
                            }
                          },
                          [
                            col?.icon?.map((iconInfo) => {
                              if (iconInfo.popoverIcon && !iconInfo.hasChildrenIcon) {
                                //数据源  非树形表格数据
                                return h(
                                  'div',
                                  {
                                    style: {
                                      margin: '0 8px',
                                      cursor: 'pointer',
                                      color: '#2468F2'
                                    }
                                  },
                                  [
                                    h(
                                      ElPopover,
                                      {
                                        placement: 'bottom',
                                        trigger: 'hover'
                                        // width: "150px"
                                      },
                                      {
                                        default: () =>
                                          iconInfo?.popoverIcon?.map((popoverIconInfo) => {
                                            return h(
                                              'div',
                                              {
                                                style: {
                                                  cursor: 'pointer',
                                                  width: popoverIconInfo.width || '100%',
                                                  height: '30px',
                                                  lineHeight: '30px'
                                                },
                                                onmouseover: (event) => {
                                                  event.target.style.background = '#F5F7FA'
                                                },
                                                onmouseout: (event) => {
                                                  event.target.style.background = 'transparent'
                                                },
                                                onClick: () => {
                                                  popoverIconInfo.handleClick(row, column, $index)
                                                }
                                              },
                                              [
                                                h('span', {
                                                  class: popoverIconInfo.iconfont,
                                                  style: {
                                                    color: popoverIconInfo.color
                                                  }
                                                }),
                                                popoverIconInfo.label
                                              ]
                                            )
                                          }),
                                        reference: () =>
                                          //剧名插槽内容
                                          h('div', {
                                            class: iconInfo.iconfont
                                          })
                                      }
                                    )
                                  ]
                                )
                              } else if (iconInfo.popoverIcon && iconInfo.hasChildrenIcon) {
                                //树形表格数据
                                return row.type === 'FOLDER'
                                  ? h(
                                      'div',
                                      {
                                        style: {
                                          margin: '0 8px',
                                          cursor: 'pointer',
                                          color: '#2468F2'
                                        }
                                      },
                                      [
                                        h(
                                          ElPopover,
                                          {
                                            placement: 'bottom',
                                            trigger: 'hover'
                                          },
                                          {
                                            default: () =>
                                              iconInfo?.popoverIcon?.map((popoverIconInfo) => {
                                                return h(
                                                  'div',
                                                  {
                                                    style: {
                                                      cursor: 'pointer',
                                                      width: popoverIconInfo.width || '100%',
                                                      height: '30px',
                                                      lineHeight: '30px'
                                                    },
                                                    onmouseover: (event) => {
                                                      event.target.style.background = '#F5F7FA'
                                                    },
                                                    onmouseout: (event) => {
                                                      event.target.style.background = 'transparent'
                                                    },
                                                    onClick: () => {
                                                      popoverIconInfo.handleClick(
                                                        row,
                                                        column,
                                                        $index
                                                      )
                                                    }
                                                  },
                                                  [
                                                    h('span', {
                                                      class: popoverIconInfo.iconfont,
                                                      style: {
                                                        padding: '0 5px',
                                                        color: popoverIconInfo.color
                                                      }
                                                    }),
                                                    popoverIconInfo.label
                                                  ]
                                                )
                                              }),
                                            reference: () =>
                                              h('div', {
                                                class: 'iconfont icon-circle-plus-outline'
                                              })
                                          }
                                        )
                                      ]
                                    )
                                  : h('div', {
                                      class: iconInfo.iconfont,
                                      style: {
                                        margin: '0 8px',
                                        cursor: 'pointer',
                                        color: '#2468F2'
                                      },
                                      onClick: (e) => {
                                        iconInfo.handleClick(row, column, $index)
                                        emit('handleOnClick', e, row, $index, iconInfo)
                                      }
                                    })
                              } else if (!iconInfo.popoverIcon && !iconInfo.hasChildrenIcon) {
                                //树形表格操作列、无弹出框
                                return row.type === 'FOLDER'
                                  ? h('div', {
                                      class: 'iconfont icon-moveTo',
                                      style: {
                                        margin: '0 8px',
                                        cursor: 'pointer',
                                        color: '#2468F2'
                                      },
                                      onClick: (e) => {
                                        row.type === 'FOLDER'
                                          ? iconInfo.handleFileClick(row, column, $index)
                                          : iconInfo.handleClick(row, column, $index)
                                        emit('handleOnClick', e, row, $index, iconInfo)
                                      }
                                    })
                                  : h('div', {
                                      class: iconInfo.iconfont,
                                      style: {
                                        margin: '0 8px',
                                        cursor: 'pointer',
                                        color: '#2468F2'
                                      },
                                      onClick: (e) => {
                                        row.type === 'FOLDER'
                                          ? iconInfo.handleFileClick(row, column, $index)
                                          : iconInfo.handleClick(row, column, $index)
                                        emit('handleOnClick', e, row, $index, iconInfo)
                                      }
                                    })
                              } else if (iconInfo.isSame) {
                                return h('div', {
                                  class: iconInfo.iconfont,
                                  style: {
                                    margin: '0 8px',
                                    cursor: 'pointer',
                                    color: '#2468F2'
                                  },
                                  onClick: (e) => {
                                    iconInfo.handleClick(row, column, $index)
                                    emit('handleOnClick', e, row, $index, iconInfo)
                                  }
                                })
                              } else {
                                //树形表格操作列、无弹出框
                                return h('div', {
                                  class:
                                    row.type === 'FOLDER'
                                      ? iconInfo.hasChildrenIcon || iconInfo.iconfont
                                      : iconInfo.iconfont,
                                  style: {
                                    margin: '0 8px',
                                    cursor: 'pointer',
                                    color: '#2468F2'
                                  },
                                  onClick: (e) => {
                                    row.type === 'FOLDER'
                                      ? iconInfo.handleFileClick(row, column, $index)
                                      : iconInfo.handleClick(row, column, $index)
                                    emit('handleOnClick', e, row, $index, iconInfo)
                                  }
                                })
                              }
                            })
                          ]
                        )
                      default:
                        return h('span', [row[col.prop]])
                    }
                  },
                  header: ({ column, $index }) => [
                    //二级表头生成的图标
                    h('span', col.label), // 标签
                    col.childrenIcon
                      ? h(
                          'div',
                          {
                            style: {
                              display: 'flex',
                              justifyContent: 'space-between'
                            }
                          },
                          [
                            h('i', {
                              class: col.childrenIcon,
                              style: {
                                marginRight: '4px',
                                color: col.color
                              }
                            }),
                            h(
                              'i',
                              {
                                class: 'iconfont icon-setting',
                                style: {
                                  marginRight: '4px',
                                  color: col.color
                                },
                                onClick: () => {
                                  col?.handleClick(column, $index)
                                }
                              },
                              {}
                            )
                          ]
                        )
                      : null
                  ]
                }
              )
      )

    const elTableSelf = ref()
    expose({
      clearSelection: () => elTableSelf.value.clearSelection(),
      getSelectionRows: () => elTableSelf.value.getSelectionRows(),
      toggleRowSelection: (row, selected) => elTableSelf.value.toggleRowSelection(row, selected),
      toggleAllSelection: () => elTableSelf.value.toggleAllSelection(),
      toggleRowExpansion: (row, expanded) => elTableSelf.value.toggleRowExpansion(row, expanded)
    })
    return () =>
      h('div', { ref: elTableWrapperSelf, class: 'table-list' }, [
        h(
          ElTable,
          {
            ref: elTableSelf,
            data: props.tableData,
            stripe: true,
            border: props.border,
            rowKey: 'id',
            headerRowStyle: props.headerRowStyle,
            headerCellStyle: props.headerCellStyle,
            rowStyle: typeof props.rowStyle === 'function' ? props.rowStyle : rowStyle.value,
            style: 'width: 100%',
            height: '100%',
            showHeader: props.showHeader,
            defaultExpandAll: props.defaultExpandAll,
            onSelectionChange: (e) => emit('selectionChange', e),
            onRowClick: (row) => emit('rowClick', row)
          },
          [
            tableIndex.value
              ? h(
                  ElTableColumn,
                  {
                    label: tableIndex.value,
                    width: '60px',
                    align: 'center',
                    fixed: 'left'
                  },
                  ({ $index }) => h('span', `${$index + 1}`)
                )
              : null,
            getTableColumn(props.tableColumns),
            props.tableOperations.length
              ? h(ElTableColumn, { label: '操作', fixed: 'right' }, ({ row, $index }) =>
                  h(GxActions, {
                    align: 'center',
                    verticalCenter: true,
                    actions: props.tableOperations,
                    attach: { row: row, $index: $index },
                    onClickBtn: (e) => emit('operateTable', e, row, $index)
                  })
                )
              : null
          ]
        )
      ])
  }
}
</script>

<style lang="scss">
@use '../style/index' as *;

//popover中图标的颜色
.icon-wrapper.iconfont {
  color: #ff0000; /* 设置图标的颜色，这里使用红色作为示例 */
}
</style>
<style lang="scss" scoped>
.table-list {
  //border: 1px solid #dfe2e6;
  box-shadow: 0 size(-1) 0 0 #dfe2e6 inset;
  $table-list-bg-color: #f5f7fa;
  height: 100%;
  :deep(.el-table) {
    --el-bg-color: transparent;
    --el-fill-color-lighter: #{$table-list-bg-color};
    --el-fill-color-light: #{$table-list-bg-color};
    --el-table-border: #{size(2)} solid #{rgba($theme-text-color, 0.05)};
    --el-table-border-color: #{rgba($theme-text-color, 0.05)};
    --el-table-bg-color: transparent;
    --el-table-row-hover-bg-color: #{rgba($theme-text-color, 0.2)};
    --el-table-header-bg-color: #{$table-list-bg-color};
    --el-table-tr-bg-color: #{$table-list-bg-color};
    --el-table-text-color: $secondary-text-color;
    --el-table-header-text-color: rgba(255, 255, 255, 0.85);
    .el-table__inner-wrapper {
      .el-table__header {
        thead th {
          font-weight: normal;
          text-align: center;
          color: $secondary-text-color;
        }
      }
      .el-table__body tr:not(.el-table__row--striped) {
        background: transparent;
      }
      .cell {
        .el-image {
          padding: size(2);
          background-image: url('./assets/images/image_border.png');
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>
