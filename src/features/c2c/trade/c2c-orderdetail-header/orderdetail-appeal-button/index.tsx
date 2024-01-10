import { useState, useEffect } from 'react'
import { fillZero } from '@/helper/date'
import { useCountDown } from 'ahooks'
import cn from 'classnames'
import { t } from '@lingui/macro'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import styles from './index.module.css'
import OrderdetailAppealSubmit from '../orderdetail-appeal-submit'

type Props = {
  setAppealTypeChange: () => void
  time: number
  orders?: YapiGetV1C2COrderDetailData
}

function OrderdetailAppealButton(props: Props) {
  const { setAppealTypeChange, time, orders } = props

  const [buttonStatus, setButtonStatus] = useState<boolean>(time > Date.now())

  const [countdown, { seconds, minutes }] = useCountDown({
    leftTime: time,
    onEnd: () => {
      setButtonStatus(false)
    },
  })

  useEffect(() => {
    time > 0 ? setButtonStatus(true) : setButtonStatus(false)
  }, [time])

  const setAppealChange = () => {
    if (buttonStatus) return
    setAppealTypeChange()
  }

  return (
    <div className={styles.container}>
      {buttonStatus ? (
        <div className="success-button mr-6 rounded">
          <span
            className={cn('text-sm font-medium', {
              'px-5 text-text_color_04': buttonStatus,
              'px-11 text-text_color_01': !buttonStatus,
            })}
          >
            {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`}
            {countdown ? (
              <span>
                ( {fillZero(minutes)}:{fillZero(seconds)}s)
              </span>
            ) : (
              ''
            )}
          </span>
        </div>
      ) : (
        <OrderdetailAppealSubmit className="px-11 text-sm font-medium" orders={orders} onClick={setAppealChange}>
          {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`}
        </OrderdetailAppealSubmit>
      )}
    </div>
  )
}

export default OrderdetailAppealButton
