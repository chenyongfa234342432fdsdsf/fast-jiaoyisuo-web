import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { YapiPostV1AgentInviteDetailsAnalysisData } from '@/typings/yapi/AgentInviteDetailsAnalysisV1PostApi'
import { YapiPostV1AgentInviteHistoryListMembersData } from '@/typings/yapi/AgentInviteHistoryV1PostApi'
import { isEmpty, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { getCodeDetailList } from '@/apis/common'
import { useCommonStore } from '@/store/common'
import { PaginationProps } from '@nbit/arco'
import { apiAgentInviteTableCheckMoreHandler } from '@/helper/agent/invite'
import { YapiPostV1AgentInviteHistoryApiRequestReal } from '@/typings/api/agent/invite'
import { useUpdateEffect } from 'react-use'
import { useMount } from 'ahooks'
import { isFalsyExcludeZero } from '@/helper/common'

export function useAgentInviteInfoOverviewInit() {}

export function useAgentInviteInfoList() {}

export function useAgentInviteSearching() {}

export function useAgentInviteAnalysis() {
  const store = useAgentInviteStore()
  const [apiData, setApiData] = useState<YapiPostV1AgentInviteDetailsAnalysisData>()

  const apiRequest = (resolve, reject) => {
    store.apis
      .inviteDetailsAnalysisApi({
        ...(store.chartFilterSetting as any),
      })
      .then(res => {
        if (res.isOk) {
          const data = res.data
          // store.resetEditingFilterSetting()
          return resolve(data)
        }
        return reject()
      })
  }

  // const { refreshCallback: refresh, apiStatus } = useReqeustMarketHelper({
  //   apiRequest,
  //   setApiData,
  //   deps: [store.chartFilterSetting.startDate, store.chartFilterSetting.endDate],
  // })

  // return { apiData, setApiData, refresh, apiStatus }
}

export function useAgentInviteTableCheckMore() {
  const store = useAgentInviteStore()
  const state = store.filterSettingCheckMore
  const defualtPageConfig = store.helper.getCheckMoreDefaultPage()
  const [page, setPage] = useState<PaginationProps>(defualtPageConfig)
  const [dataList, setDataList] = useState<YapiPostV1AgentInviteHistoryListMembersData[]>([])
  const [isLoading, setIsLoading] = useState<null | boolean>(null)

  useUpdateEffect(() => {
    setPage(defualtPageConfig)
    setDataList([])
  }, [store.filterSettingCheckMore])

  useUpdateEffect(() => {
    setDataList([])
  }, [page.pageSize])

  useEffect(() => {
    let requestData: YapiPostV1AgentInviteHistoryApiRequestReal = omitBy(
      {
        ...store.filterSettingCheckMore,
        forceUpdate: '',
      },
      x => !x
    )

    if (isEmpty(requestData)) return

    requestData = {
      ...requestData,
      page: page.current,
      pageSize: page.pageSize,
    }

    apiAgentInviteTableCheckMoreHandler({ setIsLoading, setDataList, setPage, requestData })
  }, [
    state.levelLimit,
    // state.puid,
    state.spotMin,
    state.spotMax,
    state.contractMin,
    state.contractMax,
    state.borrowCoinMin,
    state.borrowCoinMax,
    state.targetUid,
    state.forceUpdate,
    page.current,
    page.pageSize,
  ])

  return { apiData: dataList, setApiData: setDataList, page, setPage, isLoading }
}

export function useGetContractStatusCode() {
  const { locale } = useCommonStore()
  const { setContractStatusCode } = useAgentInviteStore()

  useEffect(() => {
    getCodeDetailList({ lanType: locale, codeVal: 'contract_status_cd' }).then(res => {
      const codeMap = res.data?.reduce((prev, curr) => {
        prev[curr.codeVal] = curr.codeKey
        return prev
      }, {})
      setContractStatusCode(codeMap)
    })
  }, [])
}

export function useAgentProductLine() {
  const store = useAgentInviteStore()
  useMount(() => {
    if (isEmpty(store.cache.productLineEnabledState)) {
      store.fetchProductLines()
    }
  })
  const productLine = store.cache.productLineEnabledState
  const hasSpot = !isFalsyExcludeZero(productLine.spot)
  const hasContract = !isFalsyExcludeZero(productLine.contract)
  const hasBorrow = !isFalsyExcludeZero(productLine.borrowCoin)

  return { hasSpot, hasBorrow, hasContract }
}

export function useAgentProductLineWithFee() {
  const store = useAgentInviteStore()
  useMount(() => {
    if (isEmpty(store.cache.productLineEnabledStateWithFee)) {
      store.fetchProductLinesWithFee()
    }
  })
  const productLine = store.cache.productLineEnabledStateWithFee
  const hasSpot = !isFalsyExcludeZero(productLine.spot)
  const hasContract = !isFalsyExcludeZero(productLine.contract)
  const hasBorrow = !isFalsyExcludeZero(productLine.borrowCoin)

  return { hasSpot, hasBorrow, hasContract }
}
