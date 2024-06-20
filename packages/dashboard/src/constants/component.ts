import { constWithReverse } from '../utils'

// primary classification of the component.
export const enum ComponentCategory {
  // The components most commonly used by users.
  CHART = 'chart',
  // Offical components that implement non-standardized interfaces.
  WIDGET = 'widget',
  // Components that assist the internal implementation of the system.
  INTERNAL = 'internal'
}

export const enum ChartCategory {
  TABLE = 'table',
  INDICATOR = 'indicator',
  LINE_OR_PLANE = 'line/plane',
  COLUMN_OR_BAR = 'column/bar',
  PIE_OR_RING = 'pie/ring',
  FUNNEL_TRANSFORM = 'funnel/transform',
  BUBBLE_OR_SCATTER = 'bubble/scatter',
  GEOGRAPHY = 'GEOGRAPHY',
  OTHER = 'OTHER'
}

export const ChartCategoryName = constWithReverse({
  [ChartCategory.TABLE]: '表格',
  [ChartCategory.INDICATOR]: '指标',
  [ChartCategory.LINE_OR_PLANE]: '线/面图',
  [ChartCategory.COLUMN_OR_BAR]: '柱/条图',
  [ChartCategory.PIE_OR_RING]: '饼/环图',
  [ChartCategory.BUBBLE_OR_SCATTER]: '气泡/散点',
  [ChartCategory.FUNNEL_TRANSFORM]: '漏斗/转化关系',
  [ChartCategory.GEOGRAPHY]: '地理',
  [ChartCategory.OTHER]: '其它'
})

export const ChartCategoryOrder: Record<ChartCategory, number> = {
  [ChartCategory.TABLE]: 0,
  [ChartCategory.INDICATOR]: 1,
  [ChartCategory.LINE_OR_PLANE]: 2,
  [ChartCategory.COLUMN_OR_BAR]: 3,
  [ChartCategory.PIE_OR_RING]: 4,
  [ChartCategory.BUBBLE_OR_SCATTER]: 5,
  [ChartCategory.FUNNEL_TRANSFORM]: 6,
  [ChartCategory.GEOGRAPHY]: 7,
  [ChartCategory.OTHER]: 9
}

export const enum ChartName {
  TABLE_CROSSTAB = 'TableCrosstab',
  TABLE_DETAIL_LIST = 'TableDetailList',
  TABLE_THERMAL_MAP = 'TableThermalMap',

  INDICATOR_BOARD = 'IndicatorBoard',
  INDICATOR_TREND = 'IndicatorTrend',
  INDICATOR_PROGRESS_BAR = 'IndicatorProgressBar',
  INDICATOR_DASHBOARD = 'IndicatorDashboard',
  INDICATOR_RIPPLE = 'IndicatorRipple',

  LINE_CHART = 'LineChart',
  PLANE_CHART = 'PlaneChart',
  PLANE_STACKING = 'PlaneStacking',
  PLANE_PERCENTAGE = 'PlanePercentage',
  LINE_COMBINATION_CHART = 'LineCombinationChart',

  BAR_CHART = 'BarChart',
  BAR_STACKING = 'BarStacking',
  BAR_PERCENTAGE = 'BarPercentage',
  COLUMN_RANKING_LIST = 'ColumnRankingList',
  COLUMN_CHART = 'ColumnChart',
  COLUMN_STACKING = 'ColumnStacking',
  COLUMN_PERCENTAGE = 'ColumnPercentage',

  PIE_CHART = 'PieChart',
  RADAR_CHART = 'RadarChart',

  BUBBLE_CHART = 'BubbleChart',
  SCATTER_CHART = 'ScatterChart',

  FUNNEL_CHART = 'FunnelChart',
  FUNNEL_COMPARISON = 'FunnelComparison',
  SANKEY_DIAGRAM = 'SankeyDiagram',

  COLOR_MAP = 'ColorMap'
}

export const ChartNameZH = constWithReverse({
  [ChartName.TABLE_CROSSTAB]: '交叉表',
  [ChartName.TABLE_DETAIL_LIST]: '明细表',
  [ChartName.TABLE_THERMAL_MAP]: '热力图',

  [ChartName.INDICATOR_BOARD]: '指标看板',
  [ChartName.INDICATOR_TREND]: '指标趋势',
  [ChartName.INDICATOR_PROGRESS_BAR]: '进度条',
  [ChartName.INDICATOR_DASHBOARD]: '仪表盘',
  [ChartName.INDICATOR_RIPPLE]: '水波图',

  [ChartName.LINE_CHART]: '线图',
  [ChartName.PLANE_CHART]: '面积图',
  [ChartName.PLANE_STACKING]: '堆积',
  [ChartName.PLANE_PERCENTAGE]: '百分比',
  [ChartName.LINE_COMBINATION_CHART]: '组合图',

  [ChartName.BAR_CHART]: '柱图',
  [ChartName.BAR_STACKING]: '堆积',
  [ChartName.BAR_PERCENTAGE]: '百分比',
  [ChartName.COLUMN_RANKING_LIST]: '排行榜',
  [ChartName.COLUMN_CHART]: '条形图',
  [ChartName.COLUMN_STACKING]: '堆积',
  [ChartName.COLUMN_PERCENTAGE]: '百分比',

  [ChartName.PIE_CHART]: '饼图',
  [ChartName.RADAR_CHART]: '雷达图',
  [ChartName.BUBBLE_CHART]: '气泡图',
  [ChartName.SCATTER_CHART]: '散点图',
  [ChartName.FUNNEL_CHART]: '漏斗图',
  [ChartName.FUNNEL_COMPARISON]: '对比漏斗',
  [ChartName.SANKEY_DIAGRAM]: '桑基图',
  [ChartName.COLOR_MAP]: '色彩地图'
})

export const ChartTitle = constWithReverse({})

export const ChartOrder: Partial<Record<ChartName, number>> = {
  [ChartName.LINE_CHART]: 1,
  [ChartName.PLANE_CHART]: 2,
  [ChartName.PLANE_STACKING]: 3,
  [ChartName.PLANE_PERCENTAGE]: 4
}
