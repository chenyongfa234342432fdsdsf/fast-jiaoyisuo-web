import { AssetsRouteEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { MarginAccountIndex } from '@/features/assets/margin'
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
          title={t`assets.layout.menus.leverage`}
          headerChildren={
            <>
              <Icon name="asset_icon_record" hasTheme />
              <Link href="/assets/financial-record?type=4">{t`modules/assets/margin/index-0`}</Link>
              <Icon name="asset_icon_record" hasTheme />
              <Link href="/assets/margin/margin-fee">{t`modules/assets/margin/index-1`}</Link>
            </>
          }
        />
      }
    >
      <MarginAccountIndex />
    </AssetsLayout>
  )
}

export { Page }
