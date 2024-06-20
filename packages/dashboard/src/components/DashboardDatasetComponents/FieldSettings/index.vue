<template>
  <div class="bi-field-settings">
    <el-form v-model="formData">
      <template v-if="formType === 'nullDisplay'">
        <el-form-item label="空值展示为">
          <el-input v-model="formData.nullDisplay"></el-input>
        </el-form-item>
      </template>
      <template v-else-if="formType === 'dataFormat'">
        <el-form-item>
          <el-radio-group v-model="formData.formatType">
            <el-radio label="自动适配" :value="DataFormatType.AUTO"></el-radio>
            <el-radio label="数值" :value="DataFormatType.NUMBER"></el-radio>
            <el-radio label="百分比" :value="DataFormatType.PERCENT"></el-radio>
            <el-radio label="手动输入" :value="DataFormatType.CUSTOM"></el-radio>
          </el-radio-group>
          <template v-if="formData.formatType === DataFormatType.AUTO">
            <el-form-item label="适配方式">
              <el-select v-model="formData.adaptationMode">
                <el-option label="自动适配（中文）" value="ZH"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template
            v-else-if="
              formData.formatType === DataFormatType.NUMBER ||
              formData.formatType === DataFormatType.PERCENT
            "
          >
            <el-form-item label="小数位数">
              <el-select v-model="formData.decimalDigits">
                <el-option label="无" :value="0"></el-option>
                <el-option
                  v-for="index in 5"
                  :key="index"
                  :label="index"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="formData.formatType === DataFormatType.NUMBER" label="数据量级">
              <el-select v-model="formData.dataMagnitude">
                <el-option label="无" value=""></el-option>
                <el-option
                  v-for="option in [
                    ['无', ''],
                    ['千', ''],
                    ['万', ''],
                    ['百万', ''],
                    ['千万', ''],
                    ['亿', ''],
                    ['K', ''],
                    ['M', ''],
                    ['k', ''],
                    ['mn', ''],
                    ['bn', '']
                  ]"
                  :key="option"
                  :label="option[0]"
                  :value="option[0]"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负数">
              <el-select v-model="formData.negative">
                <el-option
                  v-for="option in [
                    ['-1234', ''],
                    ['(1234)', '']
                  ]"
                  :key="option"
                  :label="option[0]"
                  :value="option[0]"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else-if="formData.formatType === DataFormatType.CUSTOM">
            <el-form-item label="适配方式">
              <el-input v-model="formData.adaptationMode" placeholder="例如 #,##0.00%"></el-input>
            </el-form-item>
          </template>
        </el-form-item>
      </template>
      <template v-else-if="formType === 'fieldContent'">
        <el-form-item label="字段原名">
          <el-input v-model="formData.originName" disabled></el-input>
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input v-model="formData.displayName" placeholder="请输入字段别名"></el-input>
        </el-form-item>
        <el-form-item label="字段描述">
          <el-input
            type="textarea"
            v-model="formData.description"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

const enum DataFormatType {
  AUTO,
  NUMBER,
  PERCENT,
  CUSTOM
}
type FieldSettignsFormType = 'nullDisplay' | 'dataFormat' | 'fieldContent'
const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    required: true
  },
  formType: {
    type: String as PropType<FieldSettignsFormType>,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style lang="scss"></style>
