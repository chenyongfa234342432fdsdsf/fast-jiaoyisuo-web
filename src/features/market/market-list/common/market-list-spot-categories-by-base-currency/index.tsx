import { getCategoriesByBaseCurrency } from '@/apis/market/market-list'
import Tabs from '@/components/tabs'
import {
  MarketLisModulesEnum,
  SpotMarketBaseCurrenyEnum,
  spotMarketsBaseCurrencyFilter,
  spotMarketsCategoryFilter,
  SpotMarketSectorCategoryEnum,
} from '@/constants/market/market-list'
import { useMarketListStore } from '@/store/market/market-list'
import { useSafeState } from 'ahooks'
import { omitBy, isEmpty } from 'lodash'
import { useEffect } from 'react'
import { SelectUIOptionType } from '@/typings/api/market/market-list'

export function useSpotMarketCategoryByBaseCurrency(selectedBaseCurrencyFilter) {
  const [state, setState] = useSafeState<SelectUIOptionType[]>([])

  useEffect(() => {
    const apiParams = omitBy({ buyCoinId: selectedBaseCurrencyFilter } || {}, x => !x) as any
    if (
      isEmpty(apiParams) ||
      selectedBaseCurrencyFilter === SpotMarketBaseCurrenyEnum.favorites ||
      selectedBaseCurrencyFilter === SpotMarketSectorCategoryEnum.total
    )
      return

    getCategoriesByBaseCurrency(apiParams).then(res => {
      let resolvedTabs: SelectUIOptionType[] = []

      if (res.isOk) {
        const newTabs = (res?.data?.list || []).map(x => {
          return {
            id: String(x.id),
            title: x.name,
          }
        })
        resolvedTabs = [...resolvedTabs, ...newTabs] as SelectUIOptionType[]
      }

      setState(resolvedTabs)
    })
  }, [selectedBaseCurrencyFilter])

  return state
}

export function MarketListSpotCategoriesByBaseCurrency() {
  const store = useMarketListStore().spot
  const tabList = [
    ...spotMarketsCategoryFilter(),
    ...useSpotMarketCategoryByBaseCurrency(store.selectedBaseCurrencyFilter),
  ]

  return (
    <div className="categroy-tab-bar">
      <Tabs
        mode="button"
        value={store.selectedCategroyFilter || SpotMarketSectorCategoryEnum.total}
        tabList={tabList}
        onChange={val => store.setSelectedCategroyFilter(val.id)}
        isScrollable
      />
    </div>
  )
}

export function MarketListSpotTradeCategoriesByBaseCurrency() {
  const store = useMarketListStore().spotMarketsTradeModule

  const tabList = [
    ...spotMarketsBaseCurrencyFilter(),
    ...spotMarketsCategoryFilter(),
    ...useSpotMarketCategoryByBaseCurrency(store.selectedBaseCurrencyFilter),
  ]

  return (
    <div className="categroy-tab-bar">
      <Tabs
        mode="text"
        value={store.selectedCategroyFilter || SpotMarketSectorCategoryEnum.total}
        tabList={tabList}
        onChange={val => store.setSelectedCategroyFilter(val.id)}
        isScrollable
      />
    </div>
  )
}

export function MarketListActiveSpotCategoriesByBaseCurrency() {
  const rootStore = useMarketListStore()
  const active = rootStore.activeModule
  const activeStore = rootStore[rootStore.activeModule]

  if (!activeStore || activeStore.selectedBaseCurrencyFilter === SpotMarketBaseCurrenyEnum.favorites) return null

  switch (active) {
    case MarketLisModulesEnum.spotMarkets:
      return (
        <div className="spot-base-currency-tab">
          <MarketListSpotCategoriesByBaseCurrency />
        </div>
      )
    default:
      return null
  }
}
