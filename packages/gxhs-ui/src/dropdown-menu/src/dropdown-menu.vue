<template>
  <el-dropdown
    ref="dropdownSelf"
    class="gx-dropdown-menu"
    trigger="click"
    popper-class="gx-dropdown-menu__popper"
  >
    <slot></slot>
    <template #dropdown>
      <dropdown></dropdown>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { h, ref, useSlots } from 'vue'
import { ElDropdown, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'

import type { GxDropdownMenuProps, GxDropdownMenuItem } from './dropdown-menu'
import GxDropdownMenuTitle from './dropdown-menu-title.vue'

const props = withDefaults(defineProps<GxDropdownMenuProps>(), {
  menus: () => [
    {
      label: '1asdasdasd',
      children: [
        {
          label: '1-1'
        },
        {
          label: '1-1adas',

          children: [
            {
              label: '2-1'
            }
          ]
        }
      ]
    },
    {
      label: '2',
      children: [
        {
          label: '2-1'
        }
      ]
    }
  ]
})
const slots = useSlots()

const menusHelper = (menus: Array<GxDropdownMenuItem>, parIndex?: string) => {
  return menus.map((menu, index) => {
    const uniKey = `${parIndex ? parIndex : ''}-${index}`
    const title = () =>
      slots.title ? slots.title(menu) : h(GxDropdownMenuTitle, { label: menu.label })

    if (menu.children?.length) {
      return h(
        ElSubMenu,
        { index: uniKey },
        {
          default: () => menusHelper(menu.children as Array<GxDropdownMenuItem>, uniKey),
          title
        }
      )
    }

    return h(ElMenuItem, { index: uniKey }, title)
  })
}
const Dropdown = () =>
  h(
    ElMenu,
    { collapse: true, popperClass: 'gx-dropdown-menu__menu-popper' },
    menusHelper(props.menus)
  )

const dropdownSelf = ref<InstanceType<typeof ElDropdown> | null>(null)
defineExpose({
  ref: () => dropdownSelf.value
})
</script>

<style lang="scss">
.gx-dropdown-menu {
  font-size: inherit;
  color: inherit;
  line-height: normal;

  &__menu-popper {
    .el-menu {
      &--popup {
        min-width: 0;
      }
    }
  }

  &__popper {
    .el-menu {
      padding: 5px 0;
      min-width: 200px;

      &--collapse {
        width: auto;
      }
    }

    .el-menu--collapse > .el-menu-item .el-sub-menu__icon-arrow,
    .el-menu--collapse
      > .el-menu-item-group
      > ul
      > .el-sub-menu
      > .el-sub-menu__title
      .el-sub-menu__icon-arrow,
    .el-menu--collapse > .el-sub-menu > .el-sub-menu__title .el-sub-menu__icon-arrow {
      display: block;
    }

    .el-menu--collapse > .el-menu-item [class^='el-icon'],
    .el-menu--collapse
      > .el-menu-item-group
      > ul
      > .el-sub-menu
      > .el-sub-menu__title
      [class^='el-icon'],
    .el-menu--collapse > .el-sub-menu > .el-sub-menu__title [class^='el-icon'] {
      width: inherit;
      margin-top: -6px;
      margin-right: 0;
    }
  }
}
</style>
