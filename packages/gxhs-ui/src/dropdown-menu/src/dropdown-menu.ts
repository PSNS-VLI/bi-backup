export interface GxDropdownMenuItem {
  label: string
  children?: Array<GxDropdownMenuItem>
}

export interface GxDropdownMenuProps {
  menus: Array<GxDropdownMenuItem>
}
