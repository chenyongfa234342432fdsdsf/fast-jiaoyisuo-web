import { AssetsRouteEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { TotalAssets } from '@/features/assets/saving/total-assets'
import { SavingList } from '@/features/assets/saving/saving-list'

import { AssetsHeader } from '@/features/assets/common/assets-header'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { t } from '@lingui/macro'

function Page() {
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.saving}
      header={
        <AssetsHeader
          title={t`assets.layout.menus.financial`}
          headerChildren={
            <>
              <Icon name="asset_icon_record" hasTheme />
              <Link href="/assets/saving">{t`assets.layout.menus.financial`}</Link>
              <Icon name="asset_icon_record" hasTheme />
              <Link href="/assets/saving/history">{t`modules/assets/saving/index-0`}</Link>
            </>
          }
        />
      }
    >
      <TotalAssets />
      <SavingList />
    </AssetsLayout>
  )
}

export { Page }
