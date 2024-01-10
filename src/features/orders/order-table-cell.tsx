import {
  cancelAllHoldingOrderByMarketPrice,
  cancelFutureOrder,
  cancelSpotNormalOrder,
  cancelSpotPlanOrder,
} from '@/apis/order'
import { useSpotOrderModuleContext, useFutureOrderModuleContext } from '@/features/orders/order-module-context'
import {
  IBaseOrderItem,
  IFutureFundingFeeLog,
  IFutureHoldingOrderItem,
  IFutureOrderItem,
  ISpotPlanOrderItem,
} from '@/typings/api/order'
import { Button, Message, Tooltip } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useRequest } from 'ahooks'
import { useState } from 'react'
import {
  FutureOrderActionEnum,
  FuturePlanOrderStatusEnum,
  FutureStopLimitOrderStopLimitTypeEnum,
  OrderStatusEnum,
  OrderTabTypeEnum,
  SpotPlanOrderStatusEnum,
} from '@/constants/order'
import { getCurrentUnitAmount } from '@/helper/order'
import { replaceEmpty } from '@/helper/filters'
import { FutureTradeUnitEnum } from '@/constants/future/trade'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import classNames from 'classnames'
import TableActions from '@/components/table-actions'
import { getFutureOrderActions } from '@/helper/order/future'
import { getTextFromStoreEnums } from '@/helper/store'
import { baseOrderFutureStore } from '@/store/order/future'
import { formatCurrency } from '@/helper/decimal'
import { FutureOrderDetail } from './details/future'
import { FutureHoldingOrderModifyMargin } from './details/holding'
import { FutureOrderStopLimitDetail } from './details/modify-stop-limit'
import { SpotOrderDetail } from './details/spot'
import { FutureOrderModifyExtraMargin } from './details/extra-margin'
import { FutureFundingFeeDetail } from './details/future-funding-fee'

function useCancelFutureOrder(order: IFutureOrderItem) {
  const { orderHookResult } = useFutureOrderModuleContext()
  const { run, loading } = useRequest(
    async () => {
      const res = await cancelFutureOrder({ id: order.id, entrustType: orderHookResult.entrustType })
      if (!res.isOk) {
        return
      }
      Message.success(t`order.messages.cancelSuccess`)
    },
    {
      manual: true,
    }
  )

  return {
    run,
    loading,
  }
}

export function ActionCell({ order }: { order: IBaseOrderItem | ISpotPlanOrderItem }) {
  const { cancelOrderEvent$ } = useSpotOrderModuleContext()
  const isPlanOrder = (order as ISpotPlanOrderItem).orderStatusCd !== undefined
  const normalOrder = order as IBaseOrderItem
  const planOrder = order as ISpotPlanOrderItem

  const { run: cancel, loading } = useRequest(
    async () => {
      const res = await (isPlanOrder ? cancelSpotPlanOrder : cancelSpotNormalOrder)({ id: order.id })
      if (!res.isOk) {
        return
      }
      cancelOrderEvent$.emit()
      Message.success(t`order.messages.cancelSuccess`)
    },
    {
      manual: true,
    }
  )
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const cancelable = isPlanOrder
    ? [SpotPlanOrderStatusEnum.unTrigger].includes(planOrder.orderStatusCd)
    : [OrderStatusEnum.unsettled, OrderStatusEnum.partlySucceed].includes(normalOrder.status!)
  const onAction = () => {
    if (cancelable) {
      cancel()
    } else {
      setDetailModalVisible(true)
    }
  }
  if (isPlanOrder && !planOrder.refOrderId && !cancelable) {
    return <span>{replaceEmpty('')}</span>
  }

  return (
    <>
      {detailModalVisible && (
        <SpotOrderDetail
          visible={detailModalVisible}
          onClose={() => {
            setDetailModalVisible(false)
          }}
          id={isPlanOrder ? planOrder.refOrderId : normalOrder.id!}
        />
      )}
      <div>
        <div className="text-brand_color cursor-pointer" onClick={onAction}>
          {cancelable ? t`order.table-cell.action.cancel` : t`assets.coin.overview.detail`}
        </div>
      </div>
    </>
  )
}

export function FutureAmountCell({
  order,
  amount,
  isDealAmount,
}: {
  order: IFutureOrderItem
  amount: string
  isDealAmount: boolean
}) {
  return <div>{getCurrentUnitAmount(amount, order, isDealAmount)}</div>
}
export function FutureTriggerEntrustAmountCell({ order }: { order: IFutureOrderItem }) {
  return (
    <div>
      {getCurrentUnitAmount(order.dealAmount, order, true, undefined, false)}/
      {getCurrentUnitAmount(order.price, order, false, undefined)}
    </div>
  )
}

