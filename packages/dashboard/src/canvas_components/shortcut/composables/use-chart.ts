import { ref, onMounted, watch, onUnmounted, type WatchStopHandle } from 'vue'
import { Chart, type MarkNode } from '@antv/g2'

import {
  // utils
  getCssID,
  boolArray,
  debounce,
  // store
  useChartDataStore,
  resolveChartUniID,
  // global key
  CHART_CONFIG_KEY,
  DATASET_CONFIG_KEY,
  // api
  DashboardApi,
  type Field
} from '../shortcut'
import type { ChartProps, ChartStore } from '../types/chart'

type ChartHook = (store: Partial<ChartStore>, chart: Chart) => void
function useChart(
  props: ChartProps,
  options: {
    componentID?: string
    callback?: {
      onCreated?: (chart: Chart, store: Partial<ChartStore>) => void
      onConfigUpdated?: ChartHook
      onDataRequested?: ChartHook
      onLoaded?: ChartHook
      // old api
      initChart?: (chart: Chart, store: Partial<ChartStore>) => MarkNode
      updateStore?: (mark: MarkNode, store: Partial<ChartStore>, chart: Chart) => void
      updateChart?: (mark: MarkNode, store: Partial<ChartStore>, chart: Chart) => void
      loadChart?: (mark: MarkNode, store: Partial<ChartStore>, chart: Chart) => void
      // without dom
      updateStoreWithoutDom?: (store: Partial<ChartStore>) => void
      updateChartWithoutDom?: (store: Partial<ChartStore>) => void
      loadChartWithoutDom?: (store: Partial<ChartStore>) => void
    }
  }
) {
  const { componentID, callback = {} } = options
  const {
    initChart,
    updateStore,
    updateChart,
    updateStoreWithoutDom,
    updateChartWithoutDom,
    // new api
    onCreated,
    onConfigUpdated,
    onDataRequested
  } = callback

  // init container param
  const containerID = componentID ? `${componentID}--${getCssID()}` : ''
  const containerSelf = ref<HTMLElement | null>(null)
  const containerStyle = {
    height: '100%',
    width: '100%'
  }

  let provideData: (data: Array<any>) => void = () => {}
  let provideCover: (coverUrl?: string) => void = () => {}
  if (props.runtimeUnikey) {
    const chartDataStore = useChartDataStore()
    provideData = (data: Array<any>) => chartDataStore.provide(props.runtimeUnikey, data)
  }
  if (componentID) {
    const componentName = resolveChartUniID(componentID)?.chartName

    provideCover = async (coverUrl?: string) => {
      if (coverUrl === undefined && componentName) {
        coverUrl = await import(`../covers/${componentName}.png`).then((module) => module.default)
      }

      props.provideCover && props.provideCover(coverUrl ?? '')
    }

    provideCover()
  }
  const loadData = async (fields: Array<Field>, filters: Array<Field> = []) => {
    const datasetId = (props.store as Record<string, any>)?.[DATASET_CONFIG_KEY]?.datasetId
    let originChartData: Array<Record<string, any>> = []

    if (datasetId) {
      const res = await DashboardApi.loadData({
        datasetId,
        fields: boolArray(fields),
        fieldFilters: filters
      })

      if (res) {
        originChartData = res
      }
    }

    setTimeout(() => provideCover(''), 500)

    return originChartData
  }

  // lifecycle hooks
  let chartContainer = containerSelf.value
  let chartInstance: Chart = new Chart()
  const chartResizeObserver: ResizeObserver = new ResizeObserver(
    debounce(() => (chartInstance as any).changeSize())
  )
  const watcherBuffer: Array<WatchStopHandle> = []
  onMounted(() => {
    if (containerID) {
      chartContainer = document.getElementById(containerID)

      if (chartContainer) {
        chartContainer.style.width = '100%'
        chartContainer.style.height = '100%'
      }
    }

    let markInstance: MarkNode | null = null
    if (chartContainer) {
      chartInstance = new Chart({
        container: chartContainer,
        autoFit: true,
        padding: 'auto'
      })

      if (initChart) {
        markInstance = initChart(chartInstance, props.store)
      }

      chartResizeObserver.observe(chartContainer)
    }

    onCreated && onCreated(chartInstance, props.store)

    // update data
    watcherBuffer.push(
      watch(
        () => [props.store?.fields, props.store?.styles, props.store?.analyses],
        debounce(() => {
          if (chartInstance && markInstance && updateStore) {
            updateStore(markInstance, props.store, chartInstance)
            chartInstance.render()
          }

          if (updateStoreWithoutDom) {
            updateStoreWithoutDom(props.store)
          }

          if (onConfigUpdated) {
            onConfigUpdated(props.store, chartInstance)
          }
        }),
        {
          deep: true,
          immediate: true
        }
      )
    )

    // fields config
    const callHookWhenUpdateData = () => {
      if (chartInstance && markInstance && updateChart) {
        updateChart(markInstance, props.store, chartInstance)
        chartInstance.render()
      }

      if (updateChartWithoutDom) {
        updateChartWithoutDom(props.store)
      }

      if (onDataRequested) {
        onDataRequested(props.store, chartInstance)
      }
    }

    let previousUpdateRequestId = 0
    let autoUpdateIntervalId: any = null
    watcherBuffer.push(
      watch(
        () => props.store?.[CHART_CONFIG_KEY],
        debounce((requestConfigData) => {
          const {
            updateRequestId = 0,
            autoUpdate = false,
            autoUpdateGap = 5,
            autoUpdateGapToSecond = 60
          } = requestConfigData || {}

          if (updateRequestId !== previousUpdateRequestId) {
            previousUpdateRequestId = updateRequestId
            callHookWhenUpdateData()
          }

          autoUpdateIntervalId && clearInterval(autoUpdateIntervalId)
          if (autoUpdate) {
            autoUpdateIntervalId = setInterval(
              () => {
                callHookWhenUpdateData()
              },
              autoUpdateGap * autoUpdateGapToSecond * 1000
            )
          }
        }),
        {
          deep: true,
          immediate: true
        }
      )
    )
  })

  onUnmounted(() => {
    watcherBuffer.forEach((handle) => {
      handle && handle()
    })

    if (chartContainer) {
      chartResizeObserver.unobserve(chartContainer)
    }
  })

  return {
    containerID,
    containerSelf,
    containerStyle,
    provideData,
    provideCover,
    loadData
  }
}

export { useChart }
