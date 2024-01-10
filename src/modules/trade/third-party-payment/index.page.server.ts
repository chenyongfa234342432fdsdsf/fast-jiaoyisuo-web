import { baseLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import { getC2cDefaultSeoMeta } from '@/helper/c2c/trade'

export { onBeforeRender }

async function onBeforeRender(pageContext: PageContext) {
  const layoutStore = baseLayoutStore.getState()
  const title = layoutStore?.layoutProps?.copyright
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
      documentProps: await getC2cDefaultSeoMeta(t`modules_trade_third_party_payment_index_page_server_bkloey7_dq`),
    },
  }
}
