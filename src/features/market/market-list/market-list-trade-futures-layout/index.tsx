import { useMarketListStore } from '@/store/market/market-list'
import { SpotMarketBaseCurrenyEnum } from '@/constants/market/market-list'

import { MarketListFuturesTradeSearchResult } from '@/features/market/market-list/common/market-list-table-content-search'
import { Popover } from '@nbit/arco'
import Icon from '@/components/icon'
import { useRef, useEffect } from 'react'
import DebounceSearchBar from '@/components/debounce-search-bar'
import { t } from '@lingui/macro'
import { useFuturesFavList } from '@/hooks/features/market/favourite'
import classNames from 'classnames'
import { useContractMarketStore } from '@/store/market/contract'
import { MarketListTradeCoinSelectedHistoryFutures } from '@/features/market/market-list/common/market-list-trade-selected-history'
import { MarketFuturesTradeHotSearching } from '@/features/market/market-list/common/market-list-hot-searching'
import { MarketListFuturesTradeBaseCurrencyTab } from '@/features/market/market-list/common/market-list-futures-categories'
import {
  MarketFuturesTradeFavoriteTableContent,
  MarketFuturesTradeSearchDefaultTableContent,
} from '@/features/market/market-list/common/market-list-table-content/market-list-table-content-trade-area'
import styles from '../market-list-trade-spot-layout/index.module.css'
import futuresStyles from './index.module.css'

export function MarketFuturesTradeContent() {
  const { searchInput, isSearchInputFocused, ...store } = useMarketListStore().futuresMarketsTradeModule

  const isDefault = !isSearchInputFocused && !searchInput
  const isJustFocused = isSearchInputFocused && (!searchInput || !searchInput.trim())
  const isSearching = searchInput && searchInput.trim()

  // 初次进入的时候，判断是否在自选当中，在的话切换到自选
  // TODOs: change to store after adding extra params to fav store - leo
  const favListResp = useFuturesFavList()
  const isFavCheckedRef = useRef(false)
  const currentCoin = useContractMarketStore().currentCoin
  useEffect(() => {
    if (!currentCoin.symbolName) return
    if (isFavCheckedRef.current) return
    if (favListResp.isLoading) return
    if (favListResp.data?.find(x => x.symbolName === currentCoin.symbolName)) {
      store.setSelectedBaseCurrencyFilter(SpotMarketBaseCurrenyEnum.favorites)
    }

    isFavCheckedRef.current = true
  }, [favListResp])

  // 用于 just focused 状态时界面的判断点击事件，以免回到默认状态
  const justFocusedRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isJustFocused) return

    justFocusedRef.current?.addEventListener('mousedown', e => {
      // mousedown event 优先级高于 onBlur，停止防止搜索 onBlur event 导致 state 变化
      e.preventDefault()
    })

    return () => {
      justFocusedRef.current?.removeEventListener('mousedown', () => {})
    }
  }, [justFocusedRef, isJustFocused])

  return (
    <div className={classNames(styles.scoped, 'hide-scrollbar-on-not-active')}>
      <div className="market-list-spot-trade-search-wrapper">
        <div className="common-header search-bar sticky">
          <DebounceSearchBar
            placeholder={t`future.funding-history.search-future`}
            onChange={value => {
              store.setSearchInput(value)
            }}
            toggleFocus={value => {
              store.setIsSearchInputFocused(value)
            }}
            inputValue={searchInput}
          />
        </div>

        <Optional isRender={!!isDefault}>
          <div className="on-default">
            <div className="sticky-header sticky">
              <div className="default-nav-row">
                <div className={`${futuresStyles['futures-default-categories']}`}>
                  <MarketListFuturesTradeBaseCurrencyTab />
                </div>
              </div>
            </div>

            <div className="on-default content">
              <div className="default-content">
                {store.selectedBaseCurrencyFilter === SpotMarketBaseCurrenyEnum.favorites ? (
                  <MarketFuturesTradeFavoriteTableContent />
                ) : (
                  <MarketFuturesTradeSearchDefaultTableContent />
                )}
              </div>
            </div>
          </div>
        </Optional>

        <Optional isRender={!!isJustFocused}>
          <div className="on-focus content" ref={justFocusedRef}>
            <MarketListTradeCoinSelectedHistoryFutures />

            <div className="spot-hot-table">
              <MarketFuturesTradeHotSearching />
            </div>
          </div>
        </Optional>

        <Optional isRender={!!isSearching}>
          <div className="on-result">
            <MarketListFuturesTradeSearchResult />
          </div>
        </Optional>
      </div>
    </div>
  )
}

const Optional = function ({ children, isRender }: { children: any; isRender: boolean }) {
  return isRender ? children : null
}

export default function MarketListFuturesTradeLayout() {
  const store = useMarketListStore().futuresMarketsTradeModule
  const isVisiable = store.isSearchPopoverVisible
  const offset = store.tradeAreaLeftOffset

  return (
    <Popover
      position="bottom"
      content={<MarketFuturesTradeContent />}
      popupVisible={isVisiable}
      className={`${styles.popover}`}
      style={{
        left: `${offset}px`,
      }}
    >
      <div>
        <Icon className="icon flex items-center" name={isVisiable ? 'arrow_close' : 'arrow_open'} hasTheme />
      </div>
    </Popover>
  )
}
