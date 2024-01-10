import { queryFutureOrderFundingFeeLogs } from '@/apis/order'
import Icon from '@/components/icon'
import { getCoinPrecision, rateFilter } from '@/helper/assets'
import { formatDate } from '@/helper/date'
import { formatCurrency } from '@/helper/decimal'
import { replaceEmpty } from '@/helper/filters'
import { getFutureTradePair } from '@/helper/market'
import { getTextFromStoreEnums } from '@/helper/store'
import { useTablePagination } from '@/hooks/use-table-pagination'
import { MarkcoinRequest } from '@/plugins/request'
import { baseOrderFutureStore } from '@/store/order/future'
import { IBaseOrderTransactionLog } from '@/typings/api/order'
import { YapiGetV1PerpetualAssetsFundingRateDetailListFundingRateData } from '@/typings/yapi/PerpetualAssetsFundingRateDetailV1GetApi'
import { YapiGetV1PerpetualOrderDetailListData } from '@/typings/yapi/PerpetualOrderDetailListV1GetApi'
import { t } from '@lingui/macro'
import { Message, Modal, Spin, TableColumnProps } from '@nbit/arco'
import { IncreaseTag } from '@nbit/react'
import classNames from 'classnames'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useCopyToClipboard } from 'react-use'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import Table from '@/components/table'
import styles from './base.module.css'

export type IOrderStatusProps = {
  completeness?: string
  statusText?: string
  statusConfig?: {
    icon: string
    hasTheme?: boolean
    textColor: string
  }
  no: string
  name?: ReactNode
  title?: ReactNode
}
function OrderStatus({
  title = t`features_orders_order_detail_5101068`,
  statusConfig,
  completeness,
  name,
  no,
  ...props
}: IOrderStatusProps) {
  const [, copyToClipboard] = useCopyToClipboard()
  const statusText =
    parseFloat(completeness || '0') > 0 ? `${props.statusText}(${parseFloat(completeness || '0')}%)` : props.statusText
  const copy = () => {
    copyToClipboard(no)
    Message.success(t`features_orders_order_detail_5101067`)
  }

  return (
    <div className={styles['order-status-wrapper']}>
      <div className="px-4 w-full mb-2">
        <div className="order-no">
          <div>
            <span>{title} :</span>
            <span>{no}</span>
          </div>
          <div onClick={copy}>
            <Icon name="copy" hasTheme />
          </div>
        </div>
      </div>
      {name && <div className="mb-2 text-base font-medium">{name}</div>}
      {statusConfig && (
        <div className={classNames('flex items-center text-sm', statusConfig.textColor)}>
          <span className="mr-1">
            <Icon name={statusConfig.icon} hasTheme={statusConfig.hasTheme} />
          </span>
          <span>{statusText}</span>
        </div>
      )}
    </div>
  )
}

export type IPropListProps = {
  list: {
    label: string | ReactNode
    id?: string
    value: string | ReactNode
    /** 隐藏 */
    invisible?: boolean
  }[]
}
export function PropList({ list }: IPropListProps) {
  return (
    <div>
      {list
        .filter(item => !item.invisible)
        .map(item => {
          return (
            <div
              key={typeof item.label === 'string' ? item.label : item.id}
              className={styles['prop-list-item-wrapper']}
            >
              <div className="text-text_color_02">{item.label}</div>
              <div>{item.value || replaceEmpty(item.value as any)}</div>
            </div>
          )
        })}
    </div>
  )
}

type IBaseTableLogsProps = {
  propData?: any[]
  search?: MarkcoinRequest<
    any,
    {
      list?: any[]
      total?: number
    }
  >
  columns: TableColumnProps[]
  rowKey?: string
  params?: any
}

