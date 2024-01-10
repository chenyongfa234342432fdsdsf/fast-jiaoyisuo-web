import CToCOrderBookHeader from '@/features/order-book/c2c/header'
import CToCOrderBookTableHeader from '@/features/order-book/c2c/table-header'
import CToCOrderBookContainer from '@/features/order-book/c2c/container'
import { OrderBookButtonTypeEnum } from '@/store/order-book/common'
import styles from './index.module.css'

function CToCOrderBook() {
  const list = new Array(5).fill({
    price: 1,
    quantity: 1,
  })
  return (
    <div className={`c2c-order-book ${styles.scoped}`}>
      <div className="c2c-order-book-wrap">
        <CToCOrderBookHeader />

        <CToCOrderBookTableHeader priceUnit="CNY" quantityUnit="USDT" />

        <CToCOrderBookContainer tableDatas={list} status={OrderBookButtonTypeEnum.sell} />

        <CToCOrderBookContainer tableDatas={list} status={OrderBookButtonTypeEnum.buy} />
      </div>
    </div>
  )
}

export default CToCOrderBook
