<template>
  <InfoBlock
    :sql-name="sqlName"
    :tableTabActions="tableTabActions"
    v-model:contentType="contentType"
    :itemTitle="itemTitle"
    :showItems="showItems"
    :actions="actions"
    :data="dataSetDetail"
    :filterParams="filterParams"
    :previewTableDatas="previewTableDatas"
    @saveHandler="saveHandlerClick"
    @update:show-items="showItemClick"
    @update:sql-name="updateSqlName"
    @update:contentType="updateContentType"
  ></InfoBlock>
</template>
<script setup>
import InfoBlock from '@/views/DataStructure/DataSet/blocks/InfoBlock.vue'
import useInfoBlock from '@/views/DataStructure/DataSet/useInfoBlock'
import resolveQueryId from '@/utils/resolve-query'
const queryId = resolveQueryId().id ? Number(resolveQueryId().id) : ''
const {
  sqlName,
  actions,
  contentType,
  tableTabActions,
  itemTitle,
  showItems,
  saveHandlerClick,
  showItemClick,
  updateSqlName,
  dataSetDetail,
  updateContentType,
  filterParams,
  previewTableDatas
} = useInfoBlock(true, {
  id: queryId
})
</script>
<style lang="scss" scoped></style>
