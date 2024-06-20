<template>
  <el-scrollbar v-if="mode === 'vertical'">
    <Menu></Menu>
  </el-scrollbar>
  <Menu v-else></Menu>
</template>

<script setup lang="ts">
import { h, ref, computed, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ElMenu, ElSubMenu, ElMenuItem, ElScrollbar } from 'element-plus'
import 'element-plus/theme-chalk/el-menu.css'

import GxIcon from '../../GxIcon'

import { type GxMenuProps, type GxMenuItem, MenuMode } from './types'

const router = useRouter()
const props = withDefaults(defineProps<GxMenuProps>(), {
  menus: () => [],
  mode: MenuMode.Vertical,
  collapse: false
})

const collapse = computed(() => props.mode === MenuMode.Vertical && props.collapse)

const activeKey = computed(() => router.currentRoute.value.fullPath)
const getUniKey: (menu: GxMenuItem, parIndex: string | number, index: string | number) => string = (
  menu,
  parIndex,
  index
) => {
  parIndex = parIndex ? `${parIndex}-` : ''
  return menu.to || `${parIndex}${index}`
}
const getOpeneds: (menus: Array<GxMenuItem>) => Array<string> = (menus) => {
  const keys: Array<string> = []

  const recursionUnit = (menus: Array<GxMenuItem>, parIndex: string | number = '') => {
    menus.forEach((menu, index) => {
      if (menu.children?.length) {
        const uniKey = getUniKey(menu, parIndex, index)
        keys.push(uniKey)
        recursionUnit(menu.children, uniKey)
      }
    })
  }

  recursionUnit(menus)

  return keys
}
const menuItem = (
  menu: GxMenuItem,
  active: boolean = false,
  collapse: boolean = false,
  hasSub: boolean = false
) => {
  return h(
    'div',
    {
      class: ['gx-menu-title', !menu.icon && 'gx-menu-title--without-icon', active && 'is-active']
    },
    [
      menu.icon &&
        h(GxIcon, {
          class: ['gx-menu-title__icon'],
          iconClass: menu.icon as string
        }),
      !collapse &&
        h(
          RouterLink,
          { class: ['gx-menu-title__link'], to: hasSub ? {} : { path: menu.to } },
          () => menu.label
        ),
      !collapse &&
        hasSub &&
        h(GxIcon, {
          class: ['gx-menu-title__icon-arrow'],
          iconClass: 'icon-arrow-down'
        })
    ]
  )
}
const menuHelper = (
  menus: Array<GxMenuItem>,
  parIndex: string | number = '',
  collapse: boolean = false
) => {
  return menus.map((menu, index) => {
    const uniKey = getUniKey(menu, parIndex, index)
    const active = activeKey.value.includes(uniKey)
    if (menu.children && menu.children.length) {
      return h(
        ElSubMenu,
        {
          class: {
            active
          },
          index: uniKey
        },
        {
          default: () => menuHelper(menu.children as GxMenuItem[], uniKey),
          title: menuItem(menu, active, collapse, true)
        }
      )
    }
    return h(
      ElMenuItem,
      {
        class: {
          active
        },
        index: uniKey
      },
      () => menuItem(menu, active, collapse)
    )
  })
}
const elMenuSelf = ref<InstanceType<typeof ElMenu> | null>(null)
const openIndex = () => {
  getOpeneds(props.menus).forEach((key) => (elMenuSelf as any).value?.open(key))
}
watch(
  () => props.collapse,
  (o, n) => {
    o === false && n === true && openIndex()
  }
)
const Menu = () =>
  h(
    'div',
    {
      class: [
        'gx-menu',
        collapse.value && 'gx-menu--collapse',
        props.mode === MenuMode.Horizontal ? 'gx-menu--horizontal' : 'gx-menu--vertical'
      ]
    },
    [
      h(
        ElMenu,
        {
          ref: elMenuSelf,
          collapse: collapse.value,
          defaultOpeneds: props.mode === MenuMode.Vertical ? getOpeneds(props.menus) : [],
          mode: props.mode as never,
          popperClass: `gx-menu ${
            props.mode === MenuMode.Horizontal ? 'gx-menu--horizontal' : 'gx-menu--vertical'
          } gx-menu--popup-container`
        },
        () => menuHelper(props.menus, '', collapse.value)
      )
    ]
  )
