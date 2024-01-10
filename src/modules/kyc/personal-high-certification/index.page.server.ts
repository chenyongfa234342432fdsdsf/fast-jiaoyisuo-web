import { t } from '@lingui/macro'
import { getKycDefaultSeoMeta } from '@/helper/c2c/trade'

async function onBeforeRender() {
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
      documentProps: await getKycDefaultSeoMeta(t`features_kyc_kyc_header_index_5101171`),
    },
  }
}

export { onBeforeRender }
