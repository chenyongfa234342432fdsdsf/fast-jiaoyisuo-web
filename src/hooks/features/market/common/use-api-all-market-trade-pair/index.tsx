import { getTradePairList } from '@/apis/market/market-list'
import { useMount, useRequest } from 'ahooks'
import { cacheKeyMarketSpotAllTradePairs } from '@/helper/cache'
import { useMarketStore } from '@/store/market'
import { ahookRequestSWRConfig } from '@/constants/market'
import { useContractMarketStore } from '@/store/market/contract'
import { getV1PerpetualTradePairListApiRequest } from '@/apis/market/futures'
import { isEmpty } from 'lodash'

/**
 * 所有币对信息
 *
 */
export default function useApiAllMarketTradePair() {
  const store = useMarketStore()

  const { loading, run } = useRequest(
    async () => {
      getTradePairList({}).then(res => {
        if (!res.isOk || !res.data?.list) return
        store.updateAllTradePairs(res.data.list || [])
      })
    },
    {
      manual: true,
      retryCount: 1,
      cacheKey: cacheKeyMarketSpotAllTradePairs,
      ...ahookRequestSWRConfig,
    }
  )

  useMount(() => {
    if (isEmpty(store.allTradePairs)) {
      run()
    }
  })

  return { loading, data: store.allTradePairs }
}

/**
 * 所有合约币对信息
 */
export function useApiAllMarketFuturesTradePair() {
  const store = useContractMarketStore()

  const { loading, run } = useRequest(
    async () => {
      getV1PerpetualTradePairListApiRequest({}).then(res => {
        if (!res.isOk || !res.data?.list) return
        store.updateAllTradePairs(res.data.list || [])
      })
    },
    {
      manual: true,
    }
  )

  useMount(() => {
    if (isEmpty(store.allTradePairs)) {
      run()
    }
  })

  return { loading, data: store.allTradePairs }
}
