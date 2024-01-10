/**
 * 广告单详情 - 历史订单状态组件
 */
import { AdvertiseOrderStatusEnum } from '@/constants/c2c/advertise'
import OrderdetailHeaderTime from '@/features/c2c/trade/c2c-orderdetail-header/orderdetail-header-time'
import { useShowOrderComponent } from '@/features/c2c/trade/c2c-orderdetail-header/use-show-order-component'
import { C2COrderStatus } from '@/features/c2c/trade/c2c-trade'
import { IAdvertOrderHistoryList } from '@/typings/api/c2c/advertise/post-advertise'

interface StatusMessageProps {
  item: IAdvertOrderHistoryList
}
export function StatusMessage({ item }: StatusMessageProps) {
  const { statusTitle } = useShowOrderComponent({}, item, {}, {}).showSelectedOrderComponent
  const isShowExp = [
    C2COrderStatus.CREATED,
    C2COrderStatus.WAS_PAYED,
    C2COrderStatus.WAS_TRANSFER_COIN,
    C2COrderStatus.WAS_COLLECTED,
  ].includes((item.statusCd || '') as C2COrderStatus)
  return (
    <span>
      <span className="flex items-center">
        <span
          className={
            item.statusCd === AdvertiseOrderStatusEnum.wasReceiveCoin ||
            item.statusCd === AdvertiseOrderStatusEnum.wasCancel
              ? 'text-text_color_03 mr-1'
              : 'mr-1'
          }
        >
          {statusTitle}
        </span>
        {isShowExp && item?.expireTime && <OrderdetailHeaderTime targetDateTime={item.expireTime - Date.now()} />}
      </span>
    </span>
  )
}
