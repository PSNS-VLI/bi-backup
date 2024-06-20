<template>
  <div
    class="bi-field"
    :class="{
      'bi-field--is-measurement': field.class === FieldClass.MEASUREMENT,
      'bi-field--is-dimension': field.class === FieldClass.DIMENSION
    }"
  >
    <gx-dropdown-menu
      ref="dropdownMenuSelf"
      trigger="contextmenu"
      :menus="fieldDropdownMenus"
      @visible-change="handleDropdownMenuVisibleChange"
    >
      <b-i-field-label
        class="bi-field__inner"
        :class="{
          'bi-field__inner--hovering': hovering
        }"
        :icon="getFieldIconByType(field)"
        :title="field.name"
        :operations="operations"
        :tooltip-attributes="{ disabled: false, effect: 'light', placement: 'left' }"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <template #tooltip-content>
          <div class="bi-field-info">
            <span class="bi-field-info__title">字段原名：</span>
            <span>{{ field.name }}</span>
            <span class="bi-field-info__title">显示名称：</span>
            <span>{{ field.settings.displayName }}</span>
            <!-- <span class="bi-field-info__title">数据集：</span>
          <span></span> -->
          </div>
        </template>
      </b-i-field-label>
      <template #title="{ label, onClick, active }">
        <div
          class="bi-field__menu"
          :class="{
            'bi-field__menu--active': !!active
          }"
          @click="
            () => {
              hanldeDropdownMenuTitleClick()
              onClick()
            }
          "
        >
          {{ label }}
        </div>
      </template>
    </gx-dropdown-menu>
    <!-- Dialog -->
    <el-dialog
      append-to-body
      v-model="dropdownMenuDialog.visible"
      :title="dropdownMenuDialog.title"
      width="500"
    >
      <el-form v-model="dropdownMenuDialog.formData">
        <template v-if="dropdownMenuDialog.formType === 'nullDisplay'">
          <el-form-item label="空值展示为">
            <el-input v-model="dropdownMenuDialog.formData"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="dropdownMenuDialog.formType === 'dataFormat'">
          <el-form-item>
            <el-radio-group v-model="dropdownMenuDialog.formData.formatType">
              <el-radio label="自动适配" :value="DataFormatType.AUTO"></el-radio>
              <el-radio label="数值" :value="DataFormatType.NUMBER"></el-radio>
              <el-radio label="百分比" :value="DataFormatType.PERCENT"></el-radio>
              <el-radio label="手动输入" :value="DataFormatType.CUSTOM"></el-radio>
            </el-radio-group>
            <template v-if="dropdownMenuDialog.formData.formatType === DataFormatType.AUTO">
              <el-form-item label="适配方式">
                <el-select v-model="dropdownMenuDialog.formData.adaptationMode">
                  <el-option label="自动适配（中文）" value="ZH"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template
              v-else-if="
                dropdownMenuDialog.formData.formatType === DataFormatType.NUMBER ||
                dropdownMenuDialog.formData.formatType === DataFormatType.PERCENT
              "
            >
              <el-form-item label="小数位数">
                <el-select v-model="dropdownMenuDialog.formData.decimalDigits">
                  <el-option label="无" :value="0"></el-option>
                  <el-option
                    v-for="index in 5"
                    :key="index"
                    :label="index"
                    :value="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-show="dropdownMenuDialog.formData.formatType === DataFormatType.NUMBER"
                label="数据量级"
              >
                <el-select v-model="dropdownMenuDialog.formData.dataMagnitude">
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
                <el-select v-model="dropdownMenuDialog.formData.negative">
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
            <template v-else-if="dropdownMenuDialog.formData.formatType === DataFormatType.CUSTOM">
              <el-form-item label="适配方式">
                <el-input
                  v-model="dropdownMenuDialog.formData.adaptationMode"
                  placeholder="例如 #,##0.00%"
                ></el-input>
              </el-form-item>
            </template>
          </el-form-item>
        </template>
        <template v-else-if="dropdownMenuDialog.formType === 'fieldContent'">
          <el-form-item label="字段原名">
            <el-input v-model="dropdownMenuDialog.formData.originName" disabled></el-input>
          </el-form-item>
          <el-form-item label="显示名称">
            <el-input
              v-model="dropdownMenuDialog.formData.displayName"
              placeholder="请输入字段别名"
            ></el-input>
          </el-form-item>
          <el-form-item label="字段描述">
            <el-input
              type="textarea"
              v-model="dropdownMenuDialog.formData.description"
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dropdownMenuDialog.onCancel">取消</el-button>
          <el-button type="primary" @click="dropdownMenuDialog.onConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

import { type GxIconGroupItem, type GxDropdownMenuItem, GxDropdownMenu } from '@gxhs/ui'

import BIFieldLabel from '../FieldLabel'

import { type Field, FieldClass } from '../../../types/dataset'
import {
  // general
  boolArray,
  // dataset
  getFieldIconByType,
  FieldDataFormatTypeMap,
  FieldSortTypeMap,
  FieldAggregationTypeMap,
  FieldNullDisplayTypeMap,
  setFieldDataFormat,
  setFieldSort,
  setFieldAggregation,
  setNullDisplay
} from '../../../utils'

const props = withDefaults(
  defineProps<{
    field: Field
  }>(),
  {}
)
const emit = defineEmits(['deleteField', 'update:field'])

/**
 * Dropdown menu
 */
