import { OrderLayout } from '@/features/orders/order-layout'
import { useEffect, useRef } from 'react'
import { EntrustTypeEnum, OrderTabTypeEnum } from '@/constants/order'
import { useOrderCommonParams, useSpotOpenOrders } from '@/hooks/features/order'
import { SpotFullBaseOrder } from '@/features/orders/composite/spot-full'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'
import { generateOrderPageDefaultSeoMeta } from '@/helper/order/future'

function getOrderTableTitle(orderTab: OrderTabTypeEnum) {
  const orderTabTitle: string =
    {
      [OrderTabTypeEnum.current]: t`order.tabs.current`,
      [OrderTabTypeEnum.history]: t`order.tabs.history`,
    }[orderTab] || ''
  return orderTabTitle
}
export async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
    fullScreen: true,
  }
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${pageContext.path}`,
      pageProps,
      layoutParams,
      documentProps: generateOrderPageDefaultSeoMeta(getOrderTableTitle(pageContext.routeParams.type as any)),
    },
  }
}

export function Page() {
  const pageContext = usePageContext()
  const orderTab = pageContext.routeParams.type || OrderTabTypeEnum.current
  const queryType = pageContext.urlParsed.search.type
  const spotOrderHookResult = useSpotOpenOrders(queryType ? (Number(queryType) as EntrustTypeEnum) : undefined)
  const staticRefs = useRef({
    tableLayoutProps: {
      tableHeight: 500,
    },
  })
  const [customParams, onCustomParamsChange] = useOrderCommonParams()
  useEffect(() => {
    spotOrderHookResult.setEntrustType(EntrustTypeEnum.normal)
  }, [orderTab])
  const orders = [
    {
      tab: OrderTabTypeEnum.current,
      entrustType: EntrustTypeEnum.normal,
    },
    {
      tab: OrderTabTypeEnum.current,
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
    <OrderLayout
      subTitle={t`features_orders_order_menu_5101178`}
      title={getOrderTableTitle(pageContext.routeParams.type as any)}
    >
      {orders.map(item => {
        return (
          orderTab === item.tab && (
            <SpotFullBaseOrder
              key={`${item.entrustType}${item.tab}`}
              orderTab={item.tab}
              showSelect
              onCommonParamsChange={onCustomParamsChange}
              entrustType={item.entrustType}
              spotOrderHookResult={spotOrderHookResult}
              tableLayoutProps={staticRefs.current.tableLayoutProps}
              commonParams={customParams}
              visible={spotOrderHookResult.entrustType === item.entrustType}
            />
          )
        )
      })}
    </OrderLayout>
  )
}
