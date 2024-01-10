import styles from './index.module.css'

function UserFormHeader({ title }) {
  return (
    <div className={`user-form-title ${styles.scoped}`}>
      <label>{title}</label>
    </div>
  )
}

export default UserFormHeader
