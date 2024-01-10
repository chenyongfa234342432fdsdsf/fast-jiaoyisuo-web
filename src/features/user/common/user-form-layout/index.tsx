import UserBackToTheLastPage from '@/features/user/common/back'
import UserFormHeader from './header'
import styles from './index.module.css'

function UserFormLayout({ title, children }) {
  return (
    <section className={`user-form-layout ${styles.scoped}`}>
      <UserBackToTheLastPage />
      <div className="form">
        {title && <UserFormHeader title={title} />}
        <div className="form-wrap">
          <div className="container">{children}</div>
          <div className="placeholder"></div>
        </div>
      </div>
    </section>
  )
}

export default UserFormLayout
