import { memo, useState, forwardRef, useImperativeHandle } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Modal } from '@nbit/arco'
import { ReturnFreeTradeTip } from '../../c2c-trade'
import style from './index.module.css'

type Props = {
  freeTradeTipProps: ReturnFreeTradeTip
}

function BidTradeTipModal(props: Props, ref) {
  const { freeTradeTipProps } = props

  const { tipContent, tipButton, tipTitle } = freeTradeTipProps || {}

  const [coinsTradeTipModal, setCoinsTradeTipModal] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    setCoinsTradeTipVisible() {
      setCoinsTradeTipModal(true)
    },
    setCoinsTradeTipNotVisible() {
      setCoinsTradeTipModal(false)
    },
  }))

  return (
    <div className={style.scope}>
      <Modal
        title={tipTitle || t`features_c2c_trade_free_trade_free_tradetip_modal_index_nbrhum24jysk2tcr0fhs8`}
        visible={coinsTradeTipModal}
        className={style['coins-trade-modal']}
        footer={null}
        closeIcon={<Icon name="close" hasTheme />}
        onOk={() => setCoinsTradeTipModal(false)}
        onCancel={() => setCoinsTradeTipModal(false)}
      >
        <div className="coins-trade-content">{tipContent}</div>
        {tipButton}
      </Modal>
    </div>
  )
}

export default memo(forwardRef(BidTradeTipModal))
