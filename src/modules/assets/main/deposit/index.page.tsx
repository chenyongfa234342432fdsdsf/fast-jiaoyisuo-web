import { AssetsRouteEnum, FinancialRecordLogTypeEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { DepositLayout } from '@/features/assets/main/deposit'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'

export function Page() {
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.coins}
      header={<AssetsHeader className="assets-deposit-header" title={t`assets.deposit.deposit`} showRight={false} />}
    >
      <DepositLayout />
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
        title: t`assets.deposit.title`,
      }),
    },
  }
}
