import { useState, memo, useRef, forwardRef, useImperativeHandle } from 'react'
import { Modal, ModalProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import './c2cmodal.module.css'

interface Props extends ModalProps {
  modalmsg: string
  okText: string
  onOk?: (e?: MouseEvent) => Promise<any> | void
  showLeftTopIcon?: boolean
}

function C2CModal(props: Props, ref) {
  const { modalmsg, okText, onOk, showLeftTopIcon = true } = props

  const C2CModalRef = useRef<HTMLDivElement | null>(null)

  const [modalVisibl, setModalVisibl] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    openModal() {
      setModalVisibl(true)
    },
    closeModal() {
      setModalVisibl(false)
    },
  }))

  const setCloseModal = () => {
    setModalVisibl(false)
  }

  return (
    <div ref={C2CModalRef} className="kyc-modal-container">
      <div>
        <Modal
          {...props}
          onCancel={() => setCloseModal()}
          okText={okText}
          title={
            <div className="modal-title">
              <div>
                {showLeftTopIcon && <Icon name="msg" />}
                {t`trade.c2c.max.reminder`}
              </div>
              <div onClick={() => setCloseModal()}>
                <Icon name="close" hasTheme />
              </div>
            </div>
          }
          visible={modalVisibl}
          wrapClassName="free-trade-modal"
          onOk={onOk}
          closable={false}
          mountOnEnter
          getPopupContainer={() => C2CModalRef.current as Element}
        >
          <div className="modal-detail">{modalmsg}</div>
        </Modal>
      </div>
    </div>
  )
}

export default memo(forwardRef(C2CModal))
