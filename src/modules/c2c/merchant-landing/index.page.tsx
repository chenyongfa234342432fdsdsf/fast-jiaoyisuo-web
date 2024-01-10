import { C2cMerchantApplicationLanding } from '@/features/c2c/trade/merchant-landing'
import { getC2cMerchantSeoMeta } from '@/helper/c2c/merchant-application'
import { t } from '@lingui/macro'

function Page() {
  return <C2cMerchantApplicationLanding />
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
      pageProps,
      layoutParams,
      documentProps: {
        ...getC2cMerchantSeoMeta(),
        title: t`features_c2c_new_merchant_application_marchant_info_index_2225101364`,
      },
    },
  }
}
