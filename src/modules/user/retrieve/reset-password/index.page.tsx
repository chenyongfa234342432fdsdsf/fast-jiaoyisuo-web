import { t } from '@lingui/macro'
import UserRetrieveResetPassword from '@/features/user/retrieve/reset-password'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <UserRetrieveResetPassword />
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
