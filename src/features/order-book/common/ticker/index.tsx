import { useMemo } from 'react'
import { IconArrowDown, IconArrowUp } from '@nbit/arco/icon'
import { Popover } from '@nbit/arco'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import { usePageContext } from '@/hooks/use-page-context'
import { OrderBookButtonTypeEnum } from '@/store/order-book/common'
import { TradeModeEnum } from '@/constants/trade'
import { getFutureFundingRatePagePath } from '@/helper/route'
import { FundingHistoryTabIdEnum, FundingHistoryTypeEnum } from '@/constants/future/funding-history'
import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { useOrderBookStore } from '@/store/order-book'
import { rateFilter } from '@/helper/assets'
import { formatCurrency } from '@/helper/decimal'
import styles from './index.module.css'

interface OrderBookTickerProps {
  symbolWassName: string
  hasRoundingSymbol?: boolean
  tradeMode: string
  tradeId?: number
}

function TradeOrderBookTicker({ symbolWassName, hasRoundingSymbol, tradeMode, tradeId }: OrderBookTickerProps) {
  const pageContext = usePageContext()
  const symbolName = pageContext.routeParams.id

  const spotStore = useMarketStore()
  const contractStrore = useContractMarketStore()
  const orderBookStore = useOrderBookStore()

  const { checkStatus, marketPrice, rate, contractMarkPrice } = orderBookStore

  const store = tradeMode === TradeModeEnum.spot ? spotStore : contractStrore

  const { last, markPrice, priceOffset } = store.currentCoin

  const ratePrice =
    tradeMode === TradeModeEnum.spot
      ? rate || rateFilter({ amount: last as string, symbol: symbolWassName })
      : contractMarkPrice || formatCurrency(markPrice, priceOffset)

  const more = useMemo(() => {
    return (
      <div className="more">
        <Link href={`/order-book/${tradeMode}/${symbolName}`} target>{t`More`}</Link>
      </div>
    )
  }, [tradeMode, symbolName])

  return (
    <div className={`ticker ${styles.scoped}`}>
      <div className="price">
        <div
          className={
            checkStatus === OrderBookButtonTypeEnum.buy
              ? 'buy'
              : checkStatus === OrderBookButtonTypeEnum.sell
              ? 'sell'
              : 'primary'
          }
        >
          <label>{marketPrice || last}</label>
          {checkStatus === OrderBookButtonTypeEnum.buy && <IconArrowDown />}
          {checkStatus === OrderBookButtonTypeEnum.sell && <IconArrowUp />}
          <span></span>
        </div>
      </div>

      {tradeMode === TradeModeEnum.spot && (
        <div className="rate">
          <label>
            {hasRoundingSymbol && '≈'} {ratePrice}
          </label>
        </div>
      )}

      {tradeMode === TradeModeEnum.futures && (
        <div className="rate futures-rate">
          <Popover
            content={
              <>
                <label>{t`features_order_book_common_ticker_index_5101579`}</label>
                <Link
                  className="text-brand_color"
                  href={getFutureFundingRatePagePath({
                    type: FundingHistoryTypeEnum.index,
                    tab: FundingHistoryTabIdEnum.usdt,
                    tradeId,
                  })}
                >{t`features_announcement_bulletin_board_index_5101190`}</Link>
              </>
            }
          >
            <label>{ratePrice}</label>
          </Popover>
        </div>
      )}

      {more}
    </div>
  )
}

export default TradeOrderBookTicker
