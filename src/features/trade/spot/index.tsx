import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { Dropdown, Menu, Modal } from '@nbit/arco'
import Tabs from '@/components/tabs'
import {
  getTradeOrderTypesMap,
  getTradeTabsMap,
  TradeMarginTypesEnum,
  TradeModeEnum,
  TradeOrderTypesEnum,
  TradeEntrustModalType,
  TradeBuyOrSellEnum,
} from '@/constants/trade'
import { useAssetsStore } from '@/store/assets'
import { useMarketStore } from '@/store/market'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { useUserStore } from '@/store/user'
import { usePageContext } from '@/hooks/use-page-context'
import { useGetMyAssets } from '@/hooks/features/assets'
import TradeEntrustModal from '@/features/trade/trade-entrust-modal'
import { useUpdateLayoutEffect } from 'ahooks'
import classNames from 'classnames'
import { useLayoutStore } from '@/store/layout'
import { useNavigateOwnParams } from '@/hooks/use-navigate-own-params'
import { getMergeModeStatus } from '@/features/user/utils/common'
import Styles from './index.module.css'
import TradeForm, { ITradeFormRef } from './trade-form'
import TradeMarginSteps from '../trade-margin-steps'
import TradeMarginOpen, { ITradeMarginOpenRef } from '../trade-margin-open'
import TradeServiceTerms from '../trade-service-terms'
import TradeLayoutTrigger from '../trade-layout-trigger'
import TradeSideSelect from '../trade-side-select'

type ITradeProps = {
  isSide?: boolean
}

