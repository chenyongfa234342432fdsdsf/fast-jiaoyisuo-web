// import Tabs from '@/components/tabs'
import { formatDate } from '@/helper/date'
import classNames from 'classnames'
import ErrorBoundary from '@/components/error-boundary'
import TradeDeal from '@/features/trade/trade-deal'
import styles from './index.module.css'

export function TradeListItem({ item }: { item: any }) {
  const isSell = item.direction === 'sell' || item.direction === 'short'

  return (
    <div
      className={classNames(styles['trade-list-item-wrapper'], {
        'is-sell': isSell,
      })}
    >
      <div className="price col-1">{item.price}</div>
      <div className="text col-2">{item.amount}</div>
      <div className="text col-3">{formatDate(item.ts, 'hh:mm:ss')}</div>
    </div>
  )
}
export type TradeListLayoutProps = {
  headers: {
    name: string
    className?: string
  }[]
  tradeList: any[]
}

export function TradeListLayout(props) {
  return (
    <div className={styles['trade-list-wrapper']}>
      <ErrorBoundary>
        <TradeDeal {...props} />
      </ErrorBoundary>
    </div>
  )
}
