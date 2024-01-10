import Tabs from '@/components/tabs'
import { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { EntrustTypeEnum, geOrderTabTypeEnumName, OrderTabTypeEnum } from '@/constants/order'
import { enumValuesToOptions } from '@/helper/order'
import Link from '@/components/link'
import { useMarketStore } from '@/store/market'
import { HideSmallAssetsNode, TradeAssetsList } from '@/features/assets/common/trade-assets-list'
import { useOrderCommonParams, useSpotOpenOrders } from '@/hooks/features/order'
import { SpotFullBaseOrder } from '@/features/orders/composite/spot-full'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import styles from './index.module.css'
import { useTradeOrder } from './base'

const AssetsTabValue = 'assets'

/** 交易页面订单 */
function TradeOrder() {
  const currentId = useMarketStore().currentCoin?.tradeId
  const { onlyCurrentSymbol, tableLayoutProps, checkOnlyCurrentSymbolNode } = useTradeOrder()
  const { orderSettings } = useBaseOrderSpotStore()
  const spotOrderHookResult = useSpotOpenOrders(undefined, currentId, onlyCurrentSymbol)
  const { entrustType, openTitle, displayNormalOrders, displayPlanOrders } = spotOrderHookResult
  const tabs = enumValuesToOptions([OrderTabTypeEnum.current, OrderTabTypeEnum.history], geOrderTabTypeEnumName)
  tabs.push({
    label: t`features/user/personal-center/menu-navigation/index-1`,
    value: AssetsTabValue,
  })
  tabs[0].label = openTitle
  const [orderTab, setOrderTab] = useState(orderSettings.defaultOrderTab as any)
  const onOrderTabChange = (item: typeof tabs[0]) => {
    setOrderTab(item.value)
    if ([OrderTabTypeEnum.current, OrderTabTypeEnum.history].includes(item.value)) {
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
  if (orderTab === AssetsTabValue) {
    rightExtraNode = <HideSmallAssetsNode />
  } else {
    rightExtraNode = (
      <div className="flex items-center mr-4">
        {checkOnlyCurrentSymbolNode}
        <Link target href={`/orders/spot/${orderTab}?type=${entrustType}`} className="ml-4">
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
      tab: OrderTabTypeEnum.history,
      entrustType: EntrustTypeEnum.normal,
    },
    {
      tab: OrderTabTypeEnum.history,
      entrustType: EntrustTypeEnum.plan,
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
            <SpotFullBaseOrder
              key={`${item.entrustType}${item.tab}`}
              orderTab={item.tab}
              entrustType={item.entrustType}
              orders={item.orders}
              spotOrderHookResult={spotOrderHookResult}
              tableLayoutProps={tableLayoutProps}
              commonParams={customParams}
              onCommonParamsChange={onCustomParamsChange}
              visible={orderTab === item.tab && entrustType === item.entrustType}
            />
          )
        })}
        <div
          className={classNames('h-full', {
            hidden: orderTab !== AssetsTabValue,
          })}
        >
          {orderTab === AssetsTabValue && <TradeAssetsList />}
        </div>
      </div>
    </div>
  )
}

export default TradeOrder