export function FutureActionCell({ order, tab }: { order: IFutureOrderItem; tab: OrderTabTypeEnum }) {
  const { run } = useCancelFutureOrder(order)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showStopLimitModal, setShowStopLimitModal] = useState(false)
  const [showModifyMarginModal, setShowModifyMarginModal] = useState(false)
  const actions = getFutureOrderActions(order)
  const onClickAction = (id: FutureOrderActionEnum) => {
    switch (id) {
      case FutureOrderActionEnum.cancel:
        run()
        break
      case FutureOrderActionEnum.detail:
        setShowDetailModal(true)
        break
      case FutureOrderActionEnum.stopLimit:
        setShowStopLimitModal(true)
        break
      case FutureOrderActionEnum.margin:
        setShowModifyMarginModal(true)
        break
      default:
        break
    }
  }

  return (
    <TableActions actions={actions} max={tab === OrderTabTypeEnum.current ? 1 : 2} onClick={onClickAction}>
      {showDetailModal && (
        <FutureOrderDetail
          visible={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
          }}
          id={order.refOrderId || order.id}
        />
      )}
      {showStopLimitModal && (
        <FutureOrderStopLimitDetail visible={showStopLimitModal} setVisible={setShowStopLimitModal} order={order} />
      )}
      {showModifyMarginModal && (
        <FutureOrderModifyExtraMargin
          visible={showModifyMarginModal}
          setVisible={setShowModifyMarginModal}
          id={order.id}
          order={order}
        />
      )}
    </TableActions>
  )
}
export function FutureStopLimitCell({ order }: { order: IFutureOrderItem }) {
  const showDetailButton = order.stopLoss || order.stopProfit
  const [showDetailModal, setShowDetailModal] = useState(false)

  return (
    <div className="flex items-center">
      {showDetailModal && (
        <FutureOrderStopLimitDetail visible={showDetailModal} setVisible={setShowDetailModal} order={order} />
      )}
      {showDetailButton ? (
        <Button onClick={() => setShowDetailModal(true)} type="text">
          {t`features/orders/order-table-cell-1`}
        </Button>
      ) : (
        t`features/orders/order-table-cell-2`
      )}
    </div>
  )
}

export function FutureHoldingCell({ order }: { order: IFutureHoldingOrderItem }) {
  return (
    <div className="items-center">
      <Tooltip
        content={
          <div className="text-xs">
            <div className="mb-0.5">
              <span className="mr-8">{t`features/orders/order-table-cell-3`}</span>
              {/* 虽然有些属性没有，但是这里的 order 可以传入进行计算，下同 */}
              <span>{getCurrentUnitAmount(order.amount, order as any, false, FutureTradeUnitEnum.a)}</span>
            </div>
            <div className="mb-0.5">
              <span className="mr-8">{t`features/orders/order-table-cell-4`}</span>
              <span>{getCurrentUnitAmount(order.amount, order as any, false, FutureTradeUnitEnum.indexBase)}</span>
            </div>
            {order.symbol.toLowerCase() === FutureTradeUnitEnum.usdt && (
              <div>
                <span className="mr-8">{t`features/orders/order-table-cell-5`}</span>
                <span>{getCurrentUnitAmount(order.amount, order as any, false, FutureTradeUnitEnum.quote)}</span>
              </div>
            )}
          </div>
        }
      >
        <span className="underline decoration-dashed underline-offset-4">
          {getCurrentUnitAmount(order.amount, order as any, false)}
        </span>
      </Tooltip>
      <div>{getCurrentUnitAmount(order.frontendCalcLiquidateAmount.toString(), order as any, false)}</div>
    </div>
  )
}
export function FutureMarginCell({ order }: { order: IFutureHoldingOrderItem }) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  return (
    <div className="flex items-center">
      {showDetailModal && <FutureHoldingOrderModifyMargin setVisible={setShowDetailModal} order={order} />}
      <span>{order.openMargin}</span>
      <div className="-mt-0.5 ml-2 text-lg" onClick={() => setShowDetailModal(true)}>
        <Icon name="moreIcon_white" className="text-brand_color" />
      </div>
    </div>
  )
}

