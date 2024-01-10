import { useMarketListStore } from '@/store/market/market-list'
import NoDataImage from '@/components/no-data-image'
import MarketListCommonTableContentTradeArea from '@/features/market/market-list/common/market-list-trade-pair-common-table-content-trade-area'
import {
  useWsMarketSpotUserFavListFullAmount,
  useWsMarketFuturesUserFavListFullAmount,
} from '@/hooks/features/market/market-list/use-ws-market-spot-user-favourite-list'
import useWsMarketTradePairList, {
  useWsMarketFuturesTradePair,
} from '@/hooks/features/market/market-list/use-ws-market-trade-pair-list'
import { isEmpty } from 'lodash'

export function MarketSpotTradeSearchDefaultTableContent({ ...rest }) {
  const state = useMarketListStore().spotMarketsTradeModule
  const { data, setData, apiStatus } = useWsMarketTradePairList({
    apiParams: { buyCoinId: state.selectedBaseCurrencyFilter, conceptId: state.selectedCategroyFilter },
  })
  const props = { ...rest, setData, apiStatus, showRowTooltip: true, data }

  return <MarketListCommonTableContentTradeArea {...props} />
}

export function MarketFuturesTradeSearchDefaultTableContent({ ...rest }) {
  const state = useMarketListStore().futuresMarketsTradeModule
  const { data, setData, apiStatus } = useWsMarketFuturesTradePair({
    apiParams: { conceptId: state.selectedBaseCurrencyFilter },
  })

  const props = { ...rest, setData, apiStatus, showRowTooltip: true, data }

  return <MarketListCommonTableContentTradeArea {...props} />
}

export function MarketTradeSearchResultTableContent({ data, store, ...rest }) {
  const props = { ...rest, showRowTooltip: false, data }

  return <MarketListCommonTableContentTradeArea {...props} />
}

export function MarketSpotTradeFavoriteTableContent({ ...rest }) {
  const { resolvedData: data, setApiData: setData, isLoading } = useWsMarketSpotUserFavListFullAmount()
  const props = { ...rest, setData, showRowTooltip: true, defaultSorter: null, data }

  if (isLoading) return null
  if (!isLoading && isEmpty(data)) return <NoDataImage />

  return <MarketListCommonTableContentTradeArea {...props} />
}

export function MarketFuturesTradeFavoriteTableContent({ ...rest }) {
  const { resolvedData: data, setApiData: setData, isLoading } = useWsMarketFuturesUserFavListFullAmount()
  const props = { ...rest, setData, showRowTooltip: true, defaultSorter: null, data }

  if (isLoading) return null
  if (!isLoading && isEmpty(data)) return <NoDataImage />

  return <MarketListCommonTableContentTradeArea {...props} />
}
