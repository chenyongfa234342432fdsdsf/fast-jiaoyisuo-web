import {
  SpotNormalOrderMarketUnitEnum,
  OrderStatusEnum,
  FutureOrderDirectionEnum,
  FutureNormalOrderTypeIndEnum,
  FutureNormalOrderStatusEnum,
  FutureOrderPlaceUnitEnum,
} from '@/constants/order'
import { formatDate } from '@/helper/date'
import { formatCurrency } from '@/helper/decimal'
import { replaceEmpty } from '@/helper/filters'
import { IFutureOrderItem, IFutureOrderTransactionLog, IQueryFutureOrderDetailResp } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { Modal, TableColumnProps } from '@nbit/arco'
import classNames from 'classnames'
import { ReactNode, useRef, useState } from 'react'
import { queryFutureOrderDetail, queryFutureOrderTransactionLogs } from '@/apis/order'
import { useMount, useRequest } from 'ahooks'
import {
  getFuture,
  getFutureOrderCountByTradeUnit,
  getFutureOrderCountSymbol,
  getFutureOrderDirectionColorClass,
  getFutureOrderIsBuy,
  getFutureOrderValueEnumText,
} from '@/helper/order/future'
import { IncreaseTag } from '@nbit/react'
import Tabs from '@/components/tabs'
import {
  BaseTableLogs,
  FundingLogs,
  IOrderStatusProps,
  IPropListProps,
  MarginLogs,
  OrderDetailLayoutProps,
} from './base'
import styles from './base.module.css'
import { FuturePlanOrderTriggerCondition } from '../order-table-cell'

function getOrderStatusProps(order: IFutureOrderItem): IOrderStatusProps {
  const enumsText = getFutureOrderValueEnumText(order)
  const statusConfigs = {
    [FutureNormalOrderStatusEnum.partlySucceed]: {
      icon: 'clock_paused',
      textColor: 'text-brand_color',
    },
    [FutureNormalOrderStatusEnum.unsettled]: {
      hasTheme: true,
      icon: 'login_unsatisfied',
      textColor: 'text-text_color_02',
    },
    [FutureNormalOrderStatusEnum.settled]: {
      icon: 'login_satisfied',
      textColor: 'text-success_color',
    },
    [FutureNormalOrderStatusEnum.partlyCanceled]: {
      icon: 'clock_paused',
      textColor: 'text-brand_color',
    },
    [FutureNormalOrderStatusEnum.systemCanceled]: {
      hasTheme: true,
      textColor: 'text-text_color_02',
      icon: 'login_unsatisfied',
    },
    [FutureNormalOrderStatusEnum.manualCanceled]: {
      textColor: 'text-text_color_02',
      hasTheme: true,
      icon: 'login_unsatisfied',
    },
  }
  const statusConfig = statusConfigs[order.statusCd!]

  return {
    statusConfig,
    statusText: enumsText.statusText,
    no: order.id?.toString() || '',
    completeness: order.completeness,
    name: (
      <>
        <span>{replaceEmpty(order.baseCoinShortName)}</span>
        <span>{replaceEmpty(order.quoteCoinShortName)}</span> {t`assets.enum.tradeCoinType.perpetual`}
      </>
    ),
  }
}

type IFutureOrderDetailProps = {
  children?: ReactNode
  id: any
  visible: boolean
  onClose: () => void
}
export function useOrderDetail(id: any) {
  const [order, setOrder] = useState<IQueryFutureOrderDetailResp>({} as any)
  const { run, loading } = useRequest(
    async () => {
      const res = await queryFutureOrderDetail({
        id,
      })
      if (!res.isOk || !res.data) {
        return
      }
      setOrder(res.data)
    },
    {
      manual: true,
    }
  )
  useMount(run)

  return [order, loading] as const
}

