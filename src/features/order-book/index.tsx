import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useRequest } from 'ahooks'
import { Select, Input } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import {
  DeepHandicapOptions,
  OrderBookButtonTypeEnum,
  OrderBookListLimitEnum,
  MergeDepthDefaultTypeEnum,
  DepthDataObject,
  OrderBookDepthDataType,
  handleOrderBookPopUpValue,
} from '@/store/order-book/common'
import { useOrderBookStore } from '@/store/order-book'
import { getMarketTicker, getV1PerpetualTradePairDetailApiRequest } from '@/apis/market'
import { TradeModeEnum } from '@/constants/trade'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { YapiGetV1TradePairDetailData } from '@/typings/yapi/TradePairDetailV1GetApi'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import { YapiGetV1PerpetualTradePairDetailData } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'
import Icon from '@/components/icon'
import useApiAllMarketTradePair, {
  useApiAllMarketFuturesTradePair,
} from '@/hooks/features/market/common/use-api-all-market-trade-pair'
import { ColorBlockSettingsEnum } from '@/constants/user'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { useUserStore } from '@/store/user'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import styles from './index.module.css'

const Option = Select.Option

enum BackTradePageEnum {
  trade = '/trade/', // 现货
  futures = '/futures/', // 合约
  margin = '/margin/', // 杠杆
}

function OrderBookContentCell({ type, cellData, index, width, maximumQuantity, colorsBlock }) {
  const pageContext = usePageContext()

  const tradeMode = useMemo(() => {
    return pageContext.routeParams.tradeMode
  }, [pageContext.routeParams.tradeMode])

  const colorBlockWidth = (v: OrderBookDepthDataType, bodyWidth: number) => {
    const value = colorsBlock === ColorBlockSettingsEnum.grandTotal ? v.totalInitialValue : v.volumeInitialValue
    return value !== '--' && maximumQuantity ? (Number(value) / maximumQuantity) * width : bodyWidth
  }
  return (
    <div className="cell" key={index}>
      <div className="cell-wrap">
        <div className="buy-and-sell">
          <label>
            {type === OrderBookButtonTypeEnum.buy
              ? t`features_order_book_index_h83c4guoknauc6jeqr29u`
              : t`features_order_book_index_hgs2x32qx2qwpljb0ss4x`}{' '}
            {index + 1}
          </label>
        </div>
        <div className="price">
          <label>{cellData.tagPrice}</label>
        </div>
        <div className="amount">
          <label>{cellData.volume}</label>
        </div>
        <div className="turnover">
          <label>{tradeMode === TradeModeEnum.spot ? cellData.turnover : cellData.turnoverInitialValue}</label>
        </div>
        <div className="grand-total">
          <label>{cellData.popVolume}</label>
        </div>
      </div>
      <div className="progress" style={{ width: colorBlockWidth(cellData, cellData.bodyWidth) }}></div>
    </div>
  )
}

