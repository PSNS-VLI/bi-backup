<template>
  <el-menu :default-active="active" class="el-menu-vertical-demo" @select="handlerSelect">
    <el-sub-menu index="FileSource">
      <template #title>
        <span>本地文件</span>
      </template>
      <el-menu-item index="FileSource">
        <span class="iconfont icon-a-Uploadfiles"></span>
        <span>文件上传</span>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="SqlSource">
      <template #title>
        <span>数据库</span>
      </template>
      <el-menu-item index="SqlSource">
        <span class="iconfont icon-Mysql"></span>
        <span>MySQL</span>
      </el-menu-item>
      <el-menu-item index="DaMengSource">
        <span class="iconfont icon-sqlserveryunshujukuSQLServerban"></span>
        <span>达梦数据库</span>
      </el-menu-item>
    </el-sub-menu>
    <!-- <el-sub-menu index="ApiSource">
      <template #title>
        <span>API数据</span>
      </template>
      <el-menu-item index="ApiSource">
        <span class="iconfont icon-API"></span>
        <span>API数据</span>
      </el-menu-item>
    </el-sub-menu> -->
  </el-menu>
</template>
<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  active: {
    type: String
  }
})
const emit = defineEmits(['handlerActive'])
const active = computed(() => props.active)
const handlerSelect = (active) => {
  console.log(active)
  emit('handlerActive', active)
}
</script>

<style lang="scss" scoped>
.el-menu {
  display: flex;
  flex-direction: column;
  flex: 1;
  .el-menu-item.is-active {
    background: #f5f7fa;
  }
}
.icon-a-Uploadfiles {
  color: $icon-uploadfiles-color;
}
.icon-Mysql {
  color: $icon-mysql-color;
}
.icon-sqlserveryunshujukuSQLServerban {
  color: $main-button-color;
}
.icon-API {
  color: $icon-api-color;
}
</style>
