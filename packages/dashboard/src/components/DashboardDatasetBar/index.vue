<template>
  <b-i-side-bar class="bi-dashboard-dataset-bar" title="数据" v-model="barInstance.opened">
    <template #header-append>
      <div class="bi-dashboard-dataset-bar__header">
        <div class="bi-dashboard-dataset-bar__switcher">
          <div class="bi-dashboard-dataset-bar__switcher-placeholder">
            <div
              class="bi-dashboard-dataset-bar__switcher-wrapper"
              :class="{
                'bi-dashboard-dataset-bar__switcher-wrapper--expanding': switcherExpanding
              }"
              v-click-outside="
                () => {
                  switcherExpanding = false
                }
              "
            >
              <div
                class="bi-dashboard-dataset-bar__switcher-title"
                @click="switcherExpanding = !switcherExpanding"
              >
                <span>{{ currentDataset ? currentDataset.name : '请选择' }}</span>
                <gx-icon icon-class="icon-caret-bottom" size="small"></gx-icon>
              </div>
              <b-i-dashboard-dataset-switcher
                v-show="switcherExpanding"
                class="bi-dashboard-dataset-bar__switcher-content"
                :selected-id="initDatasetId"
                @dataset-selected="handleDatasetSelected"
                @click-dataset="switcherExpanding = false"
              ></b-i-dashboard-dataset-switcher>
            </div>
          </div>
          <gx-icon-group v-show="currentDataset" :icons="switcherOperations"></gx-icon-group>
        </div>
        <div class="bi-dashboard-dataset-bar__previewer"></div>
        <div class="bi-dashboard-dataset-bar__tool-bar">
          <div class="bi-dashboard-dataset-bar__tool-bar__info">
            <span>字段</span>
            <gx-icon
              icon-class="icon-tishi"
              tooltip="同时选择：Cmd/Ctrl+"
              icon-size="small"
            ></gx-icon>
          </div>
          <gx-icon-group
            class="bi-dashboard-bar__tool-bar__operations"
            :icons="toolBarOperations"
            icon-size="small"
          ></gx-icon-group>
        </div>
      </div>
    </template>
    <template #content>
      <div
        class="bi-dashboard-dataset-bar__content"
        v-loading="loadingField"
        element-loading-text="加载数据中..."
      >
        <div class="bi-dashboard-dataset-bar__content-dimension">
          <div class="bi-dashboard-dataset-bar__content-title">
            <span>维度</span>
          </div>
          <dimension-tree></dimension-tree>
        </div>
        <div class="bi-dashboard-dataset-bar__content-measurement">
          <div class="bi-dashboard-dataset-bar__content-title">
            <span>度量</span>
            <measurement-tree></measurement-tree>
          </div>
        </div>
      </div>
    </template>
  </b-i-side-bar>
</template>

<script setup lang="ts">
import { ref, h, watch, type Ref, computed } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'

import { type GxIconGroupItem, GxIconGroup, GxIcon } from '@gxhs/ui'

import { FieldNodeType, FieldClass } from '../../types/dataset'
import type { Dataset, Field, FieldTree } from '../../types/dataset'
import type { IDType } from '../../types/common'
import {
  debounce,
  getFieldIconByNodeType,
  genComponentName,
  filterFieldsByFieldClass
} from '../../utils'
import { DATASET_CONFIG_KEY } from '../../constants/app/dashboard'

import BISideBar from '../SideBar'
import { BIFileTree, BIFieldLabel, BIFieldTreeNodeTooltip } from '../DashboardDatasetComponents'
import { DashboardApi } from '../DashboardInterface'
import { useBar } from '../composables'

import BIDashboardDatasetSwitcher from './DashboardDatasetSwitcher'
import { DashboardDatasetBar } from './dashboard-dataset-bar'

defineOptions({
  name: genComponentName('DashboardDatasetBar')
})

/**
 * bar instance
 */
const { barInstance } = useBar(DashboardDatasetBar, 'DashboardDatasetBar')
watch(
  () => barInstance.data[DATASET_CONFIG_KEY],
  (datasetConfig) => {
    if (datasetConfig) {
      initDataset(datasetConfig)
    } else {
      if (initDatasetId.value) {
        Object.assign(barInstance.data, { [DATASET_CONFIG_KEY]: getDatasetConfig() })
      }
    }
  }
)
defineExpose({
  instance: barInstance
})

/**
 * dataset
 */
