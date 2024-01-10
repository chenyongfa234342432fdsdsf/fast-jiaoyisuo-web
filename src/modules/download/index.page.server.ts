import { t } from '@lingui/macro'
import { getCommunityGroupsDefaultSeoMeta } from '@/helper/community-groups'

export async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: false,
    headerShow: false,
    fullScreen: false,
  }
  return {
    pageContext: {
      needSeo: false,
      pageProps,
      layoutParams,
      documentProps: {
        title: '',
        description: '',
      },
    },
  }
}
