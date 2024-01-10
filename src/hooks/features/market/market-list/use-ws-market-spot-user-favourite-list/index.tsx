import { YapiGetV1FavouriteListData } from '@/typings/yapi/FavouriteListV1GetApi'
import { useSafeState } from 'ahooks'
import { useEffect, useState } from 'react'
import {
  useWsFuturesMarketTradePairFullAmount,
  useWsSpotMarketTradePairFullAmount,
} from '../../common/market-ws/use-ws-market-trade-pair-full-amount'
import { useFuturesFavList, useSpotFavList } from '../../favourite'

/**
 * 加载自选数据，按照选择的顺序
 */
export function useWsMarketSpotUserFavListFullAmount() {
  const [apiData, setApiData] = useSafeState<YapiGetV1FavouriteListData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const resolvedData = useWsSpotMarketTradePairFullAmount({ apiData })

  const favList = useSpotFavList()

  useEffect(() => {
    setApiData(favList.data || [])
    setIsLoading(favList.isLoading)
  }, [favList])

  return { resolvedData, setApiData, isLoading }
}

export function useWsMarketFuturesUserFavListFullAmount() {
  const [apiData, setApiData] = useSafeState<YapiGetV1FavouriteListData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const resolvedData = useWsFuturesMarketTradePairFullAmount({ apiData })

  const favList = useFuturesFavList()

  useEffect(() => {
    setApiData(favList.data || [])
    setIsLoading(favList.isLoading)
  }, [favList])

  return { resolvedData, setApiData, isLoading }
}
