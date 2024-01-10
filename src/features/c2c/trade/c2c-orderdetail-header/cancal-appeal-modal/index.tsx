import { memo, useState, forwardRef, useImperativeHandle, ReactNode } from 'react'
import Icon from '@/components/icon'
import { Modal } from '@nbit/arco'
import style from './index.module.css'
import { ModalParams } from '../../c2c-trade'

type Props = {
  modalParams: ModalParams
  children: ReactNode
  afterOpen?: () => void
  afterClose?: () => void
  initialVisible?: boolean
}

function CancalAppealModal(props: Props, ref) {
  const { modalParams, children, afterOpen, afterClose, initialVisible } = props

  const [coinsTradeTipModal, setCoinsTradeTipModal] = useState<boolean | undefined>(initialVisible)

  useImperativeHandle(ref, () => ({
    setCancalAppealModalVisible() {
      setCoinsTradeTipModal(true)
    },
    setCancalAppealModalNotVisible() {
      setCoinsTradeTipModal(false)
    },
  }))

  const setCoinsTradeTipModalCanCal = () => {
    setCoinsTradeTipModal(false)
  }

  return (
    <div className={style.scope}>
      <Modal
        title={modalParams?.modalTitle}
        afterOpen={afterOpen}
        afterClose={afterClose}
        visible={coinsTradeTipModal}
        className={style['cancal-trade-modal']}
        footer={null}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={setCoinsTradeTipModalCanCal}
      >
        <div>{children}</div>
      </Modal>
    </div>
  )
}

export default memo(forwardRef(CancalAppealModal))
