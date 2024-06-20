<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="props.pageSizes"
      background
      layout="total, prev, pager, sizes, jumper"
      :total="props.total"
      @size-change="$emit('sizeChange', $event)"
      @current-change="$emit('currentChange', $event)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  pageSizes: {
    type: Array,
    default: () => [5, 10, 15, 20]
  }
})
const emit = defineEmits(['update:currentPage', 'update:pageSize', 'sizeChange', 'currentChange'])
const currentPage = computed({
  get: () => {
    return props.currentPage
  },
  set: (val) => {
    emit('update:currentPage', val)
  }
})
const pageSize = computed({
  get: () => {
    return props.pageSize
  },
  set: (val) => {
    emit('update:pageSize', val)
  }
})
</script>

<style lang="scss">
.el-popper {
  .el-select-dropdown {
    border: size(1) solid $input-border-color;
    background-color: $input-fill-color;
    .el-scrollbar {
      .el-select-dropdown__wrap {
        .el-select-dropdown__list {
          .el-select-dropdown__item {
            background: transparent !important;
          }
          .hover,
          .selected {
            background-color: $input-border-color !important;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@use '../style/index' as *;

.pagination {
  $pager_size: size(24);
  $text_color: rgba(255, 255, 255, 0.65);
  display: flex;
  justify-content: right;
  :deep(.el-pagination) {
    --el-text-color-regular: #{$text_color};
    --el-pagination-button-color: #{$text_color};
    --el-pagination-bg-color: #{$theme-text-color};
    --el-pagination-button-bg-color: #f5f7fa;
    --el-disabled-bg-color: #{$input-fill-color};
    --el-color-primary: #{$main-button-color};
    .btn-prev {
      color: #606266;
      width: $pager_size;
      height: $pager_size;
      border: size(1) solid #{$input-border-color};
      border-radius: size(4);
      min-width: $pager_size;
    }
    .el-pager {
      li {
        min-width: $pager_size;
        height: $pager_size;
        border-radius: size(4);
        border: size(1) solid #{$input-border-color};
        color: #606266;
        &.is-active {
          border: none;
          font-weight: normal;
        }
      }
    }
    .el-pagination__sizes {
      height: $pager_size;
      border: size(1) solid #{$input-border-color};
      border-radius: size(4);
      margin-left: size(16);
      .el-input__wrapper {
        height: size(26);
        &:hover {
          --el-select-border-color-hover: #{$input-border-color};
        }
      }
    }
    .el-pagination__jump {
      color: #606266;
      &.is-last {
        .el-input__wrapper {
          box-shadow: size(0) size(0);
        }
      }
      .el-pagination__editor {
        height: $pager_size;
        border: size(1) solid #{$input-border-color};
        border-radius: size(4);
      }
    }
    .el-input {
      --el-input-bg-color: #{$input-fill-color};
      --el-input-border-color: #{$input-border-color};
      --el-input-text-color: #606266;
    }
  }
}
</style>
