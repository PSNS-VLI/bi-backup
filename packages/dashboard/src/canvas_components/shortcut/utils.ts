import { type Field } from './shortcut'

const fieldNameMapper = (field: Field) => field.name

export const groupChartDataByFields = (
  chartData: Array<Record<string, any>>,
  classFields: Array<Field>,
  valueFields: Array<Field>,
  legends: Array<Field> = [],
  options: {
    stringNumberConvert?: boolean
    calculatedSum?: boolean
    calculatedPercent?: boolean
    percentPrecision?: number
  } = {}
) => {
  const classNames = classFields.map(fieldNameMapper)
  const valueNames = valueFields.map(fieldNameMapper)
  const legendNames = legends.map(fieldNameMapper)

  const customLegend = !!legends.length
  const {
    stringNumberConvert = false,
    calculatedPercent = false,
    calculatedSum = calculatedPercent,
    percentPrecision = 2
  } = options

  const classKey = classNames.join('-')
  const valueKey = valueNames.join('-')
  const totalValueKey = '__BI_TOTAL_VALUE_KEY__'
  const percentSourceValueKey = '__BI_PERCENT_SOURCE_VALUE_KEY__'
  const percentValueKey = '__BI_PERCENT_VALUE_KEY__'
  const percentStrValueKey = '__BI_PERCENT_STR_VALUE_KEY__'
  const colorKey = customLegend ? legendNames.join('-') : '__BI_COLOR_KEY__'

  const newChartData = chartData.reduce((newChartData: Array<Record<string, any>>, dataItem) => {
    const newDataItem: Record<string, any> = {
      [classKey]: classNames.reduce((item, name) => {
        return `${item ? `${item}-` : ''}${dataItem[name]}`
      }, ''),
      ...dataItem
    }

    const filteredValueNames = valueNames.slice(0, customLegend ? 1 : valueNames.length)
    let totalValue = NaN
    let totalValueSymbolFlag: 'SAME' | 'OPPOSITE' | 'NAN' = 'NAN'

    if (calculatedSum) {
      let previousValueSymbolFlag: '+' | '-' | '' = ''
      const setPreviousValueSymbolFlag = (flag: '+' | '-') => {
        if (!previousValueSymbolFlag) {
          previousValueSymbolFlag = flag
          totalValueSymbolFlag = 'SAME'
        } else if (previousValueSymbolFlag !== flag) {
          totalValueSymbolFlag = 'OPPOSITE'
        }
      }
      totalValue = filteredValueNames.reduce((total, name) => {
        const value = Number(dataItem[name])

        if (Number.isNaN(value)) {
          totalValueSymbolFlag = 'NAN'
          return NaN
        }

        setPreviousValueSymbolFlag(value < 0 ? '-' : '+')

        return total + value
      }, 0)
    }

    filteredValueNames.forEach((name) => {
      const temp = Object.assign(
        {},
        newDataItem,
        {
          [valueKey]: dataItem[name]
        },
        !customLegend && {
          [colorKey]: name
        },
        calculatedSum && {
          [totalValueKey]: totalValue
        },
        calculatedPercent &&
          totalValueSymbolFlag !== 'OPPOSITE' && {
            [percentSourceValueKey]: Number(dataItem[name]) / totalValue
          }
      )

      const percentSourceValue = temp[percentSourceValueKey] as number
      if (percentSourceValue !== undefined) {
        Object.assign(temp, {
          [percentValueKey]: Number.parseFloat(percentSourceValue.toFixed(percentPrecision)),
          [percentStrValueKey]: `${(percentSourceValue * 100).toFixed(percentPrecision)}%`
        })
      }

      newChartData.push(temp)
    })

    if (stringNumberConvert) {
      newChartData.forEach((item) => {
        const numberFromString = Number(item[valueKey])
        if (!Number.isNaN(numberFromString)) {
          item[valueKey] = numberFromString
        }
      })
    }

    return newChartData
  }, [])

  return {
    chartData: newChartData,
    classKey,
    valueKey,
    colorKey,
    totalValueKey,
    percentSourceValueKey,
    percentValueKey,
    percentStrValueKey
  }
}
