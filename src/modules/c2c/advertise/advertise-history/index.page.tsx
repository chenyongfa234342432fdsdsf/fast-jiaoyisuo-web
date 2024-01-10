import { AdvertiseHistory } from '@/features/c2c/advertise/advertise-history'
import C2CTab from '@/features/c2c/trade/c2c-tab'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'
import { getC2cDefaultSeoMeta } from '@/helper/c2c/trade'
import { getC2cAdsHistoryPageRoutePath } from '@/helper/route'
import { t } from '@lingui/macro'

export function Page() {
  return (
    <div className="bg-bg_color">
      <C2CTab showIsTop={false} activeTab="AdsList">
        <AdvertiseHistory />
      </C2CTab>
    </div>
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
      unAuthTo: `/login?redirect=${getC2cAdsHistoryPageRoutePath()}`,
      pageProps,
      layoutParams,
      documentProps: await getC2cDefaultSeoMeta(
        t`modules_c2c_advertise_advertise_history_index_page_server_0qa7cw9nfgw7jtuclr1po`
      ),
    },
  }
}
