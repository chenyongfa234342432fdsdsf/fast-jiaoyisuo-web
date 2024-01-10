import { getTradePairList } from '@/apis/market/market-list'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import {
  YapiGetV1FuturesTradePairListApiRequestWithPagination,
  YapiGetV1TradePairListApiRequestWithPagination,
} from '@/typings/api/market/market-list'
import { isEmpty, omitBy } from 'lodash'
import useApiAllCoinSymbolInfo from '@/hooks/features/market/common/use-api-all-coin-symbol-info'
import { YapiGetV1CoinQueryCoinPageListCoinListData } from '@/typings/yapi/CoinQueryCoinPageListV1GetApi'
import { calMarketCap, mergeTradePairWithSymbolInfo } from '@/helper/market/market-list'
import { ApiStatusEnum, SpotMarketBaseCurrenyEnum, SpotMarketSectorCategoryEnum } from '@/constants/market/market-list'
import { useMount, useSafeState, useUnmount } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import {
  YapiGetV1PerpetualTradePairListApiRequest,
  YapiGetV1PerpetualTradePairListData,
} from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import { getV1PerpetualTradePairListApiRequest } from '@/apis/market/futures'
import { useMarketStore } from '@/store/market'
import { useMarketListStore } from '@/store/market/market-list'
import {
  useWsFuturesMarketTradePairFullAmount,
  useWsSpotMarketTradePairFullAmount,
} from '../../common/market-ws/use-ws-market-trade-pair-full-amount'

/**
 * 用于行情 - 现货的币对列表
 */
export default function useWsMarketTradePair({
  apiParams,
}: {
  apiParams: YapiGetV1TradePairListApiRequestWithPagination
}) {
  const cache = useMarketListStore().cache

  const [apiData, setApiData] = useSafeState<YapiGetV1TradePairListData[]>([])
  const [apiStatus, setApiStatus] = useState(ApiStatusEnum.default)
  const resolvedData = useWsSpotMarketTradePairFullAmount({ apiData })
  const isExistRef = useRef<null | boolean>(null)

  useMount(() => {
    isExistRef.current = true
  })
  useUnmount(() => {
    isExistRef.current = false
  })

  useEffect(() => {
    if (!isExistRef.current) return

    if (
      apiParams.buyCoinId === SpotMarketBaseCurrenyEnum.favorites ||
      apiParams.buyCoinId === SpotMarketSectorCategoryEnum.total
    )
      return
    if (
      apiParams.conceptId === SpotMarketSectorCategoryEnum.total ||
      apiParams.conceptId === SpotMarketBaseCurrenyEnum.favorites
    )
      apiParams.conceptId = ''
    apiParams = omitBy(apiParams || {}, x => !x)

    // 行情模块暂时没有返回所有数据的需求
    if (isEmpty(apiParams)) return

    const key = `${apiParams.buyCoinId || ''}-${apiParams.conceptId || ''}`
    const value = cache.spotListMap[key]

    if (value) {
      setApiData(value)
      setApiStatus(ApiStatusEnum.succeed)
      return
    }

    setApiStatus(ApiStatusEnum.fetching)
    getTradePairList(apiParams)
      .then(res => {
        if (!isExistRef.current) return
        const data = res?.data?.list || []

        const resolvedSpot = data.map(item => {
          const newItem = {
            ...item,
            calMarketCap: calMarketCap(item),
          }
          return newItem
        })
        cache.setSpotListMap(key, resolvedSpot)
        setApiData(resolvedSpot)
        setApiStatus(ApiStatusEnum.succeed)
      })
      .catch(() => {
        if (!isExistRef.current) return
        setApiStatus(ApiStatusEnum.failed)
      })
  }, [apiParams.buyCoinId, apiParams.conceptId])

  return { data: resolvedData, setData: setApiData, apiStatus }
}

