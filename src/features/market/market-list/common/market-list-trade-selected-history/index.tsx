import Icon from '@/components/icon'
import { getQuoteDisplayName } from '@/helper/market'
import { useMarketListStore } from '@/store/market/market-list'
import { t } from '@lingui/macro'
import { useMount } from 'ahooks'

function MarketListTradeCoinSelectedHistory({ store }) {
  useMount(() => {
    store.loadFromCacheForpairSearchHistory()
  })

  const showList = store.pairSearchHistory

  if (!showList?.length) return null

  return (
    <div className="selected-coin-history-panel">
      <div className="header">
        <div className="content-title">
          {t`features_market_market_list_market_list_spot_trade_layout_coin_selected_history_index_2739`}
        </div>

        <div>
          <Icon
            name="delete"
            hasTheme
            onClick={() => {
              store.clearPairSearchHistory()
            }}
          />
        </div>
      </div>

      <div className="spot-coin-selected-list">
        {showList.map((item, index) => {
          return (
            <div
              className="item-block"
              key={index}
              onClick={() => {
                store.updatePairSearchHistory(item)
              }}
            >
              {getQuoteDisplayName({
                coin: item,
                spot: { hasColorContrast: false },
                futures: { withSymbolType: true, withSymbolTypeCss: false },
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MarketListTradeCoinSelectedHistorySpot() {
  const store = useMarketListStore().spotMarketsTradeModule
  return <MarketListTradeCoinSelectedHistory store={store} />
}

export function MarketListTradeCoinSelectedHistoryFutures() {
  const store = useMarketListStore().futuresMarketsTradeModule
  return <MarketListTradeCoinSelectedHistory store={store} />
}
