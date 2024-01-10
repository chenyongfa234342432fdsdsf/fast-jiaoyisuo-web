import { t } from '@lingui/macro'
import UserPersonalCenterAgentApply from '@/features/agent/apply'
import { generateAgentDefaultSeoMeta } from '@/helper/agent'

function Page() {
  return <UserPersonalCenterAgentApply />
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
      unAuthTo: '/login?redirect=/agent/apply',
      pageProps,
      layoutParams,
      documentProps: generateAgentDefaultSeoMeta({ title: t`modules_agent_apply_index_page_5101601` }),
    },
  }
}

export { onBeforeRender, Page }
