import { t } from '@lingui/macro'
import { InputNumberProps, Select } from '@nbit/arco'
import { getTradeMarketAmountTypesMap, TradeMarketAmountTypesEnum } from '@/constants/trade'
import { memo } from 'react'
import { formatCurrency, formatNumberDecimalDelZero } from '@/helper/decimal'
import TradeInputNumber from '../../trade-input-number'
import Styles from './index.module.css'

interface IFuturesCalculatorAmountProps extends InputNumberProps {
  amountType: string
  underlyingCoin: string
  denominatedCoin: string
  handleSelectChange?: (params: any) => void
  priceOffset?: number
  amountOffset?: number
  // 仓位保证金
  initMargin?: number | string
  // 开仓数量
  initAmount?: number | string
  placeholderPrefix: string
}

function FuturesCalculatorAmount(props: IFuturesCalculatorAmountProps) {
  const {
    amountType,
    denominatedCoin,
    underlyingCoin,
    handleSelectChange,
    amountOffset,
    priceOffset,
    min,
    initMargin,
    initAmount,
    prefix,
    placeholderPrefix,
    ...rest
  } = props
  let placeholder
  let tips
  function _onSelectChange(params) {
    if (amountType !== params && handleSelectChange) {
      handleSelectChange(params)
    }
  }
  // 合约
  const tradeMarketAmountTypesMap = getTradeMarketAmountTypesMap(denominatedCoin, underlyingCoin)
  let precision = 2
  let isTipsShow

  // 非可检仓模式
  if (amountType === TradeMarketAmountTypesEnum.funds) {
    precision = priceOffset ?? 2
    // placeholder = t({
    //   id: 'features_trade_trade_amount_input_index_2437',
    //   values: { 0: min },
    // })
    if (rest.value) {
      isTipsShow = rest.value && !Number.isNaN(rest.value)
      tips = t({
        id: 'features_trade_trade_amount_input_index_2601',
        values: {
          0: formatCurrency(formatNumberDecimalDelZero(initAmount, amountOffset)),
          1: underlyingCoin,
        },
      })
    }
  } else {
    precision = amountOffset ?? 2
    // placeholder = t({
    //   id: 'features_trade_trade_amount_input_index_2438',
    //   values: { 0: min },
    // })
    if (rest.value) {
      isTipsShow = rest.value && !Number.isNaN(rest.value)
      tips = t({
        id: 'features_trade_trade_amount_input_index_2601',
        values: {
          0: formatCurrency(formatNumberDecimalDelZero(initMargin, priceOffset)),
          1: denominatedCoin,
        },
      })
    }
  }
  return (
    <div className={Styles.scoped}>
      <TradeInputNumber
        {...rest}
        precision={precision}
        min={min}
        prefix={prefix}
        placeholder={t({
          id: 'features_trade_trade_futures_calculator_futures_calculator_amount_index_k9ejpv80qztlpaolfvodu',
          values: { 0: placeholderPrefix },
        })}
        suffix={
          <div className="flex items-center">
            {tradeMarketAmountTypesMap[amountType]}
            <Select
              onChange={_onSelectChange}
              trigger="hover"
              bordered={false}
              style={{ width: 24 }}
              triggerProps={{
                autoAlignPopupWidth: false,
                autoAlignPopupMinWidth: true,
              }}
              value={amountType}
            >
              {Object.keys(tradeMarketAmountTypesMap).map(key => (
                <Select.Option key={key} value={key}>
                  {tradeMarketAmountTypesMap[key]}
                </Select.Option>
              ))}
            </Select>
          </div>
        }
      />
      <div className="tips-wrap">{isTipsShow && tips}</div>
    </div>
  )
}

export default memo(FuturesCalculatorAmount)