// [dataset] switcher
const switcherExpanding = ref(false)
const switcherOperations: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-more-horizontal',
    children: [
      {
        iconClass: '',
        title: '预览数据'
      },
      {
        iconClass: '',
        title: '前往编辑数据集组合'
      }
    ]
  }
]
// [dataset] init switcher
const initDatasetId = ref<IDType>()
const initDataset = (datasetConfig: { datasetId?: IDType }) => {
  const { datasetId } = datasetConfig

  if (datasetId !== undefined) {
    initDatasetId.value = datasetId
  }
}
const getDatasetConfig = () => {
  const datasetConfig: {
    datasetId?: IDType
  } = {}

  if (initDatasetId.value) {
    datasetConfig.datasetId = initDatasetId.value
  }

  return datasetConfig
}

const currentDataset = ref<Dataset>()
const handleDatasetSelected = (dataset: Dataset) => {
  if (initDatasetId.value !== dataset.id && barInstance.data.fields) {
    const fieldsKey = Object.keys(barInstance.data.fields)
    fieldsKey.forEach((key) => {
      barInstance.data.fields[key] = []
    })
  }

  currentDataset.value = dataset
  initDatasetId.value = dataset.id

  loadFieldData(dataset.id)

  const datasetIdConfig = { datasetId: dataset.id }
  if (!barInstance.data[DATASET_CONFIG_KEY]) {
    barInstance.data[DATASET_CONFIG_KEY] = datasetIdConfig
  } else {
    Object.assign(barInstance.data[DATASET_CONFIG_KEY], datasetIdConfig)
  }
}

// [dataset] toolbar
const toolBarOperations: Array<GxIconGroupItem> = [
  {
    iconClass: 'icon-search'
  },
  {
    iconClass: 'icon-refresh-right',
    onClick: () => {
      loadingField.value = true

      setTimeout(() => {
        if (currentDataset.value) {
          loadFieldData(currentDataset.value.id)
        }
      }, 500)
    }
  },
  {
    iconClass: 'icon-plus',
    children: [
      {
        iconClass: '',
        title: '新建计算字段'
      },
      {
        iconClass: '',
        title: '新建分组维度'
      },
      {
        iconClass: '',
        title: '新建维度组'
      },
      {
        iconClass: '',
        title: '新建占位符'
      }
    ]
  },
  {
    iconClass: 'icon-caret-bottom',
    children: [
      {
        iconClass: '',
        title: '占位符管理'
      }
    ]
  }
]

/**
 * field
 */
// [field] field-tree
const convertedData = ref<FieldTree>([])
const dimensionData = ref<FieldTree>([])
const measurementData = ref<FieldTree>([])

const filterFieldTreeByFieldClass = filterFieldsByFieldClass as unknown as (
  fieldTree: FieldTree,
  fieldClass: FieldClass
) => FieldTree
const loadingField = ref(false)
const loadFieldData: (datasetId: IDType) => void = debounce(async (datasetId) => {
  const fields = await DashboardApi.loadField({ datasetId })

  if (fields) {
    convertedData.value = []
    dimensionData.value = filterFieldTreeByFieldClass(fields, FieldClass.DIMENSION)
    measurementData.value = filterFieldTreeByFieldClass(fields, FieldClass.MEASUREMENT)
  }

  loadingField.value = false
})
const convertFieldData = (field: Field) => {
  const convertedIndex = convertedData.value.filter((data) => data.id === field.id).length
  const fieldName = `${field.name}_副本${convertedIndex ? `${convertedIndex}` : ''}`

  convertedData.value.unshift(
    Object.assign({}, field, {
      pid: -1,
      name: fieldName,
      class: field.class === FieldClass.DIMENSION ? FieldClass.MEASUREMENT : FieldClass.DIMENSION,
      settings: Object.assign({}, field.settings, {
        displayName: fieldName
      })
    })
  )
}