export function FutureHoldingActionCell({ order }: { order: IFutureHoldingOrderItem }) {
  const { cancelOrderEvent$ } = useSpotOrderModuleContext()

  const { run, loading } = useRequest(
    async () => {
      if (Number(order.closingAmount) > 0) {
        Message.info(t`features/orders/order-table-cell-6`)
      }
      const res = await cancelAllHoldingOrderByMarketPrice({
        side: `close_${order.side}`,
        amount: order.amount,
        triggerPrice: order.triggerPrice || '',
        code: order.symbol,
      })
      if (!res.isOk) {
        return
      }
      setTimeout(() => {
        // 撮合需要时间
        cancelOrderEvent$.emit()
      }, 500)
      Message.success(t`features/orders/order-table-cell-7`)
    },
    {
      manual: true,
    }
  )

  const [showStopProfitModal, setShowStopProfitModal] = useState(false)
  const [showStopLossModal, setShowStopLossModal] = useState(false)

  return (
    <div className="flex items-center">
      <Button onClick={() => setShowStopLossModal(true)} type="text">
        {t`constants/order-7`}
      </Button>
      <span className="text-text_color_03 text-lg">|</span>
      <Button onClick={() => setShowStopProfitModal(true)} type="text">
        {t`constants/order-6`}
      </Button>
      <span className="text-text_color_03 text-lg">|</span>
      <Button onClick={run} loading={loading} type="text">
        {t`features/orders/order-table-cell-8`}
      </Button>
    </div>
  )
}
export function FutureStopLimitActionCell({ order }: { order: IFutureOrderItem }) {
  const { run, loading } = useCancelFutureOrder(order)
  const [showStopLimitModal, setShowStopLimitModal] = useState(false)
  const isProfit =
    (order.stopLimitType as any as FutureStopLimitOrderStopLimitTypeEnum) ===
    FutureStopLimitOrderStopLimitTypeEnum.profit
  if (![FuturePlanOrderStatusEnum.unTrigger, FuturePlanOrderStatusEnum.unTrigger2].includes(order.statusCd as any)) {
    return <span>{replaceEmpty('')}</span>
  }

  return (
    <div className="flex items-center">
      <Button onClick={() => setShowStopLimitModal(true)} type="text">
        {t`user.field.reuse_43`}
      </Button>
      <span className="text-text_color_03 text-lg">|</span>
      <Button onClick={run} loading={loading} type="text">
        {t`order.table-cell.action.cancel`}
      </Button>
    </div>
  )
}

export function FutureNameCell({ order }: { order: IFutureOrderItem }) {
  return (
    <div className="text-left">
      <span>{order.symbol.toUpperCase()}</span>&nbsp;
      <span>{t`assets.enum.tradeCoinType.perpetual`}</span>
    </div>
  )
}

export function SpotTradeOpenCurrencyCell({ order }: { order: IBaseOrderItem | ISpotPlanOrderItem }) {
  const pageContext = usePageContext()
  const targetPath = `/trade/${order.symbol}`
  const isCurrentTrade = pageContext.path === targetPath

  const toTrade = () => {
    if (isCurrentTrade) {
      return
    }
    link(targetPath, {
      overwriteLastHistoryEntry: true,
    })
  }
  return (
    <div
      className={classNames({
        'cursor-pointer': !isCurrentTrade,
      })}
      onClick={toTrade}
    >
      {order.sellCoinShortName?.toUpperCase()}/{order.buyCoinShortName?.toUpperCase()}
      {!isCurrentTrade && <Icon className="ml-1" name="next_arrow" hasTheme />}
    </div>
  )
}

export function FuturePlanOrderTriggerCondition({ order }: { order: IFutureOrderItem }) {
  const priceTypeText = getTextFromStoreEnums(
    order.triggerPriceTypeInd,
    baseOrderFutureStore.getState().orderEnums.triggerPriceTypeIndWithSuffix.enums
  )

  return (
    <div className="inline-flex">
      {priceTypeText} {order.triggerDirectionInd === 'up' ? '≥' : '≤'}{' '}
      {replaceEmpty(formatCurrency(order.triggerPrice))}
    </div>
  )
}
export function FutureFundingFeeActionCell({ item }: { item: IFutureFundingFeeLog }) {
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const onAction = () => {
    setDetailModalVisible(true)
  }

  return (
    <>
      {detailModalVisible && (
        <FutureFundingFeeDetail
          visible={detailModalVisible}
          onClose={() => {
            setDetailModalVisible(false)
          }}
          fundingFee={item}
        />
      )}
      <div>
        <div className="text-brand_color cursor-pointer" onClick={onAction}>
          {t`assets.coin.overview.detail`}
        </div>
      </div>
    </>
  )
}