function TransactionLogs({
  feeCoinName,
  orderId,
  sellCoinName,
  isLiquidationOrder,
  symbol,
}: {
  sellCoinName: string
  feeCoinName: string
  orderId: any
  isLiquidationOrder: boolean
  symbol: string
}) {
  const future = getFuture(symbol)

  const columns: TableColumnProps<IFutureOrderTransactionLog>[] = [
    {
      title: t`future.funding-history.index-price.column.time`,
      width: 200,
      render(_, log) {
        return <div className="inline-block">{formatDate(log.createdByTimeLong!)}</div>
      },
    },
    {
      title: t`Amount`,
      align: 'right',
      width: 200,
      render(_, log) {
        const isQuote = sellCoinName === log.quoteSymbolName
        let digit = isQuote ? future?.quoteSymbolScale : future?.amountOffset
        let size = isQuote ? log.filledAmount : log.filledSize
        let coinName = isQuote ? log.quoteSymbolName : log.baseSymbolName
        // 没有对应记录时取另外的字段
        if (!size) {
          size = log.filledAmount || log.filledSize
          coinName = isQuote ? log.baseSymbolName : log.quoteSymbolName
          digit = isQuote ? future?.amountOffset : future?.quoteSymbolScale
        }
        return (
          <div className="inline-block">
            {`${replaceEmpty(formatCurrency(size, digit, false))} ${replaceEmpty(coinName || sellCoinName)}`}
          </div>
        )
      },
    },
    {
      title: t`future.funding-history.index.table-type.price`,
      width: 200,
      align: 'right',
      render(_, log) {
        return (
          <div className="inline-block">
            {replaceEmpty(formatCurrency(log.filledPrice!, future?.priceOffset, false))}
          </div>
        )
      },
    },
    {
      title: t`order.columns.logFee`,
      width: 200,
      align: 'right',
      render(_, log) {
        return (
          <div className="inline-block">{`${replaceEmpty(
            formatCurrency(log.fees, future?.quoteSymbolScale, false)
          )} ${replaceEmpty(feeCoinName)}`}</div>
        )
      },
    },
    ...(isLiquidationOrder
      ? []
      : ([
          {
            title: t`features_orders_details_future_5101572`,
            width: 80,
            align: 'right',
            render(_, log) {
              return <div className="capitalize inline-block">{replaceEmpty(log.takerMaker)}</div>
            },
          },
        ] as const)),
  ]

  const paramsRef = useRef({
    orderId,
  })
  const search = queryFutureOrderTransactionLogs

  return <BaseTableLogs params={paramsRef.current} rowKey="createdByTime" search={search} columns={columns} />
}