// dropdown dialog
const enum DataFormatType {
  AUTO,
  NUMBER,
  PERCENT,
  CUSTOM
}
const dropdownMenuDialog = reactive<{
  visible: boolean
  title: string
  formType: 'dataFormat' | 'nullDisplay' | 'fieldContent'
  formData?: any
  onCancel: () => void
  onConfirm: () => void
}>({
  visible: false,
  title: '设置',
  formType: 'fieldContent',
  formData: {},
  onCancel() {
    dropdownMenuDialog.visible = false
  },
  onConfirm: () => {}
})
// computed menus
const getMenusByTypeMap = <T extends string | number | symbol>(
  typeMap: Record<T, string>,
  attach?: {
    handler?: (key: T) => Field
    isActive?: (key: T) => boolean
  }
): Array<GxDropdownMenuItem> => {
  const { handler, isActive } = attach || {}

  return Object.keys(typeMap).map((key) => {
    const menu = {
      label: typeMap[key as T]
    }

    typeof handler === 'function' &&
      Object.assign(menu, {
        onClick: () => {
          emit('update:field', handler(key as T))
        }
      })

    typeof isActive === 'function' &&
      Object.assign(menu, {
        active: isActive(key as T)
      })

    return menu
  })
}
const fieldDropdownMenus = computed(() => {
  const field = props.field
  const settings = field.settings

  const menus: Array<GxDropdownMenuItem> = boolArray([
    field.class === FieldClass.MEASUREMENT && {
      label: '数据展示格式',
      children: getMenusByTypeMap(FieldDataFormatTypeMap, {
        handler: (key) => setFieldDataFormat(field, key),
        isActive: (key) => settings?.dataFormat === key
      })
    },
    {
      label: '排序',
      children: getMenusByTypeMap(FieldSortTypeMap, {
        handler: (key) => setFieldSort(field, key),
        isActive: (key) => settings?.sort === key
      })
    },
    {
      label: '聚合方式',
      children: getMenusByTypeMap(FieldAggregationTypeMap, {
        handler: (key) => setFieldAggregation(field, key),
        isActive: (key) => settings?.aggregation === key
      })
    },
    {
      label: '空值展示样式',
      children: boolArray([
        {
          label: '空值',
          children: getMenusByTypeMap(FieldNullDisplayTypeMap, {
            handler: (key) => setNullDisplay(field, key, 'nullValue'),
            isActive: (key) => settings?.nullDisplay?.nullValue === key
          })
        },
        field.class === FieldClass.DIMENSION && {
          label: '空字符串',
          children: getMenusByTypeMap(FieldNullDisplayTypeMap, {
            handler: (key) => setNullDisplay(field, key, 'nullChar'),
            isActive: (key) => settings?.nullDisplay?.nullChar === key
          })
        }
      ])
    },
    {
      label: '字段显示内容',
      onClick: () => {
        dropdownMenuDialog.formType = 'fieldContent'
        dropdownMenuDialog.title = '字段显示内容'
        dropdownMenuDialog.formData = {
          originName: field.originName,
          displayName: field.settings.displayName,
          description: field.description
        }
        dropdownMenuDialog.visible = true
        dropdownMenuDialog.onConfirm = () => {
          dropdownMenuDialog.visible = false
          emit(
            'update:field',
            Object.assign(field, {
              settings: Object.assign({}, field.settings, {
                displayName: dropdownMenuDialog.formData.displayName
              }),
              description: dropdownMenuDialog.formData.description
            })
          )
        }
      }
    }
  ])

  return menus
})
// dropdown control
let dropdownDisplayStatus = false
const handleDropdownMenuVisibleChange = (status: boolean) => {
  dropdownDisplayStatus = status
}
const dropdownMenuSelf = ref<InstanceType<typeof GxDropdownMenu> | null>(null)
const hanldeDropdownMenuTitleClick = () => {
  const controller = dropdownMenuSelf.value?.ref()
  controller && controller.handleClose()
}

/**
 * field label config
 */
const hovering = ref(false)
const operations: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-caret-bottom',
    tooltip: '更多',
    onClick() {
      const controller = dropdownMenuSelf.value?.ref()

      if (controller) {
        if (dropdownDisplayStatus) controller.handleClose()
        else {
          controller.handleOpen()
        }
      }
    }
  },
  {
    iconClass: 'icon-delete',
    tooltip: '删除',
    onClick() {
      emit('deleteField')
    }
  }
]
</script>

<style lang="scss">
.bi-field {
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;

  .gx-dropdown-menu {
    width: 100%;
  }

  .bi-field-label {
    flex: 1;
  }

  &__menu {
    flex: 1;
    padding: 0 10px;
    border-radius: 4px;
    font-size: 13px;

    &:hover {
      background-color: #f4f4f4;
    }

    &--active {
      background-color: rgba(46, 116, 255, 0.1);
    }
  }

  &--is-measurement {
    border-color: #26bf59;
    background-color: rgba(#26bf59, 0.15);

    .bi-field-label {
      --bi-field-label-icon-color: #26bf59;
    }
  }

  &--is-dimension {
    border-color: var(--el-color-primary);
    background-color: rgba(#2468f2, 0.15);
  }

  &__inner {
    .gx-icon-group {
      opacity: 0;
    }

    &--hovering {
      .gx-icon-group {
        opacity: 1;
      }
    }
  }

  &-info {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    padding: 10px 12px;
    white-space: pre-wrap;
    word-break: break-all;

    &__title {
      opacity: 0.7;
      text-align: right;
    }
  }
}
</style>
