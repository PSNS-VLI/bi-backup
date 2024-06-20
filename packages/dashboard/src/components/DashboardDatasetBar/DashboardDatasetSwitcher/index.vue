<template>
  <div class="bi-dashboard-dataset-switcher">
    <el-tabs class="bi-dashboard-dataset-switcher__body" v-model="activeName">
      <el-tab-pane
        class="bi-dashboard-dataset-switcher__content"
        :label="SwitcherTabName[SwitcherTab.USED]"
        :name="SwitcherTab.USED"
      >
        <used-file-tree></used-file-tree>
      </el-tab-pane>
      <el-tab-pane
        class="bi-dashboard-dataset-switcher__content"
        :label="SwitcherTabName[SwitcherTab.ALL]"
        :name="SwitcherTab.ALL"
      >
        <div class="bi-dashboard-dataset-switcher__content-header">
          <el-input v-model="datasetSearch" placeholder="输入关键字搜索">
            <template #prefix>
              <gx-icon icon-class="icon-search"></gx-icon>
            </template>
          </el-input>
          <gx-icon icon-class="icon-refresh-right" @click="handleClickRefresh"></gx-icon>
        </div>
        <all-file-tree
          v-loading="datasetLoading"
          element-loading-text="加载数据中..."
        ></all-file-tree>
      </el-tab-pane>
    </el-tabs>
    <div class="bi-dashboard-dataset-switcher__footer">
      <el-button type="primary" size="small">上传本地文件</el-button>
      <el-button size="small">新建数据集</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, defineComponent, computed, watch, type PropType, type Ref } from 'vue'

import { GxIcon } from '@gxhs/ui'

import type { DatasetTree, Dataset } from '../../../types/dataset'
import type { IDType } from '../../../types/common'
import { DatasetNodeType } from '../../../types/dataset'
import { debounce, depthFirstSearch, getDatasetIconByNodeType } from '../../../utils'

import { DashboardApi } from '../../DashboardInterface'
import { BIFileTree } from '../../DashboardDatasetComponents'

const props = defineProps<{
  selectedId?: IDType
}>()
const emit = defineEmits(['datasetSelected', 'clickDataset'])

/**
 * switcher tab
 */
const enum SwitcherTab {
  USED,
  ALL
}
const SwitcherTabName: Record<SwitcherTab, string> = {
  [SwitcherTab.USED]: '已使用',
  [SwitcherTab.ALL]: '全部'
}
const activeName = ref(SwitcherTab.USED)

/**
 * switcher content
 */
// [content] dataset used
const filterDatasetByIds = (datasetTree: DatasetTree, ids: Array<IDType>): Array<Dataset> => {
  const selected: Array<Dataset> = []

  depthFirstSearch(
    datasetTree,
    (dataset) => ({
      next: !!dataset.children?.length
    }),
    (dataset) => {
      if (ids.includes(dataset.id)) {
        selected.push(dataset)
      }
    }
  )

  return selected
}
const datasetSelectedIDsSet = ref<Set<IDType>>(new Set())
watch(
  () => props.selectedId,
  (id) => {
    if (id) {
      datasetSelectedIDsSet.value.clear()
      datasetSelectedIDsSet.value.add(id)
      const datasetSelected = filterDatasetByIds(datasetData.value, [id])
      if (datasetSelected.length) {
        emit('datasetSelected', datasetSelected[0])
      }
    }
  },
  {
    immediate: true
  }
)
const datasetSelectedIDs = computed<Array<IDType>>(() => {
  const selectedIDs: Array<IDType> = []

  for (const id of datasetSelectedIDsSet.value.values()) {
    selectedIDs.push(id)
  }

  return selectedIDs
})
const datasetSelected = computed<Array<Dataset>>(() => {
  return filterDatasetByIds(datasetData.value, datasetSelectedIDs.value)
})

// [content] all dataset
const datasetData = ref<DatasetTree>([])
let datasetDataCached: DatasetTree = []
const datasetLoading = ref<boolean>(false)
const loadDatasetData: (param?: { keywords?: string }) => void = debounce(async (param) => {
  datasetLoading.value = true
  const res = await DashboardApi.loadDataset(param ?? {})
  if (res) {
    datasetData.value = res
    datasetDataCached = res
  }
  datasetLoading.value = false
})
loadDatasetData()

