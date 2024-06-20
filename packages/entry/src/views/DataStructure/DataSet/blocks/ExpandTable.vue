<template>
  <div class="table-container">
    <div class="table-title">
      <ul>
        <li v-for="item in tableColumn" :key="item">{{ item.label }}</li>
      </ul>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-expand-all="true"
      :show-header="false"
      row-key="name"
      @select="handlerSelect"
      ref="mainTableSelf"
    >
      <el-table-column type="selection" :selectable="selectable" :show-overflow-tooltip="false">
      </el-table-column>
      <el-table-column type="expand">
        <template #default="props">
          <el-table
            :data="props.row.children"
            :show-header="false"
            class="expand-table"
            @select="(selection, row) => handlerSubSelect(selection, row, props.row)"
            :cell-style="cellStyle"
            :ref="(el) => setRefMap(el, props.row.name)"
          >
            <el-table-column type="selection" :selectable="selectable"></el-table-column>
            <el-table-column label="字段原名" prop="name">
              <template #default="{ row }">
                <el-input
                  v-model="row.name"
                  @focus="inputFocus(row.name, row)"
                  @blur="inputValueChange(row.name, row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="物理字段名" prop="originName"></el-table-column>
            <el-table-column label="字段类型" prop="type">
              <template #default="{ row }">
                <el-cascader
                  v-model="row.type"
                  :options="fieldTypeMapList(row.dataType)"
                  :props="{
                    emitPath: true,
                    expandTrigger: 'hover',
                    value: 'value',
                    label: 'label',
                    children: 'children',
                    checkStrictly: true
                  }"
                  @change="(val) => handleChange(row, val)"
                >
                  <template #default="{ data }">
                    <span>{{ data.label }}</span>
                  </template>
                </el-cascader>
              </template>
            </el-table-column>
            <el-table-column label="默认聚合" prop="aggregation">
              <template #default="{ row }">
                <el-select
                  v-model="row.aggregation"
                  v-if="props.row.name.includes('度量')"
                  @change="(val) => handleDefaultChange(row.name, val, row)"
                >
                  <el-option
                    v-for="op in optionAggregat"
                    :key="op.value"
                    :label="op.label"
                    :value="op.value"
                  ></el-option>
                </el-select>
                <div v-else></div>
              </template>
            </el-table-column>
            <el-table-column label="数值展示格式" prop="dataFormat">
              <template #default="{ row }">
                <el-select
                  v-model="row.dataFormat"
                  v-if="props.row.name.includes('度量')"
                  @change="(val) => handleDefaultChange(row.name, val, row)"
                >
                  <el-option
                    v-for="op in options"
                    :key="op.value"
                    :label="op.label"
                    :value="op.value"
                  ></el-option>
                </el-select>
                <div v-else></div>
              </template>
            </el-table-column>
            <el-table-column label="字段描述" prop="desc">
              <template #default="{ row }">
                <el-input
                  v-model="row.description"
                  @focus="inputFocus(row.name, row)"
                  @blur="inputDescriptionChange(row.name, row)"
                  placeholder="请输入字段描述"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="options">
              <template #default="{ row }">
                <GxActions :actions="actions" :attach="row" type="text"></GxActions>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="" prop="name"> </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { GxActions } from '@gxhs/ui'
import { defineProps, defineEmits, ref, watchEffect, computed } from 'vue'
import { options } from './../useInfoBlock.js'

const emit = defineEmits([
  'handlerBatchOptions',
  'handlerExpandCopy',
  'handlerExpandDelete',
  'inputNameChange', //字段原名
  'selectDefault', //默认聚合方式
  'inputDescChange',
  'expandRowChange' //字段类型
])
const props = defineProps({
  tableData: {
    type: Array
  }
})

const optionAggregat = [
  {
    label: '求和',
    value: 'SUM'
  },
  {
    label: '计数',
    value: 'COUNT'
  },
  {
    label: '最大值',
    value: 'MAX'
  },
  {
    label: '最小值',
    value: 'MIN'
  },
  {
    label: '平均值',
    value: 'AVG'
  }
]
//默认聚合
const handleDefaultChange = (name, val, row) => {
  emit('selectDefault', name, val, row)
}

const tableData = ref(props.tableData)
function removeCheckedNodes(tree) {
  return tree?.filter((node) => {
    if (node.children) {
      node.children = removeCheckedNodes(node.children)
      if (node.children.length === 0) {
        return false
      }
    }
    return node.checked !== 1
  })
}

watchEffect(() => {
  const jsonData = JSON.parse(JSON.stringify(props.tableData))
  tableData.value = jsonData.map((rootNode) => {
    const { name, ...rootItems } = rootNode
    return {
      name: name + '（' + `${rootNode.children.length}` + '）',
      ...rootItems,
      children: removeCheckedNodes(rootNode.children)
    }
  })
})
const mainTableSelf = ref(null)

