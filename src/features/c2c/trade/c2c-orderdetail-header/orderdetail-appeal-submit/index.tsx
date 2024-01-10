import { Button } from '@nbit/arco'
import { ReactNode } from 'react'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import styles from './index.module.css'

type Props = {
  className: string
  children?: ReactNode
  orders?: YapiGetV1C2COrderDetailData
  onClick?: () => void
}

function OrderDetailAppealButton(props: Props) {
  const { className, children, onClick } = props

  return (
    <div className={styles.container}>
      <Button type="secondary" className="success-button mr-6 rounded" onClick={onClick}>
        <span className={className}>{children}</span>
      </Button>
    </div>
  )
}

export default OrderDetailAppealButton
