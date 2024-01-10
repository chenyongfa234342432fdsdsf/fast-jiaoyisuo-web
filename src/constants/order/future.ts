import { t } from '@lingui/macro'

export enum FutureOrderStopLimitDetailDisplayStatusEnum {
  dealt = 'dealt',
  toDeal = 'to_deal',
  canceled = 'canceled',
}
export function getFutureOrderStopLimitDetailDisplayStatusEnum(value: FutureOrderStopLimitDetailDisplayStatusEnum) {
  return {
    [FutureOrderStopLimitDetailDisplayStatusEnum.dealt]: t`order.constants.status.entrusted`,
    [FutureOrderStopLimitDetailDisplayStatusEnum.toDeal]: t`constants_order_future_5101477`,
    [FutureOrderStopLimitDetailDisplayStatusEnum.canceled]: t`order.constants.status.canceled`,
  }[value]
}
