import { sortBy24QuoteVolume } from '@/constants/market/market-list'
import {
  IActiveMarketBaseStoreType,
  IActiveMarketStoreType,
} from '@/hooks/features/market/market-list/use-active-market-store'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { useSafeState } from 'ahooks'
import { isEmpty, uniqBy } from 'lodash'
import { useRef, useEffect } from 'react'
import { useMount, useUpdateEffect } from 'react-use'
import ws from '@/plugins/ws'
import futuresWs from '@/plugins/ws/futures'
import { WsThrottleTimeEnum } from '@/constants/ws'
import { useWsMarketTradePairByType } from '../../common/market-ws/use-ws-market-trade-pair'

/**
 *  现货币对快捷选择栏数据流
 *  没有本地 cache 时，首次加载使用当前选择 + top 10 币对，并更新 cache 和 store
 *  有本地 cache 时，使用 当前选择 + cache

*   在快捷币对选择栏点击币对时，不改变顺序
 *  在其他页面点击币对时，将当前币对作为第一个
 */
export default function useWsMarketSelectedHistory({
  store,
  baseStore,
}: {
  store: IActiveMarketStoreType
  baseStore: IActiveMarketBaseStoreType
}) {
  const [apiData, setApiData] = useSafeState<YapiGetV1TradePairListData[]>([])
  const resolvedData = useWsMarketTradePairByType(
    store.wsSubscription,
    store.storeName === 'futures' ? futuresWs : ws,
    WsThrottleTimeEnum.Slower
  )({ apiData })
  const allTradePair = store.allTradePairs
  const hasPopulatedRef = useRef<boolean>(false)
  const hasCacheRef = useRef<boolean>(false)

  useMount(() => {
    const cache = store.getTradePairHistoryQuickSelectCache() || []
    store.updateCoinSelectedHistoryList(cache)
  })

  useEffect(() => {
    const cache = store.getTradePairHistoryQuickSelectCache()
    if (!isEmpty(cache) && cache.length > 1) hasCacheRef.current = true
    if (hasPopulatedRef.current || hasCacheRef.current) return
    if (!isEmpty(allTradePair)) hasPopulatedRef.current = true

    const selectedList = baseStore.getState().coinSelectedHistoryList
    const currentCoin = baseStore.getState().currentCoin
    store.updateCoinSelectedHistoryList(
      uniqBy([currentCoin, ...selectedList, ...sortBy24QuoteVolume(allTradePair).slice(0, 10)], x => x.id).slice(0, 10)
    )
  }, [allTradePair])

  useUpdateEffect(() => {
    setApiData(baseStore.getState().coinSelectedHistoryList)
  }, [store.coinSelectedHistoryList])

  return resolvedData
}
