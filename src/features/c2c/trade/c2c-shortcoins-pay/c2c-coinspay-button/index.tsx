import { memo, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { getQuickHasProgressing } from '@/apis/c2c/c2c-trade'
import { Modal, Button } from '@nbit/arco'
import { debounce } from 'lodash'
import { YapiPostV1C2CQuickTransactionBuyCurrencyListData } from '@/typings/yapi/C2cQuickTransactionBuyCurrencyV1PostApi'
import { useCountDown } from 'ahooks'
import cn from 'classnames'
import style from './index.module.css'

type Props = {
  color: string
  buttonText: string
  setCoinspaybuyBack?: () => void
  contentTips?: string
  setCoinspayChange: () => void
  selectedPayMethod?: YapiPostV1C2CQuickTransactionBuyCurrencyListData
  selectedPayAdvertId?: number
}

function C2CCoinspayButton(props: Props, ref) {
  const {
    color,
    setCoinspaybuyBack,
    contentTips,
    setCoinspayChange,
    selectedPayMethod,
    selectedPayAdvertId,
    buttonText,
  } = props || {}

  const [targetDate, setTargetDate] = useState<number>(Date.now() + 30000)

  const [coinsPayvisible, setCoinsPayvisible] = useState<boolean>(false)

  const [coinsPayLoading, setCoinsPayLoading] = useState<boolean>(false)

  const getQuickHasRequqest = async () => {
    const { isOk, data } = await getQuickHasProgressing({
      advertId: selectedPayAdvertId || selectedPayMethod?.advertId,
    })
    if (isOk && !data) {
      setCoinsPayvisible(true)
    } else if (isOk && data) {
      setTargetDate(Date.now() + 30000)
    }
  }

  useImperativeHandle(ref, () => ({
    openCoinsPayvisibleModal() {
      setCoinsPayvisible(true)
    },
  }))

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      getQuickHasRequqest()
    },
  })

  const setTradeButton = () => {
    setCoinsPayvisible(false)
    setCoinspaybuyBack && setCoinspaybuyBack()
  }

  const setCoinsPurchase = useCallback(
    debounce(async () => {
      setCoinsPayLoading(true)
      try {
        await setCoinspayChange()
        setCoinsPayLoading(false)
      } catch (error) {
        setCoinsPayLoading(false)
      }
    }, 500),
    [setCoinspayChange]
  )

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
        <div className="coins-trade-content">
          {contentTips || t`features_c2c_trade_free_trade_free_coinspay_button_index_nqkuhvkuzuxkngai93cb_`}
        </div>
        <div className="coins-trade-button cursor-pointer" onClick={setTradeButton}>
          {t`user.field.reuse_17`}
        </div>
      </Modal>
      <Button
        loading={coinsPayLoading}
        className={cn('coinspay-button-container cursor-pointer', {
          'coinspay-button-purchase': color === 'buy_up_color',
          'coinspay-button-sell': color !== 'buy_up_color',
        })}
        onClick={setCoinsPurchase}
      >
        {t`user.field.reuse_17`}
        {buttonText}({Math.round(countdown / 1000)}s)
      </Button>
    </div>
  )
}

export default memo(forwardRef(C2CCoinspayButton))
