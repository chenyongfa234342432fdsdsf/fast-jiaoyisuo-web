import { baseLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import { getC2cDefaultSeoMeta } from '@/helper/c2c/trade'

export { onBeforeRender }

async function onBeforeRender(pageContext: PageContext) {
  const layoutStore = baseLayoutStore.getState()
  const title = layoutStore?.layoutProps?.copyright
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
      documentProps: await getC2cDefaultSeoMeta(t`features_c2c_new_common_c2c_new_nav_index_5101352`),
    },
  }
}
