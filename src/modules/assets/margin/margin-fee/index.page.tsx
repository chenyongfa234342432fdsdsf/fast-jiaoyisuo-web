import { AssetsRouteEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { MarginFeeIndex } from '@/features/assets/margin/margin-fee'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { t } from '@lingui/macro'

function Page() {
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.margin}
      header={
        <AssetsHeader
          title={t`modules/assets/margin/index-1`}
          headerChildren={
            <>
              <Icon name="asset_icon_record" hasTheme />
              <Link href="/assets/financial-record?type=4">{t`modules/assets/margin/index-0`}</Link>
              <Icon name="asset_icon_record" hasTheme />
              <Link href="/assets/main/withdraw/address">{t`assets.withdraw.withdrawAddress`}</Link>
            </>
          }
        />
      }
    >
      <MarginFeeIndex />
    </AssetsLayout>
  )
}

export { Page }
