import type { InjectionKey, Ref } from 'vue'
import type { ChartConfigStore } from '../../types/configuration'

export const CHART_CONFIG_KEY = '__bi_chart_config__'
export const DATASET_CONFIG_KEY = '__bi_dataset__'
/**
 * {
 *   elementLoaded: boolean
 * }
 */
export const CANVAS_CONFIG_KEY = '__bi_canvas__'

export const CHART_CONFIG_BAR_PROVIDE_CHART_CONFIG_STORE = Symbol() as InjectionKey<
  Ref<ChartConfigStore>
>

export const CHART_CONFIG_BAR_PROVIDE_CHART_DATA = Symbol() as InjectionKey<Ref<Array<any>>>
