import { memo, useState } from 'react'
import { getAdvertCheckAdvertById } from '@/apis/c2c/c2c-trade'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Modal } from '@nbit/arco'
import { useCountDown } from 'ahooks'
import cn from 'classnames'
import style from './index.module.css'

type Props = {
  color: string
  setCoinspaybuyBack?: () => void
  setPurchase?: () => void
  advertId?: string
}

function C2CCoinspayButton(props: Props) {
  const { color, setCoinspaybuyBack, setPurchase, advertId } = props || {}

  const [targetDate, setTargetDate] = useState<number>(Date.now() + 30000)

  const [coinsPayvisible, setCoinsPayvisible] = useState<boolean>(false)

  const getAdvertCheckAdvertChange = async () => {
    const { isOk, data } = await getAdvertCheckAdvertById({ advertId })
    if (isOk && !data?.hasAdvert) {
      setCoinsPayvisible(true)
    } else if (isOk && data?.hasAdvert) {
      setTargetDate(Date.now() + 30000)
    }
  }

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      getAdvertCheckAdvertChange()
    },
  })

  const setTradeButton = () => {
    setCoinsPayvisible(false)
    setCoinspaybuyBack && setCoinspaybuyBack()
  }

  const setCoinsPurchase = () => {
    setPurchase && setPurchase()
  }

  return (
    <div className={style.scope}>
      <Modal
        title={t`features_c2c_trade_free_trade_free_tradetip_modal_index_nbrhum24jysk2tcr0fhs8`}
        visible={coinsPayvisible}
        className={style['coins-trade-modal']}
        footer={null}
        closeIcon={<Icon name="close" hasTheme />}
        onOk={() => setCoinsPayvisible(false)}
      >
        <div className="coins-trade-content">{t`features_c2c_trade_free_trade_free_coinspay_button_index_nqkuhvkuzuxkngai93cb_`}</div>
        <div className="coins-trade-button cursor-pointer" onClick={setTradeButton}>
          {t`user.field.reuse_17`}
        </div>
      </Modal>
      <div className={cn('coinspay-button-container cursor-pointer', `bg-${color}`)} onClick={setCoinsPurchase}>
        {t`features_c2c_trade_free_trade_free_coinspay_button_index_pirbcof8ymcddh8mimf8k`}
        {Math.round(countdown / 1000)}s)
      </div>
    </div>
  )
}

export default memo(C2CCoinspayButton)
