/**
 * 合约 - 止盈止损弹窗组件
 */
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { useLockFn, useUnmount, useUpdateEffect, useMemoizedFn } from 'ahooks'
import {
  getTriggerPriceTypeEnumName,
  EntrustTypeEnum,
  StopLimitTabEnum,
  TriggerPriceTypeEnum,
  // TradePairMarketStatus,
  FuturePositionDirectionEnum,
  FuturesOrderSideTypeEnum,
  StopLimitStrategyTypeEnum,
  StrategyOptionTypeEnum,
  StopLimitTriggerDirectionEnum,
} from '@/constants/assets/futures'
import {
  getAmountByPercent,
  getPercentByAmount,
  onGetExpectedProfit,
  getFuturesMarketDepthApi,
} from '@/helper/assets/futures'
import { IncreaseTag } from '@nbit/react'
import { Button, Message, Form } from '@nbit/arco'
import AssetsPopUp from '@/features/assets/common/assets-popup'
import stylesForm from '@/features/assets/common/assets-popup/asset-popup-form/index.module.css'
import AssetsInputNumber from '@/features/assets/common/assets-input-number'
import { IPositionListData, ITradePairDetailData } from '@/typings/api/assets/futures/position'
import { getTradePairDetailApi } from '@/apis/assets/futures/common'
import {
  deletePerpetualStrategy,
  deletePerpetualStrategyAll,
  getPerpetualPositionStrategyDetails,
  postPerpetualStrategyPlace,
} from '@/apis/assets/futures/position'
import { decimalUtils } from '@nbit/utils'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { WsBizEnum, WsTypesEnum } from '@/constants/ws'
import { YapiGetPerpetualMarketRestV1MarketDepthApiResponse } from '@/typings/yapi/PerpetualMarketRestMarketDepthV1GetApi'
import { FuturesPositionStrategyDetailsResp } from '@/typings/api/assets/futures'
import { formatNonExponential } from '@/helper/decimal'
import PositionPrice from '../position-price'
import styles from './index.module.css'
import SliderBar from '../slider'
import { EntrustTypeSelect, EntrustTriggerTypeSelect } from '../entrust-select'
import { PlanPrice } from '../position-price/footer-position-price'
import { PositionModalHeader } from '../position-modal-header'

interface StopLimitModalProps {
  visible: boolean
  setVisible: (val: boolean) => void
  type?: number
  /** 仓位信息 */
  positionData: IPositionListData
  onSuccess?: (val?: any) => void
}

