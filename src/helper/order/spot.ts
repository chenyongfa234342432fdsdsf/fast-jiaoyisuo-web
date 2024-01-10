import { EntrustTypeEnum, OrderDirectionEnum, OrderStatusEnum, SpotPlanOrderStatusEnum } from '@/constants/order'
import { baseSpotStore } from '@/store/order/spot'
import { IBaseOrderItem, IQuerySpotOrderReqParams, ISpotPlanOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { getTextFromStoreEnums } from '../store'

export function normalOrderMapParamsFn(params: IQuerySpotOrderReqParams): IQuerySpotOrderReqParams {
  return {
    ...params,
    status: Array.isArray(params.statusArr) ? params.statusArr.join(',') : params.status,
    side: Array.isArray(params.direction) ? (params.direction.length > 1 ? '' : params.direction[0]) : params.direction,
    beginDate: params.beginDateNumber?.toString(),
    endDate: params.endDateNumber?.toString(),
    beginDateNumber: undefined,
    endDateNumber: undefined,
    direction: undefined,
    statusArr: undefined,
    dateType: undefined,
    entrustType: undefined,
  }
}

export function getNormalTypes() {
  return [
    {
      label: t`common.all`,
      value: '',
    },
    {
      label: t`order.constants.matchType.market`,
      value: EntrustTypeEnum.market,
    },
    {
      label: t`order.constants.matchType.limit`,
      value: EntrustTypeEnum.limit,
    },
  ]
}
export function getPlanTypes() {
  return [
    {
      label: t`common.all`,
      value: '',
    },
    {
      label: t`features_orders_order_columns_spot_5101082`,
      value: EntrustTypeEnum.market,
    },
    {
      label: t`constants/order-8`,
      value: EntrustTypeEnum.limit,
    },
  ]
}
/** 获取订单枚举文本 */
export function getOrderValueEnumText(
  orderItem: IBaseOrderItem | ISpotPlanOrderItem,
  replaceValues: Partial<IBaseOrderItem & ISpotPlanOrderItem> = {}
) {
  const order = {
    ...orderItem,
    ...replaceValues,
  }
  const orderEnums = baseSpotStore.getState().orderEnums
  const orderStatusEnums = orderEnums.orderStatus.enums
  const planOrderStatusEnums = orderEnums.planOrderStatus.enums
  const planOrder = order as ISpotPlanOrderItem
  const normalOrder = order as IBaseOrderItem
  const isPlanOrder = planOrder.orderStatusCd !== undefined
  const normalStatusConfigs = {
    [OrderStatusEnum.systemCanceled]: {
      text: t`order.constants.status.canceled`,
    },
    [OrderStatusEnum.manualCanceled]: {
      text: t`order.constants.status.canceled`,
    },
  }
  const planStatusConfigs = {
    [SpotPlanOrderStatusEnum.systemCanceled]: {
      text: t`order.constants.status.canceled`,
    },
    [SpotPlanOrderStatusEnum.manualCanceled]: {
      text: t`order.constants.status.canceled`,
    },
  }
  const statusConfig = isPlanOrder
    ? planStatusConfigs[planOrder.orderStatusCd]
    : normalStatusConfigs[normalOrder.status!]
  // 对于已撤销，这里做一个单独的处理，因为控制台还是分开显示手动和系统，但是前端只有一个已撤销，无法改变文字来区分
  const statusText =
    statusConfig?.text ||
    getTextFromStoreEnums(
      isPlanOrder ? planOrder.orderStatusCd : normalOrder.status!,
      isPlanOrder ? planOrderStatusEnums : orderStatusEnums
    )

  const typeText = getTextFromStoreEnums(
    isPlanOrder ? planOrder.matchType : normalOrder.orderType!,
    orderEnums.entrustType.enums
  )
  const typeTextWithSuffix = getTextFromStoreEnums(
    isPlanOrder ? planOrder.matchType : normalOrder.orderType!,
    isPlanOrder ? orderEnums.planEntrustTypeWithSuffix.enums : orderEnums.entrustTypeWithSuffix.enums
  )

  const directionText = getTextFromStoreEnums(
    isPlanOrder ? planOrder.side : normalOrder.side!,
    orderEnums.orderDirection.enums
  )

  return {
    statusText,
    directionText,
    typeText,
    typeTextWithSuffix,
  }
}
const ORDER_MAX_COUNT = 50
/** 获取是否超出订单数量限制 */
export function getCanOrderMore(entrustType: EntrustTypeEnum, direction: OrderDirectionEnum) {
  const openOrderModule = baseSpotStore.getState().openOrderModule
  const existOrders = (
    (entrustType === EntrustTypeEnum.plan ? openOrderModule.plan.data : openOrderModule.normal.data) as any[]
  ).filter(item => item.side === direction)

  return existOrders.length < ORDER_MAX_COUNT
}
