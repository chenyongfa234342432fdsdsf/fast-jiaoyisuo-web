import { CSSProperties, ReactNode } from 'react'
import { Modal } from '@nbit/arco'

type ModalType = {
  style?: CSSProperties
  className?: string | string[]
  visible: boolean
  children: ReactNode
}

function CustomModal({ style, className, visible, children }: ModalType) {
  return (
    <Modal className={className} style={style} visible={visible} title={null} footer={null} closeIcon={null}>
      {children}
    </Modal>
  )
}

export default CustomModal
