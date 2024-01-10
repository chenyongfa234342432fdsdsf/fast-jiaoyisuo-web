import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import styles from './index.module.css'

function UserBackToTheLastPage() {
  return (
    <div className={`back ${styles.scoped}`}>
      <Icon name="back" hasTheme />
      <label onClick={() => window.history.back()}>{t`user.field.reuse_44`}</label>
    </div>
  )
}

export default UserBackToTheLastPage
