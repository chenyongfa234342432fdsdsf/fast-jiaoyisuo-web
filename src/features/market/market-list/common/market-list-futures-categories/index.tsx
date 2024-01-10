import { getV1PerpetualTradePairConceptListApiRequest } from '@/apis/market/futures'
import Tabs from '@/components/tabs'
import { spotMarketsBaseCurrencyFilter, spotMarketsCategoryFilter } from '@/constants/market/market-list'
import { useMarketListStore } from '@/store/market/market-list'
import { SelectUIOptionType } from '@/typings/api/market/market-list'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'

export function useMarketListFuturesSectorCategories() {
  const cache = useMarketListStore().cache

  useEffect(() => {
    if (!isEmpty(cache.futuresCategories)) return
    getV1PerpetualTradePairConceptListApiRequest({}).then(res => {
      const newTabs: SelectUIOptionType[] =
        (res?.data || []).map(x => {
          return {
            id: String(x.id),
            title: x.name,
          }
        }) || []

      cache.setFuturesCategories(newTabs)
    })
  }, [])

  return cache.futuresCategories
}

export function MarketListFuturesBaseCurrencyTabCommon({ store }) {
  const tabList = [
    ...spotMarketsBaseCurrencyFilter(),
    ...spotMarketsCategoryFilter(),
    ...useMarketListFuturesSectorCategories(),
  ]

  return (
    <div className="currency-tab-bar">
      <Tabs
        mode="text"
        value={store.selectedBaseCurrencyFilter}
        tabList={tabList}
        onChange={item => store.setSelectedBaseCurrencyFilter(item.id)}
        isScrollable
      />
    </div>
  )
}

export function MarketListFuturesBaseCurrencyTab() {
  const store = useMarketListStore().futures
  return <MarketListFuturesBaseCurrencyTabCommon store={store} />
}

export function MarketListFuturesTradeBaseCurrencyTab() {
  const store = useMarketListStore().futuresMarketsTradeModule
  return <MarketListFuturesBaseCurrencyTabCommon store={store} />
}
