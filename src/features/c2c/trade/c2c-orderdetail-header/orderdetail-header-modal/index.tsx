import { memo, useState, forwardRef, useImperativeHandle } from 'react'
import Icon from '@/components/icon'
import { debounce } from 'lodash'
import { Modal, Button } from '@nbit/arco'
import style from './index.module.css'
import { ModalParams } from '../../c2c-trade'

type Props = {
  modalParams: ModalParams
}

function OrderdetailHeaderModal(props: Props, ref) {
  const { modalParams } = props

  const [coinsTradeTipModal, setCoinsTradeTipModal] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    setHeaderModalVisible() {
      setCoinsTradeTipModal(true)
    },
  }))

  const setCoinsTradeTipModalOk = debounce(async () => {
    if (modalParams?.onOkChange) {
      const res = await modalParams?.onOkChange()
      res && setCoinsTradeTipModal(false)
    }
  }, 300)

  const setCoinsTradeTipModalCanCal = () => {
    setCoinsTradeTipModal(false)
  }

  return (
    <div className={style.scope}>
      <Modal
        title={modalParams?.modalTitle}
        visible={coinsTradeTipModal}
        className={style['coins-trade-modal']}
        footer={null}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={setCoinsTradeTipModalCanCal}
      >
        <div className="coins-trade-content">{modalParams?.modalContent}</div>
        <div className="coins-trade-button">
          <div className="coins-trade-cancel cursor-pointer" onClick={setCoinsTradeTipModalCanCal}>
            {modalParams?.canCelText}
          </div>
          <Button type="primary" className="coins-trade-ok" onClick={setCoinsTradeTipModalOk}>
            {modalParams?.okText}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default memo(forwardRef(OrderdetailHeaderModal))
