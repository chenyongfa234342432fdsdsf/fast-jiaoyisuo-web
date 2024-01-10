import AdvertiseDetail from '@/features/c2c/advertise/advertise-detail'
import C2CTab from '@/features/c2c/trade/c2c-tab'
import { generateAssetsDefaultSeoMeta } from '@/helper/assets'
import { getC2cDefaultSeoMeta } from '@/helper/c2c/trade'
import { t } from '@lingui/macro'

export function Page() {
  return (
    <div className="bg-bg_color">
      <C2CTab showIsTop={false}>
        <AdvertiseDetail />
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
      pageProps,
      layoutParams,
      documentProps: await getC2cDefaultSeoMeta(
        t`modules_c2c_advertise_advertise_detail_index_page_y-rdiiflzyp_su7e2fzja`
      ),
    },
  }
}
