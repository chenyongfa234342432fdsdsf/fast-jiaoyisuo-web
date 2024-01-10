import { Button } from '@nbit/arco'
import { ReactNode, useState, useEffect } from 'react'
import { t } from '@lingui/macro'
import { setOrderUrge } from '@/apis/c2c/c2c-trade'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import styles from './index.module.css'

type Props = {
  className: string
  children: ReactNode
  orders?: YapiGetV1C2COrderDetailData
}

function OrderdetailSuccessChangeButton(props: Props) {
  const { className, children, orders } = props

  const [buttonStatusDisAble, setButtonStatusDisAble] = useState<boolean>(false)

  const setChangeButtonStatus = async () => {
    const { isOk } = await setOrderUrge({ id: orders?.id })
    isOk && setButtonStatusDisAble(true)
  }

  useEffect(() => {
    orders?.urge ? setButtonStatusDisAble(true) : setButtonStatusDisAble(false)
  }, [orders?.urge])

  return (
    <div className={styles.container}>
      <Button
        type="primary"
        disabled={buttonStatusDisAble}
        className="success-button rounded"
        onClick={setChangeButtonStatus}
      >
        <span className={className}>
          {buttonStatusDisAble
            ? t`features_c2c_trade_c2c_orderdetail_header_orderdetail_success_changebutton_index_pfllabeictrasubutzfop`
            : children}
        </span>
      </Button>
    </div>
  )
}

export default OrderdetailSuccessChangeButton
