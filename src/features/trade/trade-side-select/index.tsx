import { TradeBuyOrSellEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import styles from './index.module.css'

type ITradeSideSelectProps = {
  value: TradeBuyOrSellEnum
  onChange: (value: TradeBuyOrSellEnum) => void
}

function TradeSideSelect({ value, onChange }: ITradeSideSelectProps) {
  const selectBuy = () => {
    onChange(TradeBuyOrSellEnum.buy)
  }

  const selectSell = () => {
    onChange(TradeBuyOrSellEnum.sell)
  }
  return (
    <div className={styles['trade-side-select-wrapper']}>
      <div
        className={classNames('buy', {
          selected: value === TradeBuyOrSellEnum.buy,
        })}
        onClick={selectBuy}
      >
        {t`order.constants.direction.buy`}
      </div>
      <div
        className={classNames('sell', {
          selected: value === TradeBuyOrSellEnum.sell,
        })}
        onClick={selectSell}
      >
        {t`order.constants.direction.sell`}
      </div>
    </div>
  )
}

export default TradeSideSelect
