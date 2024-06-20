<template>
  <InfoBlock
    :sql-name="sqlName"
    :tableTabActions="tableTabActions"
    v-model:contentType="contentType"
    :itemTitle="itemTitle"
    :showItems="showItems"
    :actions="actions"
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
  updateContentType,
  filterParams,
  previewTableDatas
} = useInfoBlock()
</script>
<style lang="scss" scoped></style>
