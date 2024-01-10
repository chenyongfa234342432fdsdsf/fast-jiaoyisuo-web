import { t } from '@lingui/macro'
import { InputNumberProps, Select } from '@nbit/arco'
import {
  TradeOrderTypesEnum,
  getTradeMarketAmountTypesMap,
  TradeMarketAmountTypesEnum,
  TradeModeEnum,
  TradeFuturesOrderAssetsTypesEnum,
} from '@/constants/trade'
import { getTradeAmountByMarket, getTradeTotalByMarket } from '@/helper/trade'
import { memo } from 'react'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import TradeInputNumber from '../trade-input-number'
import Styles from './index.module.css'

interface ITradeAmountInputProps extends InputNumberProps {
  tradeMode: TradeModeEnum
  tradeOrderType: TradeOrderTypesEnum
  isTradeTrailingMarketOrderType?: boolean
  amountType: string
  underlyingCoin: string
  denominatedCoin: string
  currentLeverage?: string | number
  orderAssetsTypes?: TradeFuturesOrderAssetsTypesEnum
  handleSelectChange?: (params: any) => void
  priceOffset?: number
  amountOffset?: number
  // 只减仓
  futuresDelOptionChecked?: boolean
  positionItemSize?: number
  // 仓位保证金
  initMargin?: number | string
  // 开仓数量
  initAmount?: number | string
  // 金额输入框
  inputPrice?: number | string
  initPrice?: number | string
}

