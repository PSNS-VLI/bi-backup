import type { Component as VueComponent } from 'vue'

import type { CanvasComponent } from './canvas'
import type { ContainerInterface } from './container'

export interface Component extends CanvasComponent {
  name: string
  component: VueComponent
}

export interface ChartComponent extends Component {
  icon: string
  title?: string
  description: string
  tooltip?: any
}

export interface DashboardChartComponent<T extends ContainerInterface = ContainerInterface>
  extends ChartComponent {
  dimensionDescription: string
  measureDescription: string
  onClick?: (context: T, store: Record<string, any>) => void
  onResolve?: (context: T, store: Record<string, any>) => void
  afterLoad?: (context: T, store: Record<string, any>) => void
}
