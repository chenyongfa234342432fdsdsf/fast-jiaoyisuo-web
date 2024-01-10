import { OrderLayout } from '@/features/orders/order-layout'
import { useRef } from 'react'
import { EntrustTypeEnum, OrderTabTypeEnum } from '@/constants/order'
import { useOrderCommonParams, useFutureOpenOrders } from '@/hooks/features/order'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'
import { FutureFullBaseOrder } from '@/features/orders/composite/future-full'
import { useApiAllMarketFuturesTradePair } from '@/hooks/features/market/common/use-api-all-market-trade-pair'
import { getFuturesCurrencySettings } from '@/helper/assets/futures'
import { useUserStore } from '@/store/user'
import { useMount, useUpdateEffect } from 'ahooks'
import { useGetMyAssets } from '@/hooks/features/assets'
import { TradeModeEnum } from '@/constants/trade'
import { baseAssetsStore } from '@/store/assets'
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
  const futureOrderHookResult = useFutureOpenOrders(queryType ? (Number(queryType) as EntrustTypeEnum) : undefined)
  const staticRefs = useRef({
    tableLayoutProps: {
      tableHeight: 500,
    },
  })
  const [customParams, onCustomParamsChange] = useOrderCommonParams()
  useUpdateEffect(() => {
    futureOrderHookResult.setEntrustType(EntrustTypeEnum.normal)
  }, [orderTab])
  const { isLogin, updatePreferenceAndUserInfoData } = useUserStore()

  const assetsParamsRef = useRef({
    accountType: TradeModeEnum.futures,
  })
  /** 初始化资产数据 */
  useGetMyAssets(assetsParamsRef.current)

  useMount(() => {
    if (isLogin) {
      getFuturesCurrencySettings()
      baseAssetsStore.getState().fetchCoinRate()
      updatePreferenceAndUserInfoData()
    }
  })
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
      tab: OrderTabTypeEnum.current,
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
  useApiAllMarketFuturesTradePair()

  return (
    <OrderLayout subTitle={t`order.titles.future`} title={getOrderTableTitle(pageContext.routeParams.type as any)}>
      {orders.map(item => {
        return (
          orderTab === item.tab && (
            <FutureFullBaseOrder
              key={`${item.entrustType}${item.tab}`}
              orderTab={item.tab}
              showSelect
              onCommonParamsChange={onCustomParamsChange}
              entrustType={item.entrustType}
              futureOrderHookResult={futureOrderHookResult}
              tableLayoutProps={staticRefs.current.tableLayoutProps}
              commonParams={customParams}
              visible={futureOrderHookResult.entrustType === item.entrustType}
            />
          )
        )
      })}
    </OrderLayout>
  )
}
