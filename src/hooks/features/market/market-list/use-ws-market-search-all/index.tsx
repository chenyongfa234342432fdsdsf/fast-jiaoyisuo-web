import { getTradePairListBySearch } from '@/apis/market/market-list'
import { ApiStatusEnum } from '@/constants/market/market-list'
import { calMarketCap } from '@/helper/market/market-list'
import { YapiGetV1TradePairSearchDataReal } from '@/typings/api/market/market-list'
import { YapiGetV1TradePairSearchApiRequest } from '@/typings/yapi/TradePairSearchV1GetApi'
import { useSafeState, useUpdateEffect } from 'ahooks'
import { useEffect, useState } from 'react'
import {
  useWsFuturesMarketTradePairFullAmount,
  useWsSpotMarketTradePairFullAmount,
} from '../../common/market-ws/use-ws-market-trade-pair-full-amount'

export default function ({ apiParams }: { apiParams: YapiGetV1TradePairSearchApiRequest }) {
  const [apiData, setApiData] = useSafeState<YapiGetV1TradePairSearchDataReal>({})
  const [resolvedData, setResolvedData] = useSafeState<YapiGetV1TradePairSearchDataReal>({})
  const [apiStatus, setApiStatus] = useState(ApiStatusEnum.default)
  const wsSpotData = useWsSpotMarketTradePairFullAmount({ apiData: apiData?.spot })
  const wsFuturesData = useWsFuturesMarketTradePairFullAmount({ apiData: apiData?.perpetual })

  useEffect(() => {
    if (!apiParams.symbolName) return

    setApiStatus(ApiStatusEnum.fetching)
    getTradePairListBySearch(apiParams)
      .then(res => {
        const spotRaw = res.data?.spot || []
        const resolvedSpot = spotRaw.map(item => {
          const newItem = {
            ...item,
            calMarketCap: calMarketCap(item),
          }
          return newItem
        })
        const resolvedFutures = res.data?.perpetual || []
        setApiStatus(ApiStatusEnum.succeed)
        setApiData({
          spot: resolvedSpot,
          perpetual: resolvedFutures,
        })
      })
      .catch(() => {
        setApiStatus(ApiStatusEnum.failed)
      })
  }, [apiParams.symbolName])

  useUpdateEffect(() => {
    setResolvedData({
      spot: wsSpotData,
      perpetual: wsFuturesData,
    })
  }, [wsSpotData, wsFuturesData])

  // return [toMarketListGlobalSearchWithAllType(resolvedData) || {}, setApiData]
  return { data: resolvedData || {}, setData: setApiData, apiStatus }
}
