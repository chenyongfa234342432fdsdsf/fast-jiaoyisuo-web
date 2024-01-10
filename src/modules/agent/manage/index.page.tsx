import { t } from '@lingui/macro'
import UserPersonalCenterAgentManage from '@/features/agent/manage'
import { generateAgentDefaultSeoMeta } from '@/helper/agent'

function Page() {
  return <UserPersonalCenterAgentManage />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
    fullScreen: true,
  }
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/manage',
      pageProps,
      layoutParams,
      documentProps: generateAgentDefaultSeoMeta({ title: t`features_agent_index_5101365` }),
    },
  }
}

export { onBeforeRender, Page }
