import { t } from '@lingui/macro'
import UserModifyPassword from '@/features/user/personal-center/account-security/modify-password'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <UserModifyPassword />
}

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
  }
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/personal-center/account-security/modify-password',
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(t`user.pageContent.title_08`, UserModuleDescribeKeyEnum.default),
    },
  }
}

export { Page, onBeforeRender }
