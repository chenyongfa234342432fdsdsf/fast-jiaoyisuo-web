import Icon from '@/components/icon'
import classNames from 'classnames'
import Styles from './index.module.css'

function TradeTrailingMarketTag({ onChange, checked }: { onChange: any; checked: boolean }) {
  return (
    <span className={classNames(Styles.scoped, { checked })} onClick={onChange}>
      <Icon hasTheme={!checked} name={!checked ? 'contract_market_price' : 'contract_market_price_hover'} />
    </span>
  )
}

export default TradeTrailingMarketTag
