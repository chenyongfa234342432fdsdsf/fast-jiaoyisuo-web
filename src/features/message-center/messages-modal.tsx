import { Modal, Button } from '@nbit/arco'
import { formatDate } from '@/helper/date'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import styles from './index.module.css'

type MessagesModalType = {
  data: any
  visible: boolean
  onChange?: () => void
  onCancel?: () => void
}

function MessagesModal({ data, visible, onChange, onCancel }: MessagesModalType) {
  const onChangeMessage = () => {
    onChange && onChange()
  }

  const onChangeCancel = () => {
    onCancel && onCancel()
  }

  return (
    <Modal
      focusLock
      autoFocus={false}
      visible={visible}
      title={t`features_message_center_messages_modal_5101265`}
      onOk={onChangeMessage}
      onCancel={onChangeCancel}
      footer={
        <>
          <Button onClick={onChangeCancel}>{t`user.field.reuse_48`}</Button>
          {data?.webLink ? (
            <Button onClick={onChangeMessage} type="primary">
              <Link href={data.webLink}>{t`features/message-center/messages-3`}</Link>
            </Button>
          ) : null}
        </>
      }
      className={styles['message-modal-wrapper']}
    >
      <div className="modal-header">{data?.title}</div>
      <div className="modal-time">{formatDate(data?.eventTime)}</div>
      <div className="modal-body">{data?.content}</div>
    </Modal>
  )
}
export default MessagesModal
