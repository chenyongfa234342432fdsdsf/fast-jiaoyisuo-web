import { t } from '@lingui/macro'
import Tabs from '@/components/tabs'
import { MarketCoinTab } from '@/constants/market'
import { onTradePairClickRedirect, formatTradePair, getQuoteDisplayName } from '@/helper/market'
import useWsMarketSelectedHistory from '@/hooks/features/market/market-list/use-ws-market-spot-selected-history/inex'
import Icon from '@/components/icon'
import { useState } from 'react'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import classnames from 'classnames'
import HorizontalScrollBar from '@/components/horizontal-scroll-bar'
import { getActiveMarketStore } from '@/hooks/features/market/market-list/use-active-market-store'
import { MarketLisModulesEnum } from '@/constants/market/market-list'
import styles from './index.module.css'

function MarkHistoryList({ storeType }: { storeType: MarketLisModulesEnum }) {
  const tabList = [
    { title: t`features_market_market_history_select_index_2561`, id: MarketCoinTab.Kline },
    { title: t`features_market_market_history_select_index_2562`, id: MarketCoinTab.CoinDescribe },
  ]

  const marketState = getActiveMarketStore(storeType).useMarketActiveStore()

  const onTabChange = item => {
    marketState.updateCurrentMarketCoinTab(item.id)
  }

  return (
    <div className={styles.scoped}>
      <MarketQuickHistory storeType={storeType} key={storeType} />

      <div className="char-tab-wrapper">
        <Tabs
          classNames="chart-tab"
          mode="text"
          onChange={onTabChange}
          tabList={tabList}
          value={marketState.currentMarketCoinTab}
        />
      </div>
    </div>
  )
}

function MarketQuickHistory({ storeType }: { storeType: MarketLisModulesEnum }) {
  const { useMarketActiveStore, baseMarketActiveStore } = getActiveMarketStore(storeType)
  const marketState = useMarketActiveStore()

  const quickHistoryList = useWsMarketSelectedHistory({
    store: marketState,
    baseStore: baseMarketActiveStore,
  })
  const [activeQuickItem, setActiveQuickItem] = useState<YapiGetV1TradePairListData | null>(null)

  return (
    <HorizontalScrollBar withScrollbar className="history-list scrollbar-custom hide-scrollbar-on-not-active">
      {quickHistoryList?.map((item, index) => {
        return (
          <div
            className={classnames('history-item', {
              'selected-item': item.symbolWassName === marketState.currentCoin.symbolWassName,
            })}
            key={item.id}
            onMouseOver={() => setActiveQuickItem(item)}
            onFocus={() => setActiveQuickItem(item)}
            onMouseLeave={() => setActiveQuickItem(null)}
            onClick={e => {
              e.stopPropagation()
              onTradePairClickRedirect(item, {}, true)
            }}
          >
            <span className={`${activeQuickItem?.id === item.id ? 'visible' : 'invisible'} close-icon`}>
              <Icon
                name="del_input_box"
                hasTheme
                onClick={e => {
                  e.stopPropagation()
                  marketState.removeCoinSelectedHistoryList(item as any)
                  setActiveQuickItem(null)
                }}
              />
            </span>
            <span className="quote-name">
              {getQuoteDisplayName({ coin: item, spot: { hasColorContrast: true }, futures: { withSymbolType: true } })}
            </span>
            {formatTradePair(item as any).chg()}
          </div>
        )
      })}
    </HorizontalScrollBar>
  )
}

export default MarkHistoryList
