import { memo, useState, forwardRef, useImperativeHandle } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Modal } from '@nbit/arco'
import { link } from '@/helper/link'
import { getKycPageRoutePath } from '@/helper/route'
import style from './index.module.css'

type Props = {
  contentTips?: string
}

function C2CCoinspayButton(props: Props, ref) {
  const { contentTips } = props || {}

  const [coinsPayvisible, setCoinsPayvisible] = useState<boolean>(false)

  const [showGoToC2C, setShowGoToC2C] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    openCoinsPayvisibleModal(item) {
      setCoinsPayvisible(true)
      setShowGoToC2C(item)
    },
  }))

  const setGoToKyc = () => {
    link(getKycPageRoutePath())
  }

  const setTradeButton = () => {
    setCoinsPayvisible(false)
  }

  return (
    <div className={style.scope}>
      <Modal
        title={t`features_c2c_trade_shortcut_coins_shorcut_coins_modal_index_msvng0issqryi6qyoystr`}
        visible={coinsPayvisible}
        className={style['coins-trade-modal']}
        footer={null}
        closeIcon={<Icon name="close" hasTheme />}
        onOk={() => setCoinsPayvisible(false)}
        onCancel={() => setCoinsPayvisible(false)}
      >
        <div className="coins-trade-content">
          {contentTips || t`features_c2c_trade_free_trade_free_coinspay_button_index_nqkuhvkuzuxkngai93cb_`}
        </div>
        {!showGoToC2C ? (
          <div className="coins-trade-button" onClick={setTradeButton}>
            {t`user.field.reuse_48`}
          </div>
        ) : (
          <div className="coins-trade-kyc">
            <div className="coins-again-later">{t`features_c2c_trade_free_trade_index_ptlr4xwchw95iebrerelt`}</div>
            <div className="coins-again-attestation" onClick={setGoToKyc}>
              {t`features_c2c_trade_free_trade_index_t_2kb34ljxqk-dnmnmr4u`}
              <span>KYC</span>
              {t`features_c2c_trade_free_trade_index_ueruhwwnrlhksqf41fkqn`}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default memo(forwardRef(C2CCoinspayButton))