function Trade({ isSide }: ITradeProps, ref) {
  const { navigateOwnLink } = useNavigateOwnParams()
  const isMergeMode = getMergeModeStatus()
  const pageContext = usePageContext()
  const queryType = pageContext.urlParsed.search?.type as TradeOrderTypesEnum
  const pageId = pageContext.routeParams.id
  const tradeMarginOpenRef = useRef<ITradeMarginOpenRef>()
  const tradeEntrustModalRef = useRef<TradeEntrustModalType>()
  const tradeOrderTypesMap = getTradeOrderTypesMap()
  const tradeTabsMap = getTradeTabsMap()
  const tabList = Object.keys(tradeTabsMap).map(k => ({ id: k, title: tradeTabsMap[k] }))
  const tradeOrderTypes = Object.keys(tradeOrderTypesMap).map(key => ({
    title: tradeOrderTypesMap[key],
    id: key,
  }))
  const [tradeTabType, setTradeTabType] = useState(TradeModeEnum.spot)
  const [orderType, setOrderType] = useState(queryType || TradeOrderTypesEnum.market)
  useUpdateLayoutEffect(() => {
    if (queryType !== orderType) {
      setOrderType(queryType || TradeOrderTypesEnum.market)
    }
  }, [queryType])
  const isMarginTrade = tradeTabType !== TradeModeEnum.spot
  const tradeMode = isMarginTrade ? TradeModeEnum.margin : TradeModeEnum.spot
  const assetsStore = useAssetsStore()
  const marketState = useMarketStore()
  const userStore = useUserStore()
  const { headerData } = useLayoutStore()
  const currentAssets = assetsStore.userAssetsSpot
  const currentCoin = marketState.currentCoin
  const denominatedCoin = currentCoin.buySymbol
  const underlyingCoin = currentCoin.sellSymbol
  const buyFormRef = useRef<ITradeFormRef>(null)
  const sellFormRef = useRef<ITradeFormRef>(null)
  const [tradeSide, setTradeSide] = useState(TradeBuyOrSellEnum.buy)
  const currentInitPrice = marketState.currentInitPrice
  const assetsParams: any =
    tradeTabType === TradeModeEnum.spot
      ? {
          accountType: tradeMode,
          paramsCoin: { tradeId: currentCoin.tradeId },
        }
      : {
          accountType: tradeMode,
          paramsMargin: {
            activeName: tradeTabType,
            tradeId: currentCoin.tradeId,
            /** 杠杆买入模式：1 普通模式，2 自动借款模式，3 自动还款模式 */
            leverBuyMode: TradeMarginTypesEnum.borrow,
            /** 杠杆卖出模式：1 普通模式，2 自动借款模式，3 自动还款模式 */
            leverSellMode: TradeMarginTypesEnum.borrow,
          },
        }
  /** 初始化资产数据 */
  useGetMyAssets(assetsParams)
  function onTradeOrderTypeChange(item) {
    const type = item.id as TradeOrderTypesEnum
    setOrderType(type)
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
  useImperativeHandle(ref, () => ({
    onTradeOrderTypeChange,
  }))
  const setOpenEntrustModal = () => {
    tradeEntrustModalRef.current?.openModal()
  }

  function onTradeMarginCheck() {
    if (!userStore.isLogin) {
      return false
    }
    /** 未进行杠杆风险测试 */
    if (0) {
      // if (!userStore.userInfo.isActivateMargin) {
      Modal?.confirm?.({
        icon: null,
        maskClosable: false,
        title: t`trade.c2c.max.reminder`,
        style: { width: '420px' },
        content: (
          <div>
            {t({
              id: 'features/trade/index-5',
              values: { 0: headerData?.businessName },
            })}
            <span className="text-brand_color cursor-pointer" onClick={() => {}}>
              {t`features/trade/index-6`}
            </span>
          </div>
        ),
        onOk: () => {
          Modal.destroyAll()
          Modal?.confirm?.({
            icon: null,
            maskClosable: false,
            title: (
              <div>
                <div className="text-2xl">{t`features/trade/index-7`}</div>
                <div className="subtitle text-text_color_02 mb-2 text-sm mt-1">{t`features/trade/index-8`}</div>
              </div>
            ),
            style: { width: '720px' },
            content: <TradeMarginOpen ref={tradeMarginOpenRef} />,
            onOk: () => {
              return new Promise((resolve, reject) => {
                tradeMarginOpenRef.current?.form
                  .validate()
                  .then(() => {
                    resolve(1)
                    const confirm = Modal?.confirm?.({
                      icon: null,
                      maskClosable: false,
                      title: t`user.validate_form_10`,
                      style: { width: '420px' },
                      content: (
                        <TradeServiceTerms
                          onCancel={() => confirm?.close()}
                          onOk={() => {
                            //
                          }}
                        >
                          <span className="text-brand_color cursor-pointer" onClick={() => {}}>
                            {t({
                              id: 'features/trade/index-9',
                              values: { 0: headerData?.businessName },
                            })}
                          </span>
                        </TradeServiceTerms>
                      ),
                      footer: null,
                    })
                  })
                  .catch(() => {
                    reject(new Error(t`features_trade_spot_index_2425`))
                  })
              })
            },
          })
        },
      })
      return false
    }
    /** 业务逻辑 TODO: */
  }
  function onTransferClick() {
    if (onTradeMarginCheck()) {
      //
    }
  }
  function onLoanClick() {
    if (onTradeMarginCheck()) {
      //
    }
  }

  return (
    <div
      className={classNames(Styles.scoped, {
        'is-side': isSide,
      })}
    >
      {isMarginTrade && <TradeMarginSteps />}
      {isSide && (
        <div className="p-4 pb-0">
          <TradeSideSelect value={tradeSide} onChange={setTradeSide} />
        </div>
      )}
      <div className="trade-tab-wrap">
        {/* <Tabs mode="line" onChange={tabChange} tabList={tabList} value={tradeTabType} /> */}
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
            <div className="h-full flex items-center pr-4">
              <TradeLayoutTrigger />
            </div>
          }
        />
        {/* 交易一级 tab 右侧菜单 */}
        {isMarginTrade && (
          <div className="trade-tab-menu-wrap">
            <Dropdown
              droplist={
                <Menu>
                  <Link href="/margin/order/data">
                    <Menu.Item key="1">{t`features/trade/index-1`}</Menu.Item>
                  </Link>
                  <Link href="/margin/order/data?position=2&tab=1">
                    <Menu.Item key="2">{t`features/trade/index-2`}</Menu.Item>
                  </Link>
                  <Link href="">
                    <Menu.Item key="3">{t`features/trade/index-3`}</Menu.Item>
                  </Link>
                </Menu>
              }
              position="br"
            >
              <Icon name="user_about_protocol_black" />
              {/* 修复 Dropdown 不触发 */}
              {''}
            </Dropdown>
          </div>
        )}
      </div>
      <div className="trade-main-wrap">
        <div className="trade-order-type-tab-wrap">
          {/* <Tabs
            mode="text"
            classNames="text-text_color_02"
            onChange={onTradeOrderTypeChange}
            tabList={tradeOrderTypes}
            value={orderType}
          /> */}
          {/* 交易二级 tab 右侧菜单 */}
          {isMarginTrade && (
            <div className="trade-order-type-tab-menu-wrap">
              <span className="text-brand_color bg-brand_color_special_02 rounded-sm mr-1.5 text-xs px-0.5">3x</span>
              <span
                className="text-brand_color text-xs mr-1 cursor-pointer"
                onClick={onTransferClick}
              >{t`features/assets/main/index-4`}</span>
              <span
                className="text-brand_color text-xs cursor-pointer"
                onClick={onLoanClick}
              >{t`features/trade/index-4`}</span>
            </div>
          )}
        </div>
        <div className="form-wrap">
          <div
            className={classNames('form-left', {
              hidden: isSide && tradeSide === TradeBuyOrSellEnum.sell,
            })}
          >
            <div className="assets-wrap">
              <div className="label">
                {t`Avbl`}({denominatedCoin})
              </div>
              <div className="num">
                {currentAssets.buyCoin?.availableAmountText}
                {!isMergeMode && (
                  <Link href={`/assets/main/deposit?id=${currentCoin.buyCoinId}`} target>
                    <Icon name="a-spot_available" />
                  </Link>
                )}
              </div>
            </div>
            <TradeForm
              ref={buyFormRef}
              tradeOrderType={orderType}
              isModeBuy
              tradeMode={tradeMode}
              tradeTabType={tradeTabType}
            />
          </div>
          <div
            className={classNames('form-right', {
              hidden: isSide && tradeSide === TradeBuyOrSellEnum.buy,
            })}
          >
            <div className="assets-wrap">
              <div className="label">
                {t`Avbl`}({underlyingCoin})
              </div>
              <div className="num">
                {currentAssets.sellCoin?.availableAmountText}
                {!isMergeMode && (
                  <Link href={`/assets/main/deposit?id=${currentCoin.sellCoinId}`} target>
                    <Icon name="a-spot_available" />
                  </Link>
                )}
              </div>
            </div>
            <TradeForm
              ref={sellFormRef}
              tradeOrderType={orderType}
              isModeBuy={false}
              tradeMode={tradeMode}
              tradeTabType={tradeTabType}
            />
          </div>
        </div>
      </div>
      <TradeEntrustModal ref={tradeEntrustModalRef} okText={t`features_trade_spot_index_2510`} />
    </div>
  )
}

export default forwardRef(Trade)
