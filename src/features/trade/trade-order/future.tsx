import Tabs from '@/components/tabs'
import { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { EntrustTypeEnum, geOrderTabTypeEnumName, OrderTabTypeEnum } from '@/constants/order'
import { enumValuesToOptions } from '@/helper/order'
import Link from '@/components/link'
import { useOrderCommonParams, useFutureOpenOrders } from '@/hooks/features/order'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import { FutureFullBaseOrder } from '@/features/orders/composite/future-full'
import { getFutureOrderPagePath } from '@/helper/route'
import { useOrderFutureStore } from '@/store/order/future'
import { FuturesPositionList } from '@/features/assets/futures/common/position-list/futures-position-list'
import { TradeAssetsList } from '@/features/assets/futures/common/trade-future-assets/trade-assets-list'
import { FutureLeverInfo } from '@/features/orders/composite/future-lever-info'
import { useContractMarketStore } from '@/store/market/contract'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useUserStore } from '@/store/user'
import { UserFuturesTradeStatus } from '@/constants/user'
import styles from './index.module.css'
import { useTradeOrder } from './base'

/** 交易页面订单 */
export function FutureTradeOrder() {
  const currentId = useContractMarketStore().currentCoin?.id
  const { onlyCurrentSymbol, tableLayoutProps, checkOnlyCurrentSymbolNode } = useTradeOrder(
    t`features_trade_trade_order_future_xmsteurmbejlbirzyu1sh`
  )
  const { orderSettings } = useOrderFutureStore()
  const futureOrderHookResult = useFutureOpenOrders(undefined, currentId, onlyCurrentSymbol)
  const { entrustType, openTitle, displayNormalOrders, displayPlanOrders, disPlayStopLimitOrders } =
    futureOrderHookResult
  const tabs = enumValuesToOptions(
    [
      OrderTabTypeEnum.holdings,
      OrderTabTypeEnum.current,
      OrderTabTypeEnum.history,
      OrderTabTypeEnum.assets,
      OrderTabTypeEnum.leverInfo,
    ],
    geOrderTabTypeEnumName
  )
  const assetsFuturesStore = useAssetsFuturesStore()
  const { positionListFutures } = { ...assetsFuturesStore }
  const userStore = useUserStore()
  const {
    isLogin,
    userInfo: { isOpenContractStatus },
  } = userStore
  if (isLogin && isOpenContractStatus === UserFuturesTradeStatus.open) {
    tabs[0].label += `(${positionListFutures.length || 0})`
    tabs[1].label = openTitle
  }
  const [orderTab, setOrderTab] = useState(orderSettings.defaultOrderTab as any)
  const onOrderTabChange = (item: typeof tabs[0]) => {
    setOrderTab(item.value)
    if (
      [OrderTabTypeEnum.holdings, OrderTabTypeEnum.current, OrderTabTypeEnum.history, OrderTabTypeEnum.assets].includes(
        item.value
      )
    ) {
      orderSettings.updateDefaultOrderTab(item.value)
    }
  }
  const [customParams, onCustomParamsChange] = useOrderCommonParams()
  useUpdateEffect(() => {
    onCustomParamsChange({
      tradeId: onlyCurrentSymbol ? (currentId as any) : undefined,
    })
  }, [onlyCurrentSymbol, currentId])

  let rightExtraNode
  if (orderTab === OrderTabTypeEnum.assets || orderTab === OrderTabTypeEnum.leverInfo) {
    rightExtraNode = null
  } else {
    rightExtraNode = (
      <div className="flex items-center mr-4">
        {checkOnlyCurrentSymbolNode}
        <Link
          target
          href={getFutureOrderPagePath(
            orderTab === OrderTabTypeEnum.holdings ? OrderTabTypeEnum.current : orderTab,
            entrustType
          )}
          className="ml-4"
        >
          <Icon name="order_history" hasTheme />
        </Link>
      </div>
    )
  }
  const orders = [
    {
      tab: OrderTabTypeEnum.current,
      orders: displayNormalOrders,
      entrustType: EntrustTypeEnum.normal,
    },
    {
      tab: OrderTabTypeEnum.current,
      orders: displayPlanOrders,
      entrustType: EntrustTypeEnum.plan,
    },
    {
      tab: OrderTabTypeEnum.current,
      orders: disPlayStopLimitOrders,
      entrustType: EntrustTypeEnum.stopLimit,
    },
    {
      tab: OrderTabTypeEnum.history,
      entrustType: EntrustTypeEnum.normal,
    },
    {
      tab: OrderTabTypeEnum.history,
      entrustType: EntrustTypeEnum.plan,
    },
    {
      tab: OrderTabTypeEnum.history,
      entrustType: EntrustTypeEnum.stopLimit,
    },
  ]

  return (
    <div className={styles['trade-order-wrapper']}>
      <div className="tabs-wrapper">
        <Tabs
          extra={null}
          rightExtra={rightExtraNode}
          mode="line"
          titleMap="label"
          idMap="value"
          onChange={onOrderTabChange}
          tabList={tabs}
          value={orderTab}
        />
      </div>
      <div className="content-wrapper">
        {orders.map(item => {
          return (
            <FutureFullBaseOrder
              key={`${item.entrustType}${item.tab}`}
              orderTab={item.tab}
              entrustType={item.entrustType}
              orders={item.orders}
              futureOrderHookResult={futureOrderHookResult}
              tableLayoutProps={tableLayoutProps}
              commonParams={customParams}
              onCommonParamsChange={onCustomParamsChange}
              visible={orderTab === item.tab && entrustType === item.entrustType}
            />
          )
        })}
        <div
          className={classNames('h-full', {
            hidden: orderTab !== OrderTabTypeEnum.holdings,
          })}
        >
          <FuturesPositionList />
        </div>
        <div
          className={classNames('h-full', {
            hidden: orderTab !== OrderTabTypeEnum.assets,
          })}
        >
          <TradeAssetsList />
        </div>
        <div
          className={classNames('h-full', {
            hidden: orderTab !== OrderTabTypeEnum.leverInfo,
          })}
        >
          <FutureLeverInfo />
        </div>
      </div>
    </div>
  )
}
