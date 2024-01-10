import classNames from 'classnames'
import styles from './index.module.css'
import { TradeActivityList } from './trade-activity-list'

/**
 * 市场异动
 * @param height 列表高度
 * @param initNum 初始化时列表条数展示限制
 */
export default function MarketActivity() {
  return (
    <section className={classNames(styles.scoped)}>
      <TradeActivityList />
    </section>
  )
}
