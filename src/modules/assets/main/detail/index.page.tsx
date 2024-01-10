import { AssetsRouteEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { CoinAssetsDetail } from '@/features/assets/main/assets-detail'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import { usePageContext } from '@/hooks/use-page-context'
// import Icon from '@/components/icon'
// import Link from '@/components/link'
import { t } from '@lingui/macro'
import { useAssetsStore } from '@/store/assets'
import { AssetsHeaderRight } from '@/features/assets/main/common/header-right-opt'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'

export function Page() {
  const assetsStore = useAssetsStore()
  const pageContext = usePageContext()
  const coinName = assetsStore.assetsDetailCoin.coinName || ''
  const coinId = pageContext?.urlParsed?.search?.cid

  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.coins}
      header={
        <AssetsHeader
          title={`${coinName || ''} ${t`modules/assets/coins/detail/index-0`}`}
          // headerChildren={
          //   <>
          //     <Icon name="asset_icon_record" hasTheme />
          //     <Link href="/assets/financial-record">{t`assets.deposit.financialRecord`}</Link>
          //     <Icon name="asset_icon_record" hasTheme />
          //     <Link href="/assets/main/withdraw/address">{t`assets.withdraw.withdrawAddress`}</Link>
          //   </>
          // }
          coinId={coinId}
          rightChildren={<AssetsHeaderRight coinId={coinId} />}
        />
      }
    >
      <CoinAssetsDetail />
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
        title: t`modules/assets/coins/detail/index-0`,
      }),
    },
  }
}
