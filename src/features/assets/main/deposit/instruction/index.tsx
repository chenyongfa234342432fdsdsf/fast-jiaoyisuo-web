/**
 * 充值说明
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import styles from './index.module.css'

export function Instruction({ rechargeWarnWord }) {
  if (!rechargeWarnWord) return null

  return (
    <div className={styles.scoped}>
      <div className="assets-label mt-6">{t`assets.deposit.remind`}</div>
      <div className="remind-wrap">
        <Icon name="msg" className="msg" />
        <div className="remind-info" dangerouslySetInnerHTML={{ __html: rechargeWarnWord }}></div>
      </div>
    </div>
  )
}
