import { t } from '@lingui/macro'
import { getCommunityGroupsDefaultSeoMeta } from '@/helper/community-groups'

export async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
    fullScreen: true,
  }
  return {
    pageContext: {
      needSeo: true,
      pageProps,
      layoutParams,
      documentProps: getCommunityGroupsDefaultSeoMeta(
        t({
          id: 'modules_community_groups_index_page_server_5101316',
          values: { 0: 'Monkey' },
        })
      ),
    },
  }
}
