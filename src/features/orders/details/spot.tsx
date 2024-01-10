import { OrderDirectionEnum, EntrustTypeEnum, SpotNormalOrderMarketUnitEnum, OrderStatusEnum } from '@/constants/order'
import { formatDate } from '@/helper/date'
import { formatCurrency } from '@/helper/decimal'
import { replaceEmpty } from '@/helper/filters'
import { IBaseOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { ReactNode, useState } from 'react'
import { querySpotNormalOpenOrderDetail } from '@/apis/order'
import { useMount } from 'ahooks'
import { getOrderValueEnumText } from '@/helper/order/spot'
import { IOrderStatusProps, OrderDetailLayoutProps, TransactionLogs } from './base'

function getOrderStatusProps(order: IBaseOrderItem): IOrderStatusProps {
  const enumsText = getOrderValueEnumText(order)
  const statusConfigs = {
    [OrderStatusEnum.partlySucceed]: {
      icon: 'clock_paused',
      textColor: 'text-brand_color',
    },
    [OrderStatusEnum.unsettled]: {
      hasTheme: true,
      icon: 'login_unsatisfied',
      textColor: 'text-text_color_02',
    },
    [OrderStatusEnum.settled]: {
      icon: 'login_satisfied',
      textColor: 'text-success_color',
    },
    [OrderStatusEnum.partlyCanceled]: {
      icon: 'clock_paused',
      textColor: 'text-brand_color',
    },
    [OrderStatusEnum.systemCanceled]: {
      hasTheme: true,
      textColor: 'text-text_color_02',
      icon: 'login_unsatisfied',
    },
    [OrderStatusEnum.manualCanceled]: {
      textColor: 'text-text_color_02',
      hasTheme: true,
      icon: 'login_unsatisfied',
    },
  }
  const statusConfig = statusConfigs[order.status!]

  return {
    statusConfig,
    statusText: enumsText.statusText,
    no: order.id?.toString() || '',
    completeness: order.completeness,
    name: (
      <>
        <span>{replaceEmpty(order.sellCoinShortName)}</span> / <span>{replaceEmpty(order.buyCoinShortName)}</span>
      </>
    ),
  }
}

type ISpotOrderDetailProps = {
  children?: ReactNode
  id: any
  visible: boolean
  onClose: () => void
}

export function SpotOrderDetail({ visible, onClose, id }: ISpotOrderDetailProps) {
  const [order, setOrder] = useState<IBaseOrderItem>({} as any)
  useMount(async () => {
    const res = await querySpotNormalOpenOrderDetail({
      id,
    })
    if (!res.isOk || !res.data) {
      return
    }
    setOrder(res.data)
  })
  const isBuy = order.side === OrderDirectionEnum.buy
  const enumsText = getOrderValueEnumText(order)
  const isMarketPrice = order.orderType === EntrustTypeEnum.market
  const feeCoinName = isBuy ? order.sellCoinShortName : order.buyCoinShortName
  const marketOrderIsEntrustAmount = order.marketUnit === SpotNormalOrderMarketUnitEnum.entrustAmount
  const coinName = isMarketPrice
    ? marketOrderIsEntrustAmount
      ? order.sellCoinShortName
      : order.buyCoinShortName
    : order.sellCoinShortName

  const props1 = [
    {
      label: t`order.columns.entrustType`,
      value: !order.id ? (
        replaceEmpty()
      ) : (
        <span
          className={classNames({
            'text-sell_down_color': !isBuy,
            'text-buy_up_color': isBuy,
          })}
        >
          {enumsText.typeText} / {enumsText.directionText}
        </span>
      ),
    },
    {
      label: t({
        id: 'features_orders_details_spot_5101078',
        values: { 0: replaceEmpty(coinName) },
      }),
      value: (
        <span>
          <span>{formatCurrency(order.successCount)}</span>/
          <span className="text-text_color_02">{formatCurrency(order.entrustCount)}</span>
        </span>
      ),
    },
    {
      label: t`features_orders_order_columns_spot_5101084`,
      value: (
        <span>
          <span>{replaceEmpty(order.averagePrice)}</span>/
          <span className="text-text_color_02">
            {isMarketPrice ? t`trade.tab.orderType.marketPrice` : formatCurrency(order.entrustPrice || '')}
          </span>
        </span>
      ),
    },
  ]
  const props2 = [
    {
      label: t`order.columns.logFee`,
      value: `${replaceEmpty(formatCurrency(order.fees))} ${replaceEmpty(feeCoinName)}`,
    },
    {
      label: t`features_order_book_index_2703`,
      value: `${replaceEmpty(formatCurrency(order.totalAmount))} ${replaceEmpty(order.buyCoinShortName)}`,
    },
    {
      label: t`assets.financial-record.creationTime`,
      value: formatDate(order.createdByTime!),
    },
    {
      label: t`features_orders_details_spot_5101080`,
      value: formatDate(order.updatedByTime!),
    },
  ]

  return (
    <OrderDetailLayoutProps
      statusProps={getOrderStatusProps(order)}
      visible={visible}
      onClose={onClose}
      props1={props1}
      props2={props2}
    >
      <div className="py-3">
        <h3 className="font-medium text-base">{t`features_orders_details_spot_5101081`}</h3>
      </div>
      <TransactionLogs
        logs={order.transactionLogs}
        sellCoinName={order.sellCoinShortName!}
        feeCoinName={feeCoinName!}
      />
    </OrderDetailLayoutProps>
  )
}
