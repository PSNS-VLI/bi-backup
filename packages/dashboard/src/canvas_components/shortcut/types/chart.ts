import type { ChartConfigStore } from '../../../types/configuration'

export type ChartStore = ChartConfigStore

export interface ChartProps {
  store: Partial<ChartStore>
  runtimeUnikey: string
  provideCover?: (coverUrl: string) => void
}
