<template>
  <div class="gx-dropdown-menu-title">
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String
  }
})
</script>

<style lang="scss">
.gx-dropdown-menu-title {
  flex: 1;
  padding: 0 10px;
  border-radius: 4px;

  &:hover {
    background-color: #f4f4f4;
  }
}
</style>