export function StopLimitModal(props: StopLimitModalProps) {
  const { visible, setVisible, positionData, type = StopLimitTabEnum.stopLimit, onSuccess } = props || {}
  /** 仓位基本信息 */
  const {
    groupId = '',
    symbol = '',
    tradeId,
    positionId = '',
    size = 0,
    openPrice = '',
    markPrice = '',
    latestPrice = '',
    sideInd,
    symbolWassName = '',
  } = positionData || {}

  /** positionDealPrice 最新成交价 */
  const {
    wsDealSubscribe,
    wsDealUnSubscribe,
    wsMarkPriceSubscribe,
    wsMarkPriceUnSubscribe,
    positionDealPrice,
    updatePositionDealPrice,
    positionMarkPrice,
    updatePositionMarkPrice,
    futuresCurrencySettings: { currencySymbol, offset },
  } = useAssetsFuturesStore()

  const FormItem = Form.Item
  const [form] = Form.useForm()
  const [percent, setPercent] = useState(0)
  const [buttonDisable, setButtonDisable] = useState(true)
  const [loading, setLoading] = useState(false)
  /** 合约币对详情 */
  const [tradePairDetails, setTradePairDetails] = useState<ITradePairDetailData | undefined>() // 币对详情
  const [positionStopDetails, setPositionStopDetails] = useState<FuturesPositionStrategyDetailsResp>() // 仓位止盈止损详情
  const [profitInfo, setProfitInfo] = useState({
    profit: '',
    positionProfit: '',
    positionLoss: '',
  }) // 仓位预计止盈止损
  const [activeTab, setActiveTab] = useState(type || StopLimitTabEnum.stopLimit)
  const { strategyInfo, updateStrategyInfo } = useAssetsFuturesStore().positionModule

  const {
    /** 数量精度位 */
    amountOffset = 0,
    priceOffset = 0,
    /** 计价币名 */
    quoteSymbolName = '',
    /** 标的币名 */
    baseSymbolName = '',
    /** taker 费率 */
    takerFeeRate = 0,
    // /** marketStatus：合约交易状态 - 1 开盘中、2 停盘中、3 预约开盘 */
    // marketStatus = TradePairMarketStatus.stop,
  } = tradePairDetails || {}

  const [entrustType, setEntrustType] = useState<EntrustTypeEnum>(strategyInfo.entrustType)
  const [triggerType, setTriggerType] = useState<TriggerPriceTypeEnum>(strategyInfo.triggerPriceType)
  const [triggerTypeStopLoss, setTriggerTypeStopLoss] = useState<TriggerPriceTypeEnum | string>(
    strategyInfo.lossTriggerPriceType
  )
  const [triggerTypeStopProfit, setTriggerTypeStopProfit] = useState<TriggerPriceTypeEnum | string>(
    strategyInfo.profitTriggerPriceType
  )

  const tabs = [
    { title: t`features/orders/details/future-11`, id: StopLimitTabEnum.stopLimit },
    { title: t`features_assets_futures_common_stop_limit_modal_index_5101469`, id: StopLimitTabEnum.positionStopLimit },
  ]

  /**
   * 撤销仓位止盈止损
   */
  const onCancelStrategy = async (id: string) => {
    const res = await deletePerpetualStrategy({ id })

    const { isOk } = res || {}
    if (!isOk) {
      return false
    }

    return true
  }

  /**
   * 撤销全部仓位止盈止损
   */
  const onCancelStrategyAll = async () => {
    const res = await deletePerpetualStrategyAll({
      tradeId,
      groupId,
      positionId,
      entrustTypeInd: EntrustTypeEnum.market,
    })

    const { isOk } = res || {}
    if (!isOk) {
      return false
    }

    return true
  }

  /**
   * 撤销
   */
  const onRevoke = useLockFn(async (id?: string) => {
    let isSuccess = true
    isSuccess = id
      ? await onCancelStrategy(positionStopDetails && positionStopDetails[id].id)
      : await onCancelStrategyAll()

    isSuccess
      ? Message.success(t`features_assets_futures_common_stop_limit_modal_index_5101470`)
      : Message.error(t`features_assets_futures_common_stop_limit_modal_index_5101373`)

    setVisible(false)
    onSuccess && onSuccess()
  })

  const onProfitInfo = () => {
    const triggerPrice = form.getFieldValue('triggerPrice')
    const entrustPrice = form.getFieldValue('entrustPrice')
    const amount = form.getFieldValue('amount')
    // 计算预计盈亏
    // 限价：(委托价格 - 开仓均价) * 平仓数量 - 委托价格 * 平仓数量 * taker 费率
    // 市价：(触发价格 - 开仓均价) * 平仓数量 - 触发价格 * 平仓数量 * taker 费率
    const price = entrustType === EntrustTypeEnum.limit ? entrustPrice : triggerPrice
    const profitInfoData = {
      ...profitInfo,
      profit: onGetExpectedProfit({
        price,
        closeSize: amount,
        openPrice,
        takerFeeRate: `${takerFeeRate}`,
        sideInd,
      }),
    }

    setProfitInfo(profitInfoData)
  }

  const onProfitInfoPosition = () => {
    const lossPrice = form.getFieldValue('triggerPriceStopLoss')
    const profitPrice = form.getFieldValue('triggerPriceStopProfit')
    // 计算仓位止盈止损预计盈亏
    // 市价：(触发价格 - 开仓均价) * 平仓数量 - 触发价格 * 平仓数量 * taker 费率
    const profitInfoData = {
      ...profitInfo,
      positionProfit: onGetExpectedProfit({
        price: profitPrice,
        closeSize: `${size}`,
        openPrice,
        takerFeeRate: `${takerFeeRate}`,
        sideInd,
      }),
      positionLoss: onGetExpectedProfit({
        price: lossPrice,
        closeSize: `${size}`,
        openPrice,
        takerFeeRate: `${takerFeeRate}`,
        sideInd,
      }),
    }
    setProfitInfo(profitInfoData)
  }

  /** 预计盈亏 */
  // features_assets_futures_common_close_position_modal_index_5101385
  const isMarketPrice = entrustType === EntrustTypeEnum.market
  const priceInputText = isMarketPrice
    ? t`features_assets_futures_common_close_position_modal_index_5101385`
    : t({
        id: 'features_assets_futures_common_stop_limit_modal_index_5101376',
        values: { 0: quoteSymbolName },
      })
  /** 拖动 slide 计算数量 */
  function onSliderChange(_percent) {
    setPercent(_percent)
    const amount = getAmountByPercent(_percent, Number(size), amountOffset)
    form.setFieldValue('amount', amount)
    if (activeTab === StopLimitTabEnum.stopLimit) {
      onProfitInfo()
      return
    }
    onProfitInfoPosition()
  }

  /** 输入数值，计算百分比 */
  const onInputChange = val => {
    const _percent = getPercentByAmount(val, Number(size))
    if (_percent >= 0) {
      setPercent(_percent)
    }
    if (activeTab === StopLimitTabEnum.stopLimit) {
      onProfitInfo()
      return
    }
    onProfitInfoPosition()
  }

  /** 监听表单内容改变，校验通过时按钮亮起 */
  const onFormChange = async () => {
    if (activeTab === StopLimitTabEnum.stopLimit) {
      onProfitInfo()
      return
    }
    onProfitInfoPosition()
    // try {
    //   await form.validate()
    //   setButtonDisable(false)
    // } catch (e) {
    //   setButtonDisable(true)
    // }
  }

  interface SetTriggerDirectionProps {
    /** 触发价格 */
    triggerPrice?: string | number
    /** 触发类型 */
    triggerPriceTypeInd?: string
  }

  /**
   * 计算触发方向
   * 平多 触发价格大于最新价格，标记价格 = 向上
   * 平多 触发价格小于最新价格，标记价格 = 向下
   * 平空 触发价格小于最新价格，标记价格 = 向下
   * 平空 触发价格大于最新价格，标记价格 = 向上
   * @param sideInd 仓位类型 多/空
   * @param strategyTypeInd 策略类型 止盈/止损
   * @param triggerPrice 触发价格
   * @param positionDealPrice 最新价格
   * @param positionMarkPrice 标记价格
   * @returns 触发方向 triggerDirectionInd
   */
  const onSetTriggerDirection = (param: SetTriggerDirectionProps) => {
    const { triggerPrice, triggerPriceTypeInd } = param

    let comparePrices = triggerPriceTypeInd === TriggerPriceTypeEnum.new ? positionDealPrice : positionMarkPrice

    let triggerDirectionInd

    switch (sideInd) {
      case FuturePositionDirectionEnum.openBuy:
        if (Number(triggerPrice) > Number(comparePrices)) {
          triggerDirectionInd = StopLimitTriggerDirectionEnum.up
        }

        if (Number(triggerPrice) < Number(comparePrices)) {
          triggerDirectionInd = StopLimitTriggerDirectionEnum.down
        }
        break
      case FuturePositionDirectionEnum.openSell:
        if (Number(triggerPrice) < Number(comparePrices)) {
          triggerDirectionInd = StopLimitTriggerDirectionEnum.down
        }

        if (Number(triggerPrice) > Number(comparePrices)) {
          triggerDirectionInd = StopLimitTriggerDirectionEnum.up
        }
        break
      default:
        break
    }

    return triggerDirectionInd
  }

  /**
   * 计算止盈止损策略类型 (分批)
   * 当方向为多时，委托价格（限价）/触发价格（市价）>开仓均价 订单记为止盈；委托价格（限价）/触发价格（市价）=<开仓均价 订单记为止损
   * 当方向为空时，委托价格（限价）/触发价格（市价）<开仓均价 订单记为止盈；委托价格（限价）/触发价格（市价）>=开仓均价 订单记为止损
   */
  const onGetTriggerDirection = (newPrice: string) => {
    let strategyTypeInd = ''

    // 计算当前为止盈还是止损
    const difference = Number(decimalUtils.SafeCalcUtil.sub(newPrice, openPrice))

    switch (sideInd) {
      case FuturePositionDirectionEnum.openBuy:
        strategyTypeInd = difference > 0 ? StopLimitStrategyTypeEnum.stopProfit : StopLimitStrategyTypeEnum.stopLoss
        break
      case FuturePositionDirectionEnum.openSell:
        strategyTypeInd = difference > 0 ? StopLimitStrategyTypeEnum.stopLoss : StopLimitStrategyTypeEnum.stopProfit
        break
      default:
        break
    }

    return strategyTypeInd
  }

  /**
   * 获取仓位方向
   */
  const onSetTriggerSide = () => {
    return {
      [FuturePositionDirectionEnum.openBuy]: FuturesOrderSideTypeEnum.closeLong,
      [FuturePositionDirectionEnum.openSell]: FuturesOrderSideTypeEnum.closeShort,
    }[sideInd]
  }

  /**
   * 新增止盈止损
   */
  const onStrategyPlace = useLockFn(async (req, hint: string) => {
    setLoading(true)
    const res = await postPerpetualStrategyPlace(req)
    const { isOk, message = '' } = res || {}

    if (!isOk) {
      setLoading(false)
      return
    }

    Message.success(hint)
    setLoading(false)
    setVisible(false)
    onSuccess && onSuccess()
  })

  /** 确定 */
  const onCommitForm = async () => {
    const triggerSideInd = onSetTriggerSide()
    const triggerPrice = form.getFieldValue('triggerPrice')
    const entrustPrice = form.getFieldValue('entrustPrice')
    const amount = form.getFieldValue('amount')
    const lossPrice = form.getFieldValue('triggerPriceStopLoss')
    const profitPrice = form.getFieldValue('triggerPriceStopProfit')

    switch (activeTab) {
      case StopLimitTabEnum.stopLimit: // 分批止盈止损
        if (!triggerPrice) {
          Message.warning(t`features_trade_spot_trade_form_index_2558`)
          return
        }

        if (entrustType === EntrustTypeEnum.limit && !entrustPrice) {
          Message.warning(t`features/trade/trade-form/index-4`)
          return
        }

        if (!amount) {
          Message.warning(t`features/trade/trade-form/index-2`)
          return
        }

        if (amount > size) {
          Message.warning(t`features_assets_futures_common_stop_limit_modal_index_5101546`)
          return
        }
        // 计算当前为止盈还是止损
        const newTriggerPrice = entrustType === EntrustTypeEnum.limit ? entrustPrice : triggerPrice
        let strategyTypeInd = onGetTriggerDirection(newTriggerPrice)
        const triggerDirectionInfo = onSetTriggerDirection({
          triggerPrice: newTriggerPrice,
          triggerPriceTypeInd: triggerType,
        })
        const params = {
          groupId,
          positionId,
          tradeId,
          strategyOperationType: StrategyOptionTypeEnum.part,
          strategyTypeInd,
          triggerSideInd,
          triggerDirectionInd: triggerDirectionInfo,
          triggerPrice,
          triggerPriceTypeInd: triggerType,
          price: entrustPrice,
          entrustTypeInd: entrustType,
          size: formatNonExponential(amount),
          percent: 0,
          // ...triggerDirectionInfo,
        }
        const req: any = {
          stopProfit: params,
          stopLoss: params,
        }

        if (triggerDirectionInfo === StopLimitStrategyTypeEnum.stopProfit) {
          delete req.stopLoss
        } else {
          delete req.stopProfit
        }

        onStrategyPlace(req, t`features_assets_futures_common_stop_limit_modal_index_5101531`)
        break
      case StopLimitTabEnum.positionStopLimit: // 仓位止盈止损
        // const maxProfitPrice =
        //   triggerTypeStopProfit === TriggerPriceTypeEnum.new ? positionDealPrice : positionMarkPrice
        // const maxLossPrice = triggerTypeStopLoss === TriggerPriceTypeEnum.new ? positionDealPrice : positionMarkPrice

        // 校验止盈止损输入价格
        const marketDepth: YapiGetPerpetualMarketRestV1MarketDepthApiResponse['data'] =
          (await getFuturesMarketDepthApi(symbol)) || {}
        const maxBids = marketDepth?.bids?.[0]?.[0] || '' // 买 1 价
        const maxAsks = marketDepth?.asks?.[0]?.[0] || '' // 卖 1 价

        // 无对手盘时提示交易失败
        if (
          (sideInd === FuturePositionDirectionEnum.openBuy && (lossPrice || profitPrice) && !maxAsks) ||
          (sideInd === FuturePositionDirectionEnum.openSell && (lossPrice || profitPrice) && !maxBids)
        ) {
          Message.error(t`features_trade_spot_trade_form_index_5101316`)
          return
        }
        if (sideInd === FuturePositionDirectionEnum.openBuy) {
          // 多仓位：止盈 > 卖 1 价   止损 < 卖 1 价  多仓位：止盈 > 最新价格/标记价格，不需要判断 止损 < 最新价格/标记价格
          if (profitPrice && Number(profitPrice) <= Number(maxAsks)) {
            Message.warning(t`features_assets_futures_common_stop_limit_modal_index_5101533`)
            return
          }

          if (lossPrice && Number(lossPrice) >= Number(maxAsks)) {
            Message.warning(t`features_assets_futures_common_stop_limit_modal_index_5101534`)
            return
          }
        } else {
          // 空仓位：止盈 < 买 1 价   止损 > 买 1 价  空仓位：止盈 < 最新价格/标记价格，不需要判断 止损 > 最新价格/标记价格
          if (profitPrice && Number(profitPrice) >= Number(maxBids)) {
            Message.warning(t`features_assets_futures_common_stop_limit_modal_index_5101533`)
            return
          }

          if (lossPrice && Number(lossPrice) <= Number(maxBids)) {
            Message.warning(t`features_assets_futures_common_stop_limit_modal_index_5101534`)
            return
          }
        }

        if (!profitPrice && !lossPrice) {
          Message.warning(t`features_assets_futures_common_stop_limit_modal_index_5101532`)
          return
        }

        const positionParams = {
          groupId,
          positionId,
          size,
          tradeId,
          strategyOperationType: StrategyOptionTypeEnum.position,
          entrustTypeInd: EntrustTypeEnum.market,
        }

        let positionReq: any = {}

        if (profitPrice && !positionStopDetails?.stopProfit) {
          const profitDirection = onSetTriggerDirection({
            triggerPrice: profitPrice,
            triggerPriceTypeInd: triggerTypeStopProfit,
          })
          positionReq.stopProfit = {
            strategyTypeInd: StopLimitStrategyTypeEnum.stopProfit,
            triggerDirectionInd: profitDirection,
            triggerSideInd,
            triggerPrice: profitPrice,
            triggerPriceTypeInd: triggerTypeStopProfit,
            ...positionParams,
          }
        }

        if (lossPrice && !positionStopDetails?.stopLoss) {
          const lossDirection = onSetTriggerDirection({
            triggerPrice: lossPrice,
            triggerPriceTypeInd: triggerTypeStopLoss,
          })
          positionReq.stopLoss = {
            strategyTypeInd: StopLimitStrategyTypeEnum.stopLoss,
            triggerDirectionInd: lossDirection,
            triggerSideInd,
            triggerPrice: lossPrice,
            triggerPriceTypeInd: triggerTypeStopLoss,
            ...positionParams,
          }
        }

        positionReq.stopProfit || positionReq.stopLoss
          ? onStrategyPlace(positionReq, t`features_assets_futures_common_stop_limit_modal_index_5101535`)
          : setVisible(false)

        break
      default:
        break
    }
  }

  /** 提交方法 */
  const onFormSubmit = useLockFn(async () => {
    try {
      onCommitForm()
      return true
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
    }
  })

  const onloadTradeDetails = async () => {
    /** 获取币对详情接口 */
    const tradePairDetailRes = await getTradePairDetailApi({ symbol })
    if (tradePairDetailRes.isOk) {
      setTradePairDetails(tradePairDetailRes.data)
    }
  }

  /**
   * 获取仓位止盈止损详情
   */
  const onLoadPositionDetails = async () => {
    const res = await getPerpetualPositionStrategyDetails({ id: positionId })
    const { isOk, data, message = '' } = res || {}

    if (!isOk) {
      return
    }

    if (data && (data?.stopLoss || data?.stopProfit)) {
      if (data?.stopLoss) {
        setTriggerTypeStopLoss(data?.stopLoss?.triggerPriceTypeInd)
        form.setFieldValue('triggerPriceStopLoss', data?.stopLoss?.triggerPrice)
      }

      if (data?.stopProfit) {
        setTriggerTypeStopProfit(data?.stopProfit?.triggerPriceTypeInd)
        form.setFieldValue('triggerPriceStopProfit', data?.stopProfit?.triggerPrice)
      }
      setPositionStopDetails(data)
      onProfitInfoPosition()
    }
  }

  /** 最新价订阅入参 */
  const subs = {
    biz: WsBizEnum.perpetual,
    type: WsTypesEnum.perpetualDeal,
    base: baseSymbolName,
    quote: quoteSymbolName,
    contractCode: symbolWassName,
  }

  const markSubs = { biz: WsBizEnum.perpetual, type: WsTypesEnum.perpetualIndex, contractCode: symbolWassName }

  useEffect(() => {
    getFuturesMarketDepthApi(symbol)
    onloadTradeDetails()
    wsDealSubscribe(subs)
    wsMarkPriceSubscribe(markSubs)
    updatePositionDealPrice(latestPrice)
    updatePositionMarkPrice(markPrice)
    /** 获取仓位止盈止损详情信息 */
    activeTab === StopLimitTabEnum.positionStopLimit && onLoadPositionDetails()
  }, [symbol])

  useUnmount(() => {
    wsDealUnSubscribe(subs)
    wsMarkPriceUnSubscribe(markSubs)
  })

  useUpdateEffect(() => {
    activeTab === StopLimitTabEnum.positionStopLimit && onLoadPositionDetails()
  }, [activeTab])

  useUpdateEffect(() => {
    onProfitInfo()
  }, [entrustType])

  const getTriggerPricePlaceholder = field => {
    if (field === 'triggerPriceStopLoss') {
      return t`features/orders/details/modify-stop-limit-12`
    }
    return t`features/orders/details/modify-stop-limit-11`
  }

  /**
   * 分批止盈止损
   */
  const onRenderContent = () => {
    return (
      <>
        <div className="form-item">
          <div className="form-labels">
            <span>{t`features_trade_spot_trade_form_index_2560`}</span>
            <span>{t`features_orders_details_modify_stop_limit_5101352`}</span>
          </div>
          <div className="form-input form-input-between">
            <FormItem
              className={'left-item'}
              field="triggerPrice"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_trade_spot_trade_form_index_2558`)
                    }
                    return cb()
                  },
                },
              ]}
              requiredSymbol={false}
            >
              <AssetsInputNumber
                precision={priceOffset}
                placeholder={t({
                  id: 'features_assets_futures_common_stop_limit_modal_index_5101374',
                  values: { 0: quoteSymbolName },
                })}
              />
            </FormItem>
            <div className={'right-item'}>
              <FormItem>
                <EntrustTriggerTypeSelect
                  value={triggerType}
                  onChange={value => {
                    setTriggerType(value)
                    updateStrategyInfo({ ...strategyInfo, triggerPriceType: value })
                  }}
                />
              </FormItem>
            </div>
          </div>
        </div>

        <div className="form-item">
          <div className="form-labels">
            <span>{t`features/trade/trade-order-confirm/index-1`}</span>
            <span>{t`order.columns.entrustType`}</span>
          </div>
          <div className="form-input form-input-between">
            <FormItem
              field="entrustPrice"
              className={'left-item'}
              rules={[
                {
                  required: true && !isMarketPrice,
                  validator: (value, cb) => {
                    if (!value && !isMarketPrice) {
                      return cb(t`features/trade/trade-form/index-4`)
                    }
                    return cb()
                  },
                },
              ]}
              requiredSymbol={false}
            >
              <AssetsInputNumber precision={priceOffset} placeholder={priceInputText} disabled={isMarketPrice} />
            </FormItem>
            <div className={'right-item'}>
              <FormItem>
                <EntrustTypeSelect
                  value={entrustType}
                  onChange={value => {
                    setEntrustType(value)
                    updateStrategyInfo({ ...strategyInfo, entrustType: value })
                    form.setFieldValue('entrustPrice', '')
                  }}
                />
              </FormItem>
            </div>
          </div>
        </div>
        <div className="form-item">
          <div className="form-labels">
            <span>{t`Amount`}</span>
          </div>
          <div className="form-input">
            <FormItem
              field="amount"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_assets_futures_common_close_position_modal_index_5101571`)
                    }
                    return cb()
                  },
                },
              ]}
              requiredSymbol={false}
            >
              <AssetsInputNumber
                className="assets-input form-amount"
                placeholder={t({
                  id: 'features_assets_futures_common_stop_limit_modal_index_5101377',
                  values: { 0: baseSymbolName },
                })}
                suffix={<div className="text-text_color_01">{baseSymbolName}</div>}
                precision={amountOffset}
                onChange={(val: number) => {
                  onInputChange(val)
                }}
              />
            </FormItem>
          </div>
        </div>
        {/* 仓位比例 */}
        <div className="form-item">
          <div className="form-slider">
            <SliderBar
              value={percent}
              onChange={val => {
                onSliderChange(val)
              }}
              marks={{
                0: '0',
                25: '25',
                50: '50',
                75: '75',
                100: '100',
              }}
            />
          </div>
        </div>
        <PlanPrice
          profitLossAmount={Number(profitInfo?.profit)}
          quoteSymbolName={quoteSymbolName}
          baseSymbolName={baseSymbolName}
          size={size}
        />
      </>
    )
  }

  /**
   * 仓位止盈止损
   */
  const onRenderPositionContent = () => {
    const positionContent = [
      {
        title: t`constants/order-6`,
        id: 'stopProfit',
        disable: !!positionStopDetails?.stopProfit,
        field: 'triggerPriceStopProfit',
        triggerType: triggerTypeStopProfit,
        hint: (
          <div className="price-hint">
            {t`features_assets_futures_common_stop_limit_modal_index_5101378`}
            <span className="hint-name mx-1">{getTriggerPriceTypeEnumName(triggerTypeStopProfit)}</span>
            {t`features_assets_futures_common_stop_limit_modal_index_5101379`}
            <span className="hint-name"> {form.getFieldValue('triggerPriceStopProfit') || '--'} </span>
            {t`features_assets_futures_common_stop_limit_modal_index_5101380`}{' '}
            <IncreaseTag
              value={profitInfo?.positionProfit || '--'}
              hasPrefix
              right={` ${currencySymbol}`}
              digits={offset}
              isRound={false}
            />
          </div>
        ),
        disableText: positionStopDetails?.stopProfit
          ? `${
              positionStopDetails?.stopProfit?.triggerPriceTypeInd &&
              getTriggerPriceTypeEnumName(positionStopDetails?.stopProfit?.triggerPriceTypeInd)
            } ${positionStopDetails?.stopProfit?.triggerSideInd === FuturesOrderSideTypeEnum.closeLong ? '>=' : '<='} ${
              positionStopDetails?.stopProfit?.triggerPrice
            } ${quoteSymbolName}`
          : '',
      },
      {
        title: t`constants/order-7`,
        id: 'stopLoss',
        disable: !!positionStopDetails?.stopLoss,
        field: 'triggerPriceStopLoss',
        triggerType: triggerTypeStopLoss,
        hint: (
          <div className="price-hint">
            {t`features_assets_futures_common_stop_limit_modal_index_5101378`}
            <span className="hint-name mx-1">{getTriggerPriceTypeEnumName(triggerTypeStopLoss)}</span>
            {t`features_assets_futures_common_stop_limit_modal_index_5101379`}
            <span className="hint-name"> {form.getFieldValue('triggerPriceStopLoss') || '--'} </span>
            {t`features_assets_futures_common_stop_limit_modal_index_5101383`}{' '}
            <IncreaseTag
              value={profitInfo?.positionLoss || '--'}
              hasPrefix
              right={` ${currencySymbol}`}
              digits={offset}
              isRound={false}
            />
          </div>
        ),
        disableText: positionStopDetails?.stopLoss
          ? `${
              positionStopDetails?.stopLoss?.triggerPriceTypeInd &&
              getTriggerPriceTypeEnumName(positionStopDetails?.stopLoss?.triggerPriceTypeInd)
            } ${positionStopDetails?.stopLoss?.triggerSideInd === FuturesOrderSideTypeEnum.closeLong ? '<=' : '>='} ${
              positionStopDetails?.stopLoss?.triggerPrice
            } ${quoteSymbolName}`
          : '',
      },
    ]
    return (
      <>
        {positionContent.map((contentItem, index: number) => {
          return (
            <div key={index}>
              {!contentItem.disable ? (
                <div className="form-item">
                  <div className="form-labels">
                    <span>{contentItem.title}</span>
                    <span>{t`features_orders_details_modify_stop_limit_5101352`}</span>
                  </div>
                  <div className="form-input form-input-between">
                    <FormItem
                      field={contentItem.field}
                      className={'left-item'}
                      // rules={[
                      //   {
                      //     required: true,
                      //     validator: (value, cb) => {
                      //       if (!value) {
                      //         return cb(
                      //           t({
                      //             id: 'features_assets_futures_common_stop_limit_modal_index_5101374',
                      //             values: { 0: quoteSymbolName },
                      //           })
                      //         )
                      //       }
                      //       return cb()
                      //     },
                      //   },
                      // ]}
                      requiredSymbol={false}
                    >
                      <AssetsInputNumber
                        precision={priceOffset}
                        placeholder={`${getTriggerPricePlaceholder(contentItem.field)}(${quoteSymbolName})`}
                      />
                    </FormItem>
                    <div className={'right-item'}>
                      <FormItem>
                        <EntrustTriggerTypeSelect
                          value={contentItem.triggerType}
                          onChange={value => {
                            if (contentItem.field === 'triggerPriceStopLoss') {
                              setTriggerTypeStopLoss(value)
                              updateStrategyInfo({ ...strategyInfo, lossTriggerPriceType: value })
                              return
                            }

                            setTriggerTypeStopProfit(value)
                            updateStrategyInfo({ ...strategyInfo, profitTriggerPriceType: value })
                          }}
                        />
                      </FormItem>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-item mt-1">
                  <div className="profit-disabled-content">
                    <div className="profit-disabled-labels">
                      <div>{contentItem.title}</div>
                      <div className="revoke" onClick={() => onRevoke(contentItem.id)}>
                        {t`features_assets_futures_common_stop_limit_modal_index_5101472`}
                      </div>
                    </div>

                    <div className="disabled-input">{contentItem.disableText}</div>
                  </div>
                </div>
              )}

              {contentItem.hint}
            </div>
          )
        })}
      </>
    )
  }

  const renderFooterCancelButton = () => {
    if (
      activeTab === StopLimitTabEnum.positionStopLimit &&
      (positionStopDetails?.stopProfit || positionStopDetails?.stopLoss)
    ) {
      return (
        <Button className="mr-4" type="secondary" onClick={() => onRevoke()}>
          {t`features_assets_futures_common_stop_limit_modal_index_5101547`}
        </Button>
      )
    }
    return (
      <Button
        className="mr-4"
        type="secondary"
        onClick={() => {
          setVisible(false)
        }}
      >
        {t`trade.c2c.cancel`}
      </Button>
    )
  }

  return (
    <AssetsPopUp
      isResetCss
      title={null}
      visible={visible}
      footer={null}
      onCancel={() => {
        setVisible(false)
      }}
    >
      <div className={styles['stop-limit-modal-root']}>
        <PositionModalHeader title={t`features/orders/details/future-11`} positionData={positionData} />
        <div className="stop-limit-modal-wrapper">
          <div className="modal-tabs">
            <div className="tabs-cell">
              {tabs.map(tabItem => {
                return (
                  <div
                    key={tabItem.id}
                    className={`tab-cell ${activeTab === tabItem.id && 'active-tab-cell'}`}
                    onClick={() => setActiveTab(tabItem.id)}
                  >
                    <span>{tabItem.title}</span>
                    <div className={`line ${activeTab === tabItem.id && 'active-line'}`} />
                  </div>
                )
              })}
            </div>
          </div>
          <div className="stop-limit-content">
            <PositionPrice
              openPrice={openPrice}
              markPrice={positionMarkPrice}
              latestPrice={positionDealPrice}
              baseCoin={quoteSymbolName}
              priceOffset={priceOffset}
            />
            <Form form={form} className={stylesForm['asset-popup-form']} onChange={onFormChange}>
              <>
                {activeTab === StopLimitTabEnum.stopLimit && onRenderContent()}
                {activeTab === StopLimitTabEnum.positionStopLimit && onRenderPositionContent()}
              </>
            </Form>
          </div>
          <div className="footer px-8">
            {renderFooterCancelButton()}
            <Button type="primary" onClick={onFormSubmit} loading={loading}>
              {t`user.field.reuse_10`}
            </Button>
          </div>
        </div>
      </div>
    </AssetsPopUp>
  )
}
