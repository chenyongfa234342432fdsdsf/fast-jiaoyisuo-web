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
      documentProps: await getKycDefaultSeoMeta(t`features_user_person_application_index_2651`),
    },
  }
}

export { onBeforeRender }
