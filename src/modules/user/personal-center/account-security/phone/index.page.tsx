import { t } from '@lingui/macro'
import UserAccountSecurityPhone from '@/features/user/personal-center/account-security/phone'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <UserAccountSecurityPhone />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
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