export function BaseTableLogs({ propData, params, search, rowKey = 'id', columns: propColumns }: IBaseTableLogsProps) {
  const columns = propColumns.map(col => ({ ...col }))
  const { tablePaginationProps, data, loading } = useTablePagination({
    search,
    propData,
    params,
  })

  if (!data || data.length === 0) {
    return (
      <Spin
        loading={loading}
        className="block"
        style={{
          width: '480px',
        }}
      >
        <div className="text-center text-text_color_02 py-9 text-xs">{t`trade.c2c.noData`}</div>
      </Spin>
    )
  }

  return (
    <div
      className={classNames(styles['logs-table-wrapper'], {
        'much-page': tablePaginationProps.total! / tablePaginationProps.pageSize! > 4,
      })}
    >
      <Table
        border={false}
        scroll={{
          y: 200,
        }}
        autoWidth
        fitByContent
        minWidthWithColumn={false}
        className="scrollbar-custom "
        pagination={tablePaginationProps}
        rowKey={i => `${(propData || data).indexOf(i)}-${i[rowKey]}`}
        loading={loading}
        columns={columns}
        data={propData || data}
      />
    </div>
  )
}

// 交易日志
export function TransactionLogs({
  feeCoinName,
  sellCoinName,
  logs,
}: {
  logs?: IBaseOrderTransactionLog[]
  sellCoinName: string
  feeCoinName: string
}) {
  const columns: TableColumnProps<IBaseOrderTransactionLog>[] = [
    {
      title: t`future.funding-history.index-price.column.time`,
      width: 200,
      render(_, log) {
        return <div className="inline-block">{formatDate(log.createdByTime!)}</div>
      },
    },
    {
      title: t`Amount`,
      align: 'right',
      render(_, log) {
        return (
          <div className="inline-block">{`${replaceEmpty(formatCurrency(log.count))} ${replaceEmpty(
            sellCoinName
          )}`}</div>
        )
      },
    },
    {
      title: t`future.funding-history.index.table-type.price`,
      align: 'right',
      render(_, log) {
        return <div className="inline-block">{replaceEmpty(formatCurrency(log.price!))}</div>
      },
    },
    {
      title: t`order.columns.logFee`,
      align: 'right',
      render(_, log) {
        return (
          <div className="inline-block">{`${replaceEmpty(formatCurrency(log.fees))} ${replaceEmpty(feeCoinName)}`}</div>
        )
      },
    },
  ]

  return <BaseTableLogs rowKey="createdByTime" columns={columns} propData={logs} />
}
type IFundingLog = YapiGetV1PerpetualOrderDetailListData
// 资金明细
export function FundingLogs({ orderId, symbol }: { orderId: string; symbol: string }) {
  const { futuresCurrencySettings } = useAssetsFuturesStore()
  const columns: TableColumnProps<IFundingLog>[] = [
    {
      title: t`future.funding-history.index-price.column.time`,
      width: 200,
      render(_, log) {
        return <div className="inline-block">{formatDate(log.time!)}</div>
      },
    },
    {
      title: t`Amount`,
      width: 200,
      align: 'right',
      render(_, log) {
        return (
          <div className="inline-block">
            <IncreaseTag
              isRound={false}
              digits={getCoinPrecision(log.coinName)}
              value={log.amount}
              kSign
              hasColor={false}
            />{' '}
            {log.coinName?.toUpperCase()}
          </div>
        )
      },
    },
    {
      title: t`features_orders_details_base_5101359`,
      width: 200,
      align: 'right',
      render(_, log) {
        return (
          <div className="inline-block">
            <span>1 {log.coinName?.toUpperCase()} ≈</span>
            <span className="ml-1">
              {formatCurrency(log.rate, futuresCurrencySettings.offset || 2, false)} {log.currencyName}
            </span>
          </div>
        )
      },
    },
    {
      title: t`assets.coin.trade-records.table.type`,
      width: 200,
      align: 'right',
      render(_, log) {
        return (
          <div className="inline-block">
            {replaceEmpty(
              getTextFromStoreEnums(log.type, baseOrderFutureStore.getState().orderEnums.fundingFeeTypeWithSuffix.enums)
            )}
          </div>
        )
      },
    },
  ]
  const paramsRef = useRef({
    orderId,
  })

  return (
    <BaseTableLogs rowKey="time" params={paramsRef.current} search={queryFutureOrderFundingFeeLogs} columns={columns} />
  )
}
type IMarginLog = IFundingLog
// 保证金明细
export function MarginLogs({ logs }: { logs?: IMarginLog[] }) {
  const columns: TableColumnProps<IMarginLog>[] = [
    {
      title: t`future.funding-history.index-price.column.time`,
      render(_, log) {
        return formatDate(log.time!)
      },
    },
    {
      title: t`Amount`,
      align: 'right',
      render(_, log) {
        return (
          <div>
            <IncreaseTag value={log.amount} kSign hasColor={false} /> {log.coinName?.toUpperCase()}
          </div>
        )
      },
    },
    {
      title: t`features_orders_details_base_5101359`,
      align: 'right',
      render(_, log) {
        return (
          <div>
            <span>1 {log.coinName} ≈</span>
            <span className="ml-1">
              {rateFilter({
                symbol: log.coinName,
                showUnit: false,
                amount: 1,
                rate: 'USD',
              })}
            </span>
          </div>
        )
      },
    },
    {
      title: t`assets.coin.trade-records.table.type`,
      align: 'right',
      render(_, log) {
        return replaceEmpty(
          getTextFromStoreEnums(log.type, baseOrderFutureStore.getState().orderEnums.marginLogTypeWithSuffix.enums)
        )
      },
    },
  ]
  return <BaseTableLogs rowKey="time" propData={logs} search={queryFutureOrderFundingFeeLogs} columns={columns} />
}
type IFundingFee = YapiGetV1PerpetualAssetsFundingRateDetailListFundingRateData
// 资金费用详情里的费用明细
export function FeesInFundingDetail({ fees = [] }: { fees?: IFundingFee[] }) {
  const columns: TableColumnProps<IFundingFee>[] = [
    {
      title: t`future.funding-history.index-price.column.time`,
      render(_, log) {
        return formatDate(log.time!)
      },
    },
    {
      title: t`Amount`,
      align: 'right',
      render(_, log) {
        return (
          <div>
            <IncreaseTag
              isRound={false}
              digits={getCoinPrecision(log.coinName)}
              value={log.amount}
              kSign
              hasColor={false}
            />{' '}
            {log.coinName}
          </div>
        )
      },
    },
  ]
  return <BaseTableLogs rowKey="time" propData={fees || []} columns={columns} />
}
export type IOrderDetailLayoutProps = {
  children?: ReactNode
  visible: boolean
  onClose: () => void
  statusProps: IOrderStatusProps
  props1: IPropListProps['list']
  props2: IPropListProps['list']
  topNode?: ReactNode
  title?: ReactNode
  loading?: boolean
}

export function OrderDetailLayoutProps({
  children,
  visible,
  props1,
  props2,
  statusProps,
  onClose,
  topNode,
  loading,
  title = t`features/orders/details/future-9`,
}: IOrderDetailLayoutProps) {
  return (
    <Modal
      wrapClassName={classNames('scrollbar-custom', styles['modal-wrapper'])}
      title={title}
      visible={visible}
      onCancel={onClose}
      footer={null}
      closeIcon={<Icon className="text-xl translate-y-1" name="close" hasTheme />}
    >
      <div className={styles['order-detail-page-layout-wrapper']}>
        <Spin delay={0} loading={loading}>
          <div>
            <OrderStatus {...statusProps} />
            {topNode}
            <div className="">
              <PropList list={props1} />
              {props2.length > 0 && (
                <>
                  <div className="border-b border-solid border-line_color_02 pt-2"></div>
                  <PropList list={props2} />
                </>
              )}
              <div className="mt-1">{children}</div>
            </div>
          </div>
        </Spin>
      </div>
    </Modal>
  )
}
