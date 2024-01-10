import { getMarketSearchHotCurrencyColumns } from '@/features/market/market-list/common/market-list-trade-pair-table-schema'
import MarketTradePairCommonTable from '@/features/market/market-list/common/market-trade-pair-common-table'
import {
  useWsHotCurrencySpot,
  useWsHotCurrencyFutures,
} from '@/hooks/features/market/market-list/use-ws-market-hot-currency'
import { useMarketListStore } from '@/store/market/market-list'
import { t } from '@lingui/macro'

/** 按照后端返回来，前端不排序 */
function MarketTradeHotSearchingTableContent({ data, store }) {
  return (
    <MarketTradePairCommonTable
      columns={getMarketSearchHotCurrencyColumns()}
      data={data}
      defaultSorter={null}
      onRow={(record, index) => {
        return {
          onClick: e => {
            store.updatePairSearchHistory(record)
          },
        }
      }}
    />
  )
}

function MarketTradeHotSearchingLayout({ children }) {
  return (
    <>
      <div className="hot-search-title content-title header">
        {t`features_market_market_list_market_list_spot_trade_layout_index_2740`}
      </div>

      <div className="hot-searching-table">{children}</div>
    </>
  )
}

export function MarketSpotTradeHotSearching() {
  const data = useWsHotCurrencySpot() || []
  const store = useMarketListStore().spotMarketsTradeModule
  const props = { data, store }

  return (
    <MarketTradeHotSearchingLayout>
      <MarketTradeHotSearchingTableContent {...props} />
    </MarketTradeHotSearchingLayout>
  )
}

export function MarketFuturesTradeHotSearching() {
  const data = useWsHotCurrencyFutures() || []
  const store = useMarketListStore().futuresMarketsTradeModule
  const props = { data, store }

  return (
    <MarketTradeHotSearchingLayout>
      <MarketTradeHotSearchingTableContent {...props} />
    </MarketTradeHotSearchingLayout>
  )
}
