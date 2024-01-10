import { ReactNode } from 'react'
import styles from './order.module.css'

export { OrderHeader }

export type IOrderHeaderProps = {
  children?: ReactNode
  category: string
  subCategory: string
}

function OrderHeader({ children, category, subCategory }: IOrderHeaderProps) {
  return (
    <div className={styles['order-header-wrapper']}>
      <div>
        <div className="text-text_color_3">{category}</div>
        <div className="text-2xl font-bold">{subCategory}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}
