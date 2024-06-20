import { Module } from '../constants/common'
import {
  ComponentCategory,
  ChartCategoryName,
  ChartCategory,
  type ChartName,
  ChartNameZH,
  ChartCategoryOrder,
  ChartOrder
} from '../constants/component'
import type { DashboardChartComponent } from '../types/component'

export const getUniID = (module: Module, categories: Array<string>) => {
  return `${module}__${categories.join('-')}`
}

export const resolveUniID = (id: string) => {
  const re = /([A-Za-z0-9]+)__([A-Za-z0-9]+(?:-[A-Za-z0-9/]+){2})/g
  const res = re.exec(id)

  if (res?.length === 3) {
    return {
      module: res[1],
      categories: res[2].split('-')
    }
  }
}

export const getUniKey = (randomLength = 10) => {
  return Number(Math.random().toString().substring(2, randomLength) + Date.now()).toString(36)
}

export const genComponentName = (name: string) => `BI${name[0].toUpperCase() + name.slice(1)}`

export const getCategories = (primary: ComponentCategory, ...categories: string[]) => {
  return [primary as string].concat(categories)
}

export const getChartUniID = (
  module: Module,
  chartCategory: ChartCategory,
  chartName: ChartName
) => {
  return getUniID(module, getCategories(ComponentCategory.CHART, chartCategory, chartName))
}

export const resolveChartUniID = (id: string) => {
  const res = resolveUniID(id)

  if (res) {
    return {
      module: res.module,
      chartCategory: res.categories[1],
      chartName: res.categories[2]
    }
  }
}

export const getDashboardChartUniID = (chartCategory: ChartCategory, chartName: ChartName) => {
  return getChartUniID(Module.DASHBOARD, chartCategory, chartName)
}

export const getDashboardChartComponents = async () => {
  const chartDir = import.meta.glob('../canvas_components/charts/**/index.ts', {
    import: 'default'
  })
  const charts: Array<{
    order: number
    name: string
    charts: Array<DashboardChartComponent>
  }> = []

  for (const key in chartDir) {
    const chart = (await chartDir[key]()) as DashboardChartComponent
    const chartCategory = (resolveChartUniID(chart.id)?.chartCategory ??
      ChartCategory.OTHER) as ChartCategory
    const chartCategoryName = ChartCategoryName[chartCategory]

    const category = charts.find((chart) => chart.name === chartCategoryName)
    if (category) {
      category.charts.push(chart)
    } else {
      charts.push({
        order: ChartCategoryOrder[chartCategory] ?? NaN,
        name: chartCategoryName,
        charts: [chart]
      })
    }
  }

  charts.forEach((chart) => {
    chart.charts.sort((current, next) => {
      const currentOrder =
        ChartOrder[(ChartNameZH[current.name] ?? current.name) as ChartName] ?? NaN
      const nextOrder = ChartOrder[(ChartNameZH[next.name] ?? next.name) as ChartName] ?? NaN
      const diff = currentOrder - nextOrder

      return Number.isNaN(diff) ? -1 : diff
    })
  })

  return charts.sort((current, next) => {
    const diff = current.order - next.order
    return Number.isNaN(diff) ? -1 : diff
  })
}

export const getDashboardChartComponentByID = async (id: string) => {
  const charts = (await getDashboardChartComponents()).reduce(
    (res: Array<DashboardChartComponent>, chart) => res.concat(chart.charts),
    []
  )
  return charts.find((chart) => chart.id === id)
}
