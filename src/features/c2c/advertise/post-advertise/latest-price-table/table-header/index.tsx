import { t } from '@lingui/macro'
import styles from '../index.module.css'

interface LatestPriceTableHeaderProps {
  /** 价格单位 */
  priceUnit: string
  /** 数量单位 */
  quantityUnit: string
}

function LatestPriceTableHeader({ priceUnit, quantityUnit }: LatestPriceTableHeaderProps) {
  return (
    <div className={`latest-price-table-header ${styles['latest-price-table-header']}`}>
      <div className="latest-price-table-header-wrap">
        <div className="gear">
          <label>{t`features/assets/margin/margin-fee/ladder-list/index-0`}</label>
        </div>
        <div className="price latest-price-header-flex">
          <label>
            {t`Price`}
            {`(${priceUnit})`}
          </label>
        </div>
        <div className="quantity">
          <label>
            {t`Amount`}
            {`(${quantityUnit})`}
          </label>
        </div>
      </div>
    </div>
  )
}

export default LatestPriceTableHeader
