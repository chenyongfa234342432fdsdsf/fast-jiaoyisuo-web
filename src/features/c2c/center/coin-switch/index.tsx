import { memo } from 'react'
import { t } from '@lingui/macro'

import Icon from '@/components/icon'
import cn from 'classnames'

import styles from './coin-switch.module.css'

function CoinSwitch({ reverse, setReverse, onChange }) {
  const handleReverseFn = () => {
    setReverse(!reverse)
    onChange()
  }
  return (
    <div className={styles.scope}>
      <div className="coin-switch-container">
        <div className="coin-switch-left">
          <div className={cn('coin-switch', { 'up-reverse': reverse })}>
            <Icon name="group" fontSize={16} hasTheme className="coin-switch-icon" />
            <div className="fixed-text">{t`features/assets/common/transfer/index-2`}</div>
            <div className="sub-text">{t`features_c2c_center_coin_switch_index_msuc6zmu2dxzocr_5wzmr`}</div>
          </div>
          <div className="coin-switch-center">
            <Icon name="c2c_next" fontSize={12} hasTheme className="icon" />
          </div>
          <div className={cn('coin-switch', { 'down-reverse': reverse })}>
            <Icon name="help_recharge_withdraw" fontSize={16} hasTheme className="coin-switch-icon" />
            <div className="fixed-text">{t`features/assets/common/transfer/index-9`}</div>
            <div className="sub-text">C2C {t`features_c2c_center_coin_switch_index_3rawstucyu0jlw1lxln_i`}</div>
          </div>
        </div>
        <div className="coin-switch-right">
          <Icon name="image_change" onClick={() => handleReverseFn()} fontSize={20} className="icon" />
        </div>
      </div>
    </div>
  )
}

export default memo(CoinSwitch)
