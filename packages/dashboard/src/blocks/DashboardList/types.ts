import { type Dashboard } from '../../types/app/dashboard'

interface DashboardListProps {
  title?: string
}

interface ColumnProps {
  prop: string
  label: string
  width?: number
}

interface RowData extends Dashboard {
  hasChildren?: boolean
  children?: RowData[]
}

export type { DashboardListProps, ColumnProps, RowData }
