type IconSize = 'small' | 'medium' | 'large'

interface GxIconProps {
  fontClass?: string
  iconClass: string
  tooltip?: string
  iconSize?: IconSize
}

export type { GxIconProps, IconSize }
