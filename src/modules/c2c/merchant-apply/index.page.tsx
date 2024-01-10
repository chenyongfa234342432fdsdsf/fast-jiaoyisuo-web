import { C2cMerchantApply } from '@/features/c2c/trade/merchant-apply'
import { c2cMaHelpers, getC2cMerchantSeoMeta } from '@/helper/c2c/merchant-application'
import { link } from '@/helper/link'
import { getC2cMerchantPageRoutePath, getC2MerchantApplicationPageRoutePath } from '@/helper/route'
import { t } from '@lingui/macro'

function Page() {
  if (!c2cMaHelpers.isUserCanApply()) {
    link(getC2cMerchantPageRoutePath())
    return null
  }

  return <C2cMerchantApply />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
    fullScreen: true,
  }

  return {
    pageContext: {
      unAuthTo: `/login?redirect=${getC2MerchantApplicationPageRoutePath()}`,
      pageProps,
      layoutParams,
      documentProps: {
        ...getC2cMerchantSeoMeta(),
        title: t`modules_c2c_merchant_apply_index_page_-0-gmkjx9geu-phzcyjzb`,
      },
    },
  }
}
