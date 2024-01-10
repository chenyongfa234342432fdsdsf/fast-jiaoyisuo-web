import { forwardRef, PropsWithChildren, useImperativeHandle, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import { Form, Button, Slider, Message, FormInstance, Modal } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useMarketStore } from '@/store/market'
import {
  TradePriceTypeEnum,
  TradeModeEnum,
  getTradePriceTypeLabelMap,
  TradeOrderTypesEnum,
  TradeMarketAmountTypesEnum,
  getTradeMarginTypesMap,
  TradeMarginTypesEnum,
  TradeFuturesTypesEnum,
  ITradeSpotTabs,
  TradeMarginEnum,
} from '@/constants/trade'
import {
  getIsPriceNumberTradePriceType,
  getTotalByPercent,
  getTradeAmount,
  getTradeAmountByPercent,
  getTradeFormSubmitBtnText,
  getTradeOrderParams,
  getTradePriceByOrderBook,
  getTradeSpotTrailingOrderParams,
  getTradeTotalPrice,
  validatorTradeNumber,
} from '@/helper/trade'
import { useAssetsStore } from '@/store/assets'
import {
  postTradeMarginPlace,
  postTradePerpetualBatchOrder,
  postTradeOrderPlace,
  postSplSaveStrategy,
} from '@/apis/trade'
import Tabs from '@/components/tabs'
import { useTradeStore } from '@/store/trade'
import { useUpdateLayoutEffect } from 'ahooks'
import { MarketIsShareEnum, SpotStopStatusEnum } from '@/constants/market'
import { formatNumberDecimal } from '@/helper/decimal'
import Decimal from 'decimal.js'
import { useUserStore } from '@/store/user'
import Link from '@/components/link'
import { link } from '@/helper/link'
import { getDefaultTradeUrl } from '@/helper/market'
import { getCanOrderMore } from '@/helper/order/spot'
import { EntrustTypeEnum, OrderDirectionEnum } from '@/constants/order'
import { UserFuturesTradeStatus } from '@/constants/user'
import { decimalUtils } from '@nbit/utils'
import Styles from './index.module.css'
import TradeInputNumber from '../../trade-input-number'
import TradePriceInput from '../../trade-price-input'
import TradeAmountInput from '../../trade-amount-input'
import TradeOrderConfirm from '../../trade-order-confirm'
import TradeTrailingMarketTag from '../../trade-trailing-market-tag'

