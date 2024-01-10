import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { Modal, Button } from '@nbit/arco'
import classNames from 'classnames'
import { useBaseMessageCenterStore } from '@/store/message-center'
import styles from './index.module.css'

export default function CloseModal() {
  const { loginModal, loginData, setLoginModal } = useBaseMessageCenterStore()

  const onChangeCancel = () => {
    setLoginModal()
    link('/login')
  }

  const onRouterCancel = path => {
    setLoginModal()
    link(path)
  }

  return (
    <Modal
      focusLock
      closable={false}
      autoFocus={false}
      visible={loginModal}
      footer={
        <>
          <Button onClick={() => onRouterCancel('/retrieve')}>{t`user.pageContent.title_03`}</Button>
          <Button type="primary" onClick={() => onRouterCancel('/login')}>
            {t`user.field.reuse_32`}
          </Button>
        </>
      }
      className={classNames(styles['message-modal-wrapper'], 'arco-modal')}
    >
      <div className="modal-wrapper-content">
        <div className="content-header">
          <div className="content-header-text">{loginData?.title}</div>
          <Icon name="close" hasTheme className="modal-close-icon" onClick={onChangeCancel} />
        </div>
        <Icon name="tips_icon" className="message-modal-icon" />
        <div className="modal-header" dangerouslySetInnerHTML={{ __html: loginData?.content }} />
      </div>
    </Modal>
  )
}
