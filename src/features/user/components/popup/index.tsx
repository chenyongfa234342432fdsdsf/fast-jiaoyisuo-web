import { Modal } from '@nbit/arco'
import styles from './index.module.css'

function UserPopUp({ children, ...props }) {
  return (
    <Modal {...props}>
      <div className={`user-popup-wrap ${styles.scoped}`}>{children}</div>
    </Modal>
  )
}

export default UserPopUp