</script>

<style lang="scss">
@use '../../style/index' as *;

a:link,
a:visited,
a:hover,
a:active {
  color: inherit;
  text-decoration: none;
}

.gx-menu {
  --gx-menu-width: #{size(220)};
  --gx-menu-bg-color: var(--el-color-primary-light-3);
  --gx-menu-hover-bg-color: var(--el-color-primary-light-5);
  --gx-menu-active-bg-color: var(--el-color-primary-light-7);
  --gx-menu-active-color: var(--el-color-primary);
  --gx-menu-item-height: #{size(40)};
  --gx-menu-horizontal-height: #{size(60)};
  --gx-menu-horizontal-sub-item-height: #{size(40)};
  --gx-menu-base-level-padding: #{size(8)};
  --gx-menu-title-gap: #{size(8)};
}

.gx-menu {
  width: var(--gx-menu-width);
  transition: width 0.3s;

  .el-menu {
    padding: size(4) 0;
    transition: width 0.3s;
  }

  &-title {
    flex: 1;
    display: flex;
    gap: size(8);
    line-height: normal;
    padding-left: var(--gx-menu-base-level-padding);

    &--without-icon {
      padding-left: calc(
        var(--gx-menu-base-level-padding) + (size(24) + var(--gx-menu-title-gap)) *
          var(--el-menu-level)
      );
    }

    .gx-icon {
      --gx-icon-text-color: inherit;
    }

    &__link {
      margin: auto;
      flex: 1;
    }

    &__icon-arrow {
      transition: transform 0.3s;
    }
  }

  .el-menu {
    --el-menu-item-height: var(--gx-menu-item-height);
    --el-menu-sub-item-height: var(--gx-menu-item-height);
    --el-menu-horizontal-height: var(--gx-menu-horizontal-height);
    --el-menu-horizontal-sub-item-height: var(--gx-menu-horizontal-sub-item-height);
    --el-menu-base-level-padding: 0;

    --el-menu-bg-color: var(--gx-menu-bg-color);
    --el-menu-hover-bg-color: var(--gx-menu-hover-bg-color);
    --el-menu-color: inherit;
    --el-menu-active-color: none;
    --el-menu-hover-color: none;

    .el-menu-item,
    .el-sub-menu__title {
      padding: var(--gx-menu-base-level-padding);
      margin: auto;
      border-radius: var(--el-border-radius-base);
      color: var(--el-menu-color);
    }
  }

  .el-sub-menu {
    .el-sub-menu__icon-arrow {
      display: none;
    }

    &.is-opened {
      .gx-menu-title__icon-arrow {
        transform: rotateZ(180deg);
      }
    }
  }

  .el-menu-item {
    &.active {
      background-color: var(--gx-menu-active-bg-color);
      color: var(--gx-menu-active-color);
    }
  }
}

.gx-menu--vertical {
  .el-menu {
    .el-menu-item,
    .el-sub-menu__title {
      max-width: calc(var(--gx-menu-width) - var(--gx-menu-base-level-padding) * 2);
    }
  }
}

.gx-menu--horizontal {
  .gx-menu--popup-container {
    .el-sub-menu__icon-arrow {
      display: none;
    }
    .gx-menu-title__icon-arrow {
      transform: rotateZ(-90deg);
    }
    .el-sub-menu {
      .el-sub-menu__title {
        padding: 0 size(8);
        background-color: var(--gx-menu-hover-bg-color);
      }
      &.is-opened {
        .gx-menu-title__icon-arrow {
          transform: rotateZ(90deg);
        }
      }
    }
    .el-menu-item {
      &.active {
        color: var(--gx-menu-active-color);
      }
    }
  }
}

.gx-menu--collapse {
  width: size(48);

  .gx-menu-title {
    padding-left: 0;
  }

  .el-menu {
    padding: size(4);
  }
  .el-sub-menu.active {
    .el-sub-menu__title {
      background-color: var(--gx-menu-active-bg-color);
      color: var(--gx-menu-active-color);
    }
  }
}
</style>
