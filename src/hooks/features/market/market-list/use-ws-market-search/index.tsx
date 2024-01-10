import { ApiStatusEnum } from '@/constants/market/market-list'
import { useSafeState, useUpdateEffect } from 'ahooks'
import { useEffect, useState } from 'react'
import useApiAllMarketTradePair, {
  useApiAllMarketFuturesTradePair,
} from '@/hooks/features/market/common/use-api-all-market-trade-pair'
import {
  useWsFuturesMarketTradePairFullAmount,
  useWsSpotMarketTradePairFullAmount,
} from '../../common/market-ws/use-ws-market-trade-pair-full-amount'

export const useWsMarketSearchSpot = function ({ apiParams }: { apiParams: { symbolName: string } }) {
  const [apiData, setApiData] = useSafeState<any[]>([])
  const [resolvedData, setResolvedData] = useSafeState<any[]>([])
  const [apiStatus, setApiStatus] = useState(ApiStatusEnum.default)
  const wsData = useWsSpotMarketTradePairFullAmount({ apiData })
  const { loading, data } = useApiAllMarketTradePair()

  useEffect(() => {
    if (loading) {
      setApiStatus(ApiStatusEnum.fetching)
      return
    }
    const searchResult = data.filter(x => x.symbolName?.toLowerCase().includes(apiParams.symbolName.toLowerCase()))
    setApiData(searchResult)
    setApiStatus(ApiStatusEnum.succeed)
  }, [apiParams.symbolName, loading])

  useUpdateEffect(() => {
    setResolvedData(wsData)
  }, [wsData])

  return { data: resolvedData, setData: setApiData, apiStatus }
}

export const useWsMarketSearchFutures = function ({ apiParams }: { apiParams: { symbolName: string } }) {
  const [apiData, setApiData] = useSafeState<any[]>([])
  const [resolvedData, setResolvedData] = useSafeState<any[]>([])
  const [apiStatus, setApiStatus] = useState(ApiStatusEnum.default)
  const wsData = useWsFuturesMarketTradePairFullAmount({ apiData })
  const { loading, data } = useApiAllMarketFuturesTradePair()

  useEffect(() => {
    if (loading) {
      setApiStatus(ApiStatusEnum.fetching)
      return
    }
    const searchResult = data.filter(x => x.symbolName?.toLowerCase().includes(apiParams.symbolName.toLowerCase()))
    setApiData(searchResult)
    setApiStatus(ApiStatusEnum.succeed)
  }, [apiParams.symbolName, loading])

  useUpdateEffect(() => {
    setResolvedData(wsData)
  }, [wsData])

  return { data: resolvedData, setData: setApiData, apiStatus }
}