const datasetSearch = ref('')
const filterDatasetByKeywords: (keywords: string) => void = debounce((keywords: string) => {
  const datasetCached = JSON.parse(JSON.stringify(datasetDataCached)) as DatasetTree
  const datasetFiltered: DatasetTree = []

  if (keywords) {
    depthFirstSearch(
      datasetCached,
      (dataset) => ({
        next: !!dataset.children?.length
      }),
      (dataset) => {
        if (dataset.nodeType === DatasetNodeType.DATASET && dataset.name.includes(keywords)) {
          datasetFiltered.push(dataset)
        }
      }
    )

    datasetData.value = datasetFiltered
  } else {
    datasetData.value = datasetCached
  }
})
watch(datasetSearch, (n) => {
  filterDatasetByKeywords(n)
})
const handleClickRefresh = () => {
  datasetSearch.value = ''

  datasetLoading.value = true

  setTimeout(() => {
    loadDatasetData()
  }, 500)
}

// [content] component
const DatasetLabel = defineComponent({
  props: {
    dataset: {
      type: Object as PropType<Dataset>,
      required: true
    },
    selected: {
      type: Boolean
    }
  },
  setup: (props) => () =>
    h(
      'div',
      {
        class: [
          'bi-dashboard-dataset-switcher__content-dataset-label',
          props.selected && 'bi-dashboard-dataset-switcher__content-dataset-label--selected'
        ],
        onClick: () => {
          const dataset = props.dataset
          const selectedIDs = datasetSelectedIDs.value

          if (dataset.nodeType === DatasetNodeType.DATASET) {
            if (datasetSelectedIDs.value.length > 0) {
              datasetSelectedIDsSet.value.clear()
            }

            if (!selectedIDs.includes(dataset.id)) {
              datasetSelectedIDsSet.value.add(dataset.id)
              emit('datasetSelected', dataset)
            }

            emit('clickDataset', dataset)
          }
        }
      },
      [
        h('div', [
          h(GxIcon, { iconClass: getDatasetIconByNodeType(props.dataset) }),
          h('span', props.dataset.name)
        ]),
        h(GxIcon, { iconClass: '' })
      ]
    )
})
const fileTreeFactory = (fileTreeData: Ref<DatasetTree>) => () =>
  h(
    BIFileTree,
    {
      class: 'bi-dashboard-dataset-switcher__content-tree',
      data: fileTreeData.value
    },
    {
      default: (treeNodeData: { data: Dataset }) =>
        h(DatasetLabel, {
          dataset: treeNodeData.data,
          selected: datasetSelectedIDs.value.includes(treeNodeData.data.id)
        })
    }
  )
// as Ref<DatasetTree> ignoreing the difference between DatasetTree and DatasetNode
const UsedFileTree = fileTreeFactory(datasetSelected as unknown as Ref<DatasetTree>)
const AllFileTree = fileTreeFactory(datasetData)
</script>

<style lang="scss">
.bi-dashboard-dataset-switcher {
  $switcher-gap: 12px;
  display: flex;
  flex-direction: column;
  min-height: 0;

  &__body {
    --el-tabs-header-height: 36px;

    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .el-tabs {
      &__nav-wrap {
        padding: 0 $switcher-gap;
      }

      &__content {
        flex: 1;
        min-height: 0;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 $switcher-gap;

    &-header {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;

      .el-input {
        --el-input-height: 14px;
      }
    }

    &-tree {
      flex: 1;
      min-height: 0;

      .el-tree {
        --el-tree-node-hover-bg-color: transparent;
      }
    }

    &-dataset-label {
      padding: 4px 0;

      &--selected {
        background-color: rgba(46, 116, 255, 0.1);
      }
      &:hover {
        background-color: rgba(46, 116, 255, 0.1);
      }
    }
  }

  &__footer {
    display: flex;
    padding: $switcher-gap;

    .el-button {
      flex: 1;
    }
  }
}
</style>
