import { getBaseCurrencyList } from '@/apis/market/market-list'
import Tabs from '@/components/tabs'
import {
  MarketLisModulesEnum,
  SpotMarketBaseCurrenyEnum,
  spotMarketsBaseCurrencyFilter,
  SpotMarketSectorCategoryEnum,
} from '@/constants/market/market-list'
import { useMarketListStore } from '@/store/market/market-list'
import { Select } from '@nbit/arco'
import { useEffect } from 'react'
import { useSafeState } from 'ahooks'
import styles from '@/features/market/market-list/market-list-trade-spot-layout/index.module.css'
import { useMarketStore } from '@/store/market'
import { SelectUIOptionType } from '@/typings/api/market/market-list'
import { MarketListFuturesBaseCurrencyTab } from '@/features/market/market-list/common/market-list-futures-categories'

export function useMarketListSpotBaseCurrencies() {
  const [state, setState] = useSafeState<SelectUIOptionType[]>([])

  useEffect(() => {
    getBaseCurrencyList({}).then(res => {
      const newTabs: SelectUIOptionType[] =
        (res?.data?.list || []).map(x => {
          return {
            id: String(x.coinId),
            title: x.symbol,
          }
        }) || []

      setState(newTabs)
    })
  }, [])

  return state
}

export function MarketListSpotBaseCurrency() {
  const store = useMarketListStore().spot
  const tabList = [...spotMarketsBaseCurrencyFilter(), ...useMarketListSpotBaseCurrencies()]

  return (
    <div className="currency-tab-bar">
      <Tabs
        mode="text"
        value={store.selectedBaseCurrencyFilter || SpotMarketBaseCurrenyEnum.favorites}
        tabList={tabList || []}
        onChange={val => {
          store.setSelectedBaseCurrencyFilter(val.id)
          // reset category filter when filter changed
          store.setSelectedCategroyFilter(SpotMarketSectorCategoryEnum.total)
        }}
        isScrollable
      />
    </div>
  )
}

export function MarketListSpotTradeBaseCurrencyDropDown() {
  const spotStore = useMarketStore()
  const store = useMarketListStore().spotMarketsTradeModule
  const tabList = useMarketListSpotBaseCurrencies()
  const currentBaseCurrency = spotStore.currentCoin.quoteSymbolName

  // 直接选中当前币对的计价币
  useEffect(() => {
    const item = tabList.find(x => x.title === currentBaseCurrency)
    store.setSelectedBaseCurrencyFilter(item ? item.id : tabList[0]?.id || '')
  }, [tabList, currentBaseCurrency])

  return (
    <Select
      size="small"
      placeholder=""
      style={{ height: 26, fontSize: 12 }}
      value={store.selectedBaseCurrencyFilter || ''}
      onChange={value => {
        store.setSelectedBaseCurrencyFilter(value)
        store.setSelectedCategroyFilter(SpotMarketSectorCategoryEnum.total)
      }}
    >
      {tabList.map((option, index) => (
        <Select.Option key={option.id} value={option.id} className={styles['custom-font-size']}>
          {option.title}
        </Select.Option>
      ))}
    </Select>
  )
}

export function MarketListActiveBaseCurrencyTab() {
  const active = useMarketListStore().activeModule

  switch (active) {
    case MarketLisModulesEnum.futuresMarkets:
      return <MarketListFuturesBaseCurrencyTab />
    default:
      return <MarketListSpotBaseCurrency />
  }
}
