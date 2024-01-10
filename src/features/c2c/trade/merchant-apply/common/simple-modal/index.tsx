import { Modal } from '@nbit/arco'
import classNames from 'classnames'
import styles from './index.module.css'

function C2cMaSimpleModal({ visible, title, onCancel, children, modalClass = {}, modalClassName = '' }) {
  return (
    <Modal
      escToExit
      className={modalClassName}
      onCancel={() => {
        onCancel()
      }}
      title={title}
      visible={visible}
      autoFocus={false}
      wrapClassName={classNames(styles.modal, modalClass)}
      footer={null}
      closeIcon={false}
    >
      <div className="modal-content">{children}</div>
    </Modal>
  )
}

export default C2cMaSimpleModal
