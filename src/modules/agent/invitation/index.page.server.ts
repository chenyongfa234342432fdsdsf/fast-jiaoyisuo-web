import { agentModuleRoutes } from '@/constants/agent'
import { generateAgentDefaultSeoMeta } from '@/helper/agent'
import { t } from '@lingui/macro'

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
    fullScreen: true,
  }
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${agentModuleRoutes.inviteCheckMore}/${pageContext.routeParams.id}`,
      pageProps,
      layoutParams,
      documentProps: generateAgentDefaultSeoMeta({ title: t`features_agent_invitation_index_5101581` }),
    },
  }
}

export { onBeforeRender }
