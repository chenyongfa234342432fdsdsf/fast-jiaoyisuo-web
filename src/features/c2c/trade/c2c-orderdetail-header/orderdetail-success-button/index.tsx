import { Button } from '@nbit/arco'
import { ReactNode } from 'react'
import styles from './index.module.css'

type Props = {
  className: string
  children: ReactNode
}

function OrderdetailSuccessButton(props: Props) {
  const { className, children } = props

  return (
    <div className={styles.container}>
      <Button type="primary" className="success-button rounded">
        <span className={className}>{children}</span>
      </Button>
    </div>
  )
}

export default OrderdetailSuccessButton