export function FutureOrderDetail({ visible, onClose, id }: IFutureOrderDetailProps) {
  const [order, loading] = useOrderDetail(id)
  const enumsText = getFutureOrderValueEnumText(order)
  const feeCoinName = order.quoteCoinShortName
  const isLiquidationOrder = order.typeInd === FutureNormalOrderTypeIndEnum.liquidation
  const isLightenOrder = order.typeInd === FutureNormalOrderTypeIndEnum.lighten
  const isPlanOrder = false
  const isOpenOrder = [FutureOrderDirectionEnum.openSell, FutureOrderDirectionEnum.openBuy].includes(
    order.sideInd as any
  )
  const coinName = getFutureOrderCountSymbol(order)
  const isMarketPrice = order.typeInd === FutureNormalOrderTypeIndEnum.market
  const { size, tradeSize, symbolName: orderEntrustCountSymbolName } = getFutureOrderCountByTradeUnit(order)
  const future = getFuture(order.symbol)

  const props1: IPropListProps['list'] = [
    {
      label: t`order.columns.entrustType`,
      value: !order.id ? (
        replaceEmpty()
      ) : (
        <span className={getFutureOrderDirectionColorClass(order.sideInd)}>
          {enumsText.typeText} / {enumsText.directionText}
        </span>
      ),
    },
    {
      label: t({
        id: 'features_orders_details_spot_5101078',
        values: { 0: replaceEmpty(orderEntrustCountSymbolName) },
      }),
      value: (
        <span>
          <span>{replaceEmpty(formatCurrency(tradeSize))}</span>/
          <span className="text-text_color_02">{formatCurrency(size)}</span>
        </span>
      ),
    },
    {
      label: t({
        id: 'features_orders_details_spot_5101079',
        values: { 0: replaceEmpty(order.quoteCoinShortName) },
      }),
      value: (
        <span>
          <span>{replaceEmpty(formatCurrency(order.tradePrice, future?.priceOffset, false))}</span>/
          <span className="text-text_color_02">
            {isMarketPrice
              ? t`trade.tab.orderType.marketPrice`
              : formatCurrency(order.price || 0, future?.priceOffset, false)}
          </span>
        </span>
      ),
    },
    {
      label: t`features/orders/order-columns/future-5`,
      value: <FuturePlanOrderTriggerCondition order={order} />,
      invisible: !isPlanOrder,
    },
  ]
  const props2: IPropListProps['list'] = [
    {
      label: t`order.columns.logFee`,
      value: `${replaceEmpty(formatCurrency(order.fees, future?.quoteSymbolScale, false))} ${replaceEmpty(
        feeCoinName
      )}`,
    },
    {
      label: t`features/orders/order-columns/holding-7`,
      invisible: isOpenOrder,
      value: (
        <div>
          <IncreaseTag value={order.realizedProfit} kSign /> {order.quoteCoinShortName}
        </div>
      ),
    },
    {
      label: t`features_orders_details_future_5101368`,
      value: `${replaceEmpty(formatCurrency(order.liquidationFees))} ${replaceEmpty(feeCoinName)}`,
      invisible: !isLiquidationOrder,
    },
    {
      label: t`constants/assets/common-10`,
      value: (
        <div>
          <IncreaseTag value={order.liquidationRemainMargin} kSign hasColor={false} />
          {` ${replaceEmpty(feeCoinName)}`}
        </div>
      ),
      invisible: !isLiquidationOrder,
    },
    {
      label: t`features_orders_details_future_5101370`,
      value: formatDate(order.createdByTime!),
      invisible: !isLiquidationOrder,
    },
    {
      label: t`features_orders_details_future_5101371`,
      value: formatDate(order.createdByTime!),
      invisible: !isLiquidationOrder,
    },
    {
      label: t`features_orders_details_future_5101372`,
      value: formatDate(order.createdByTime!),
      invisible: !isLightenOrder,
    },
    {
      label: t`features_orders_details_future_5101373`,
      value: formatDate(order.createdByTime!),
      invisible: !isLightenOrder,
    },
    {
      label: t`assets.financial-record.creationTime`,
      value: formatDate(order.createdByTime!),
      invisible: isLightenOrder || isLiquidationOrder,
    },
    {
      label: t`features_orders_details_spot_5101080`,
      value: formatDate(order.updatedByTime!),
      invisible: isLightenOrder || isLiquidationOrder,
    },
  ]
  const TabType = {
    transactionLogs: 0,
    funding: 1,
    margin: 2,
  }
  const [activeTab, setActiveTab] = useState(TabType.transactionLogs)
  const originTabList = [
    {
      title: t`features_orders_details_spot_5101081`,
      id: TabType.transactionLogs,
      visible: true,
    },
    {
      title: t`features_orders_details_future_5101355`,
      id: TabType.funding,
      // 平仓订单提供资金明细
      visible:
        Number(order.isAccept) !== 1 &&
        [FutureOrderDirectionEnum.closeBuy, FutureOrderDirectionEnum.closeSell].includes(order.sideInd as any),
    },
    {
      title: t`features_orders_details_future_5101374`,
      visible: false,
      id: TabType.margin,
    },
  ]
  const tabList = originTabList.filter(tab => tab.visible)
  const showTabs = tabList.length > 1

  const onTabChange = (tab: any) => {
    setActiveTab(tab.id)
  }
  const logsNode = (
    <TransactionLogs
      isLiquidationOrder={isLiquidationOrder}
      orderId={id}
      symbol={order.symbol}
      sellCoinName={coinName}
      feeCoinName={feeCoinName!}
    />
  )

  return (
    <OrderDetailLayoutProps
      statusProps={getOrderStatusProps(order)}
      visible={visible}
      onClose={onClose}
      props1={props1}
      props2={props2}
      loading={loading}
    >
      {showTabs ? (
        <div className={styles['tabs-wrapper']}>
          <div className="-translate-x-4">
            <Tabs mode="line" value={activeTab} tabList={tabList} onChange={onTabChange} />
          </div>
          {activeTab === TabType.transactionLogs && logsNode}
          {activeTab === TabType.funding && <FundingLogs symbol={order.symbol} orderId={order.id} />}
          {activeTab === TabType.margin && <MarginLogs logs={[]} />}
        </div>
      ) : (
        <>
          <div className="py-3">
            <h3 className="font-medium text-base">{t`features_orders_details_spot_5101081`}</h3>
          </div>
          {logsNode}
        </>
      )}
    </OrderDetailLayoutProps>
  )
}
