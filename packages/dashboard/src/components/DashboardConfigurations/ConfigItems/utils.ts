import {
  type Component,
  type WatchOptions,
  defineAsyncComponent,
  inject,
  watch,
  ref,
  computed
} from 'vue'

import type {
  ConfigItemBase,
  ConfigSelect,
  ConfigRadioGroup,
  ChartConfigStore
} from '../../../types/configuration'
import {
  isCheckbox,
  isCheckboxGroup,
  isRadioGroup,
  isRadioIconGroup,
  isRadioTab,
  isRadioGroupNest,
  isInput,
  isInputNumber,
  isSelect,
  isColorPicker,
  isTextStyle,
  isTextWrapper,
  isCheckboxWrapper,
  isKeymapWrapper,
  isCustom
} from '../../../utils/configuration'
import {
  CHART_CONFIG_BAR_PROVIDE_CHART_CONFIG_STORE,
  CHART_CONFIG_BAR_PROVIDE_CHART_DATA
} from '../../../constants/app/dashboard'

export const getConfigComponent = (config: ConfigItemBase) => {
  let component: Component | null = null

  switch (true) {
    case isCheckbox(config):
      component = defineAsyncComponent(() => import('./ConfigCheckbox'))
      break
    case isCheckboxGroup(config):
      component = defineAsyncComponent(() => import('./ConfigCheckboxGroup'))
      break
    case isRadioGroup(config):
      component = defineAsyncComponent(() => import('./ConfigRadioGroup'))
      break
    case isRadioIconGroup(config):
      component = defineAsyncComponent(() => import('./ConfigRadioIconGroup'))
      break
    case isRadioTab(config):
      component = defineAsyncComponent(() => import('./ConfigRadioTab'))
      break
    case isRadioGroupNest(config):
      component = defineAsyncComponent(() => import('./ConfigRadioGroupNest'))
      break
    case isInput(config):
      component = defineAsyncComponent(() => import('./ConfigInput'))
      break
    case isInputNumber(config):
      component = defineAsyncComponent(() => import('./ConfigInputNumber'))
      break
    case isSelect(config):
      component = defineAsyncComponent(() => import('./ConfigSelect'))
      break
    case isColorPicker(config):
      component = defineAsyncComponent(() => import('./ConfigColorPicker'))
      break
    case isTextStyle(config):
      component = defineAsyncComponent(() => import('./ConfigTextStyle'))
      break
    case isTextWrapper(config):
      component = defineAsyncComponent(() => import('./ConfigTextWrapper'))
      break
    case isCheckboxWrapper(config):
      component = defineAsyncComponent(() => import('./ConfigCheckboxWrapper'))
      break
    case isKeymapWrapper(config):
      component = defineAsyncComponent(() => import('./ConfigKeymapWrapper'))
      break
    case isCustom(config):
      component = config.component
      break
  }

  return component
}

export const useChartConfigStore = (
  callback: (configStore: ChartConfigStore) => any,
  options?: WatchOptions
) => {
  const chartConfigStore = inject(CHART_CONFIG_BAR_PROVIDE_CHART_CONFIG_STORE)

  if (chartConfigStore) {
    watch(
      chartConfigStore,
      (configStore) => {
        callback(configStore)
      },
      Object.assign(
        {
          deep: true,
          immediate: true
        },
        options
      )
    )
  }
}

export const useChartData = (callback: (chartData: Array<any>) => any, options?: WatchOptions) => {
  const chartConfigStore = inject(CHART_CONFIG_BAR_PROVIDE_CHART_DATA)

  if (chartConfigStore) {
    watch(
      chartConfigStore,
      (configStore) => {
        callback(configStore)
      },
      Object.assign(
        {
          deep: true,
          immediate: true
        },
        options
      )
    )
  }
}

export const useKeymapMapper = (
  props: {
    config: ConfigSelect<string> | ConfigRadioGroup<string>
    modelValue: any
  },
  emit: (event: 'update:modelValue' | 'optionsLose', ...args: any[]) => void
) => {
  const computedOptions = ref<Array<{ label: any; value: any }> | null>(null)
  let computedOptionsCache: Array<{ label: any; value: any }> = []

  const { chartStoreComputer, chartDataComputer } = props.config.optionsComputer || {}
  const optionsComputer = chartDataComputer || chartStoreComputer
  if (typeof optionsComputer === 'function') {
    const diffOptions = (optionsCompouted: any) => {
      if (Array.isArray(optionsCompouted)) {
        computedOptions.value = optionsCompouted

        // diff
        if (computedOptionsCache.length) {
          const optionsCompoutedValues = optionsCompouted.map((option) => option.value)
          const optionLose = computedOptionsCache.filter(
            (option) => !optionsCompoutedValues.includes(option.value)
          )
          if (optionLose.length) {
            if (optionLose.map((option) => option.value).includes(props.modelValue)) {
              emit('update:modelValue', optionsCompouted[0]?.value)
            }
            emit('optionsLose', optionLose)
          }
        }

        computedOptionsCache = optionsCompouted
      }
    }
    if (typeof chartDataComputer === 'function') {
      useChartData((chartData) => {
        const optionsCompouted = chartDataComputer(chartData || {})
        diffOptions(optionsCompouted)
      })
    } else if (typeof chartStoreComputer === 'function') {
      useChartConfigStore((configStore) => {
        const optionsCompouted = chartStoreComputer(configStore || {})
        diffOptions(optionsCompouted)
      })
    }
  }

  const selectOptions = computed(() => {
    return computedOptions.value ? computedOptions.value : props.config.options ?? []
  })

  return {
    selectOptions
  }
}
