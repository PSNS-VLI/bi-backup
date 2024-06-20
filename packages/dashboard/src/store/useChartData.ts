import { reactive, toRef, watch, type Ref, type WatchOptions } from 'vue'

import type { Key } from '../types/common'

type ChartData = Array<any>

const chartDataStore = reactive<Record<Key, ChartData>>({})

class ChartDataManager {
  provide(key: Key, data: ChartData) {
    Object.assign(chartDataStore, { [key]: data })
  }

  inject(key: Key): Ref<ChartData> | undefined {
    if (chartDataStore[key]) {
      return toRef(chartDataStore, key)
    }
  }

  watch(key: Key, callback: (chartData: ChartData) => any, options?: WatchOptions) {
    return watch(
      () => chartDataStore[key],
      (n) => {
        if (n) callback(n)
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

const chartDataManager = new ChartDataManager()
export const useChartDataStore = () => chartDataManager
