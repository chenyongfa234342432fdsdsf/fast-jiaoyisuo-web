import { t } from '@lingui/macro'
import { getC2cDefaultSeoMeta } from '@/helper/c2c/trade'

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
      documentProps: await getC2cDefaultSeoMeta(t`features/assets/main/index-13`),
    },
  }
}

export { onBeforeRender }
