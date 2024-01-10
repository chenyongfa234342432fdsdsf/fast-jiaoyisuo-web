import { OrderLayout } from '@/features/orders/order-layout'
import { t } from '@lingui/macro'
import { FutureOrderFundingFees } from '@/features/orders/composite/funding'
import { useMount } from 'ahooks'
import { getFuturesCurrencySettings } from '@/helper/assets/futures'
import { baseAssetsStore } from '@/store/assets'
import { generateOrderPageDefaultSeoMeta } from '@/helper/order/future'

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
      documentProps: generateOrderPageDefaultSeoMeta(t`constants/assets/common-8`),
    },
  }
}

export function Page() {
  useMount(() => {
    getFuturesCurrencySettings()
    baseAssetsStore.getState().fetchCoinRate()
  })

  return (
    <OrderLayout subTitle={t`order.titles.future`} title={t`constants/assets/common-8`}>
      <FutureOrderFundingFees />
    </OrderLayout>
  )
}