function OrderBookContent({ targetCoin, denominatedCurrency, deepHandicap, type, title, tableDatas, width }) {
  const { personalCenterSettings } = useUserStore()
  const { colorsBlock } = personalCenterSettings
  const list =
    tableDatas && tableDatas.length < deepHandicap
      ? tableDatas.slice(0, tableDatas.length)
      : tableDatas.slice(0, deepHandicap || OrderBookListLimitEnum.twenty)

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

  const Header = useMemo(() => {
    return (
      <div className="header">
        <div className="header-title">
          <label>{title}</label>
        </div>
        <div className="table-header">
          <div className="buy-and-sell">
            <label>{t`features_order_book_index_2702`}</label>
          </div>
          <div className="price">
            <label>
              {t`Price`} {`(${denominatedCurrency})`}
            </label>
          </div>
          <div className="amount">
            <label>
              {t`Amount`} {`(${targetCoin})`}
            </label>
          </div>
          <div className="turnover">
            <label>
              {t`features_order_book_common_table_header_index_7bx3s5i3n9`} {`(${denominatedCurrency})`}
            </label>
          </div>
          <div className="grand-total">
            <label>
              {t`features_order_book_trade_container_index_2738`} {`(${targetCoin})`}
            </label>
          </div>
        </div>
      </div>
    )
  }, [title, denominatedCurrency, targetCoin])

  return (
    <>
      {Header}

      <div className="container">
        <div className="container-wrap">
          {renderList.length > 0 && (
            <>
              {renderList.map((value, index) => (
                <OrderBookContentCell
                  key={index}
                  type={type}
                  cellData={value}
                  index={index}
                  width={width}
                  maximumQuantity={maximumQuantity}
                  colorsBlock={colorsBlock}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}

function OrderBookBuyContent({ targetCoin, denominatedCurrency, deepHandicap, width }) {
  const orderBookStore = useOrderBookStore()

  const { bidsList } = orderBookStore
  return (
    <OrderBookContent
      targetCoin={targetCoin}
      denominatedCurrency={denominatedCurrency}
      tableDatas={bidsList}
      type={OrderBookButtonTypeEnum.buy}
      deepHandicap={deepHandicap}
      title={t`BuyOrder`}
      width={width}
    />
  )
}

function OrderBookSellContent({ targetCoin, denominatedCurrency, deepHandicap, width }) {
  const orderBookStore = useOrderBookStore()

  const { asksList } = orderBookStore
  return (
    <OrderBookContent
      targetCoin={targetCoin}
      denominatedCurrency={denominatedCurrency}
      tableDatas={asksList}
      type={OrderBookButtonTypeEnum.sell}
      deepHandicap={deepHandicap}
      title={t`SellOrder`}
      width={width}
    />
  )
}

function OrderBook() {
  const [searchList, setSearchList] = useState<Array<YapiGetV1TradePairListData | YapiGetV1PerpetualTradePairListData>>(
    []
  )
  const [searchValue, setSearchValue] = useState<string>('')
  const [isSelect, setIsSelect] = useState<boolean>(false)
  const [currencyDepthOffset, setCurrencyDepthOffset] = useState<Array<string>>()
  const [mergeDepth, setMergeDepth] = useState<string>(MergeDepthDefaultTypeEnum.doubleDigits)
  const [deepHandicap, setDeepHandicap] = useState<number>(15)

  const cacheList = useRef<Array<YapiGetV1TradePairListData | YapiGetV1PerpetualTradePairListData>>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const contentWidth = useRef<number>(0)
  const currencyPair = useRef<string>('')
  const currencyDetail = useRef<YapiGetV1TradePairDetailData | YapiGetV1PerpetualTradePairDetailData>()
  const spotAllTradePairs = useApiAllMarketTradePair().data
  const contractAllTradePairs = useApiAllMarketFuturesTradePair().data

  const pageContext = usePageContext()
  const symbolName = pageContext.routeParams.id
  const tradeMode = pageContext.routeParams.tradeMode

  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    futuresCurrencySettings: { offset: fiatOffest },
  } = assetsFuturesStore

  const allTradePairs = tradeMode === TradeModeEnum.spot ? spotAllTradePairs : contractAllTradePairs

  const orderBookStore = useOrderBookStore()
  const {
    wsDepthSubscribe,
    wsDepthUnSubscribe,
    setSymbolWassName,
    setWsDepthConfig,
    resetDepthAndMarketData,
    subscriptionModel,
  } = orderBookStore

  const handleDetailList = (data: YapiGetV1TradePairDetailData | YapiGetV1PerpetualTradePairDetailData) => {
    const { depthSubs } = subscriptionModel(tradeMode)
    const depthOffset = [...(data?.depthOffset as Array<string>)]

    currencyDetail.current = data
    setCurrencyDepthOffset([...depthOffset].reverse() || [MergeDepthDefaultTypeEnum.doubleDigits])
    setMergeDepth(
      depthOffset && depthOffset.length > 0
        ? depthOffset[depthOffset.length - 1]
        : MergeDepthDefaultTypeEnum.doubleDigits
    )
    currencyPair.current = data?.symbolWassName as string
    setSymbolWassName(data?.symbolWassName as string)
    wsDepthSubscribe(depthSubs(data?.symbolWassName as string))
  }

  const getSymbolWassName = async (value: string) => {
    if (!value) return
    const { depthSubs } = subscriptionModel(tradeMode)
    currencyPair.current && wsDepthUnSubscribe(depthSubs(currencyPair.current))
    resetDepthAndMarketData()

    switch (tradeMode) {
      case TradeModeEnum.spot:
        const spotRes = await getMarketTicker({ symbol: value })
        if (spotRes.isOk) {
          handleDetailList(spotRes.data as YapiGetV1TradePairDetailData)
        }
        break
      case TradeModeEnum.futures:
        const contractRes = await getV1PerpetualTradePairDetailApiRequest({ symbol: value })
        if (contractRes.isOk) {
          handleDetailList(contractRes.data as YapiGetV1PerpetualTradePairDetailData)
        }
        break
      default:
        break
    }
  }

  const { run, loading } = useRequest(getSymbolWassName, {
    manual: true,
  })

  useEffect(() => {
    setSearchList(allTradePairs)
    cacheList.current = allTradePairs.slice()
  }, [allTradePairs])

  useEffect(() => {
    setWsDepthConfig({
      mergeDepth,
      priceOffset: currencyDetail.current?.priceOffset,
      amountOffset: currencyDetail.current?.amountOffset,
      contentWidth: contentWidth.current,
      fiatOffest,
    })
  }, [mergeDepth, contentWidth.current, currencyDetail.current, fiatOffest])

  useMount(() => {
    run(symbolName)
  })

  useUnmount(() => {
    const { depthSubs } = subscriptionModel(tradeMode)
    wsDepthUnSubscribe(depthSubs(currencyPair.current))
    DepthDataObject.destroyInstance()
  })

  useLayoutEffect(() => {
    contentWidth.current = contentRef.current?.offsetWidth as number
  }, [])

  const handleSearchValueChange = (value: string) => {
    if (!value) {
      setSearchValue(value)
      setSearchList(cacheList.current)
      return
    }
    const symbolValue = value.toLocaleLowerCase().trim()
    const list: YapiGetV1TradePairListData[] = []

    setSearchValue(String(value).trim())

    cacheList.current.forEach(v => {
      const symbolText = `${v.baseSymbolName}/${v.quoteSymbolName}`.toLocaleLowerCase()
      if (symbolText.includes(symbolValue)) list.push(v as YapiGetV1TradePairListData)
    })

    setSearchList(list)
  }

  const resetSearchContent = () => {
    setSearchValue('')
    setSearchList(cacheList.current)
  }

  return (
    <section className={`order-book ${styles.scoped}`}>
      <div className="order-book-wrap">
        <div className="order-book-container">
          <div className="order-book-container-wrap">
            <div className="title">
              <div className="text">
                <label>{t`OrderBook`}</label>
              </div>
              <div className="currency">
                <Select
                  value={`${currencyDetail.current?.symbolName}`}
                  bordered={false}
                  triggerProps={{
                    autoAlignPopupWidth: false,
                    autoAlignPopupMinWidth: true,
                    position: 'bl',
                  }}
                  onFocus={() => setIsSelect(true)}
                  onBlur={() => setIsSelect(false)}
                  onChange={run}
                  onVisibleChange={resetSearchContent}
                  suffixIcon={isSelect ? <Icon name="arrow_close" hasTheme /> : <Icon name="arrow_open" hasTheme />}
                >
                  <div className={styles['order-book-currency-search']}>
                    <Input
                      value={searchValue}
                      placeholder={t`features_order_book_index_2739`}
                      prefix={<Icon name="search" hasTheme />}
                      suffix={
                        searchValue && (
                          <Icon name="del_input_box" hasTheme onClick={() => handleSearchValueChange('')} />
                        )
                      }
                      onChange={handleSearchValueChange}
                    />
                  </div>
                  {searchList.length > 0 ? (
                    searchList.map(option => (
                      <Option key={option.id} value={`${option.symbolName}`}>
                        {option.baseSymbolName}
                        {option.quoteSymbolName}
                        {tradeMode === TradeModeEnum.futures && ` ${t`assets.enum.tradeCoinType.perpetual`}`}
                      </Option>
                    ))
                  ) : (
                    <div className={styles['order-book-no-result']}>
                      <Icon name="no_data" hasTheme isRemoteUrl width={100} height={88} />
                      <label>{t`user.search_area_03`}</label>
                    </div>
                  )}
                </Select>
              </div>
              <div className="menu">
                <div className="deep-handicap">
                  <label>{t`features_order_book_index_2734`}</label>
                  <Select defaultValue={15} style={{ width: 120 }} onChange={setDeepHandicap}>
                    {DeepHandicapOptions.map(option => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="merge-depth">
                  <label>{t`features_order_book_index_2735`}</label>
                  <Select value={mergeDepth} style={{ width: 120 }} onChange={setMergeDepth}>
                    {currencyDepthOffset?.map(option => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="back">
                  <label
                    onClick={() =>
                      link(
                        `${
                          tradeMode === TradeModeEnum.spot ? BackTradePageEnum.trade : BackTradePageEnum.futures
                        }${symbolName}`
                      )
                    }
                  >{t`features_order_book_index_2736`}</label>
                  <Icon name="transaction_arrow" hasTheme />
                </div>
              </div>
            </div>

            <div className="content">
              <div className="buy-content" ref={contentRef}>
                <OrderBookBuyContent
                  targetCoin={currencyDetail.current?.baseSymbolName}
                  denominatedCurrency={currencyDetail.current?.quoteSymbolName}
                  deepHandicap={deepHandicap}
                  width={contentWidth.current}
                />
              </div>
              <div className="sell-content">
                <OrderBookSellContent
                  targetCoin={currencyDetail.current?.baseSymbolName}
                  denominatedCurrency={currencyDetail.current?.quoteSymbolName}
                  deepHandicap={deepHandicap}
                  width={contentWidth.current}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FullScreenLoading isShow={loading} />
    </section>
  )
}

export default OrderBook
