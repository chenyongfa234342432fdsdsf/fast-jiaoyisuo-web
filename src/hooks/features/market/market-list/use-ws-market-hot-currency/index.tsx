import { getHotCurrencies, getV1PerpetualTradePairHotApiRequest } from '@/apis/market/market-list'
import { mergeTradePairWithSymbolInfo } from '@/helper/market/market-list'
import { TradePairWithCoinInfoType } from '@/typings/api/market/market-list'
import { useEffect } from 'react'
import { useSafeState } from 'ahooks'
import {
  useWsFuturesMarketTradePairSlow,
  useWsSpotMarketTradePairSlow,
} from '@/hooks/features/market/common/market-ws/use-ws-market-trade-pair'
import { YapiGetV1PerpetualTradePairHotListData } from '@/typings/yapi/PerpetualTradePairHotV1GetApi'
import { YapiGetV1TradePairHotListData } from '@/typings/yapi/TradePairHotV1GetApi'
import useApiAllCoinSymbolInfo from '../../common/use-api-all-coin-symbol-info/index'

export function useWsHotCurrencySpotHomePage() {
  const [apiData, setApiData] = useSafeState<TradePairWithCoinInfoType[]>([])
  const allCoinSymbolInfo = useApiAllCoinSymbolInfo()

  useEffect(() => {
    getHotCurrencies({}).then(hotCurrenciesResp => {
      const mergedList = mergeTradePairWithSymbolInfo(hotCurrenciesResp.data?.list || [], allCoinSymbolInfo)
      setApiData(mergedList)
    })
  }, [allCoinSymbolInfo])

  return useWsSpotMarketTradePairSlow({ apiData })
  // return apiData
}

export function useWsHotCurrencySpot() {
  const [apiData, setApiData] = useSafeState<YapiGetV1TradePairHotListData[]>([])

  useEffect(() => {
    getHotCurrencies({}).then(hotCurrenciesResp => {
      setApiData(hotCurrenciesResp.data?.list || [])
    })
  }, [])

  return useWsSpotMarketTradePairSlow({ apiData })
  // return apiData
}

export function useWsHotCurrencyFutures() {
  const [apiData, setApiData] = useSafeState<YapiGetV1PerpetualTradePairHotListData[]>([])

  useEffect(() => {
    getV1PerpetualTradePairHotApiRequest({}).then(hotCurrenciesResp => {
      setApiData(hotCurrenciesResp.data?.list || [])
    })
  }, [])

  return useWsFuturesMarketTradePairSlow({ apiData })
  // return apiData
}
