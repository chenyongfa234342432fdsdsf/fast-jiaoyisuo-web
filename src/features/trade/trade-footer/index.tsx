import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { IncreaseTag } from '@nbit/react'
import Styles from './index.module.css'

function TradeFooter() {
  return (
    <div className={Styles.scoped}>
      <div className="left">
        <Icon className="mr-2" name="home" />
        {t`Stable connection`}
      </div>
      <div className="main">
        <div className="line"></div>
        <div className="item">
          <div className="name">USDT</div>
          <div className="change">
            <IncreaseTag kSign hasPrefix value={66666} />
          </div>
          <div className="last-price">1111</div>
          <div className="line"></div>
        </div>
      </div>
      <div className="right">
        <div className="item">
          <Icon className="mr-2" name="home" />
          {t`Download`}
        </div>
      </div>
    </div>
  )
}

export default TradeFooter
