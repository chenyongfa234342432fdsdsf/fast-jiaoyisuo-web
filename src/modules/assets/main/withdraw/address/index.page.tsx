import { WithdrawAddressLayout } from '@/features/assets/main/withdraw/address'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'
import { t } from '@lingui/macro'

export function Page() {
  return <WithdrawAddressLayout />
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
        title: t`assets.withdraw.withdrawAddressList`,
      }),
    },
  }
}