const FormItem = Form.Item
interface ITradeFormProps {
  isModeBuy: boolean
  tradeMode: TradeModeEnum
  tradeTabType: ITradeSpotTabs | TradeFuturesTypesEnum
  tradeOrderType: TradeOrderTypesEnum
}
function formatTooltip(val) {
  return <span>{val}%</span>
}
export interface ITradeFormRef {
  form: FormInstance
}
function TradeForm({ isModeBuy, tradeMode, tradeTabType, tradeOrderType }: PropsWithChildren<ITradeFormProps>, ref) {
  const [form] = Form.useForm()
  const userStore = useUserStore()
  const { userInfo } = userStore
  const marketState = useMarketStore()
  const assetsStore = useAssetsStore()
  const tradeStore = useTradeStore()
  const { setting, tradePanel, updateTradeUnit } = tradeStore
  const userAssetsSpot = assetsStore?.userAssetsSpot || {}
  const { currentCoin, currentInitPrice } = marketState
  const amountOffset = Number(currentCoin.amountOffset) || 0
  const priceOffset = Number(currentCoin.priceOffset) || 0

  const maxFunds = Number(currentCoin.maxAmount) || 9999999999
  const minFunds = Number(currentCoin.minAmount) || 10
  const maxAmount = Number(currentCoin.maxCount) || 9999999999
  const minAmount = Number(currentCoin.minCount) || 0.01
  const isTrading =
    currentCoin.marketStatus === SpotStopStatusEnum.trading && userInfo.spotStatusInd === UserFuturesTradeStatus.open
  const [isTradeTrailingMarketOrderType, setIsTradeTrailingMarketOrderType] = useState(false)
  const depthQuotePrice = isModeBuy
    ? Number(currentInitPrice.sellPrice || currentCoin.last)
    : Number(currentInitPrice.buyPrice || currentCoin.last)
  const formTriggerPrice = Form.useWatch('triggerPrice', form)
  const hasDepthPrice = isModeBuy ? !!currentInitPrice.sellPrice : !!currentInitPrice.buyPrice
  const currentInitPriceQuotePrice = isModeBuy ? currentInitPrice.sellPrice : currentInitPrice.buyPrice
  const inputPrice = Form.useWatch('price', form)
  const isMarketPriceMode = useMemo(() => {
    if (
      TradeOrderTypesEnum.market === tradeOrderType ||
      (TradeOrderTypesEnum.trailing === tradeOrderType && isTradeTrailingMarketOrderType)
    ) {
      return true
    }
    return false
  }, [tradeOrderType, isTradeTrailingMarketOrderType])

  const initPrice = useMemo(() => {
    if (isTradeTrailingMarketOrderType && TradeOrderTypesEnum.trailing === tradeOrderType) {
      return formTriggerPrice || depthQuotePrice
    }
    if (!isMarketPriceMode) {
      return inputPrice
    }
    return depthQuotePrice
  }, [depthQuotePrice, isTradeTrailingMarketOrderType, formTriggerPrice, tradeOrderType, isMarketPriceMode, inputPrice])

  const high = formatNumberDecimal(
    decimalUtils.SafeCalcUtil.add(1, currentCoin.priceFloatRatio).mul(initPrice || 1) || 9999999999,
    priceOffset
  )
  const low = formatNumberDecimal(
    decimalUtils.SafeCalcUtil.sub(1, currentCoin.priceFloatRatio).mul(initPrice || 1) || 0,
    priceOffset
  )
  const denominatedCoin = currentCoin.buySymbol || 'USDT'
  const underlyingCoin = currentCoin.sellSymbol || 'BTC'
  const isMarginTrade = [(TradeMarginEnum.isolated, TradeMarginEnum.margin)].includes(tradeTabType as any)
  const [loading, setLoading] = useState(false)
  const [percent, setPercent] = useState(0)
  const [tradePriceType, setTradePriceType] = useState(TradePriceTypeEnum.coinType)
  const tradeMarginTypesMap = getTradeMarginTypesMap()
  const tradeMarginTypes = Object.keys(tradeMarginTypesMap).map(key => {
    return {
      title: tradeMarginTypesMap[key],
      id: key,
    }
  })
  /** 输入框下拉计价单位金额还是数量 eg usdt / btc */
  const [amountType, setAmountType] = useState(
    isModeBuy ? TradeMarketAmountTypesEnum.funds : TradeMarketAmountTypesEnum.amount
  )

  /** 交易成交额 input 显示策略，市价隐藏 */
  const totalPriceShow =
    TradeOrderTypesEnum.limit === tradeOrderType ||
    (TradeOrderTypesEnum.trailing === tradeOrderType && !isTradeTrailingMarketOrderType)
  /** 委托输入框 */
  const trailingPriceShow = TradeOrderTypesEnum.trailing === tradeOrderType
  const tradePriceTypeLabelMap = getTradePriceTypeLabelMap(isModeBuy)
  const onTradePriceSelectChange = params => {
    setTradePriceType(params)
  }
  const [tradeMarginType, setTradeMarginType] = useState(TradeMarginTypesEnum.normal)
  const msgRef = useRef<Record<string, any>>({})
  const inputAmountField = useMemo(() => {
    if (tradeOrderType === TradeOrderTypesEnum.limit) {
      return TradeMarketAmountTypesEnum.amount
    }
    if (tradeOrderType === TradeOrderTypesEnum.market) {
      return amountType
    }
    return isTradeTrailingMarketOrderType ? amountType : TradeMarketAmountTypesEnum.amount
  }, [amountType, isTradeTrailingMarketOrderType, tradeOrderType])
  /** 用户总资产 */
  const userCoinTotal = isModeBuy
    ? Number(userAssetsSpot.buyCoin?.availableAmount || 0)
    : Number(userAssetsSpot.sellCoin?.availableAmount || 0)
  /** 转换资产，统一资产的计价比，用来比对是否有钱下单 */
  const userCoinTotalDenominatedCoin = useMemo(() => {
    if (isModeBuy) {
      return userCoinTotal
    }
    return userCoinTotal * initPrice
  }, [userCoinTotal, initPrice, isModeBuy])

  const onAmountSelectChange = params => {
    setAmountType(params)
    onSliderChange(percent)
  }
  /** 重置 form 校验不然爆红 */
  useUpdateLayoutEffect(() => {
    resetForm()
  }, [inputAmountField, form, isTradeTrailingMarketOrderType])

  // 切换 tab 刷新交易额校验
  useUpdateLayoutEffect(() => {
    form.resetFields(['totalPrice', 'triggerPrice'])
    setPercent(0)
  }, [tradeOrderType, form, currentCoin.symbolName])

  /** 当前价格，更具档位、币种等类型获取价格 */
  const getCurrentPrice = () => {
    if (TradePriceTypeEnum.coinType === tradePriceType) {
      return form.getFieldsValue().price || 0
    }
    return getTradePriceByOrderBook(tradePriceType) || 0
  }
  /** 拖动 slide 计算交易数量、交易总额 */
  function onSliderChange(_percent) {
    setPercent(_percent)
    // 限价
    if (
      TradeOrderTypesEnum.limit === tradeOrderType ||
      (TradeOrderTypesEnum.trailing === tradeOrderType && !isTradeTrailingMarketOrderType)
    ) {
      // 统一货币计算
      const userCoinCurrent = userCoinTotalDenominatedCoin / initPrice
      const _price = getCurrentPrice()
      if (_price > 0) {
        const amount = getTradeAmountByPercent(_percent, userCoinCurrent, amountOffset)
        const totalPrice = getTradeTotalPrice(_price, amount, priceOffset)
        form.setFieldsValue({
          amount,
          totalPrice,
        })
        return
      }
    }
    // 市价
    if (isMarketPriceMode) {
      // 统一货币计算
      if (inputAmountField === TradeMarketAmountTypesEnum.funds) {
        const funds = getTotalByPercent(_percent, userCoinTotalDenominatedCoin, priceOffset)
        form.setFieldsValue({
          [inputAmountField]: funds,
        })
      }
      if (inputAmountField === TradeMarketAmountTypesEnum.amount) {
        const amount = getTradeAmountByPercent(_percent, userCoinTotalDenominatedCoin / initPrice, amountOffset)
        form.setFieldsValue({
          [inputAmountField]: amount,
        })
      }
    }
  }
  const onFormChange = (currentVal, params) => {
    // 市价
    if (isMarketPriceMode) {
      let val = currentVal[inputAmountField]
      val = inputAmountField === TradeMarketAmountTypesEnum.amount ? val * initPrice : val
      let _percent = (100 * val) / userCoinTotalDenominatedCoin
      _percent = _percent >= 0 ? _percent : 0
      if (_percent > 100) {
        _percent = 0
      }
      setPercent(_percent)
      return
    }

    if (
      tradeOrderType === TradeOrderTypesEnum.limit ||
      (tradeOrderType === TradeOrderTypesEnum.trailing && !isTradeTrailingMarketOrderType)
    ) {
      const currentKeys = Object.keys(currentVal)
      const updateVal = { ...params }
      if (currentKeys.includes('amount')) {
        updateVal.totalPrice = getTradeTotalPrice(updateVal.price, updateVal.amount || 0, priceOffset)
      } else if (currentKeys.includes('totalPrice')) {
        updateVal.amount = getTradeAmount(updateVal.totalPrice || 0, updateVal.price, amountOffset)
      } else if (currentKeys.includes('price')) {
        updateVal.amount = getTradeAmount(updateVal.totalPrice || 0, updateVal.price, amountOffset)
      }
      let _percent = (100 * updateVal.totalPrice) / userCoinTotalDenominatedCoin
      if (_percent > 100) {
        _percent = 0
      }
      if (_percent >= 0) {
        setPercent(_percent)
      }
      form.setFieldsValue(updateVal)
    }
  }

  function resetForm() {
    form.resetFields(['totalPrice', inputAmountField])
    msgRef.current = {}
    setPercent(0)
  }

  function resetFormAfterSubmit() {
    resetForm()
    form.resetFields(['triggerPrice'])
  }

  function formatFormParams(params) {
    // amountOffset
    if (params.price) {
      params.price = formatNumberDecimal(params.price, priceOffset)
    }
    if (params.totalPrice) {
      params.totalPrice = formatNumberDecimal(params.totalPrice, priceOffset)
    }
    if (params.triggerPrice) {
      params.triggerPrice = formatNumberDecimal(params.triggerPrice, priceOffset)
    }
    return params
  }

  const onFormSubmit = formParams => {
    if (currentCoin.isShare === MarketIsShareEnum.close) {
      Message.error(t`features_trade_spot_trade_form_index_5101315`)
      return
    }
    if (!hasDepthPrice && TradeOrderTypesEnum.market === tradeOrderType) {
      Message.error(t`features_trade_spot_trade_form_index_5101316`)
      return
    }
    const msg = Object.values(msgRef.current).find(v => !!v)
    if (msg) {
      Message.error({ id: 'tradeSubmit', content: msg })
      return
    }
    formParams = formatFormParams(formParams)
    const params = getTradeOrderParams(
      formParams,
      currentCoin,
      tradeMode,
      tradeTabType,
      tradeOrderType,
      tradeMarginType,
      tradePriceType,
      isModeBuy,
      inputAmountField
    ) as any
    if (tradeMode === TradeModeEnum.spot) {
      if (
        !getCanOrderMore(
          tradeOrderType === TradeOrderTypesEnum.trailing ? EntrustTypeEnum.plan : EntrustTypeEnum.normal,
          isModeBuy ? OrderDirectionEnum.buy : OrderDirectionEnum.sell
        )
      ) {
        Message.error(t`features_trade_spot_trade_form_index_5101342`)
        return
      }
      // 下单时是否开启二次确认 仅仅现货计划单（默认必须打开），合约需要用户配置
      /** 现货委托交易需要弹窗 */
      if (TradeOrderTypesEnum.trailing === tradeOrderType && tradeTabType === TradeModeEnum.spot) {
        const getIsDialogSettingOpen = () => {
          if (isTradeTrailingMarketOrderType) {
            return setting.trailing.market.spot
          }
          return setting.trailing.limit.spot
        }
        openTradeOrderPreviewDialog(formParams, getIsDialogSettingOpen(), () => {
          setLoading(true)
          postSplSaveStrategy(
            getTradeSpotTrailingOrderParams(
              formParams,
              currentCoin,
              isModeBuy,
              inputAmountField,
              isTradeTrailingMarketOrderType,
              currentCoin.last
            )
          )
            .then(res => {
              if (res.isOk) {
                Message.success(t`features/orders/details/modify-stop-limit-0`)
                resetFormAfterSubmit()
              }
            })
            .finally(() => setLoading(false))
        })
        return
      }
      /** 市价限价 */
      const getIsDialogSettingOpen = () => {
        if (tradeOrderType === TradeOrderTypesEnum.market) {
          return setting.common.market.spot
        }
        return setting.common.limit.spot
      }
      openTradeOrderPreviewDialog(formParams, getIsDialogSettingOpen(), () => {
        setLoading(true)
        postTradeOrderPlace(params)
          .then(res => {
            if (res.isOk) {
              Message.success(t`features/orders/details/modify-stop-limit-0`)
              resetFormAfterSubmit()
            }
          })
          .finally(() => setLoading(false))
      })
      return
    }

    if (tradeMode === TradeModeEnum.margin) {
      // 下单时是否开启二次确认 仅仅现货计划单（默认必须打开），合约需要用户配置
      /** 现货委托交易需要弹窗 */
      if (TradeOrderTypesEnum.trailing === tradeOrderType) {
        const getIsDialogSettingOpen = () => {
          return setting.trailing.limit.spot
        }
        openTradeOrderPreviewDialog(formParams, getIsDialogSettingOpen(), () => {
          setLoading(true)
          postTradePerpetualBatchOrder({ code: currentCoin.tradeId, params })
            .then(res => {
              if (res.isOk) {
                Message.success(t`features/orders/details/modify-stop-limit-0`)
                resetFormAfterSubmit()
              }
            })
            .finally(() => setLoading(false))
        })
        return
      }

      setLoading(true)
      return postTradeMarginPlace(params)
        .then(res => {
          if (res.isOk) {
            Message.success(t`features/orders/details/modify-stop-limit-0`)
            resetFormAfterSubmit()
          }
        })
        .finally(() => setLoading(false))
    }
    return null
  }

  function openTradeOrderPreviewDialog(formParams, isDialogSettingOpen, onOk, onCancel?: any) {
    if (isDialogSettingOpen) {
      return Modal.confirm({
        icon: null,
        maskClosable: false,
        title: t`features/trade/trade-form/index-5`,
        style: { width: '444px' },
        content: (
          <TradeOrderConfirm
            coin={currentCoin}
            isModeBuy={isModeBuy}
            formParams={formParams}
            tradeOrderType={tradeOrderType}
            tradeMode={tradeMode}
            amountType={inputAmountField}
          />
        ),
        onOk: () => {
          onOk && onOk()
        },
        onCancel: () => {
          onCancel && onCancel()
        },
      })
    }
    onOk && onOk()
  }
  function onTradeMarginTypeChange(item) {
    const type = item.id as TradeMarginTypesEnum
    setTradeMarginType(type)
  }
  useImperativeHandle(ref, () => ({
    form,
  }))

  /** 交易价格档位、币种类型切换需要覆盖数字或者文案 */
  useUpdateLayoutEffect(() => {
    if (tradePriceType === TradePriceTypeEnum.coinType) {
      form.setFieldsValue({ price: currentInitPriceQuotePrice })
    } else {
      form.setFieldsValue({ priceText: tradePriceTypeLabelMap[tradePriceType] })
    }
  }, [tradePriceType, currentInitPriceQuotePrice, tradeOrderType])

  function getInitFormValue() {
    if (tradeOrderType === TradeOrderTypesEnum.market) {
      return { priceText: t`features_trade_trade_price_input_index_2447` }
    }
    if (tradeOrderType === TradeOrderTypesEnum.limit) {
      return {
        price: initPrice,
      }
    }
    if (tradeOrderType === TradeOrderTypesEnum.trailing) {
      return { price: initPrice }
    }
    return {}
  }
  const priceField = getIsPriceNumberTradePriceType(tradeOrderType, tradePriceType) ? 'price' : 'priceText'

  return (
    <div className={classnames(Styles.scoped, `trade-${tradeMode}`, isModeBuy ? `mode-buy` : 'mode-sell')}>
      <Form form={form} initialValues={getInitFormValue()} onChange={onFormChange} onSubmit={onFormSubmit}>
        {/* 一级 Tabs 用作杠杆交易类型切换 */}
        {isMarginTrade && (
          <Tabs
            size="small"
            tabList={tradeMarginTypes}
            mode="button"
            value={tradeMarginType}
            onChange={onTradeMarginTypeChange}
            classNames="mb-2"
          />
        )}
        {/* 计划委托的触发价格 */}
        {trailingPriceShow && (
          <div className="trigger-price-show">
            <FormItem
              field="triggerPrice"
              rules={[
                {
                  validator(value, cb) {
                    value = Number(value)
                    if (!validatorTradeNumber(value)) {
                      const msg = t`features_trade_spot_trade_form_index_2558`
                      msgRef.current.triggerPrice = msg
                      return cb()
                    }
                    msgRef.current.triggerPrice = ''
                    return cb()
                  },
                },
              ]}
            >
              <TradeInputNumber
                precision={priceOffset}
                hideControl={false}
                // mode="button"
                prefix={t`features_trade_spot_trade_form_index_2560`}
                suffix={denominatedCoin}
                // placeholder={t({
                //   id: 'features_trade_spot_trade_form_index_2560',
                //   values: { 0: denominatedCoin },
                // })}
              />
            </FormItem>
          </div>
        )}
        {/* 普通价格输入 */}
        <div
          className={classnames('trigger-price-show', {
            'price-text': priceField === 'priceText',
          })}
        >
          <FormItem
            labelAlign="left"
            field={priceField}
            rules={[
              {
                validator(value, cb) {
                  value = Number(value)
                  if (tradeOrderType === TradeOrderTypesEnum.market) {
                    msgRef.current[priceField] = ''
                    return cb()
                  }
                  if (!validatorTradeNumber(value)) {
                    const msg = t`features/trade/trade-form/index-0`
                    msgRef.current[priceField] = msg
                    return cb()
                  }
                  if (value > high) {
                    const msg = t({
                      id: 'features_trade_spot_trade_form_index_2614',
                      values: { 0: high, 1: denominatedCoin },
                    })
                    msgRef.current[priceField] = msg
                    return cb()
                  }
                  if (value < low) {
                    const msg = t({
                      id: 'features_trade_spot_trade_form_index_2615',
                      values: { 0: low, 1: denominatedCoin },
                    })
                    msgRef.current[priceField] = msg
                    return cb()
                  }
                  msgRef.current[priceField] = ''
                  return cb()
                },
              },
            ]}
          >
            <TradePriceInput
              inputSuffix={denominatedCoin}
              tradeMode={tradeMode}
              precision={priceOffset}
              tradeOrderType={tradeOrderType}
              tradePriceType={tradePriceType}
              isTradeTrailingMarketOrderType={isTradeTrailingMarketOrderType}
              handleSelectChange={onTradePriceSelectChange}
              suffixExt={
                <TradeTrailingMarketTag
                  checked={isTradeTrailingMarketOrderType}
                  onChange={() => {
                    setIsTradeTrailingMarketOrderType(!isTradeTrailingMarketOrderType)
                  }}
                />
              }
            />
          </FormItem>
        </div>
        {/* 数量输入框 */}
        <FormItem
          className={classnames({
            'trade-amount-market-wrap': isMarketPriceMode,
          })}
          field={inputAmountField}
          rules={[
            {
              validator(value, cb) {
                value = Number(value)
                if (inputAmountField === TradeMarketAmountTypesEnum.amount) {
                  if (!validatorTradeNumber(value)) {
                    const msg = t`features/trade/trade-form/index-2`
                    msgRef.current[inputAmountField] = msg
                    return cb()
                  }
                  if (value * initPrice > userCoinTotalDenominatedCoin) {
                    const msg = t`features/trade/trade-form/index-1`
                    msgRef.current[inputAmountField] = msg
                    return cb()
                  }
                  if (value > maxAmount) {
                    const msg = t({
                      id: 'features_trade_spot_trade_form_index_2612',
                      values: { 0: maxAmount, 1: underlyingCoin },
                    })
                    msgRef.current[inputAmountField] = msg
                    return cb()
                  }

                  if (value < minAmount) {
                    const msg = t({
                      id: 'features_trade_spot_trade_form_index_2613',
                      values: { 0: minAmount, 1: underlyingCoin },
                    })
                    msgRef.current[inputAmountField] = msg
                    return cb()
                  }
                  msgRef.current[inputAmountField] = ''
                  return cb()
                }
                if (!validatorTradeNumber(value)) {
                  const msg = t`features_trade_spot_trade_form_index_2603`
                  msgRef.current[inputAmountField] = msg
                  return cb()
                }
                if (tradeOrderType === TradeOrderTypesEnum.limit) {
                  const totalPrice = Number(form.getFieldsValue().totalPrice)
                  if (totalPrice > userCoinTotalDenominatedCoin) {
                    const msg = t`features/trade/trade-form/index-1`
                    msgRef.current[inputAmountField] = msg
                    return cb()
                  }
                  msgRef.current[inputAmountField] = ''
                  return cb()
                }
                if (value > userCoinTotalDenominatedCoin) {
                  const msg = t`features/trade/trade-form/index-1`
                  msgRef.current[inputAmountField] = msg
                  return cb()
                }

                if (value > maxFunds) {
                  const msg = t({
                    id: 'features_trade_spot_trade_form_index_2616',
                    values: { 0: maxFunds },
                  })
                  msgRef.current[inputAmountField] = msg
                  return cb()
                }
                if (value < minFunds) {
                  const msg = t({
                    id: 'features_trade_spot_trade_form_index_2617',
                    values: { 0: minFunds },
                  })
                  msgRef.current[inputAmountField] = msg
                  return cb()
                }
                msgRef.current[inputAmountField] = ''
                return cb()
              },
            },
          ]}
        >
          <TradeAmountInput
            priceOffset={priceOffset}
            amountOffset={amountOffset}
            isTradeTrailingMarketOrderType={isTradeTrailingMarketOrderType}
            handleSelectChange={onAmountSelectChange}
            tradeOrderType={tradeOrderType}
            underlyingCoin={underlyingCoin}
            denominatedCoin={denominatedCoin}
            tradeMode={tradeMode}
            amountType={inputAmountField}
            initPrice={initPrice}
          />
        </FormItem>
        <Slider
          className="slider-wrap"
          disabled={!userStore.isLogin}
          marks={{
            0: '0',
            25: '25',
            50: '50',
            75: '75',
            100: '100',
          }}
          value={percent}
          onChange={onSliderChange}
          defaultValue={0}
          formatTooltip={formatTooltip}
        />
        {/* 成交额 */}
        {totalPriceShow && (
          <FormItem
            field="totalPrice"
            rules={[
              {
                validator(value, cb) {
                  value = Number(value)
                  if (!validatorTradeNumber(value)) {
                    const msg = t`features/trade/trade-form/index-3`
                    msgRef.current.totalPrice = msg
                    return cb()
                  }
                  if (value > maxFunds) {
                    const msg = t({
                      id: 'features_trade_spot_trade_form_index_2616',
                      values: { 0: maxFunds },
                    })
                    msgRef.current.totalPrice = msg
                    return cb()
                  }

                  if (value < minFunds) {
                    const msg = t({
                      id: 'features_trade_spot_trade_form_index_2617',
                      values: { 0: minFunds },
                    })
                    msgRef.current.totalPrice = msg
                    return cb()
                  }
                  msgRef.current.totalPrice = ''
                  return cb()
                },
              },
            ]}
          >
            <TradeInputNumber precision={priceOffset} suffix={denominatedCoin} prefix={t`constants/trade-4`} />
          </FormItem>
        )}
        {[TradeMarginTypesEnum.borrow, TradeMarginTypesEnum.repay].includes(tradeMarginType) && (
          <div className="assets-wrap">
            <div className="label">
              {tradeMarginType === TradeMarginTypesEnum.borrow
                ? t`features/trade/index-4`
                : t`features/trade/trade-form/index-6`}
            </div>
            <div className="num">
              {/* TODO: tradeMarginType */}
              {userAssetsSpot.buyCoin?.availableAmountText} {denominatedCoin}
            </div>
          </div>
        )}
        <FormItem labelAlign="left">
          {!userStore.isLogin && (
            <Button
              type="primary"
              onClick={() => {
                link(`/login?redirect=${getDefaultTradeUrl()}`)
              }}
              long
              className="submit-btn login-btn-wrap"
            >
              {/* {t`features_trade_spot_trade_form_index_5101270`} */}
              <Link href={`/login?redirect=${getDefaultTradeUrl()}`}> {t`user.field.reuse_07`} </Link>
              {t`user.third_party_01`}
              <Link href="/register"> {t`user.validate_form_11`} </Link>
            </Button>
          )}
          {userStore.isLogin && (
            <Button
              loading={loading}
              type="primary"
              disabled={!isTrading}
              htmlType="submit"
              long
              className="submit-btn"
            >
              {getTradeFormSubmitBtnText(tradeMode, isTrading, userInfo.spotStatusInd, isModeBuy, underlyingCoin)}
            </Button>
          )}
        </FormItem>
      </Form>
    </div>
  )
}

export default forwardRef(TradeForm)
