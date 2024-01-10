import { t } from '@lingui/macro'
import { getArtcleDefaultSeoMeta } from '@/helper/support'

async function onBeforeRender(pageContext: PageContext) {
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
      documentProps: getArtcleDefaultSeoMeta(t`features/announcement/index-10`),
    },
  }
}

export { onBeforeRender }