const matchNodeIcon = (nodeData: Field) => getFieldIconByNodeType(nodeData)
const judgeNodeDragable = (nodeData: Field): 'true' | 'false' => {
  if (nodeData.nodeType === FieldNodeType.FIELD) {
    return 'true'
  }
  return 'false'
}
const dragStartHook = (event: DragEvent, nodeData: Field) => {
  event.dataTransfer?.setData('text/html', JSON.stringify(nodeData))
}
const matchNodeOperations = (nodeData: Field): Array<GxIconGroupItem> => {
  if (nodeData.nodeType === FieldNodeType.FIELD) {
    const convertedIndex = convertedData.value.findIndex(
      (field) => field.id === nodeData.id && field.class === nodeData.class
    )

    return [
      {
        iconClass: 'icon-caret-bottom',
        children:
          convertedIndex === -1
            ? [
                {
                  iconClass: 'icon-Down',
                  title: `复制转${nodeData.class === FieldClass.DIMENSION ? '度量' : '维度'}`,
                  onClick: () => convertFieldData(nodeData)
                }
              ]
            : [
                {
                  iconClass: 'icon-delete',
                  title: '删除',
                  onClick: () => {
                    convertedData.value.splice(convertedIndex, 1)
                  }
                }
              ]
      }
    ]
  }
  return []
}
const labelTooltipStatus = ref<Record<string, any>>({})
const fileTreeFactory = (treeData: Ref<FieldTree>) => () =>
  h(
    BIFileTree,
    {
      data: treeData.value,
      judgeNodeDragable,
      dragStartHook,
      onDragNodeStart() {
        Object.assign(labelTooltipStatus.value, {
          disabled: true
        })
      },
      onDragNodeEnd() {
        Object.assign(labelTooltipStatus.value, { disabled: false, visable: true })
      }
    },
    {
      default: (node: { data: Field }) =>
        h(
          BIFieldLabel,
          {
            icon: matchNodeIcon(node.data),
            title: node.data?.name,
            operations: matchNodeOperations(node.data),
            tooltipAttributes: Object.assign(
              {
                disabled: false,
                placement: 'left'
              },
              labelTooltipStatus.value
            )
          },
          {
            'tooltip-content': () => h(BIFieldTreeNodeTooltip, { field: node.data })
          }
        )
    }
  )
const dimensionDataComputed = computed(() =>
  filterFieldTreeByFieldClass(convertedData.value, FieldClass.DIMENSION).concat(dimensionData.value)
)
const measurementDataComputed = computed(() =>
  filterFieldTreeByFieldClass(convertedData.value, FieldClass.MEASUREMENT).concat(
    measurementData.value
  )
)
const DimensionTree = fileTreeFactory(dimensionDataComputed)
const MeasurementTree = fileTreeFactory(measurementDataComputed)
</script>

<style lang="scss">
.bi-dashboard-dataset-bar {
  --bi-side-bar-width: 180px;

  &__header {
    font-size: 12px;
  }

  &__switcher {
    display: flex;
    gap: 4px;
    min-height: 24px;
    margin-bottom: 8px;
    user-select: none;

    &-placeholder {
      flex: 1;
      position: relative;
    }

    &-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      border-radius: 2px;
      background-color: #fff;
      z-index: 999;
      overflow: hidden;

      &--expanding {
        width: 320px;
        height: 480px;
        box-shadow:
          0 3px 6px -4px rgba(0, 0, 0, 0.12),
          0 6px 16px rgba(0, 0, 0, 0.078),
          0 9px 28px 8px rgba(0, 0, 0, 0.051);

        .bi-dashboard-dataset-bar__switcher-title {
          .gx-icon {
            transform: rotate(180deg);
          }
        }
      }
    }

    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 24px;
      padding: 0 2px 0 10px;
      background-color: var(--el-color-primary);
      color: #fff;

      span {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .gx-icon {
        --gx-icon-text-color: #fff;
        transition: all 0.3s;
      }
    }

    &-content {
      flex: 1;
    }
  }

  &__tool-bar {
    display: flex;
    justify-content: space-between;

    .gx-icon-group {
      --gx-icon-group-gap: 0;
    }
  }

  &__content {
    height: 100%;
    font-size: 12px;

    &-title {
      padding-bottom: 4px;
    }

    &-dimension,
    &-measurement {
      display: flex;
      flex-direction: column;
      padding: 8px 12px 6px;
      overflow: hidden;
    }

    .bi-file-tree {
      flex: 1;
      min-height: 0;

      .bi-field-label {
        .gx-icon-group {
          opacity: 0;
        }
      }

      &__node--hovering {
        .bi-field-label {
          .gx-icon-group {
            opacity: 1;
          }
        }
      }
    }

    &-dimension {
      height: 50%;
    }

    &-measurement {
      border-top: 1px solid var(--bi-color-border-divider, rgba(0, 0, 0, 0.1));

      .bi-file-tree {
        --bi-file-tree-check-indicator-color: #26bf59;
        .bi-field-label {
          --bi-field-label-icon-color: #26bf59;
        }
      }
    }
  }
}
</style>
