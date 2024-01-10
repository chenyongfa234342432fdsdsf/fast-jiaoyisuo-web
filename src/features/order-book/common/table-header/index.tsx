import { t } from '@lingui/macro'
import { TradeModeEnum } from '@/constants/trade'
import styles from './index.module.css'

function TradeOrderBookTableHeader({ targetCoin, denominatedCurrency, tradeMode }) {
  return (
    <div className={`tb-header ${styles.scoped}`}>
      <div className="price">
        <label>
          {t`Price`} {`(${denominatedCurrency})`}
        </label>
      </div>
      <div className="amount">
        <label className="flex-1">
          {t`Amount`} {`(${targetCoin})`}
        </label>
      </div>
      <div className="total">
        <label>
          {tradeMode === TradeModeEnum.spot
            ? t`features_order_book_common_table_header_index_7bx3s5i3n9`
            : t`features_order_book_trade_container_index_2738`}{' '}
          {tradeMode === TradeModeEnum.futures ? `(${targetCoin})` : ''}
        </label>
      </div>
    </div>
  )
}

export default TradeOrderBookTableHeader
