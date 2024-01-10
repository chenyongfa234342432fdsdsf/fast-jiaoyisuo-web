import { memo } from 'react'
import { t } from '@lingui/macro'
import { useLayoutStore } from '@/store/layout'
import Link from '@/components/link'
import { HelpCenterUrl } from '../../c2c-trade'

function C2CCoinspayBuy() {
  const layoutStore = useLayoutStore()

  return (
    <Link href={layoutStore.columnsDataByCd?.[HelpCenterUrl.C2CLegalDisclaimer]?.webUrl}>
      <span>
        {t`features_c2c_trade_c2c_shortcoins_pay_c2c_coinspay_sell_index_c6dw8xl3jzto67_6tm25r`}
        {t`features_c2c_trade_c2c_shortcoins_pay_c2c_coinspay_sell_index_tjzlw8u5ihfzs4qvyhknl`}》
      </span>
    </Link>
  )
}

export default memo(C2CCoinspayBuy)
