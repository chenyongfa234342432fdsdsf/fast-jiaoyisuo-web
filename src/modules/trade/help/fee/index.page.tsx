import TradeFee from '@/features/trade/help/fee'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'
import { t } from '@lingui/macro'

export function Page() {
  return <TradeFee />
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
      // unAuthTo: '/login?redirect=/assets',
      pageProps,
      layoutParams,
      documentProps: generateAssetsDefaultSeoMeta({
        title: t`modules_trade_help_fee_index_page_server_5101195`,
      }),
    },
  }
}
