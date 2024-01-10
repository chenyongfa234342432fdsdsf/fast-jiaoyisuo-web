import { t } from '@lingui/macro'
import AgencyCenter from '@/features/agent/agency-center'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <AgencyCenter />
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
      unAuthTo: '/login?redirect=/agent/agency-center',
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(
        t`features_agent_agency_center_index_5101513`,
        UserModuleDescribeKeyEnum.agentCenter
      ),
    },
  }
}

export { Page, onBeforeRender }
