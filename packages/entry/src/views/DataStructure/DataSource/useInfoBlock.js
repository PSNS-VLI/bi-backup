import { computed, ref } from 'vue'
import api from '@/api'
const { datasourceApi } = api
const useInfoBlock = (update, props) => {
  const datasourceId = computed(() =>
    typeof props.id === 'string' ? parseInt(props.id) : props.id
  )
  console.log(props)
  const detailData = ref([])
  const detailApiMap = {
    FileSource: 'getDatasourceDetail',
    ApiSource: 'getApiDetail',
    SqlSource: 'getDbDatasourceDetail',
    DaMengSource: 'getDbDatasourceDetail'
  }

  const loadDetail = async () => {
    const result = await datasourceApi[detailApiMap[props.componentId]].send({
      id: datasourceId.value
    })
    if (result) {
      detailData.value = result
    }
  }
  update && loadDetail()

  return {
    detailData
  }
}

//数据预览图标
const ICONMAP = {
  NUMBER: 'icon-num',
  INTEGER: 'icon-num',
  DOUBLE: 'icon-num',
  STRING: 'icon-str',
  DATE: 'icon-Calendar',
  GEOGRAPHY: 'icon-Calendar'
}
//表格转化单位
const formatDataSize = (dataSize) => {
  let formattedSize
  let unit

  if (dataSize >= 1048576) {
    // 1048576 B is 1 Mb
    formattedSize = (dataSize / 1048576).toFixed(2)
    unit = 'Mb'
  } else if (dataSize > 1024) {
    // 1024 B is 1 Kb
    formattedSize = (dataSize / 1024).toFixed(2)
    unit = 'Kb'
  } else {
    formattedSize = dataSize.toString()
    unit = 'B'
  }

  return `${formattedSize} ${unit}`
}
export default useInfoBlock
export { ICONMAP, formatDataSize }
