<template>
  <el-form ref="formSelf" :model="form">
    <el-table ref="tableSelf" :data="form.datas">
      <el-table-column
        :label="item.label"
        v-for="(item, index) in props.tableColumns"
        :key="index"
        :width="item.width"
      >
        <template #default="scoped">
          <el-form-item :prop="`datas[${scoped.$index}][${item.prop}]`" :rules="item.rules">
            <!-- <el-form-item :prop="`datas[${scoped.$index}][${item.prop}]`" :rules="rules[item.prop]"> -->
            <template v-if="item.type === 'input'">
              <el-input
                type="text"
                :placeholder="'请输入' + item.label"
                v-model="scoped.row[item.prop]"
              ></el-input>
            </template>
            <template v-else-if="item.prop === 'option' && queryId">
              <el-input
                type="text"
                :placeholder="'请输入' + item.label"
                v-model="scoped.row[item.prop]"
              ></el-input>
            </template>
            <template v-else-if="item.type === 'select'">
              <el-select v-model="scoped.row[item.prop]" style="width: 240px">
                <template #prefix>
                  <i
                    :class="['iconfont', `${ICONMAP[scoped.row[item.prop]]}`]"
                    :style="getIconForColor(scoped.row)"
                  ></i>
                </template>
                <el-option
                  :label="op.label"
                  :value="op.value"
                  v-for="(op, ind) in item.options"
                  :key="ind"
                >
                  <template #default>
                    <div>
                      <i
                        :class="['iconfont', `${ICONMAP[op.value]}`]"
                        :style="getIconForColor(op)"
                      ></i>
                      <span>{{ op.label }}</span>
                    </div>
                  </template>
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.type === 'operate'">
              <i
                :class="item.icon[0].iconfont"
                @click="() => item.icon[0].handleClick(scoped.row, scoped.column, scoped.$index)"
              ></i>
            </template>
            <template v-else>
              <div>
                {{ scoped.row[item.prop] }}
              </div>
            </template>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>
<script setup>
import { ICONMAP } from '../useInfoBlock'
import { getIconForColor } from '../../DataSet/useInfoBlock'
import { ref, defineProps, defineExpose, watchEffect, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
const query = useRoute().query
const queryId = query.id ? Number(query.id) : ''
const props = defineProps({
  tableData: {
    type: Array
  },
  tableColumns: {
    type: Array
  }
})
const form = reactive({
  datas: []
})
watchEffect(() => {
  form.datas = props.tableData
})
watch(
  () => form.value,
  (n) => {
    form.value = n
  },
  {
    deep: true
  }
)

const formSelf = ref(null)
const submit = async (fields) => {
  let valid
  if (fields?.length) {
    valid = await formSelf.value.validateField(fields, () => {})
  } else {
    valid = await formSelf.value.validate(() => {})
  }
  return {
    valid
  }
}
const clearValidate = () => {
  formSelf.value.clearValidate(() => {})
}
defineExpose({
  form,
  submit,
  clearValidate
})
</script>
<style lang="scss" scoped></style>
