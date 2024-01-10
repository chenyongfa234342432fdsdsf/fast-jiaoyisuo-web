import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { Select, Tooltip, Message } from '@nbit/arco'
import Tabs from '@/components/tabs'
import {
  getTradeOrderTypesMap,
  ITradeFuturesTabs,
  TradeModeEnum,
  TradeOrderTypesEnum,
  TradeBuyOrSellEnum,
  TradeLayoutEnum,
  TradeFuturesOrderAssetsTypesEnum,
  TradeEntrustModalType,
} from '@/constants/trade'
import FutureGroupModal from '@/features/future/future-group-modal'
import { formatCurrency } from '@/helper/decimal'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useContractMarketStore } from '@/store/market/contract'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { useUserStore } from '@/store/user'
import { usePageContext } from '@/hooks/use-page-context'
import { useGetMyAssets } from '@/hooks/features/assets'
import { useUpdateLayoutEffect } from 'ahooks'
import classNames from 'classnames'
import { useTradeStore } from '@/store/trade'
import { useFuturesStore } from '@/store/futures'
import { getTradeFuturesOrderTypes, setTradeFuturesOrderTypes } from '@/helper/cache'
import { UserFuturesTradeStatus } from '@/constants/user'
import { useNavigateOwnParams } from '@/hooks/use-navigate-own-params'
import { getMergeModeStatus } from '@/features/user/utils/common'
import Styles from './index.module.css'
import TradeForm, { ITradeFormRef } from './trade-form'
import TradeMarginSteps from '../trade-margin-steps'
import TradeSideSelect from '../trade-side-select'
import TradeLeverage from '../trade-leverage'
import TradeFuturesOrderAssetsPopup from '../trade-futures-order-assets-popup'
import TradeEntrustModal from '../trade-entrust-modal'
import TradeFuturesCalculator from '../trade-futures-calculator'

type ITradeProps = {
  isSide?: boolean
}
export interface ITradeRef {
  onTradeOrderTypeChange: any
}

