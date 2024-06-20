interface GxMenuItem {
  to: string
  label: string
  icon?: string
  children?: GxMenuItem[]
}

const enum MenuMode {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

interface GxMenuProps {
  menus: GxMenuItem[]
  mode?: MenuMode
  collapse?: boolean
}

export type { GxMenuProps, GxMenuItem }
export { MenuMode }
