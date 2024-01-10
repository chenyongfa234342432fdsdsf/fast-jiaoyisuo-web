import {
  EntrustTypeEnum,
  FutureNormalOrderStatusEnum,
  FutureNormalOrderTypeIndEnum,
  FutureOrderPlaceUnitEnum,
  FutureOrderStopLimitEntrustTypeEnum,
  FutureOrderStopLimitStatusEnum,
  FuturePlanOrderStatusEnum,
} from '@/constants/order'
import TradeInputNumber from '@/features/trade/trade-input-number'
import { formatDate } from '@/helper/date'
import { formatCurrency } from '@/helper/decimal'
import { replaceEmpty } from '@/helper/filters'
import {
  checkStrategyPrice,
  getFutureOrderDirectionColorClass,
  getFutureOrderIsBuy,
  getFutureOrderValueEnumText,
} from '@/helper/order/future'
import { getTextFromStoreEnums } from '@/helper/store'
import { baseOrderFutureStore, useOrderFutureStore } from '@/store/order/future'
import { IFutureOrderItem, IFutureOrderStopLimitDetail, IFutureOrderStopLimitStrategy } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { Message, Modal, Select } from '@nbit/arco'
import { useEffect, useState } from 'react'
import { useMount, useRequest } from 'ahooks'
import {
  queryFutureOrderStopLimitDetail,
  queryFuturePlanOrderStopLimitDetail,
  updateFutureOrderStopLimit,
  updateFuturePlanOrderStopLimit,
} from '@/apis/order'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { IPropListProps, PropList } from './base'
import styles from './modify-stop-limit.module.css'
import baseStyles from './base.module.css'

