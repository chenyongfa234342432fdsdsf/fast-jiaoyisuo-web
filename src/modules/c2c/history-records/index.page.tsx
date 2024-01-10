import { C2cHistoryRecordsLayout } from '@/features/c2c/trade/history-records'
import { getC2cHistoryRecordsPageRoutePath } from '@/helper/route'
import { t } from '@lingui/macro'

function Page() {
  return <C2cHistoryRecordsLayout />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: true,
    headerShow: true,
    fullScreen: true,
  }
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${getC2cHistoryRecordsPageRoutePath()}`,
      pageProps,
      layoutParams,
      documentProps: {
        title: t`features_c2c_advertise_advertise_detail_index_oyifsrcn099n_0hhowlwb`,
      },
    },
  }
}
