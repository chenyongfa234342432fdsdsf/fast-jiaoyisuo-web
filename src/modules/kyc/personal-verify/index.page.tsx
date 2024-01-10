import PersonApplication from '@/features/kyc/person-application'
import styles from './index.module.css'

function Page() {
  return (
    <div className={styles.scoped}>
      <PersonApplication />
    </div>
  )
}

export { Page }
