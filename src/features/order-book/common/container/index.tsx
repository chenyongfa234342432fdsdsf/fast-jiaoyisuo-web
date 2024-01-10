import { useState } from 'react'
import { Popover } from '@nbit/arco'
import { t } from '@lingui/macro'
import { OrderBookDepthDataType, OrderBookButtonTypeEnum, handleOrderBookPopUpValue } from '@/store/order-book/common'
import { TradeModeEnum } from '@/constants/trade'
import { ColorBlockSettingsEnum } from '@/constants/user'
import { useUserStore } from '@/store/user'
import styles from './index.module.css'

interface OrderContainerProps {
  quantity: number
  targetCoin: string
  denominatedCurrency: string
  onSelectPrice: (price: string, total: string, direction: number, amount: string) => void
  tableDatas: OrderBookDepthDataType[]
  status: number
  width: number
  tradeMode: string
  reverse?: boolean
}

function TradeOrderBookContainer({
  quantity,
  targetCoin,
  denominatedCurrency,
  onSelectPrice,
  tableDatas,
  status,
  width,
  tradeMode,
  reverse,
}: OrderContainerProps) {
  const [hoverIndex, setHoverIndex] = useState<number>(-1)
  const { personalCenterSettings } = useUserStore()
  const { colorsBlock } = personalCenterSettings
  const list = [...tableDatas].slice(0, quantity)
  const renderList = handleOrderBookPopUpValue([...list])

  const maximumQuantity =
    renderList.length > 0
      ? Math.max(
          ...renderList.map(item =>
            Number(
              colorsBlock === ColorBlockSettingsEnum.grandTotal
                ? item.totalInitialValue !== '--'
                  ? item.totalInitialValue
                  : 0
                : item.volumeInitialValue !== '--'
                ? item.volumeInitialValue
                : 0
            )
          )
        )
      : 0

  if (reverse) renderList.reverse()

  const colorBlockWidth = (v: OrderBookDepthDataType, bodyWidth: number) => {
    const value = colorsBlock === ColorBlockSettingsEnum.grandTotal ? v.totalInitialValue : v.volumeInitialValue
    return value !== '--' && maximumQuantity ? (Number(value) / maximumQuantity) * width : bodyWidth
  }

  return (
    <div
      className={`trade-order-book-container ${
        status === OrderBookButtonTypeEnum.sell ? styles['trade-order-book-sell-container'] : ''
      }
      ${styles.scoped}`}
    >
      <div className="trade-order-book-containe-wrap">
        {renderList.map((v, index) => (
          <Popover
            className="order-book-popover"
            position="left"
            key={index}
            content={
              <div className="popover-container">
                <div className="average-price">
                  <label>{t`features_order_book_trade_container_index_2737`}</label>
                  <label>{v.popAveragePrice}</label>
                </div>
                <div className="total">
                  <label>
                    {t`features_order_book_trade_container_index_2738`} {targetCoin}
                  </label>
                  <label>{v.popVolume}</label>
                </div>
                <div className="total">
                  <label>
                    {t`features_order_book_trade_container_index_2738`} {denominatedCurrency}
                  </label>
                  <label>{v.popTurnover}</label>
                </div>
              </div>
            }
          >
            <div
              className={
                status === OrderBookButtonTypeEnum.buy
                  ? `buy ${hoverIndex !== -1 && hoverIndex > index ? 'buy-hover' : ''}`
                  : `sell ${hoverIndex !== -1 && hoverIndex < index ? 'sell-hover' : ''}`
              }
              onClick={() => onSelectPrice(v.tagPrice, v.totalInitialValue, status, v.volumeInitialValue)}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
            >
              <div className="price">
                <label>{v.tagPrice}</label>
              </div>
              <div className="amount">
                <label>{v.volume}</label>
              </div>
              <div className="total">
                <label>{tradeMode === TradeModeEnum.spot ? v.turnover : v.popVolume}</label>
              </div>
              <div className="progress" style={{ width: colorBlockWidth(v, v.bodyWidth as number) }}></div>
              {v.isEntrust && (
                <div
                  className={`entrust ${status === OrderBookButtonTypeEnum.buy ? 'buy-entrust' : 'sell-entrust'}`}
                ></div>
              )}
            </div>
          </Popover>
        ))}
      </div>
    </div>
  )
}

export default TradeOrderBookContainer
