import TradeOrderBookContainer from '@/features/order-book/common/container'
import { OrderBookButtonTypeEnum, OrderBookBuyAndSellContainerProps } from '@/store/order-book/common'
import { useOrderBookStore } from '@/store/order-book'

function TradeOrderBookBuyContainer({
  quantity,
  targetCoin,
  denominatedCurrency,
  onSelectPrice,
  contentWidth,
  tradeMode,
}: OrderBookBuyAndSellContainerProps) {
  const orderBookStore = useOrderBookStore()

  const { bidsList } = orderBookStore

  return (
    <TradeOrderBookContainer
      quantity={quantity}
      targetCoin={targetCoin as string}
      denominatedCurrency={denominatedCurrency as string}
      onSelectPrice={onSelectPrice}
      tableDatas={[...bidsList]}
      status={OrderBookButtonTypeEnum.buy}
      width={contentWidth}
      tradeMode={tradeMode}
    />
  )
}

export default TradeOrderBookBuyContainer
