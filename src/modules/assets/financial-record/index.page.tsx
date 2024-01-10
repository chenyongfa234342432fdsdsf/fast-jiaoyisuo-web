import { FinancialRecordLayout } from '@/features/assets/financial-record'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'
import { t } from '@lingui/macro'

export function Page() {
  return <FinancialRecordLayout />
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
      unAuthTo: '/login?redirect=/assets/c2c',
      pageProps,
      layoutParams,
      documentProps: generateAssetsDefaultSeoMeta({
        title: t`assets.financial-record.title`,
      }),
    },
  }
}
