import { AssetsRouteEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { AssetsOverview } from '@/features/assets/overview'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { AssetsHeaderRight } from '@/features/assets/main/common/header-right-opt'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'

export function Page() {
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.overview}
      header={
        <AssetsHeader
          title={t`assets.index.title`}
          headerChildren={
            <>
              <Icon name="asset_icon_record" hasTheme />
              <Link href="/assets/financial-record">{t`assets.deposit.financialRecord`}</Link>
            </>
          }
          rightChildren={<AssetsHeaderRight isTransfer={false} />}
        />
      }
    >
      <AssetsOverview />
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
      // unAuthTo: '/login?redirect=/assets',
      pageProps,
      layoutParams,
      documentProps: generateAssetsDefaultSeoMeta({
        title: t`assets.index.title`,
      }),
    },
  }
}
