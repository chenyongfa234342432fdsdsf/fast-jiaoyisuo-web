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
      documentProps: await getKycDefaultSeoMeta(t`features_c2c_center_user_setting_index_namuoujjeogg1vzfgxu8c`),
    },
  }
}

export { onBeforeRender }
