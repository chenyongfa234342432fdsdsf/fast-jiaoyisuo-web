import { t } from '@lingui/macro'
import UserRetreive from '@/features/user/retrieve'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <UserRetreive />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: false,
    headerShow: true,
  }
  return {
    pageContext: {
      authTo: '/',
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(t`user.pageContent.title_03`, UserModuleDescribeKeyEnum.default),
    },
  }
}

export { Page, onBeforeRender }
