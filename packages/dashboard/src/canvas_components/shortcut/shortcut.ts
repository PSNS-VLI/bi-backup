import { markRaw } from 'vue'

import type { DashboardChartComponent } from '../../types/component'
import type { DashboardContainer } from '../../blocks/Dashboard'
import type {
  ChartConfig,
  ChartConfigStore,
  CollapseConfig,
  ConfigItemBase
} from '../../types/configuration'
import { defineComponentContainerConfig } from '../../components/DashboardComponentContainer/config'
import { ChartName, type ChartCategory, ChartNameZH, ChartTitle } from '../../constants/component'
import { getDashboardChartUniID, initChartConfigData, deepAssign } from '../../utils'

export const getChartIDAndName = (chartCategory: ChartCategory, chartName: ChartName) => {
  const componentName = ChartNameZH[chartName] ?? chartName

  return {
    componentID: getDashboardChartUniID(chartCategory, chartName),
    componentName,
    componentTitle: ChartTitle[chartName] ?? componentName
  }
}

export const defineChart = (
  chartConfig: ChartConfig,
  component: DashboardChartComponent<DashboardContainer>
) => {
  const getHook = () => (context: DashboardContainer, store: ChartConfigStore) => {
    // To prevent version conflicts, deep copy is used to achieve version compatibility.
    Object.assign(store, deepAssign(initChartConfigData(chartConfig), store))
    const chartConfigBar = context.chartConfigBar
    const datasetBar = context.datasetBar
    if (chartConfigBar) {
      chartConfigBar.inject({
        title: component.name,
        config: chartConfig,
        configData: store
      })
      context.showBar('chartConfigBar')
    }
    if (datasetBar) {
      datasetBar.inject({ configData: store })
      context.showBar('datasetBar')
    }
  }

  return markRaw(
    Object.assign(
      {
        __includeKeys: ['id'],
        __sizeLimit: {
          minWidth: 2,
          minHeight: 16
        },
        onClick: getHook(),
        onResolve: getHook()
      },
      component
    )
  )
}

export const defineStyles = (
  options: { componentName?: string },
  styles: CollapseConfig<ConfigItemBase>[]
) => {
  return [defineComponentContainerConfig(options)].concat(styles)
}

export * from '../../common/configuration'
export { DashboardApi } from '../../components/DashboardInterface'
export {
  // utils
  keyIsValue,
  valueAsKey,
  boolArray,
  debounce,
  // css
  getCssID,
  // component
  getDashboardChartUniID,
  resolveChartUniID,
  // configuration
  defineConfigKey,
  defineField,
  defineFieldFilter,
  defineCollapse,
  defineSubCollapse,
  defineChartConfig,
  defineCheckbox,
  defineCheckboxGroup,
  defineRadioGroup,
  defineRadioGroupNest,
  defineRadioIconGroup,
  defineRadioTab,
  defineInput,
  defineInputNumber,
  defineSelect,
  defineTextStyle,
  defineColorPicker,
  defineTextWrapper,
  defineCheckboxWrapper,
  defineKeymapWrapper,
  initChartConfigData,
  // dataset
  filterFieldsByFieldClass
} from '../../utils'
export { useChartDataStore } from '../../store'
export { ChartName, ChartCategory } from '../../constants/component'
export {
  CHART_CONFIG_KEY,
  CANVAS_CONFIG_KEY,
  DATASET_CONFIG_KEY
} from '../../constants/app/dashboard'
export { ConfigItemType } from '../../types/configuration'
export { FieldClass } from '../../types/dataset'
export type { Field } from '../../types/dataset'
