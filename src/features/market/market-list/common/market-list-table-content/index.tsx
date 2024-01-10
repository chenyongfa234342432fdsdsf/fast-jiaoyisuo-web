import { MarketLisModulesEnum, SpotMarketBaseCurrenyEnum } from '@/constants/market/market-list'
import useWsMarketTradePairList, {
  useWsMarketFuturesTradePair,
} from '@/hooks/features/market/market-list/use-ws-market-trade-pair-list'
import { useMarketListStore } from '@/store/market/market-list'
import MarketListSpotCommonTableContent from '../market-list-trade-pair-common-table-content'

// for market
export default function MarketListSpotTableContent() {
  const { spot: store } = useMarketListStore()
  const buyCoinId = store.selectedBaseCurrencyFilter
  const conceptId = store.selectedCategroyFilter

  const { data, setData, apiStatus } = useWsMarketTradePairList({ apiParams: { buyCoinId, conceptId } })

  return <MarketListSpotCommonTableContent data={data || []} setData={setData} apiStatus={apiStatus} />
}

export function MarketListFuturesTableContent() {
  const { futures: store } = useMarketListStore()
  const conceptId = store.selectedBaseCurrencyFilter
  const { data, setData, apiStatus } = useWsMarketFuturesTradePair({ apiParams: { conceptId } })

  return <MarketListSpotCommonTableContent data={data || []} setData={setData} apiStatus={apiStatus} />
}

// for trade
export function MarketListSpotTradeTableContent() {
  const { spotMarketsTradeModule: store } = useMarketListStore()
  const buyCoinId = store.selectedBaseCurrencyFilter
  const conceptId = store.selectedCategroyFilter

  const { data, setData, apiStatus } = useWsMarketTradePairList({ apiParams: { buyCoinId, conceptId } })

  return <MarketListSpotCommonTableContent data={data || []} setData={setData} apiStatus={apiStatus} />
}

// switcher
export function MarketListActiveTableContent() {
  const rootStore = useMarketListStore()
  const activeStore = rootStore[rootStore.activeModule]
  const active = rootStore.activeModule

  if (!activeStore || activeStore.selectedBaseCurrencyFilter === SpotMarketBaseCurrenyEnum.favorites) return null

  switch (active) {
    case MarketLisModulesEnum.futuresMarkets:
      return <MarketListFuturesTableContent />
    case MarketLisModulesEnum.spotMarkets:
      return <MarketListSpotTableContent />
    default:
      return null
  }
}
