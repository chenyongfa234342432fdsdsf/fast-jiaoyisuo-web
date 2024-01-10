import { TradeFuturesCalculatorIncomeUnitEnum, getTradeFuturesCalculatorIncomeUnitMap } from '@/constants/trade'
import { t } from '@lingui/macro'
import { Select } from '@nbit/arco'
import classNames from 'classnames'
import { memo } from 'react'
import TradeInputNumber from '../../trade-input-number'
import Styles from './index.module.css'

function FuturesIncomeInput(props) {
  const { futuresIncomeOptionUnit, setFuturesOptionUnit, suffix, ...rest } = props
  const tradeFuturesCalculatorIncomeUnitMap = getTradeFuturesCalculatorIncomeUnitMap()
  return (
    <div className={classNames(Styles.scoped, 'futures-income-input-wrap')}>
      <Select
        onChange={setFuturesOptionUnit}
        bordered={false}
        triggerProps={{
          autoAlignPopupWidth: false,
          autoAlignPopupMinWidth: true,
          position: 'bl',
        }}
        className="mr-2 futures-income-select-wrap"
        style={{ width: 52 }}
        value={futuresIncomeOptionUnit}
      >
        {Object.keys(tradeFuturesCalculatorIncomeUnitMap).map(key => (
          <Select.Option key={key} value={key}>
            {tradeFuturesCalculatorIncomeUnitMap[key]}
          </Select.Option>
        ))}
      </Select>
      <TradeInputNumber
        {...rest}
        hideControl
        suffix={suffix}
        placeholder={
          futuresIncomeOptionUnit === TradeFuturesCalculatorIncomeUnitEnum.incomeNumber
            ? t`features_trade_trade_futures_calculator_futures_income_input_index_zbzlq7y_ketaw78aa8ai0`
            : t`features_trade_trade_futures_calculator_futures_income_input_index_-ijzlywnorfysgueoz6wh`
        }
      />
    </div>
  )
}

export default memo(FuturesIncomeInput)
