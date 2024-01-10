import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import styles from './index.module.css'

export function AdvantageInfo(props) {
  const { isBlockChainType = true } = props

  return (
    <div className={styles['advantage-wrap']}>
      <div className="advantage-info">
        <Icon name={isBlockChainType ? 'quick_credit' : 'lightning_payment'} />
        <span>
          {isBlockChainType
            ? t`assets.withdraw.advantage1`
            : t`features_assets_main_withdraw_advantageinfo_index_5101312`}
        </span>
      </div>
      <div className="advantage-info">
        <Icon name={isBlockChainType ? 'low_cost' : 'pay_withdrawal_fee'} />
        <span>
          {isBlockChainType
            ? t`assets.withdraw.advantage2`
            : t`features_assets_main_withdraw_advantageinfo_index_5101313`}
        </span>
      </div>
      <div className="advantage-info">
        <Icon name={isBlockChainType ? 'safe_and_stable' : 'safe_and_convenient'} />
        <span>
          {isBlockChainType
            ? t`assets.withdraw.advantage3`
            : t`features_assets_main_withdraw_advantageinfo_index_5101314`}
        </span>
      </div>
    </div>
  )
}