function Trade({ isSide }: ITradeProps, ref) {
  const { navigateOwnLink } = useNavigateOwnParams()
  const tradeEntrustModalRef = useRef<TradeEntrustModalType>()
  const isMergeMode = getMergeModeStatus()
  const pageContext = usePageContext()
  const pageId = pageContext.routeParams.id
  // 合约止盈和止损
  const [futuresStopOptionChecked, setFuturesStopOptionChecked] = useState(false)
  // 合约只减仓
  const [futuresDelOptionChecked, setFuturesDelOptionChecked] = useState(false)
  const [futuresOrderAssetsPopupVisible, setFuturesOrderAssetsPopupVisible] = useState(false)
  function futuresDelOptionCheckedChange(val) {
    setFuturesDelOptionChecked(val)
  }
  const queryType = pageContext.urlParsed.search?.type as TradeOrderTypesEnum
  const selectgroup = pageContext.urlParsed.search?.selectgroup
  const tradeOrderTypesMap = getTradeOrderTypesMap()
  const tradeOrderTypes = Object.keys(tradeOrderTypesMap).map(key => ({
    title: tradeOrderTypesMap[key],
    id: key,
  }))
  const [tradeTabType, setTradeTabType] = useState(TradeModeEnum.futures as ITradeFuturesTabs)
  const cacheType = queryType || getTradeFuturesOrderTypes() || TradeOrderTypesEnum.market
  const [orderType, setOrderType] = useState(TradeOrderTypesEnum[cacheType] ? cacheType : TradeOrderTypesEnum.market)
  useUpdateLayoutEffect(() => {
    if (queryType !== orderType) {
      setOrderType(queryType || TradeOrderTypesEnum.market)
    }
  }, [queryType])
  const isMarginTrade = tradeTabType !== TradeModeEnum.futures
  const tradeMode = TradeModeEnum.futures
  const { userAssetsFutures, futuresCurrencySettings } = useAssetsFuturesStore()
  const marketState = useContractMarketStore()
  const { isLogin, userInfo } = useUserStore()
  const isOpenFutures = isLogin && userInfo.isOpenContractStatus === UserFuturesTradeStatus.open
  const { layout } = useTradeStore()
  const isDefaultTradeFormPosition = layout.tradeFormPosition === TradeLayoutEnum.default

  const {
    selectedContractGroup,
    getContractGroupList,
    contractGroupSubscribe,
    updateContractGroup,
    currentGroupOrderAssetsTypes,
    contractGroupList,
    groupMarginSourceCache,
    setCurrentGroupOrderAssetsTypes,
  } = useFuturesStore()

  useEffect(() => {
    const val = groupMarginSourceCache?.[selectedContractGroup?.groupId]
    setCurrentGroupOrderAssetsTypes(val || TradeFuturesOrderAssetsTypesEnum.assets)
  }, [selectedContractGroup])

  const userCoinTotal = useMemo(() => {
    if (currentGroupOrderAssetsTypes === TradeFuturesOrderAssetsTypesEnum.assets) {
      return userAssetsFutures.availableBalanceValue
    }
    return selectedContractGroup?.marginAvailable
  }, [
    userAssetsFutures.availableBalanceValue,
    currentGroupOrderAssetsTypes,
    selectedContractGroup,
    selectedContractGroup?.groupId,
    selectedContractGroup?.marginAvailable,
  ])

  const currentCoin = marketState.currentCoin

  const underlyingCoin = currentCoin.quoteSymbolName || 'USD'
  const buyFormRef = useRef<ITradeFormRef>(null)
  const sellFormRef = useRef<ITradeFormRef>(null)
  const [tradeSide, setTradeSide] = useState(TradeBuyOrSellEnum.buy)
  const currentInitPrice = marketState.currentInitPrice
  const assetsParams: any = {
    accountType: tradeMode,
    paramsCoin: { tradeId: currentCoin.id },
  }
  /** 初始化资产数据 */
  useGetMyAssets(assetsParams)
  const selectGroupRef = useRef<Record<'openContractGroup', () => void>>()

  function onTradeOrderTypeChange(item) {
    const type = item.id as TradeOrderTypesEnum
    setOrderType(type)
    setTradeFuturesOrderTypes(type)
    if (type === TradeOrderTypesEnum.limit || type === TradeOrderTypesEnum.trailing) {
      buyFormRef.current?.form.setFieldsValue({
        price: currentInitPrice.buyPrice,
        amount: undefined,
      })
      sellFormRef.current?.form.setFieldsValue({
        price: currentInitPrice.sellPrice,
        amount: undefined,
      })
    }
    if (type === TradeOrderTypesEnum.market) {
      buyFormRef.current?.form.setFieldsValue({
        priceText: t`features/trade/index-0`,
        amount: undefined,
      })
      sellFormRef.current?.form.setFieldsValue({
        priceText: t`features/trade/index-0`,
        amount: undefined,
      })
    }
    navigateOwnLink(
      { type },
      {
        keepScrollPosition: true,
        overwriteLastHistoryEntry: true,
      }
    )
  }

  const setSelectGroup = () => {
    if (contractGroupList.length > 0) {
      selectGroupRef.current?.openContractGroup()
    } else {
      Message.warning(t`features_trade_futures_index_fzvkqo8xouap4emiizjyx`)
    }
  }

  useImperativeHandle(ref, () => ({
    onTradeOrderTypeChange,
  }))

  useEffect(() => {
    if (isLogin) {
      const selectContract = contractGroupList?.find(item => item?.groupId === selectgroup)
      updateContractGroup(selectContract)
    }
  }, [contractGroupList, isLogin, selectgroup])

  useEffect(() => {
    if (isLogin) {
      getContractGroupList()
    }
    return contractGroupSubscribe()
  }, [isLogin])

  const setOpenEntrustModal = () => {
    tradeEntrustModalRef.current?.openModal()
  }

  return (
    <div
      className={classNames(Styles.scoped, {
        'is-side': isSide,
      })}
    >
      <FutureGroupModal ref={selectGroupRef} futureGroupModeClick />
      {isMarginTrade && <TradeMarginSteps />}
      {isSide && (
        <div className="p-4 pb-0">
          <TradeSideSelect value={tradeSide} onChange={setTradeSide} />
        </div>
      )}
      <div className="trade-tab-wrap">
        {/* <Tabs mode="line" onChange={tabChange} tabList={tabList} value={tradeTabType} /> */}
        {!isDefaultTradeFormPosition && (
          <div className="trade-layout-ext-wrap h-full flex items-center pr-4 mt-4 px-4 mb-1.5">
            {isLogin && (
              <Select
                onClick={setSelectGroup}
                className="futures-group-select-wrap"
                bordered={false}
                style={{ width: 152 }}
                popupVisible={false}
                placeholder={selectedContractGroup?.groupName || t`constants/order-4`}
              />
            )}
            <TradeLeverage />
          </div>
        )}

        <Tabs
          mode="line"
          classNames="text-text_color_02"
          onChange={onTradeOrderTypeChange}
          tabList={tradeOrderTypes}
          value={orderType}
          maxWidth="70%"
          extra={
            <div className="flex items-center ml-4" onClick={setOpenEntrustModal}>
              <Icon name="msg" />
            </div>
          }
          rightExtra={
            isDefaultTradeFormPosition ? (
              <div className="h-full flex items-center pr-4 gap-x-3">
                {isLogin && (
                  <Select
                    className="futures-group-select-wrap"
                    bordered={false}
                    popupVisible={false}
                    onClick={setSelectGroup}
                    style={{ width: 120 }}
                    placeholder={selectedContractGroup?.groupName || t`constants/order-4`}
                  />
                )}
                <TradeLeverage />
                <TradeFuturesCalculator />
              </div>
            ) : (
              <div className="h-full flex items-center pr-4 gap-x-3">
                <TradeFuturesCalculator />
              </div>
            )
          }
        />
      </div>
      <div className="trade-main-wrap">
        <div className="trade-order-type-tab-wrap"></div>
        <div className="form-wrap">
          <div
            className={classNames('form-left', {
              hidden: isSide && tradeSide === TradeBuyOrSellEnum.sell,
            })}
          >
            {isDefaultTradeFormPosition ? (
              <div className="futures-options-wrap">
                <Tooltip mini content={t`features_trade_futures_index_5101435`}>
                  <div
                    className={classNames({
                      'futures-del-assets-wrap': true,
                      'checked': futuresDelOptionChecked,
                    })}
                    onClick={() => {
                      if (!futuresDelOptionChecked) {
                        setFuturesStopOptionChecked(false)
                      }
                      futuresDelOptionCheckedChange(!futuresDelOptionChecked)
                    }}
                  >
                    <Icon
                      hasTheme={!futuresDelOptionChecked}
                      name={!futuresDelOptionChecked ? 'contract_reduce_position' : 'contract_reduce_position_hover'}
                    />
                    <span className="dashed-border">{t`features_trade_futures_index_5101440`}</span>
                  </div>
                </Tooltip>
                <Tooltip mini content={t`features_trade_futures_index_5101436`}>
                  <div
                    className={classNames({
                      'futures-stop-options-wrap': true,
                      'checked': futuresStopOptionChecked,
                    })}
                    onClick={() => {
                      if (!futuresStopOptionChecked) {
                        futuresDelOptionCheckedChange(false)
                      }
                      setFuturesStopOptionChecked(!futuresStopOptionChecked)
                    }}
                  >
                    <Icon
                      hasTheme={!futuresStopOptionChecked}
                      name={!futuresStopOptionChecked ? 'contract_take_profit' : 'contract_take_profit_hover'}
                    />
                    <span className="dashed-border">{t`features/orders/details/future-11`}</span>
                  </div>
                </Tooltip>
              </div>
            ) : (
              <>
                <div className="assets-wrap">
                  <div
                    className="label cursor-pointer dashed-border"
                    onClick={() => {
                      if (isOpenFutures) {
                        setFuturesOrderAssetsPopupVisible(true)
                      }
                    }}
                  >
                    {t`Avbl`}({underlyingCoin})
                  </div>
                  <div className="num">
                    {formatCurrency(userCoinTotal, futuresCurrencySettings.offset || 2, false)}
                    {!isMergeMode && (
                      <Link href={`/assets/main/deposit?id=${currentCoin.sellCoinId}`} target>
                        <Icon name="a-spot_available" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="futures-options-wrap">
                  <Tooltip mini content={t`features_trade_futures_index_5101435`}>
                    <div
                      className={classNames({
                        'futures-del-assets-wrap': true,
                        'checked': futuresDelOptionChecked,
                      })}
                      onClick={() => {
                        if (!futuresDelOptionChecked) {
                          setFuturesStopOptionChecked(false)
                        }
                        futuresDelOptionCheckedChange(!futuresDelOptionChecked)
                      }}
                    >
                      <Icon
                        hasTheme={!futuresDelOptionChecked}
                        name={!futuresDelOptionChecked ? 'contract_reduce_position' : 'contract_reduce_position_hover'}
                      />
                      <span className="dashed-border">{t`features_trade_futures_index_5101440`}</span>
                    </div>
                  </Tooltip>
                  <Tooltip mini content={t`features_trade_futures_index_5101436`}>
                    <div
                      className={classNames({
                        'futures-stop-options-wrap': true,
                        'checked': futuresStopOptionChecked,
                      })}
                      onClick={() => {
                        if (!futuresStopOptionChecked) {
                          futuresDelOptionCheckedChange(false)
                        }
                        setFuturesStopOptionChecked(!futuresStopOptionChecked)
                      }}
                    >
                      <Icon
                        hasTheme={!futuresStopOptionChecked}
                        name={!futuresStopOptionChecked ? 'contract_take_profit' : 'contract_take_profit_hover'}
                      />
                      <span className="dashed-border">{t`features/orders/details/future-11`}</span>
                    </div>
                  </Tooltip>
                </div>
              </>
            )}

            <TradeForm
              ref={buyFormRef}
              tradeOrderType={orderType}
              isModeBuy
              tradeMode={tradeMode}
              tradeTabType={tradeTabType}
              futuresStopOptionChecked={futuresStopOptionChecked}
              futuresDelOptionChecked={futuresDelOptionChecked}
            />
          </div>
          <div
            className={classNames('form-right', {
              hidden: isSide && tradeSide === TradeBuyOrSellEnum.buy,
            })}
          >
            {isDefaultTradeFormPosition ? (
              <div className="assets-wrap">
                <div
                  className="label cursor-pointer dashed-border"
                  onClick={() => {
                    if (isOpenFutures) {
                      setFuturesOrderAssetsPopupVisible(true)
                    }
                  }}
                >
                  {t`Avbl`}({underlyingCoin})
                </div>
                <div className="num">
                  {formatCurrency(userCoinTotal, futuresCurrencySettings.offset || 2, false)}
                  {!isMergeMode && (
                    <Link href={`/assets/main/deposit?id=${currentCoin.sellCoinId}`} target>
                      <Icon name="a-spot_available" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="assets-wrap">
                  <div
                    className="label cursor-pointer dashed-border"
                    onClick={() => {
                      if (isOpenFutures) {
                        setFuturesOrderAssetsPopupVisible(true)
                      }
                    }}
                  >
                    {t`Avbl`}({underlyingCoin})
                  </div>
                  <div className="num">
                    {formatCurrency(userCoinTotal, futuresCurrencySettings.offset || 2, false)}
                    {!isMergeMode && (
                      <Link href={`/assets/main/deposit?id=${currentCoin.sellCoinId}`} target>
                        <Icon name="a-spot_available" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="futures-options-wrap">
                  <Tooltip mini content={t`features_trade_futures_index_5101435`}>
                    <div
                      className={classNames({
                        'futures-del-assets-wrap': true,
                        'checked': futuresDelOptionChecked,
                      })}
                      onClick={() => {
                        if (!futuresDelOptionChecked) {
                          setFuturesStopOptionChecked(false)
                        }
                        futuresDelOptionCheckedChange(!futuresDelOptionChecked)
                      }}
                    >
                      <Icon
                        hasTheme={!futuresDelOptionChecked}
                        name={!futuresDelOptionChecked ? 'contract_reduce_position' : 'contract_reduce_position_hover'}
                      />
                      <span className="dashed-border">{t`features_trade_futures_index_5101440`}</span>
                    </div>
                  </Tooltip>
                  <Tooltip mini content={t`features_trade_futures_index_5101436`}>
                    <div
                      className={classNames({
                        'futures-stop-options-wrap': true,
                        'checked': futuresStopOptionChecked,
                      })}
                      onClick={() => {
                        if (!futuresStopOptionChecked) {
                          futuresDelOptionCheckedChange(false)
                        }
                        setFuturesStopOptionChecked(!futuresStopOptionChecked)
                      }}
                    >
                      <Icon
                        hasTheme={!futuresStopOptionChecked}
                        name={!futuresStopOptionChecked ? 'contract_take_profit' : 'contract_take_profit_hover'}
                      />
                      <span className="dashed-border">{t`features/orders/details/future-11`}</span>
                    </div>
                  </Tooltip>
                </div>
              </>
            )}

            <TradeForm
              ref={sellFormRef}
              tradeOrderType={orderType}
              isModeBuy={false}
              tradeMode={tradeMode}
              tradeTabType={tradeTabType}
              futuresStopOptionChecked={futuresStopOptionChecked}
              futuresDelOptionChecked={futuresDelOptionChecked}
            />
          </div>
        </div>
      </div>
      <TradeFuturesOrderAssetsPopup
        visible={futuresOrderAssetsPopupVisible}
        setVisible={setFuturesOrderAssetsPopupVisible}
        hasCloseIcon
      />
      <TradeEntrustModal ref={tradeEntrustModalRef} okText={t`features_trade_spot_index_2510`} />
    </div>
  )
}

export default forwardRef(Trade)