const subItemRef = ref([])
const tableColumn = [
  {
    label: '字段原名'
  },
  {
    label: '物理字段名'
  },
  {
    label: '字段类型'
  },
  {
    label: '默认聚合'
  },
  {
    label: '数值展示格式'
  },
  {
    label: '字段描述'
  },
  {
    label: '操作'
  }
]
const fieldTypeMap = [
  {
    label: '日期',
    value: 'DATE',
    children: [
      {
        value: 'yyyy-MM-dd HH:mm:ss',
        label: '自动'
      },
      {
        value: 'YYYY-MM-DD HH:mm:ss',
        label: 'YYYY-MM-DD HH:mm:ss'
      },
      {
        value: 'YYYYMMDD HH:mm:ss',
        label: 'YYYYMMDD HH:mm:ss'
      },
      {
        value: 'YYYY/MM/DD HH:mm:ss',
        label: 'YYYY/MM/DD HH:mm:ss'
      },
      {
        value: 'YYYY年MM月DD日 HH:mm:ss',
        label: 'YYYY年MM月DD日 HH时mm分ss秒'
      }
    ]
  },
  {
    label: '地理',
    value: 'GEOGRAPHY'
  },
  {
    label: '文本',
    value: 'STRING'
  },
  {
    label: '数值',
    value: 'NUMBER'
  }
]
const fieldTypeMapList = (type) => {
  const optionList = JSON.parse(JSON.stringify(fieldTypeMap))
  let options = []
  if (type === 'MEASURE') {
    options = optionList.slice(2)
  } else {
    options = optionList
  }
  return options
}
//级联选择器
const handleChange = (row, val) => {
  emit('expandRowChange', row, val)
}

function flattenDeepestChildren(node) {
  function flatten(node) {
    if (!node.children) return node

    let deepestChildren = []
    node.children.forEach((child) => {
      const flattenedChild = flatten(child)
      if (flattenedChild.children) {
        deepestChildren = deepestChildren.concat(flattenedChild.children)
        delete flattenedChild.children
      } else {
        deepestChildren.push(flattenedChild)
      }
    })

    if (deepestChildren.length > 0) {
      node.children = deepestChildren.map((child) => ({
        ...child,
        show: true // 添加 show 属性为 true
      }))
    }

    return node
  }

  return flatten(node)
}
const flattenedTreeData = computed(() =>
  tableData.value.map((rootNode) => flattenDeepestChildren({ ...rootNode }))
)
// let duple = false
const originInputName = ref('')
const originInputOriginName = ref('')
const inputFocus = (val, row) => {
  originInputName.value = val
  originInputOriginName.value = row.originName
}
const inputValueChange = (val, row) => {
  let exitArray = [] //暂存值相同的行数据

  flattenedTreeData.value.forEach((item) => {
    const sameArray = item.children.filter((i) => i.name === val)
    if (sameArray?.length) {
      exitArray = exitArray.concat(sameArray)
    }
  })
  const isRepeat = exitArray.filter((item) => item.originName !== originInputOriginName.value) //值相同的行数据通过originName唯一标识过滤
  if (isRepeat?.length) {
    ElMessage.warning('存在相同名称')
    row.name = originInputName.value
  } else if (!val) {
    ElMessage.warning('字段原名不能为空')
    row.name = originInputName.value
  } else {
    //更改值
    emit('inputNameChange', originInputName.value, val, row)
  }
}
//字段描述
const inputDescriptionChange = (val, row) => {
  emit('inputDescChange', originInputName.value, val, row)
}

const actions = [
  {
    label: '复制',
    handler: (btn, row) => {
      emit('handlerExpandCopy', row)
    }
  },
  {
    label: '删除',
    handler: (btn, row) => {
      emit('handlerExpandDelete', row, 'delete')
    }
  }
]
const setRefMap = (el, item) => {
  if (el) {
    subItemRef.value[`${item}`] = el
  }
}
const handlerSelect = (selection, row) => {
  if (row.name === '维度') {
    subItemRef.value.维度.toggleAllSelection() //维度全选框
  } else {
    subItemRef.value.度量.toggleAllSelection() //度量全选框
  }
}
const handlerSubSelect = (selection, row, propsData) => {
  if (selection.length === propsData.children.length) {
    //选中的数量和子表格数量相等
    mainTableSelf.value.toggleRowSelection(propsData, true)
  } else {
    mainTableSelf.value.toggleRowSelection(propsData, false)
  }
}
const cellStyle = () => {
  return {
    alignItems: 'flex-start'
  }
}
</script>
<style lang="scss">
.table-container {
  width: 100%;
  overflow-x: auto;
  .table-title {
    ul {
      display: flex;
      justify-content: space-between;
      list-style: none;
      li {
        @include plain-text;
        display: flex;
        flex: 1;
        min-width: size(200);
        color: #606266;
      }
    }
  }
  .el-input__wrapper {
    max-width: size(200);
  }
}
.el-table__row {
  .gx-actions {
    justify-content: flex-start;
  }
}
</style>
