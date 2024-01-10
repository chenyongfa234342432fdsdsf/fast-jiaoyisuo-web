import React, { useEffect, useCallback } from 'react'
import C2COrderDetailHeader from '@/features/c2c/trade/c2c-orderdetail-header'
import C2CTab from '@/features/c2c/trade/c2c-tab'
import C2COrderDetailPay from '@/features/c2c/trade/c2c-orderdetail-pay'
import { usePageContext } from '@/hooks/use-page-context'
import AsyncSuspense from '@/components/async-suspense'
import ErrorBoundary from '@/components/error-boundary'
import { getC2cDefaultSeoMeta } from '@/helper/c2c/trade'

import { useRefreshWindowVisible } from '@/hooks/features/c2c/order/use-refresh-window-visible'
import { IC2cOrderDetail } from '@/typings/api/c2c/order'
import { useC2CStore, baseC2CStore } from '@/store/c2c'
import { getV1ImOrderGetTeamInfoApiRequest } from '@/apis/c2c/im'
import { useSafeState } from 'ahooks'
import { YapiGetV1ImOrderGetTeamInfoApiResponse } from '@/typings/yapi/ImOrderGetTeamInfoV1GetApi'
import { Message, Spin } from '@nbit/arco'
import { t } from '@lingui/macro'
import styles from './index.module.css'

const C2CChatWindow = React.lazy(() => import('@/features/c2c/c2c-chat-window'))

export function Page() {
  const { routeParams } = usePageContext()
  const [tid, setTid] = useSafeState<string>('')
  const { C2COrderStatusDetail, setSearchOrderId, c2cOrderSubscribe, getC2COrderStatusDetail, clearC2CStatusDetail } =
    useC2CStore()

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      const { searchOrderId } = baseC2CStore.getState() || {}
      getC2COrderStatusDetail({ id: searchOrderId })
    }
  }, [routeParams.id])

  useRefreshWindowVisible(handleVisibilityChange)

  useEffect(() => {
    getC2COrderStatusDetail({ id: routeParams.id })
    setSearchOrderId(routeParams.id)
    const unSubscribe = c2cOrderSubscribe()
    return () => {
      unSubscribe()
      clearC2CStatusDetail()
    }
  }, [])

  return (
    <div className={styles.container}>
      <C2CTab>
        {C2COrderStatusDetail && <C2COrderDetailHeader orders={C2COrderStatusDetail} />}
        <div className="chatbox-order">
          <div className="im-wrap">
            {C2COrderStatusDetail ? (
              <AsyncSuspense>
                <ErrorBoundary>
                  <C2CChatWindow orderDetails={C2COrderStatusDetail as unknown as IC2cOrderDetail} />
                </ErrorBoundary>
              </AsyncSuspense>
            ) : (
              <Spin />
            )}
          </div>
          <div className="order-detail">
            {C2COrderStatusDetail && <C2COrderDetailPay orders={C2COrderStatusDetail} />}
          </div>
        </div>
      </C2CTab>
    </div>
  )
}

export async function onBeforeRender(pageContext: PageContext) {
  // return {
  //   pageContext: {
  //     // unAuthTo: '/login?redirect=/agent/join',
  //   },
  // }

  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
    fullScreen: true,
  }
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: await getC2cDefaultSeoMeta(t`features/orders/details/future-9`),
    },
  }
}
