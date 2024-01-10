import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useUnmount } from 'react-use'
import { useSafeState, useSize } from 'ahooks'
import {
  OrderBookButtonTypeEnum,
  MergeDepthDefaultTypeEnum,
  getGearNumbers,
  OrderBookContractMarkPriceSubs,
  EntrustType,
  DepthDataObject,
} from '@/store/order-book/common'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { useOrderFutureStore } from '@/store/order/future'
import { IBaseOrderItem, IFutureOrderItem } from '@/typings/api/order'
import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { useOrderBookStore } from '@/store/order-book'
import { TradeModeEnum } from '@/constants/trade'
import TradeOrderBookHeader from '@/features/order-book/common/header'
import TradeOrderBookTableHeader from '@/features/order-book/common/table-header'
import TradeOrderBookTicker from '@/features/order-book/common/ticker'
import TradeOrderBookBuyContainer from '@/features/order-book/common/container/buy-container'
import TradeOrderBookSellContainer from '@/features/order-book/common/container/sell-container'
import { getFutureOrderIsBuy } from '@/helper/order/future'
import styles from '@/features/order-book/common/index.module.css'

interface OrderBookProps {
  /**
   * price 价格
   * total 合计
   * direction 方向 (买或者卖)
   * amount 数量
   */
  onSelectPrice: (price: string, total: string, direction: number, amount: string) => void
  width?: number | string
  tradeMode: string
}

const contentMargin = 32 // 盘口容器边距

