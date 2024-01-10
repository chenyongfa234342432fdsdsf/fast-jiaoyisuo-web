import { FuturesHistoryLayout } from '@/features/assets/futures/futures-history'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'
import { t } from '@lingui/macro'

export function Page() {
  return <FuturesHistoryLayout />
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
      unAuthTo: '/login?redirect=/assets/futures',
      pageProps,
      layoutParams,
      documentProps: generateAssetsDefaultSeoMeta({
        title: t`features_assets_futures_futures_detail_index_5101364`,
      }),
    },
  }
}
