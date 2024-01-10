import { TradeLayoutEnum } from '@/constants/trade'
import { useTradeStore } from '@/store/trade'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import styles from './index.module.css'

function TradeLayout() {
  const { layout, setLayout } = useTradeStore()

  const layoutList = [
    {
      icon: 'standard_layout',
      label: t`features_trade_trade_layout_trigger_index_5101300`,
      value: TradeLayoutEnum.default,
    },
    {
      icon: 'left_layout',
      label: t`features_trade_trade_layout_trigger_index_5101301`,
      value: TradeLayoutEnum.left,
    },
    {
      icon: 'right_layout',
      label: t`features_trade_trade_layout_trigger_index_5101302`,
      value: TradeLayoutEnum.right,
    },
  ]

  return (
    <div className={styles['layout-options-wrapper']}>
      {layoutList.map(item => {
        const onSelect = () => {
          setLayout('tradeFormPosition', item.value)
        }

        return (
          <div
            key={item.value}
            className={classNames('layout-option', {
              'is-selected': layout.tradeFormPosition === item.value,
            })}
            onClick={onSelect}
          >
            <Icon noPointer className="icon default" name={item.icon} hasTheme />
            <Icon noPointer className="icon selected" name={`${item.icon}_hover`} hasTheme />
            <span>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default TradeLayout
