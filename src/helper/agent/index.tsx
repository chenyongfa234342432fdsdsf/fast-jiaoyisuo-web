import {
  DateOptionsTypes,
  incomeAnalysisChartDefaultProperties,
  productCodeMapToRates,
  totalIncomeChartDefaultProperties,
} from '@/constants/agent'
import { baseAgentStatsStore } from '@/store/agent/agent-gains'
import { YapiPostV1AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse } from '@/typings/yapi/AgtRebateInfoHistoryQueryDetailsAnalysisV1PostApi'
import { YapiPostV1AgtRebateInfoHistoryQueryDetailsListIncomes } from '@/typings/yapi/AgtRebateInfoHistoryQueryDetailsV1PostApi'
import dayjs from 'dayjs'
import { isNull, sumBy } from 'lodash'
import { t } from '@lingui/macro'
import { formatNumberDecimal } from '../decimal'
import { getBusinessName } from '../common'

const dateTemplate = 'YYYY-MM-DD hh:mm:ss'

function formatInfoBoxData(data: YapiPostV1AgtRebateInfoHistoryQueryDetailsListIncomes[]) {
  return data.reduce((prev, curr) => {
    prev[curr.dateType] = curr
    return prev
  }, {})
}

function formatDateOptions(type: DateOptionsTypes) {
  const now = dayjs()
  if (type === DateOptionsTypes.last7Days) {
    const start = now.subtract(7, 'days')
    return {
      startDate: start.format(dateTemplate),
      endDate: now.format(dateTemplate),
    }
  }
  const start = now.subtract(30, 'days')
  return {
    startDate: start.format(dateTemplate),
    endDate: now.format(dateTemplate),
  }
}

function dateOptionsToApiParams(DateOptions: DateOptionsTypes) {
  const { chartFilterSetting } = baseAgentStatsStore.getState()
  let endTime = dayjs()
  let startTime = endTime
  switch (DateOptions) {
    case DateOptionsTypes.custom:
      startTime = dayjs(chartFilterSetting.startDate).startOf('day')
      endTime = dayjs(chartFilterSetting.endDate).endOf('day')
      break
    case DateOptionsTypes.last30Days:
      // inclusive of today
      startTime = endTime.subtract(29, 'day').startOf('day')
      break
    case DateOptionsTypes.last7Days:
      // inclusive of today
      startTime = endTime.subtract(6, 'day').startOf('day')
      break
    default:
      startTime = endTime.subtract(1, 'year').startOf('day')
  }

  return {
    startDate: startTime.valueOf(),
    endDate: endTime.valueOf(),
  }
}

function fillMissingDataForChart(chartData, startDate, endDate) {
  let result = [] as any[]
  const formattedStartDate = dayjs(startDate)
  const formattedEndDate = dayjs(endDate)
  const chartDataMap = chartData.reduce((prev, curr) => {
    prev[curr.x] = curr.y
    return prev
  }, {})
  for (let start = formattedStartDate; start.diff(formattedEndDate) <= 0; start = start.add(1, 'day')) {
    if (chartDataMap[start.format('YYYY-MM-DD')])
      result.push({ x: start.format('YYYY-MM-DD'), y: chartDataMap[start.format('YYYY-MM-DD')] })
    else result.push({ x: start.format('YYYY-MM-DD'), y: 0 })
  }

  return result
}

function formatTotalIncomesChartData(
  apiData: YapiPostV1AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse['totalIncomeList'],
  startDate,
  endDate
) {
  let data = apiData.map(each => {
    return {
      x: dayjs(each.createdByTime).format('YYYY-MM-DD'),
      y: Number(formatNumberDecimal(each.legalCurIncome, 2, true)),
    }
  })
  data = fillMissingDataForChart(data, startDate, endDate)
  const id = JSON.stringify({
    ...data[data.length - 1],
    y: sumBy(data, each => Number(each.y)),
  })
  return [
    {
      id,
      data,
      ...totalIncomeChartDefaultProperties,
    },
  ]
}

