import TradeOrderBookContainer from '@/features/order-book/common/container'
import { OrderBookButtonTypeEnum, OrderBookBuyAndSellContainerProps } from '@/store/order-book/common'
import { useOrderBookStore } from '@/store/order-book'

function TradeOrderBookSellContainer({
  quantity,
  targetCoin,
  denominatedCurrency,
  onSelectPrice,
  contentWidth,
  tradeMode,
}: OrderBookBuyAndSellContainerProps) {
  const orderBookStore = useOrderBookStore()

  const { asksList } = orderBookStore

  return (
    <TradeOrderBookContainer
      quantity={quantity}
      targetCoin={targetCoin as string}
      denominatedCurrency={denominatedCurrency as string}
      onSelectPrice={onSelectPrice}
      tableDatas={[...asksList]}
      status={OrderBookButtonTypeEnum.sell}
      width={contentWidth}
      tradeMode={tradeMode}
      reverse
    />
  )
}

export default TradeOrderBookSellContainer
