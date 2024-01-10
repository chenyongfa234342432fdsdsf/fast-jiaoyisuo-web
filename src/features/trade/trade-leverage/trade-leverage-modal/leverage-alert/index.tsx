import Icon from '@/components/icon'
import Link from '@/components/link'
import { determineRedirectionUrl, getFooterDataByColName } from '@/helper/layout/footer'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import styles from './index.module.css'

function LeverageAlert() {
  const [redirectUrl, setredirectUrl] = useState('')

  useEffect(() => {
    // TODOs: check with backend column name is constant or not
    const col = getFooterDataByColName(t`features_trade_trade_leverage_modal_leverage_alert_index_5101351`)
    const url = col && determineRedirectionUrl(col)
    setredirectUrl(url || '')
  }, [])

  return (
    <Link className={styles.scoped} href={redirectUrl} target>
      {/* <Icon className="mb-auto translate-y-1/2 text-xs" name="msg" /> */}
      <span className="text-brand_color ml-1 text-xs">
        <span className="text-warning_color">{t`features_trade_trade_leverage_modal_leverage_alert_index_5101355`}</span>
        <span className="dash-underline">{t`features_trade_trade_leverage_trade_leverage_modal_leverage_alert_index_93hhmfkjew04zi8qp7qji`}</span>
      </span>
    </Link>
  )
}

export default LeverageAlert
