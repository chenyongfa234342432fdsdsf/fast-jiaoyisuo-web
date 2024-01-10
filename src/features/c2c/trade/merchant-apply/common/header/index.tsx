import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { getC2cMerchantPageRoutePath } from '@/helper/route'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import styles from './index.module.css'

export function C2cMaHeader() {
  return (
    <div className={classNames(styles.header)}>
      <div className="title-wrapper">
        <div className="title">
          {t`features_c2c_trade_merchant_apply_common_header_index_5qxi9ymko3sivaqhho67m`}
          <Icon name="c2c_application_merchant" className="merchant-icon" />
        </div>

        <div
          className="back-button"
          onClick={() => {
            link(getC2cMerchantPageRoutePath())
          }}
        >
          <span>{t`user.field.reuse_44`}</span>
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>
    </div>
  )
}
