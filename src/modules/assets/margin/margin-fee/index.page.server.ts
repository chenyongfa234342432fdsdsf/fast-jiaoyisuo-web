import { t } from '@lingui/macro'

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
        title: t`modules/assets/margin/index-1`,
      },
    },
  }
}
