import { Select, Button } from '@nbit/arco'
import styles from '../index.module.css'

function CToCOrderBookHeader() {
  return (
    <div className={`c2c-order-book-header ${styles['c2c-order-book-header-wrap']}`}>
      <div className="c2c-order-book-header-wrap">
        <Select size="default" />
        <Button type="primary">{`获取数据`}</Button>
      </div>
    </div>
  )
}

export default CToCOrderBookHeader
