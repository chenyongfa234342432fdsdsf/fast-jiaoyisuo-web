import { OrderBookButtonTypeEnum } from '@/store/order-book/common'
import styles from '../index.module.css'

interface TableDatasType {
  /** 价格 */
  price: number
  /** 数量 */
  quantity: number
}

interface CToCOrderBookHeaderProps {
  /** 档位数据 */
  tableDatas: Array<TableDatasType>
  /** 买盘或卖盘状态 */
  status: number
  /** 买盘反转 */
  reverse?: boolean
}

function CToCOrderBookContainer({ tableDatas, status, reverse }: CToCOrderBookHeaderProps) {
  const list = [...tableDatas]
  if (reverse) list.reverse()
  return (
    <div className={`c2c-order-book-container ${styles['c2c-order-book-container-wrap']}`}>
      <div className="c2c-order-book-container-wrap">
        {list.map((v, index) => (
          <div className={status === OrderBookButtonTypeEnum.buy ? 'buy' : 'sell'} key={index}>
            <div className="gear">
              <label>{`档${status === OrderBookButtonTypeEnum.buy ? index + 1 : list.length - index}`}</label>
            </div>
            <div className="price">
              <label>{v.price}</label>
            </div>
            <div className="quantity">
              <label>{v.quantity}</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CToCOrderBookContainer
