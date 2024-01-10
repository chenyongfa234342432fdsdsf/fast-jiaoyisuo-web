import styles from '../index.module.css'

interface CToCOrderBookTableHeaderProps {
  /** 价格单位 */
  priceUnit: string
  /** 数量单位 */
  quantityUnit: string
}

function CToCOrderBookTableHeader({ priceUnit, quantityUnit }: CToCOrderBookTableHeaderProps) {
  return (
    <div className={`c2c-order-book-table-header ${styles['c2c-order-book-table-header']}`}>
      <div className="c2c-order-book-table-header-wrap">
        <div className="gear">
          <label>{`档位`}</label>
        </div>
        <div className="price">
          <label>
            {`价格`}
            {`(${priceUnit})`}
          </label>
        </div>
        <div className="quantity">
          <label>
            {`数量`}
            {`(${quantityUnit})`}
          </label>
        </div>
      </div>
    </div>
  )
}

export default CToCOrderBookTableHeader
