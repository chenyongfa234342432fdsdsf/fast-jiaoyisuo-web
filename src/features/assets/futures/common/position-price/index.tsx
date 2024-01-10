/**
 * 合约 - 仓位价格展示组件
 */
import { t } from '@lingui/macro'
import { formatCurrency } from '@/helper/decimal'
import classNames from 'classnames'
import styles from './index.module.css'

interface PositionPriceProps {
  /** 开仓均价 */
  openPrice: string
  /** 标记价 */
  markPrice: string
  /** 最新价 */
  latestPrice: string
  /** 计价币 */
  baseCoin: string
  /** 计价币精度 */
  priceOffset: number
  /** 最新价点击事件 */
  onSelectLatestPrice?: () => void
  /** 最新价样式 */
  cssLatestPrice?: string
}
export default function PositionPrice(props: PositionPriceProps) {
  const {
    openPrice = '',
    markPrice = '',
    latestPrice = '',
    baseCoin = '',
    priceOffset = 2,
    onSelectLatestPrice,
    cssLatestPrice,
  } = props || {}
  const priceList = [
    {
      // 开仓均价
      label: t({
        id: 'features_assets_futures_futures_detail_position_list_index_5101366',
        values: { 0: baseCoin },
      }),
      value: formatCurrency(openPrice, priceOffset),
    },
    {
      // 标记价格
      label: t({
        id: 'features_assets_futures_futures_detail_position_list_index_5101367',
        values: { 0: baseCoin },
      }),
      value: formatCurrency(markPrice, priceOffset),
    },
    {
      // 最新价格
      label: t({
        id: 'features_assets_futures_common_position_price_index_5101503',
        values: { 0: baseCoin },
      }),
      value: formatCurrency(latestPrice, priceOffset),
      onClick: onSelectLatestPrice,
      cssName: cssLatestPrice,
    },
  ]

  return (
    <div className={styles['position-price-root']}>
      {priceList.map((item, index: number) => {
        return (
          <div
            className={classNames('price-item', item?.cssName)}
            key={index}
            onClick={() => {
              if (!item.onClick) return
              item?.onClick()
            }}
          >
            <span>{item.label}</span>
            <span className="value">{item.value}</span>
          </div>
        )
      })}
    </div>
  )
}
