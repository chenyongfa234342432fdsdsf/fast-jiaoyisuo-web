import { getAllCoinSymbolInfoList } from '@/apis/market'
import { useMount, useRequest } from 'ahooks'
import { useMarketStore } from '@/store/market'
import { cacheKeyMarketSpotAllCoinSymbolBasicInfo } from '@/helper/cache'
import { ahookRequestSWRConfig } from '@/constants/market'
import { isEmpty } from 'lodash'

/**
 * 所有币种的基本信息
 */
export default function useApiAllCoinSymbolInfo() {
  const store = useMarketStore()

  const { run } = useRequest(
    async () => {
      getAllCoinSymbolInfoList({}).then(res => {
        if (!res.isOk || !res.data?.coinList) return
        store.udpateAllCoinSymbolInfo(res.data.coinList || [])
      })
    },
    {
      manual: true,
      retryCount: 1,
      cacheKey: cacheKeyMarketSpotAllCoinSymbolBasicInfo,
      ...ahookRequestSWRConfig,
    }
  )

  useMount(() => {
    if (isEmpty(store.allCoinSymbolInfo)) {
      run()
    }
  })

  return store.allCoinSymbolInfo
}