export function useWsMarketFuturesTradePair({ apiParams }: { apiParams: YapiGetV1PerpetualTradePairListApiRequest }) {
  const [apiData, setApiData] = useSafeState<YapiGetV1PerpetualTradePairListData[]>([])
  const resolvedData = useWsFuturesMarketTradePairFullAmount({ apiData })
  const [apiStatus, setApiStatus] = useState(ApiStatusEnum.default)
  const isExistRef = useRef<null | boolean>(null)
  const cache = useMarketListStore().cache

  useMount(() => {
    isExistRef.current = true
  })
  useUnmount(() => {
    isExistRef.current = false
  })

  useEffect(() => {
    if (!isExistRef.current) return
    if (apiParams.conceptId === SpotMarketBaseCurrenyEnum.favorites) return
    if (apiParams.conceptId === SpotMarketSectorCategoryEnum.total) apiParams.conceptId = ''
    apiParams = omitBy(apiParams || {}, x => !x)

    const key = `${apiParams.conceptId || ''}-`
    const value = cache.futuresListMap[key]

    if (value) {
      setApiData(value)
      setApiStatus(ApiStatusEnum.succeed)
      return
    }

    setApiStatus(ApiStatusEnum.fetching)
    getV1PerpetualTradePairListApiRequest(apiParams)
      .then(res => {
        if (!isExistRef.current) return
        const data = res?.data?.list || []
        cache.setFuturesListMap(key, data)
        setApiData(data)
        setApiStatus(ApiStatusEnum.succeed)
      })
      .catch(() => {
        if (!isExistRef.current) return
        setApiStatus(ApiStatusEnum.failed)
      })
  }, [apiParams.conceptId])

  return { data: resolvedData, setData: setApiData, apiStatus }
}

/**
 * 用于行情 - 板块的现货币对列表
 */
export function useWsMarketSectorTradePairListWithSymbolInfo({
  apiParams,
}: {
  apiParams: YapiGetV1TradePairListApiRequestWithPagination
}) {
  const [apiData, setApiData] = useSafeState<
    (YapiGetV1TradePairListData & YapiGetV1CoinQueryCoinPageListCoinListData)[]
  >([])
  const resolvedData = useWsSpotMarketTradePairFullAmount({ apiData })
  const symbolInfo = useApiAllCoinSymbolInfo()
  const [apiStatus, setApiStatus] = useState(ApiStatusEnum.default)
  const isExistRef = useRef<null | boolean>(null)

  useMount(() => {
    isExistRef.current = true
  })
  useUnmount(() => {
    isExistRef.current = false
  })

  apiParams = omitBy(apiParams || {}, x => !x)

  useEffect(() => {
    if (!apiParams.conceptId) {
      setApiStatus(ApiStatusEnum.succeed)
      setApiData([])
      return
    }
    setApiStatus(ApiStatusEnum.fetching)
    getTradePairList(apiParams)
      .then(res => {
        if (!isExistRef.current) return
        const apiData = mergeTradePairWithSymbolInfo((res.data?.list || []) as any, symbolInfo)
        setApiStatus(ApiStatusEnum.succeed)
        setApiData(apiData)
      })
      .catch(() => {
        setApiStatus(ApiStatusEnum.failed)
      })
  }, [apiParams.conceptId, symbolInfo])

  return { data: resolvedData, setData: setApiData, apiStatus }
}

/**
 * 用于行情 - 板块的合约币对列表
 */
export function useWsMarketSectorFuturesTradePairListWithSymbolInfo({
  apiParams,
}: {
  apiParams: YapiGetV1FuturesTradePairListApiRequestWithPagination
}) {
  const [apiData, setApiData] = useSafeState<
    (YapiGetV1TradePairListData & YapiGetV1CoinQueryCoinPageListCoinListData)[]
  >([])
  const resolvedData = useWsSpotMarketTradePairFullAmount({ apiData })
  const symbolInfo = useApiAllCoinSymbolInfo()
  const [apiStatus, setApiStatus] = useState(ApiStatusEnum.default)
  const isExistRef = useRef<null | boolean>(null)

  useMount(() => {
    isExistRef.current = true
  })
  useUnmount(() => {
    isExistRef.current = false
  })

  apiParams = omitBy(apiParams || {}, x => !x)

  useEffect(() => {
    if (!apiParams.conceptId) {
      setApiStatus(ApiStatusEnum.succeed)
      setApiData([])
      return
    }
    setApiStatus(ApiStatusEnum.fetching)
    getV1PerpetualTradePairListApiRequest(apiParams)
      .then(res => {
        if (!isExistRef.current) return
        const apiData = mergeTradePairWithSymbolInfo((res.data?.list || []) as any, symbolInfo)
        setApiStatus(ApiStatusEnum.succeed)
        setApiData(apiData)
      })
      .catch(() => {
        setApiStatus(ApiStatusEnum.failed)
      })
  }, [apiParams.conceptId, symbolInfo])

  return { data: resolvedData, setData: setApiData, apiStatus }
}
