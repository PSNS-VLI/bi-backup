import type { ButtonProps } from 'element-plus'

type GxButtonProps = ButtonProps

interface GxButtonGroupItem extends Partial<GxButtonProps> {
  key?: string | number
  onClick?: () => void
  content: string
}

interface GxButtonGroupProps {
  buttons: Array<GxButtonGroupItem>
}

export type { GxButtonGroupItem, GxButtonGroupProps }
