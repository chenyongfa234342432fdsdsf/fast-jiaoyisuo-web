/**
 * 现货手续费
 */
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { OrderDirectionEnum, getOrderDirectionEnumName, getOrderEntrustTypeEnumName } from '@/constants/order'
import { useAssetsStore } from '@/store/assets'
import { CreateTimeItem } from '../create-time-item'

export function SpotFeeInfo() {
  const { financialRecordDetail } = useAssetsStore()
  const { symbol, amount, feeCoinName, side, orderType } = financialRecordDetail
  return (
    <>
      <div className="details-item-info">
        <div className="label">{t`order.columns.currency`}</div>
        <div className="value">{symbol}</div>
      </div>
      <div className="details-item-info">
        <div className="label">{t`features/orders/filters/future-0`}</div>
        <div
          className={classNames(
            side === OrderDirectionEnum.buy ? 'text-buy_up_color value' : 'text-sell_down_color value'
          )}
        >
          {getOrderDirectionEnumName(side as OrderDirectionEnum)}
        </div>
      </div>
      <div className="details-item-info">
        <div className="label">{t`order.columns.entrustType`}</div>
        <div className="value">{getOrderEntrustTypeEnumName(orderType) || '--'}</div>
      </div>
      <div className="details-item-info">
        <div className="label">{t`quote.common.volume`}</div>
        <div className="value">
          {amount} {feeCoinName || '--'}
        </div>
      </div>
      <CreateTimeItem cssName="details-item-info" />
    </>
  )
}