export function formatAgentInviteChartData(apiData: any, startDate, endDate) {
  let data = apiData.map(each => {
    return { x: dayjs(each.date).format('YYYY-MM-DD'), y: each.num }
  })
  data = fillMissingDataForChart(data, startDate, endDate)
  const id = JSON.stringify({
    ...data[data.length - 1],
    y: sumBy(data, each => Number((each as any).y)),
  })
  return [
    {
      id,
      data,
      ...totalIncomeChartDefaultProperties,
    },
  ]
}

function formatIncomeAnalysisChartData(
  apiData: YapiPostV1AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse['incomesAnalysis'],
  startDate,
  endDate
) {
  const { productCodeMap } = baseAgentStatsStore.getState()

  const productMap = apiData.reduce((prev, curr) => {
    if (!prev[curr.productCd])
      prev[curr.productCd] = [
        {
          x: dayjs(curr.createdByTime).format('YYYY-MM-DD'),
          y: Number(formatNumberDecimal(curr.legalCurIncome, 2, true)),
        },
      ]
    else
      prev[curr.productCd].push({
        x: dayjs(curr.createdByTime).format('YYYY-MM-DD'),
        y: Number(formatNumberDecimal(curr.legalCurIncome, 2, true)),
      })
    return prev
  }, {})

  const formattedChartData = Object.keys(productMap).map((key, index) => {
    const data = fillMissingDataForChart(productMap[key], startDate, endDate)
    const checkboxVal = {
      ...data[data.length - 1],
      y: sumBy(data, each => Number(each.y)),
    }
    const checkboxTitle = JSON.stringify(checkboxVal)
    return {
      id: productCodeMap[key],
      data,
      ...incomeAnalysisChartDefaultProperties[index],
      checkboxTitle,
      productCd: key,
    }
  })

  return formattedChartData
}

function extractRatesFromApiData(apiData: YapiPostV1AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse) {
  const { productCodeMap } = baseAgentStatsStore.getState()

  return Object.keys(productCodeMap).reduce((prev, curr) => {
    prev[curr] = apiData[productCodeMapToRates[curr]]
    return prev
  }, {})
}

function formatIncomesPieChartData(apiData) {
  const data = extractRatesFromApiData(apiData)
  const { productCodeMap } = baseAgentStatsStore.getState()
  if (Object.values(data).every(isNull)) return []

  const formatted = Object.keys(productCodeMap).map((key, index) => {
    return {
      id: key,
      label: productCodeMap[key],
      value: data[key] || 0,
      productCd: key,
      ...incomeAnalysisChartDefaultProperties[index],
    }
  })

  return formatted
}

// filter and format to api request structure
function formatQueryRebateToApi(params) {
  delete params.columnDetails
  if (params.productCd === 0) {
    delete params.productCd
  }

  // api requires both min and maxAmount properties
  if (params.minAmount && !params.maxAmount) {
    params.maxAmount = Number.MAX_SAFE_INTEGER
  }
  if (params.maxAmount && !params.minAmount) {
    params.minAmount = 0
  }

  return params
}

function formatDatePickerData(data) {
  return {
    startDate: dayjs(data[0]).valueOf(),
    endDate: dayjs(data[1]).valueOf(),
  }
}

function formatToDatePicker(data) {
  if (!data.startDate && !data.endDate) return []
  return [dayjs(data.startDate).format('YYYY-MM-DD'), dayjs(data.endDate).format('YYYY-MM-DD')]
}

export function generateAgentDefaultSeoMeta(
  // TODO commTitle 备用，后面扩张
  keys: {
    title: string
    description?: string
    commTitle?: string
  },
  values?: any
) {
  const businessName = getBusinessName()
  if (!values) {
    values = { businessName }
  } else {
    values.businessName = businessName
  }
  return {
    title: keys.title,
    description: t({
      id: keys?.description || `helper_agent_index_gr1uz7jkp0`,
      values,
    }),
  }
}

export {
  formatDateOptions,
  dateOptionsToApiParams,
  formatInfoBoxData,
  formatQueryRebateToApi,
  formatTotalIncomesChartData,
  formatIncomeAnalysisChartData,
  formatIncomesPieChartData,
  extractRatesFromApiData,
  formatDatePickerData,
  formatToDatePicker,
}
