import { getV1AgentInvitationCodeQueryProductCdApiRequest } from '@/apis/agent'
import { getRebateInfoHistory, getRebateInfoHistoryDetails } from '@/apis/agent/gains'
import { getCodeDetailList } from '@/apis/common'
import { DateOptionsTypes } from '@/constants/agent'
import { DateOptionsTypesInvite } from '@/constants/agent/invite'
import {
  dateOptionsToApiParams,
  formatAgentInviteChartData,
  formatIncomeAnalysisChartData,
  formatIncomesPieChartData,
  formatInfoBoxData,
  formatTotalIncomesChartData,
} from '@/helper/agent'
import { dateOptionsToApiParamsInvite } from '@/helper/agent/invite'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { useCommonStore } from '@/store/common'
import { YapiPostV1AgentInviteDetailsAnalysisData } from '@/typings/yapi/AgentInviteDetailsAnalysisV1PostApi'
import { YapiGetV1AgtRebateInfoHistoryOverviewData } from '@/typings/yapi/AgtRebateInfoHistoryOverviewV1GetApi'
import { useEffect, useState } from 'react'

function useRebateInfoDetails(DateOptions: DateOptionsTypes) {
  const [totalIncomes, settotalIncomes] = useState<ReturnType<typeof formatTotalIncomesChartData>>([])
  const [incomesAnalysis, setincomesAnalysis] = useState<ReturnType<typeof formatIncomeAnalysisChartData>>([])
  const [incomeRates, setincomeRates] = useState<ReturnType<typeof formatIncomesPieChartData>>([])
  const [incomes, setincomes] = useState<ReturnType<typeof formatInfoBoxData>>()
  const [totalIncome, settotalIncome] = useState<number | undefined>()
  const { productCodeMap, chartFilterSetting, setRebateCurrency } = useAgentStatsStore()

  useEffect(() => {
    const params = dateOptionsToApiParams(DateOptions)
    Promise.all([getRebateInfoHistoryDetails(params), getV1AgentInvitationCodeQueryProductCdApiRequest({})]).then(
      res => {
        const rebateRes = res[0]
        const productResMap = (res[1].data?.scaleList as any).map(scale => scale.productCd)

        const totalIncomesChart = rebateRes.data?.totalIncomeList
          ? formatTotalIncomesChartData(rebateRes.data.totalIncomeList, params.startDate, params.endDate)
          : []
        const incomesAnalysisChart = rebateRes.data?.incomesAnalysis
          ? formatIncomeAnalysisChartData(rebateRes.data.incomesAnalysis, params.startDate, params.endDate)
          : []
        const formattedInfoBarData = rebateRes.data?.incomes ? formatInfoBoxData(rebateRes.data.incomes) : {}
        settotalIncomes(totalIncomesChart)
        setincomesAnalysis(incomesAnalysisChart.filter(each => productResMap.includes(each.productCd)))
        setincomes(formattedInfoBarData)
        settotalIncome(rebateRes.data?.totalIncome)
        if (rebateRes.data) {
          setincomeRates(
            formatIncomesPieChartData(rebateRes.data).filter(each => productResMap.includes(each.productCd))
          )
          setRebateCurrency(rebateRes.data.legalCur)
        }
      }
    )
  }, [productCodeMap, chartFilterSetting, DateOptions])

  return { totalIncomes, incomesAnalysis, incomeRates, incomes, totalIncome }
}

export function useInviteDetailsAnalysis(DateOptions: DateOptionsTypesInvite) {
  const [totalIncomes, settotalIncomes] = useState<ReturnType<typeof formatAgentInviteChartData>>([])
  const [incomesAnalysis, setincomesAnalysis] = useState<ReturnType<typeof formatAgentInviteChartData>>([])
  const [apiData, setapiData] = useState<YapiPostV1AgentInviteDetailsAnalysisData | undefined>()
  const store = useAgentInviteStore()

  useEffect(() => {
    const params = dateOptionsToApiParamsInvite(DateOptions)
    store.apis.inviteDetailsAnalysisApi(params).then(res => {
      const totalIncomesChart = res.data?.invitedList
        ? formatAgentInviteChartData((res.data?.invitedList || []) as any, params.startDate, params.endDate)
        : []
      const incomesAnalysisChart = res.data?.totalList
        ? formatAgentInviteChartData((res.data?.totalList || []) as any, params.startDate, params.endDate)
        : []
      settotalIncomes(totalIncomesChart)
      setincomesAnalysis(incomesAnalysisChart)
      setapiData(res.data)
    })
  }, [store.chartFilterSetting, DateOptions])

  return { totalIncomes, incomesAnalysis, apiData }
}

function useGetAgentProductCode() {
  const { locale } = useCommonStore()
  const { setProductCodeMap } = useAgentStatsStore()

  useEffect(() => {
    getCodeDetailList({ lanType: locale, codeVal: 'agent_product_cd' }).then(res => {
      const codeMap = res.data?.reduce((prev, curr) => {
        prev[curr.codeVal] = curr.codeKey
        return prev
      }, {})
      setProductCodeMap(codeMap)
    })
  }, [])
}

function useRebateInfoOverview() {
  const [rebateInfo, setrebateInfo] = useState<YapiGetV1AgtRebateInfoHistoryOverviewData>()
  useEffect(() => {
    getRebateInfoHistory({}).then(res => {
      setrebateInfo(res.data)
    })
  }, [])

  return rebateInfo
}

export { useRebateInfoDetails, useGetAgentProductCode, useRebateInfoOverview }