function TradeAmountMarketInput(props: ITradeAmountInputProps) {
  const {
    tradeMode,
    tradeOrderType,
    amountType,
    denominatedCoin,
    underlyingCoin,
    isTradeTrailingMarketOrderType,
    handleSelectChange,
    amountOffset,
    priceOffset,
    currentLeverage,
    orderAssetsTypes,
    min,
    futuresDelOptionChecked,
    positionItemSize,
    initMargin,
    initAmount,
    inputPrice,
    initPrice,
    ...rest
  } = props
  let placeholder
  let tips
  function _onSelectChange(params) {
    if (amountType !== params && handleSelectChange) {
      handleSelectChange(params)
    }
  }
  if (tradeMode === TradeModeEnum.spot) {
    let precision = 2
    const tradeMarketAmountTypesMap = getTradeMarketAmountTypesMap(denominatedCoin, underlyingCoin)

    if (amountType === TradeMarketAmountTypesEnum.funds) {
      precision = priceOffset ?? 2
      placeholder = t({
        id: 'features_trade_trade_amount_input_index_2437',
        values: { 0: min },
      })
      if (rest.value) {
        tips = t({
          id: 'features_trade_trade_amount_input_index_2605',
          values: {
            0: initPrice ? getTradeAmountByMarket(initPrice, rest.value, amountOffset ?? 2) : 0,
            1: underlyingCoin,
          },
        })
      }
    } else {
      precision = amountOffset ?? 2
      placeholder = t({
        id: 'features_trade_trade_amount_input_index_2438',
        values: { 0: min },
      })
      if (rest.value) {
        tips = t({
          id: 'features_trade_trade_amount_input_index_2601',
          values: {
            0: initPrice ? getTradeTotalByMarket(initPrice, rest.value, priceOffset ?? 2) : 0,
            1: denominatedCoin,
          },
        })
      }
    }
    const isTipsShow = rest.value && !Number.isNaN(rest.value)

    return (
      <div className={Styles.scoped}>
        <TradeInputNumber
          {...rest}
          precision={precision}
          min={min}
          prefix={amountType === TradeMarketAmountTypesEnum.funds ? t`constants/trade-4` : t`Amount`}
          // placeholder={placeholder}
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
  // 合约
  const tradeMarketAmountTypesMap = getTradeMarketAmountTypesMap(denominatedCoin, underlyingCoin)
  let precision = 2
  let isTipsShow

  if (futuresDelOptionChecked) {
    isTipsShow = true
    // 可减仓模式
    if (amountType === TradeMarketAmountTypesEnum.funds) {
      precision = priceOffset ?? 2
      placeholder = t({
        id: 'features_trade_trade_amount_input_index_2437',
        values: { 0: min },
      })
      tips = t({
        id: 'features_trade_trade_amount_input_index_2604',
        values: {
          0: initPrice
            ? formatCurrency(formatNumberDecimal(Number(positionItemSize) * Number(initPrice), precision))
            : 0,
          1: denominatedCoin,
        },
      })
    } else {
      precision = amountOffset ?? 2
      placeholder = t({
        id: 'features_trade_trade_amount_input_index_2438',
        values: { 0: min },
      })
      tips = t({
        id: 'features_trade_trade_amount_input_index_2604',
        values: {
          0: formatCurrency(formatNumberDecimal(positionItemSize, precision)),
          1: underlyingCoin,
        },
      })
    }
  } else {
    // 非可检仓模式
    if (amountType === TradeMarketAmountTypesEnum.funds) {
      precision = priceOffset ?? 2
      placeholder = t({
        id: 'features_trade_trade_amount_input_index_2437',
        values: { 0: min },
      })
      if (rest.value) {
        isTipsShow = rest.value && !Number.isNaN(rest.value)
        tips = t({
          id: 'features_trade_trade_amount_input_index_2603',
          values: {
            0: formatCurrency(formatNumberDecimal(initAmount, amountOffset)),
            1: underlyingCoin,
          },
        })
      }
    } else {
      precision = amountOffset ?? 2
      placeholder = t({
        id: 'features_trade_trade_amount_input_index_2438',
        values: { 0: min },
      })
      if (rest.value) {
        isTipsShow = rest.value && !Number.isNaN(rest.value)
        tips = t({
          id: 'features_trade_trade_amount_input_index_2602',
          values: {
            0: formatCurrency(formatNumberDecimal(initMargin, priceOffset)),
            1: denominatedCoin,
          },
        })
      }
    }
  }
  return (
    <div className={Styles.scoped}>
      <TradeInputNumber
        {...rest}
        precision={precision}
        min={min}
        prefix={
          amountType === TradeMarketAmountTypesEnum.funds
            ? t`features_trade_trade_amount_input_index_5101476`
            : t`Amount`
        }
        placeholder={
          futuresDelOptionChecked
            ? amountType === TradeMarketAmountTypesEnum.funds
              ? t`features_trade_trade_order_confirm_index_zacbtzhrmhlaly2ochhc2`
              : t`features_trade_trade_amount_input_index_jg8mwmipfphoevjnieu8t`
            : amountType === TradeMarketAmountTypesEnum.funds
            ? t`features_trade_trade_amount_input_index_d9hiiaadxfjrwqkxvqmv4`
            : t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_5hxz2a8ghwn8chagdlgtf`
        }
        // placeholder={placeholder}
        suffix={
          <div className="flex items-center">
            {tradeMarketAmountTypesMap[amountType]}
            <Select
              onChange={_onSelectChange}
              trigger="hover"
              bordered={false}
              value={amountType}
              style={{ width: 24 }}
              triggerProps={{
                autoAlignPopupWidth: false,
                autoAlignPopupMinWidth: true,
              }}
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

/**
 * -------------------------------------------------------------------------------------------
 */

function TradeAmountInput(props: ITradeAmountInputProps) {
  const {
    tradeMode,
    tradeOrderType,
    amountType,
    denominatedCoin,
    underlyingCoin,
    priceOffset,
    amountOffset,
    isTradeTrailingMarketOrderType,
    min,
    handleSelectChange,
    ...rest
  } = props
  if (tradeMode === TradeModeEnum.spot) {
    /** 现货、杠杆交易的价格输入框 */
    /** 现货交易、限价交易、计划委托下，价格输入框会更具币种和档位变化 text 和 number */
    if (tradeOrderType === TradeOrderTypesEnum.limit) {
      return (
        <div className={Styles.scoped}>
          <TradeInputNumber
            min={min}
            {...rest}
            precision={amountOffset ?? 6}
            // placeholder={t({
            //   id: 'features_trade_trade_amount_input_index_2436',
            //   values: { 0: min },
            // })}
            suffix={underlyingCoin}
            prefix={t`Amount`}
          />
        </div>
      )
    }
    if (tradeOrderType === TradeOrderTypesEnum.market) {
      return <TradeAmountMarketInput {...props} />
    }
    /** 计划委托 */
    if (tradeOrderType === TradeOrderTypesEnum.trailing) {
      if (isTradeTrailingMarketOrderType) {
        return <TradeAmountMarketInput {...props} />
      }
      return (
        <div className={Styles.scoped}>
          <TradeInputNumber
            {...rest}
            min={min}
            // placeholder={t({
            //   id: 'features_trade_trade_amount_input_index_2436',
            //   values: { 0: min },
            // })}
            suffix={underlyingCoin}
            precision={amountOffset ?? 6}
            prefix={t`Amount`}
          />
        </div>
      )
    }
  }
  if (tradeMode === TradeModeEnum.futures) {
    /** 合约交易的价格输入框 */
    /** 现货交易、限价交易、计划委托下，价格输入框会更具币种和档位变化 text 和 number */
    if (tradeOrderType === TradeOrderTypesEnum.limit || tradeOrderType === TradeOrderTypesEnum.market) {
      return <TradeAmountMarketInput {...props} />
    }
    /** 计划委托 */
    if (tradeOrderType === TradeOrderTypesEnum.trailing) {
      return <TradeAmountMarketInput {...props} />
    }
  }

  return null
}

export default memo(TradeAmountInput)