function TradeOrderBook({ onSelectPrice, width, tradeMode }: OrderBookProps) {
  const [mergeDepth, setMergeDepth] = useState<string>(MergeDepthDefaultTypeEnum.doubleDigits)
  const [mode, setMode] = useState<number>(OrderBookButtonTypeEnum.primary)
  const [quantity, setQuantity] = useState<number>(0)
  const [entrust, setEntrust] = useSafeState<EntrustType>()

  const contentRef = useRef<HTMLDivElement>(null)
  const contentWidth = useRef<number>(0)
  const currencyPair = useRef<string>('')

  const size = useSize(contentRef)

  const spotStore = useMarketStore()
  const contractStrore = useContractMarketStore()
  const orderBookStore = useOrderBookStore()
  const { openOrderModule: spotOpenOrderModule } = useBaseOrderSpotStore()
  const { openOrderModule: contractOpenOrderModule } = useOrderFutureStore()

  const {
    wsDepthSubscribe,
    wsDepthUnSubscribe,
    wsMarketSubscribe,
    wsMarketUnSubscribe,
    wsMarkPriceSubscribe,
    wsMarkPriceUnSubscribe,
    setSymbolWassName,
    setWsDepthConfig,
    setWsMarketConfig,
    resetDepthAndMarketData,
    subscriptionModel,
  } = orderBookStore

  const store = tradeMode === TradeModeEnum.spot ? spotStore : contractStrore
  const openOrderModule = tradeMode === TradeModeEnum.spot ? spotOpenOrderModule : contractOpenOrderModule

  const {
    symbolWassName,
    priceOffset,
    amountOffset,
    depthOffset,
    baseSymbolName,
    quoteSymbolName,
    id: tradeId,
  } = store.currentCoin

  useEffect(() => {
    setWsDepthConfig({
      mergeDepth,
      priceOffset,
      amountOffset,
      contentWidth: contentWidth.current,
      entrust,
      quantity,
      fiatOffest: 0,
    })
  }, [mergeDepth, entrust, contentWidth.current, amountOffset, priceOffset, quantity])

  useEffect(() => {
    setWsMarketConfig({
      quoteSymbolName,
      oldPrice: '',
    })
  }, [quoteSymbolName])

  useEffect(() => {
    const entrustList = [...(openOrderModule.normal.data as Array<IBaseOrderItem & IFutureOrderItem>)]
    const buyEntrustPrice: Array<number> = []
    const sellEntrustPrice: Array<number> = []

    entrustList?.forEach(v => {
      /** 现货订单判断 */
      v.side === OrderBookButtonTypeEnum.buy && buyEntrustPrice.push(Number(v.entrustPrice))
      v.side === OrderBookButtonTypeEnum.sell && sellEntrustPrice.push(Number(v.entrustPrice))

      /** 合约订单判断 */
      if (v.sideInd) {
        const isBuy = getFutureOrderIsBuy(v.sideInd)
        isBuy ? buyEntrustPrice.push(Number(v.price)) : sellEntrustPrice.push(Number(v.price))
      }
    })
    setEntrust({ buyEntrustPrice, sellEntrustPrice })
  }, [openOrderModule.normal.data])

  useEffect(() => {
    /** 通过交易模式获取对应的 ws 配置项 */
    const { depthSubs, marketSubs } = subscriptionModel(tradeMode)

    if (symbolWassName) {
      resetDepthAndMarketData()
      setMergeDepth(
        depthOffset && depthOffset.length > 0
          ? depthOffset[depthOffset.length - 1]
          : MergeDepthDefaultTypeEnum.doubleDigits
      )
      currencyPair.current && wsDepthUnSubscribe(depthSubs(currencyPair.current))
      currencyPair.current && wsMarketUnSubscribe(marketSubs(currencyPair.current))

      if (tradeMode === TradeModeEnum.futures) {
        currencyPair.current && wsMarkPriceUnSubscribe(OrderBookContractMarkPriceSubs(currencyPair.current))
      }

      currencyPair.current = symbolWassName
      setSymbolWassName(symbolWassName)
      wsDepthSubscribe(depthSubs(symbolWassName))
      wsMarketSubscribe(marketSubs(symbolWassName))

      if (tradeMode === TradeModeEnum.futures) {
        wsMarkPriceSubscribe(OrderBookContractMarkPriceSubs(symbolWassName))
      }
    }
  }, [symbolWassName])

  useUnmount(() => {
    const { depthSubs, marketSubs } = subscriptionModel(tradeMode)

    wsDepthUnSubscribe(depthSubs(symbolWassName as string))
    wsMarketUnSubscribe(marketSubs(symbolWassName as string))

    if (tradeMode === TradeModeEnum.futures) {
      wsMarkPriceUnSubscribe(OrderBookContractMarkPriceSubs(symbolWassName as string))
    }

    DepthDataObject.destroyInstance()
  })

  useLayoutEffect(() => {
    contentWidth.current = (contentRef.current?.offsetWidth as number) - contentMargin
  }, [])

  const handleSelectPrice = (price: string, total: string, direction: number, amount: string) => {
    onSelectPrice(price, total, direction, amount)
  }

  useEffect(() => {
    if (size?.height) {
      setQuantity(getGearNumbers(size?.height as number, mode))
    }
  }, [size?.height, mode])

  return (
    <section className={`trade-order-book ${styles.scoped}`} ref={contentRef} style={{ width }}>
      <TradeOrderBookHeader
        mode={mode}
        checkeStatus={setMode}
        mergeDepth={mergeDepth}
        onMergeDepth={setMergeDepth}
        depthOffset={depthOffset || [MergeDepthDefaultTypeEnum.doubleDigits]}
      />

      <TradeOrderBookTableHeader
        targetCoin={baseSymbolName}
        denominatedCurrency={quoteSymbolName}
        tradeMode={tradeMode}
      />

      <div className="trade-order-book-main">
        {(mode === OrderBookButtonTypeEnum.primary || mode === OrderBookButtonTypeEnum.sell) && (
          <TradeOrderBookSellContainer
            quantity={quantity}
            targetCoin={baseSymbolName as string}
            denominatedCurrency={quoteSymbolName as string}
            onSelectPrice={handleSelectPrice}
            contentWidth={contentWidth.current}
            tradeMode={tradeMode}
          />
        )}

        <TradeOrderBookTicker
          symbolWassName={symbolWassName as string}
          hasRoundingSymbol={tradeMode === TradeModeEnum.spot}
          tradeMode={tradeMode}
          tradeId={tradeId}
        />

        {(mode === OrderBookButtonTypeEnum.primary || mode === OrderBookButtonTypeEnum.buy) && (
          <TradeOrderBookBuyContainer
            quantity={quantity}
            targetCoin={baseSymbolName as string}
            denominatedCurrency={quoteSymbolName as string}
            onSelectPrice={handleSelectPrice}
            contentWidth={contentWidth.current}
            tradeMode={tradeMode}
          />
        )}
      </div>
    </section>
  )
}

export default TradeOrderBook
