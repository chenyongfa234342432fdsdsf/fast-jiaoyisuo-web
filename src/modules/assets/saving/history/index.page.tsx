import { t } from '@lingui/macro'
import { AssetsRouteEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { HistoryList } from '@/features/assets/saving/history-list'

import { AssetsHeader } from '@/features/assets/common/assets-header'
import Icon from '@/components/icon'
import Link from '@/components/link'

function Page() {
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.saving}
      header={
        <AssetsHeader
          title={t`modules/assets/saving/index-0`}
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
      <HistoryList />
    </AssetsLayout>
  )
}

export { Page }
