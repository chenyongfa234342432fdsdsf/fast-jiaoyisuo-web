import { t } from '@lingui/macro'
import { InputNumberProps, InputProps, Select } from '@nbit/arco'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { getTradePriceTypeMap, TradePriceTypeEnum, TradeOrderTypesEnum, TradeModeEnum } from '@/constants/trade'
import { FocusEventHandler, memo, ReactNode } from 'react'
import TradeInputNumber from '../trade-input-number'
import TradeInputText from '../trade-input-text'
import Styles from './index.module.css'

interface ITradePriceInputProps {
  handleSelectChange?: (params: any) => void
  tradeMode: TradeModeEnum
  tradeOrderType: TradeOrderTypesEnum
  tradePriceType: TradePriceTypeEnum
  isTradeTrailingMarketOrderType: boolean
  inputSuffix: string
  precision?: number
  suffixExt?: ReactNode
}

type ITradePriceInput<T> = T extends {
  tradeMode: infer P
  tradePriceType: infer Q
} & ITradePriceInputProps
  ? P extends TradeModeEnum.spot
    ? Q extends Exclude<TradePriceTypeEnum, TradePriceTypeEnum.coinType>
      ? ITradePriceInputProps & InputProps
      : ITradePriceInputProps & InputNumberProps
    : ITradePriceInputProps & InputNumberProps
  : ITradePriceInputProps

function TradePriceInput<T>(props: ITradePriceInput<T>) {
  const {
    suffixExt,
    tradeMode,
    tradePriceType,
    tradeOrderType,
    handleSelectChange,
    inputSuffix,
    isTradeTrailingMarketOrderType,
    ...rest
  } = props
  const tradePriceTypeMap = getTradePriceTypeMap(inputSuffix)
  /** 现货、杠杆交易的价格输入框 */
  /** 现货交易、限价交易、计划委托下，价格输入框会更具币种和档位变化 text 和 number */
  if (tradeOrderType === TradeOrderTypesEnum.limit) {
    if (tradePriceType === TradePriceTypeEnum.coinType) {
      return (
        <div className={Styles.scoped}>
          <TradeInputNumber
            prefix={t`Price`}
            suffix={inputSuffix}
            hideControl={false}
            // mode="button"
            {...rest}
            // placeholder={t({
            //   id: 'features_trade_trade_price_input_index_2559',
            //   values: { 0: inputSuffix },
            // })}
          />
        </div>
      )
    }
    return (
      <div className={Styles.scoped}>
        <TradeInputText
          {...rest}
          prefix={t`Price`}
          onFocus={() => {
            /** 现货场景点击文字的 input 价格框需要切换到 币种具体数字的 input */
            handleSelectChange &&
              (handleSelectChange(TradePriceTypeEnum.coinType) as unknown as FocusEventHandler<ReactNode>)
          }}
          suffix={
            <div className="">
              {tradeMode !== TradeModeEnum.futures && <Icon className="cursor-pointer mr-1" name="msg" />}

              <Select
                onChange={handleSelectChange}
                trigger="hover"
                defaultValue={TradePriceTypeEnum.coinType}
                bordered={false}
                style={{ width: 24 }}
                triggerProps={{
                  autoAlignPopupWidth: false,
                  autoAlignPopupMinWidth: true,
                }}
              >
                {Object.keys(tradePriceTypeMap).map(key => (
                  <Select.Option key={key} value={key}>
                    {tradePriceTypeMap[key]}
                  </Select.Option>
                ))}
              </Select>
            </div>
          }
        />
      </div>
    )
  }
  if (tradeOrderType === TradeOrderTypesEnum.trailing) {
    if (isTradeTrailingMarketOrderType) {
      return (
        <div className={Styles.scoped}>
          <TradeInputText prefix={t`Price`} placeholder={t`features_trade_trade_price_input_index_2447`} disabled />
          {suffixExt && suffixExt}
        </div>
      )
    }
    return (
      <div className={Styles.scoped}>
        <TradeInputNumber
          prefix={t`Price`}
          suffix={inputSuffix}
          hideControl={false}
          // mode="button"
          {...rest}
        />
        {suffixExt && suffixExt}
      </div>
    )
  }
  if (tradeOrderType === TradeOrderTypesEnum.market) {
    return (
      <div className={Styles.scoped}>
        <TradeInputText prefix={t`Price`} placeholder={t`features_trade_trade_price_input_index_2447`} disabled />
      </div>
    )
  }
  return null
}

export default memo(TradePriceInput)