type IStrategy = IFutureOrderStopLimitStrategy
type IStopLimitFormProps = {
  isProfit: boolean
  disabled: boolean
  strategy: IStrategy
  onChange: (strategy: Partial<IStrategy>) => void
  countSymbol: string
  sizeWithCoinName?: string
}
function StopLimitForm({ isProfit, sizeWithCoinName, onChange, countSymbol, strategy, disabled }: IStopLimitFormProps) {
  const typeText = (
    isProfit
      ? {
          [FutureOrderStopLimitEntrustTypeEnum.limit]: t`constants/order-9`,
          [FutureOrderStopLimitEntrustTypeEnum.market]: t`constants/order-11`,
        }
      : {
          [FutureOrderStopLimitEntrustTypeEnum.limit]: t`constants/order-10`,
          [FutureOrderStopLimitEntrustTypeEnum.market]: t`constants/order-12`,
        }
  )[strategy.entrustTypeInd]
  const status = strategy.statusDisplay
  const statusConfig = {
    [FutureOrderStopLimitStatusEnum.editable]: {
      text: t`features/orders/order-columns/future-3`,
      color: '',
    },
    [FutureOrderStopLimitStatusEnum.effective]: {
      text: t`features/orders/order-columns/future-4`,
      color: 'text-success_color',
    },
    [FutureOrderStopLimitStatusEnum.invalid]: {
      text: t`features_orders_details_modify_stop_limit_5101351`,
      color: 'text-text_color_02',
    },
  }[status]
  const [triggerPrice, setTriggerPrice] = useState(strategy.triggerPrice)
  const [entrustPrice, setEntrustPrice] = useState(strategy.price)
  const [triggerPriceType, setTriggerPriceType] = useState(strategy.triggerPriceTypeInd)
  const orderEnums = baseOrderFutureStore.getState().orderEnums
  const sideText = getTextFromStoreEnums(strategy.triggerSideInd, orderEnums.orderDirection.enums)
  const priceTypeOptions = orderEnums.triggerPriceTypeIndWithSuffix.enums
  const isMarketPrice = strategy.entrustTypeInd === FutureOrderStopLimitEntrustTypeEnum.market
  const editable = status === FutureOrderStopLimitStatusEnum.editable && !disabled && !strategy.id
  useEffect(() => {
    onChange({
      triggerPrice,
      price: entrustPrice,
      triggerPriceTypeInd: triggerPriceType,
    })
  }, [triggerPrice, entrustPrice, triggerPriceType])
  const boxClassName = classNames('w-32 input-box', editable ? 'bg-bg_color' : 'input-box-disabled')

  return (
    <div className={styles['stop-limit-form-wrapper']}>
      <div className="flex justify-between text-base">
        <span className="font-medium">{typeText}</span>
        <span className={statusConfig?.color}>{statusConfig?.text}</span>
      </div>
      <div className="mt-4">
        <div className="form-item">
          <div className="label">{t`order.columns.direction`}</div>
          <div className={getFutureOrderDirectionColorClass(strategy.triggerSideInd)}>{sideText}</div>
        </div>
        <div className="form-item">
          <div className="label">{t`Amount`}</div>
          <div>{replaceEmpty(sizeWithCoinName)}</div>
        </div>
        <div className="form-item">
          <div className="label">{t`features_trade_spot_trade_form_index_2560`}</div>
          <div className={boxClassName}>
            <TradeInputNumber
              size="small"
              disabled={!editable}
              value={triggerPrice}
              suffix={strategy.quoteCoinShortName}
              onChange={setTriggerPrice as any}
            />
          </div>
        </div>
        {!isMarketPrice && (
          <div className="form-item">
            <div className="label">{t`features/trade/trade-order-confirm/index-1`}</div>
            <div className={boxClassName}>
              <TradeInputNumber
                size="small"
                disabled={!editable}
                value={entrustPrice}
                suffix={strategy.quoteCoinShortName}
                onChange={setEntrustPrice as any}
              />
            </div>
          </div>
        )}
        <div className="form-item">
          <div className="label">{t`features_orders_details_modify_stop_limit_5101352`}</div>
          <div className={boxClassName}>
            <Select
              disabled={!editable}
              size="small"
              value={triggerPriceType}
              onChange={setTriggerPriceType}
              options={priceTypeOptions}
              arrowIcon={<Icon className="text-xs scale-75" name="arrow_open" hasTheme />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export type IFutureOrderStopLimitDetailProps = {
  order: IFutureOrderItem
  visible: boolean
  setVisible: (visible: boolean) => void
}

function useOrderDetail(id: any, isPlan: boolean) {
  const [order, setOrder] = useState<IFutureOrderStopLimitDetail>({} as any)
  useMount(async () => {
    const res = await (isPlan ? queryFuturePlanOrderStopLimitDetail : queryFutureOrderStopLimitDetail)({
      id,
    })
    if (!res.isOk || !res.data) {
      return
    }
    setOrder(res.data)
  })

  return order
}

export function FutureOrderStopLimitDetail({ visible, order, setVisible }: IFutureOrderStopLimitDetailProps) {
  const isPlanOrder = !!order.triggerPrice
  const stopLimitDetail = useOrderDetail(order.refOrderId || order.id, order.refOrderId ? false : isPlanOrder)
  const texts = getFutureOrderValueEnumText(order)
  const orderIsCanceled = [
    FutureNormalOrderStatusEnum.systemCanceled,
    FutureNormalOrderStatusEnum.manualCanceled,
  ].includes(order.statusCd as any)
  const countSymbol =
    order.placeUnit === FutureOrderPlaceUnitEnum.BASE ? order.baseCoinShortName : order.quoteCoinShortName
  const { orderEnums } = useOrderFutureStore()
  const isMarketPrice = order.typeInd === FutureNormalOrderTypeIndEnum.market

  let strategyDisabled = false
  if (
    (isPlanOrder && [FuturePlanOrderStatusEnum.triggeredEntrustFailed].includes(order.statusCd as any)) ||
    (!isPlanOrder &&
      ![FutureNormalOrderStatusEnum.partlySucceed, FutureNormalOrderStatusEnum.unsettled].includes(
        order.statusCd as any
      ))
  ) {
    strategyDisabled = true
  }
  const footerVisible =
    !strategyDisabled &&
    (stopLimitDetail.strategy?.stopLoss?.statusDisplay === FutureOrderStopLimitStatusEnum.editable ||
      stopLimitDetail.strategy?.stopProfit?.statusDisplay === FutureOrderStopLimitStatusEnum.editable)
  const sizeWithCoinName = `${formatCurrency(Number(order.tradeSize) || order.size)} ${countSymbol}`

  const props: IPropListProps['list'] = [
    {
      label: <span className={getFutureOrderDirectionColorClass(order.sideInd)}>{texts.typeText}</span>,
      id: 'type',
      value: getTextFromStoreEnums(stopLimitDetail.orderDisplayStatus, orderEnums.stopLimitDetailDisplayStatus.enums),
    },
    {
      label: t`order.columns.direction`,
      value: <span className={getFutureOrderDirectionColorClass(order.sideInd)}>{texts.directionText}</span>,
    },
    {
      label: t`Amount`,
      value: sizeWithCoinName,
    },
    {
      label: t`Price`,
      value: isMarketPrice
        ? t`trade.tab.orderType.marketPrice`
        : `${formatCurrency(order.price)} ${order.quoteCoinShortName}`,
    },
  ]
  const [profitStrategy, setProfitStrategy] = useState<Partial<IStrategy>>({})
  const [lossStrategy, setLossStrategy] = useState<Partial<IStrategy>>({})
  const { run, loading } = useRequest(
    async () => {
      if (
        (stopLimitDetail?.strategy?.stopProfit && !profitStrategy.triggerPrice) ||
        (stopLimitDetail?.strategy?.stopLoss && !lossStrategy.triggerPrice)
      ) {
        Message.error(t`features_trade_spot_trade_form_index_2558`)
        return
      }
      const checkStrategyRes = checkStrategyPrice({
        isBuy: getFutureOrderIsBuy(order.sideInd),
        entrustPrice: order.price || '',
        entrustType: order.triggerPrice ? EntrustTypeEnum.plan : EntrustTypeEnum.limit,
        profitPrice: profitStrategy.triggerPrice || '',
        lossPrice: lossStrategy.triggerPrice || '',
        triggerPrice: order.triggerPrice,
        // 这里不会有市价单，不需要获取盘口价格，传空数组即可
        depthQuotePrice: [],
        isMarketPrice: !order.price,
      })
      if (!checkStrategyRes) {
        Modal?.warning?.({
          icon: null,
          title: (
            <div className="flex justify-center">
              <Icon name="tips_icon" style={{ fontSize: '78px' }} />
            </div>
          ),
          style: { width: '360px' },
          okText: t`features_trade_spot_index_2510`,
          content: <div>{t`features_trade_futures_trade_form_index_5101481`}</div>,
        })
        return
      }
      const isMarketPrice =
        (stopLimitDetail?.strategy?.stopLoss || stopLimitDetail?.strategy?.stopProfit)?.entrustTypeInd ===
        FutureOrderStopLimitEntrustTypeEnum.market
      if (!isMarketPrice && (!profitStrategy.price || !lossStrategy.price)) {
        Message.error(t`features/trade/trade-form/index-4`)
        return
      }

      const res = await (isPlanOrder ? updateFuturePlanOrderStopLimit : updateFutureOrderStopLimit)({
        id: stopLimitDetail.id as any,
        strategy: {
          stopProfit: stopLimitDetail?.strategy?.stopProfit
            ? {
                triggerPrice: Number(profitStrategy.triggerPrice!),
                triggerPriceTypeInd: profitStrategy.triggerPriceTypeInd!,
              }
            : undefined,
          stopLoss: stopLimitDetail?.strategy?.stopLoss
            ? {
                triggerPrice: Number(lossStrategy.triggerPrice!),
                triggerPriceTypeInd: lossStrategy.triggerPriceTypeInd!,
              }
            : undefined,
        },
      })
      setVisible(false)
      if (res.isOk) {
        Message.success(t`features_orders_details_modify_stop_limit_5101478`)
      }
    },
    {
      manual: true,
    }
  )

  return (
    <Modal
      wrapClassName={baseStyles['modal-wrapper']}
      visible={visible}
      autoFocus={false}
      onCancel={() => setVisible(false)}
      title={t`features/orders/details/future-11`}
      closeIcon={<Icon className="text-xl translate-y-1" name="close" hasTheme />}
      onOk={run}
      okButtonProps={{ loading }}
      footer={footerVisible ? undefined : null}
    >
      <div className={styles['stop-limit-wrapper']}>
        <div className="header">
          <div className="future-info">
            <div className="future-name text-base">
              {order.symbol} {t`assets.enum.tradeCoinType.perpetual`}
            </div>
            <div className="future-group">{order.groupName || t`features_future_future_group_modal_index_5101485`}</div>
          </div>
          <div className="text-text_color_02">{formatDate(order.createdByTime)}</div>
        </div>
        <div>
          <PropList list={props} />
        </div>
        <div>
          {stopLimitDetail?.strategy?.stopProfit && (
            <StopLimitForm
              onChange={setProfitStrategy}
              isProfit
              disabled={strategyDisabled}
              countSymbol={countSymbol}
              sizeWithCoinName={sizeWithCoinName}
              strategy={stopLimitDetail.strategy.stopProfit as any}
            />
          )}
          {stopLimitDetail?.strategy?.stopLoss && (
            <StopLimitForm
              onChange={setLossStrategy}
              isProfit={false}
              sizeWithCoinName={sizeWithCoinName}
              disabled={strategyDisabled}
              countSymbol={countSymbol}
              strategy={stopLimitDetail.strategy.stopLoss as any}
            />
          )}
        </div>
        {footerVisible && (
          <div className="text-text_color_02">{t`features_orders_details_modify_stop_limit_5101479`}</div>
        )}
      </div>
    </Modal>
  )
}
