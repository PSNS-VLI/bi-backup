<template>
  <div class="bi-chart-color-map">
    <div class="bi-chart-color-map__total" v-show="total.showTotal">
      <span class="total-text" :style="total.nameStyle">{{ total.title }}：</span>
      <span class="total-number" :style="total.numberStyle">{{ total.value }}</span>
    </div>
    <div :id="containerID" :style="containerStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import { ChartName, groupChartDataByFields, useChart } from '../../shortcut'
import type { ChartProps, Field } from '../../shortcut'

import { componentID, getChartConfigData } from './config'
import chinaGeoJson from './geo-json/china.geo.json'

defineOptions({
  name: ChartName.COLOR_MAP
})
const props = withDefaults(defineProps<ChartProps>(), {})

const total = reactive<{
  showTotal: boolean
  nameStyle: Record<string, any>
  numberStyle: Record<string, any>
  title: string
  value: 0
}>({
  showTotal: false,
  nameStyle: {},
  numberStyle: {},
  title: '总计',
  value: 0
})

const chinaGeoFeatures = chinaGeoJson.features.map((feature) => ({
  ...feature,
  adcode: feature.properties.code,
  cx: feature.properties.center?.[0],
  cy: feature.properties.center?.[1],
  name: feature.properties.name
}))

const { containerID, containerStyle, provideData, loadData } = useChart(props, {
  componentID,
  callback: {
    onCreated: (chart) => {
      const geoView = chart.geoView()

      const geoPath = geoView.geoPath()
      geoPath
        .data(chinaGeoFeatures)
        .style({
          fill: '#fefefe',
          stroke: 'grey',
          strokeOpacity: 0.3
        })
        .legend(false)

      geoView.geoPath()

      geoView.text().encode('x', 'cx').encode('y', 'cy').encode('text', 'name').tooltip(false)

      chart.render()
    },
    onConfigUpdated: (store, chart) => {
      const measurements = store?.fields?.measurements as Field[]
      const { contourFillingData, dataTagData, totalData, legendData } = getChartConfigData(store)

      const geoView = chart.getNodesByType('geoView')[0]
      const geoPathBase = geoView.getNodesByType('geoPath')[0] as any
      const geoPath = geoView.getNodesByType('geoPath')[1] as any
      const geoText = geoView.getNodeByType('text') as any

      geoPathBase.style(contourFillingData)

      geoText.encode('text', '')
      if (dataTagData.showDataTag) {
        if (dataTagData.reginName.show) {
          geoText.encode('text', 'name')
          geoText.style(dataTagData.reginName)
        }
      }

      Object.assign(total, totalData)
      if (measurements?.length) {
        total.title = `${measurements[0].name}总计`
      }

      geoPath.legend('color', false)
      if (legendData.showLegend) {
        geoPath.legend('color', legendData)
      }

      chart.render()
    },
    onDataRequested: async (store, chart) => {
      const dimensions = store?.fields?.dimensions as Field[]
      const measurements = store?.fields?.measurements as Field[]
      const legends = store?.fields?.legends as Field[]
      const tooltips = store?.fields?.tooltips as Field[]

      if (dimensions?.length && measurements?.length) {
        const originChartData = await loadData(dimensions.concat(measurements, legends, tooltips))
        const { chartData } = groupChartDataByFields(
          originChartData,
          dimensions,
          measurements,
          legends,
          {
            stringNumberConvert: true
          }
        )

        const dimensionName = dimensions[0].name
        const measurementName = measurements[0].name
        const geoData = chartData.reduce((res, data) => {
          const feature = chinaGeoFeatures.find((feature) => feature.adcode == data[dimensionName])

          if (feature) {
            res.push({
              ...feature,
              ...data
            })
          }

          return res
        }, [])

        const geoView = chart.getNodesByType('geoView')[0]
        const geoPath = geoView.getNodesByType('geoPath')[1] as any
        const geoText = geoView.getNodeByType('text') as any

        geoPath
          .data(geoData)
          .encode('color', measurementName)
          // .scale('color', {
          //   palette: 'gnBu'
          // })
          .legend('color', {
            layout: {
              alignItems: 'flex-end'
            }
          })
        geoText.data(geoData)

        provideData(originChartData)
        chart.render()
      }
    }
  }
})
</script>

<style lang="scss">
.bar-chart-color-map {
  position: relative;

  .legend {
    position: absolute;
    padding: 4px 12px;
    display: flex;
    align-items: center;

    .legend-text {
      margin-right: 12px;
      font-weight: 700;
    }
  }

  .legend-bottom {
    bottom: 0;
    left: 0;
    .legend-bar {
      width: 100px;
      height: 14px;
      margin: 0 4px;
      background: linear-gradient(90deg, #bae7ff 0%, #1890ff 50%, #0050b3 100%);
    }
    .legend-bar-box {
      display: flex;
      align-items: center;
      margin: 0 4px;
      .bar {
        height: 14px;
        margin: 0 1px;
      }
    }
  }

  .legend-left {
    top: 0;
    left: 0;
    margin-top: 30px;
    flex-direction: column;
    .legend-bar {
      width: 14px;
      height: 100px;
      margin: 0 4px;
      background: linear-gradient(180deg, #bae7ff 0%, #1890ff 50%, #0050b3 100%);
    }
    .legend-bar-box {
      margin: 0 4px;
      display: flex;
      flex-direction: column;
      .bar {
        width: 14px;
        margin: 1px 0;
      }
    }
  }
}
</style>
