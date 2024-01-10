import { t } from '@lingui/macro'
import UserSettings from '@/features/user/personal-center/settings/index'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'

function Page() {
  return <UserSettings />
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
      unAuthTo: '/login?redirect=/personal-center/settings',
      pageProps,
      layoutParams,
      documentProps: getUserPageDefaultDescribeMeta(t`user.field.reuse_08`, UserModuleDescribeKeyEnum.default),
    },
  }
}

export { Page, onBeforeRender }
