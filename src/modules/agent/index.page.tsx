import { t } from '@lingui/macro'
import UserPersonalCenterAgent from '@/features/agent'
import { generateAgentDefaultSeoMeta } from '@/helper/agent'

function Page() {
  return <UserPersonalCenterAgent />
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
      unAuthTo: '/login?redirect=/agent',
      pageProps,
      layoutParams,
      documentProps: generateAgentDefaultSeoMeta({ title: t`user.personal_center_05` }),
    },
  }
}

export { onBeforeRender, Page }
