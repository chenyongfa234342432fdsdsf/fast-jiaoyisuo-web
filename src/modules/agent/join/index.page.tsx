import { t } from '@lingui/macro'
import UserPersonalCenterAgentFormJoin from '@/features/agent/join'
import { generateAgentDefaultSeoMeta } from '@/helper/agent'

function Page() {
  return <UserPersonalCenterAgentFormJoin />
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
      unAuthTo: '/login?redirect=/agent/join',
      pageProps,
      layoutParams,
      documentProps: generateAgentDefaultSeoMeta({ title: t`user.application_form_11` }),
    },
  }
}

export { onBeforeRender, Page }
