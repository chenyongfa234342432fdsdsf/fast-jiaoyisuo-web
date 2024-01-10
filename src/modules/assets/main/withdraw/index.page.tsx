import { AssetsRouteEnum, FinancialRecordLogTypeEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'
import { WithdrawLayout } from '@/features/assets/main/withdraw'

export function Page() {
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.coins}
      header={<AssetsHeader className="assets-deposit-header" title={t`assets.withdraw.header`} showRight={false} />}
    >
      <WithdrawLayout />
    </AssetsLayout>
  )
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
        title: t`assets.withdraw.withdrawName`,
      }),
    },
  }
}
