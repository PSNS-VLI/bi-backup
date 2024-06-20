import type { GxIconProps, IconSize } from '../../GxIcon/src/types'

interface GxIconGrouopBaseProps extends Omit<GxIconProps, 'padding'> {
  key?: string | number
  title?: string
  disabled?: boolean
  onClick?: () => unknown
}

interface GxIconGroupDropdownItem extends GxIconGrouopBaseProps {}

interface GxIconGroupItem extends GxIconGrouopBaseProps {
  children?: Array<GxIconGroupDropdownItem>
}

interface GxIconGroupItemProps {
  groupItem: GxIconGroupItem
  iconSize?: IconSize
}

interface GxIconGroupProps {
  icons: Array<GxIconGroupItem>
  iconSize?: IconSize
  dropdownIconSize?: IconSize
  popperClass?: string
}

export type { GxIconGroupProps, GxIconGroupItemProps, GxIconGroupItem, GxIconGroupDropdownItem }
