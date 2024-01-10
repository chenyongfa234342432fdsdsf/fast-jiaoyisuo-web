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
      unAuthTo: `/login?redirect=${agentModuleRoutes.invite}`,
      pageProps,
      layoutParams,
      documentProps: generateAgentDefaultSeoMeta({ title: t`features_agent_gains_index_5101570` }),
    },
  }
}
export { onBeforeRender }
