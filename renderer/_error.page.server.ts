import { baseLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'

export async function onBeforeRender(pageContext: PageContext) {
  const { headerData } = baseLayoutStore.getState()
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
        title: headerData?.businessName,
      },
    },
  }
}
