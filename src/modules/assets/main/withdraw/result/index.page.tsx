import { WithdrawResultLayout } from '@/features/assets/main/withdraw/result'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'
import { t } from '@lingui/macro'

export function Page() {
  return <WithdrawResultLayout />
}
export async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
    fullScreen: true,
  }
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: generateAssetsDefaultSeoMeta({
        title: t`assets.withdraw.withdrawComfirmTitle`,
      }),
    },
  }
}
