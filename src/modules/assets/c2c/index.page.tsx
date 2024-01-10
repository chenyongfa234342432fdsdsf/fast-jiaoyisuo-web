import { AssetsRouteEnum, FinancialRecordLogTypeEnum } from '@/constants/assets'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { C2CAccountIndex } from '@/features/assets/c2c/index '
import { Button } from '@nbit/arco'
import { TransferButton } from '@/features/assets/common/transfer/common/transfer-button'
import { getC2cOrderShortPageRoutePath } from '@/helper/route'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'

export function Page() {
  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.c2c}
      header={
        <AssetsHeader
          title={t`modules_assets_c2c_index_page_o1rsaevd6o1hmm3i3urkc`}
          headerChildren={
            <>
              <Icon name="asset_icon_record" hasTheme />
              <Link
                href={`/assets/financial-record?type=${FinancialRecordLogTypeEnum.c2c}`}
              >{t`assets.deposit.financialRecord`}</Link>
            </>
          }
          rightChildren={
            <>
              {/* <TransferButton /> */}
              <Link href={`${getC2cOrderShortPageRoutePath()}`} className="flex">
                <Button type="primary">{t`features_c2c_new_common_c2c_new_nav_index_5101352`}</Button>
              </Link>
            </>
          }
        />
      }
    >
      <C2CAccountIndex />
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
      unAuthTo: '/login?redirect=/assets/c2c',
      pageProps,
      layoutParams,
      documentProps: generateAssetsDefaultSeoMeta({
        title: t`modules_assets_c2c_index_page_o1rsaevd6o1hmm3i3urkc`,
      }),
    },
  }
}
