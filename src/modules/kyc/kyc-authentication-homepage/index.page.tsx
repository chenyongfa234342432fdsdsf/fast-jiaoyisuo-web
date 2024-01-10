import PersonalCenter from '@/features/user/personal-center/profile'
import TradeDeal from '@/features/trade/trade-deal'
import FutureGroupModal from '@/features/future/future-group-modal'
import styles from './index.module.css'

function Page() {
  return (
    <div className={styles.scoped}>
      <div className="authentication-homepage-container">
        <PersonalCenter />
        {/* <FutureGroupModal /> */}
      </div>
    </div>
  )
}

export { Page }
