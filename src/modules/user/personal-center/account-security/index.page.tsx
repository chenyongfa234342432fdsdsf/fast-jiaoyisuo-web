import { t } from '@lingui/macro'
import UserPersonalCenterAccountSecurity from '@/features/user/personal-center/account-security'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <UserPersonalCenterAccountSecurity />
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
      unAuthTo: '/login?redirect=/personal-center/account-security',
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(t`user.pageContent.title_08`, UserModuleDescribeKeyEnum.default),
    },
  }
}

export { Page, onBeforeRender }
