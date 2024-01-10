import { ReactNode } from 'react'
import { t } from '@lingui/macro'
import { Button, Message, Modal, TableColumnProps, TableProps } from '@nbit/arco'
import { useRequest } from 'ahooks'
import { confirmToPromise } from '@/helper/order'
import { IOrderModuleContext } from '@/features/orders/order-module-context'
import { MarkcoinResponse } from '@/plugins/request'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { useUserStore } from '@/store/user'
import Link from '@/components/link'
import { usePageContext } from '@/hooks/use-page-context'
import { useTablePagination } from '@/hooks/use-table-pagination'
import { UserFuturesTradeStatus } from '@/constants/user'
import { useCommonStore } from '@/store/common'
import Table from '@/components/table'
import styles from './order.module.css'
import { OpenFuture } from '../trade/futures/open-future'

type INoDataElementProps = {
  needLogin?: boolean
  isFuture?: boolean
  loading?: boolean
}

export function NoDataElement({ needLogin = true, isFuture, loading = false }: INoDataElementProps = {}) {
  const { isLogin, userInfo } = useUserStore()
  const pageContext = usePageContext()
  const { isMergeMode } = useCommonStore()
  const isOpenFutures = userInfo.isOpenContractStatus === UserFuturesTradeStatus.open
  if (loading) return null
  return (
    <div className={styles['no-data-element-wrapper']}>
      <div>
        <Icon className="empty-img" name="no_data" isRemoteUrl hasTheme />
        {(isOpenFutures || !isFuture) && (
          <div className="text-text_color_03 text-xs cursor-auto">{t`features_orders_order_table_layout_5101267`}</div>
        )}
      </div>
      {!isMergeMode && !isLogin && needLogin && (
        <Link className="mt-2" href={`/login?redirect=${pageContext.path}`}>
          <Button type="primary" size="small">
            {t`user.field.reuse_07`}
          </Button>
        </Link>
      )}
      {isFuture && (
        <OpenFuture
          triggerButtonProps={{
            size: 'small',
          }}
        />
      )}
    </div>
  )
}

export type IOrderTableLayoutProps<T, P> = {
  children?: ReactNode
  filters: ReactNode
  columns: TableColumnProps<T>[]
  params: P
  search?: (params: any) => Promise<{
    data: T[]
    total: number
  }>
  propData?: T[]
  expandProps?: TableProps['expandProps']
  expandedRowRender?: (record: T) => JSX.Element
  getRowClassName?: (record: T) => string
  cancelAllConfig?: {
    confirmText: string
    buttonText: string
    api: () => Promise<MarkcoinResponse>
  }
  tableHeight?: number
  tableBodyFullHeight?: boolean
  onlyTable?: boolean
  inTrade?: boolean
  pageSize?: number
  needLogin?: boolean
  showPagination?: boolean
  /** 自动设置宽度，开启后将会根据实际宽度改变列宽度 */
  autoSetWidth?: boolean
  orderModuleContext: IOrderModuleContext<any>
  isFuture?: boolean
}

export function OrderTableLayout<
  T extends {
    status: any
    id: any
  },
  P
>({
  children,
  filters,
  columns: propColumns,
  expandProps,
  search,
  expandedRowRender,
  cancelAllConfig,
  params,
  propData,
  getRowClassName,
  onlyTable,
  tableHeight,
  inTrade,
  tableBodyFullHeight,
  isFuture,
  pageSize: propsPageSize = 10,
  needLogin = true,
  showPagination = true,
  autoSetWidth = true,
  orderModuleContext,
}: IOrderTableLayoutProps<T, P>) {
  const { cancelOrderEvent$, refreshEvent$ } = orderModuleContext
  const { isLogin } = useUserStore()
  const searchFn = async ({ pageNum, pageSize }) => {
    if (!search || propData || (needLogin && !isLogin)) {
      return
    }
    const res = await search({
      pageNum,
      pageSize,
    })
    return {
      isOk: true,
      data: {
        list: res.data,
        total: res.total,
      },
    }
  }
  const { tablePaginationProps, refresh, data, loading } = useTablePagination({
    search: searchFn as any,
    defaultPageSize: 20,
    params,
    propData,
  })
  const columns = propColumns
  cancelOrderEvent$.useSubscription(refresh)
  refreshEvent$.useSubscription(refresh)
  const { run: runCancelAll, loading: cancelAllLoading } = useRequest(
    async () => {
      const closeModal = await confirmToPromise(Modal.confirm, {
        title: t`order.table-layout.cancelAll.confirm.title`,
        content: cancelAllConfig?.confirmText,
      })
      const res = await cancelAllConfig!.api()
      if (!res.isOk) {
        return
      }
      Message.success(t`order.messages.cancelAllSuccess`)
      refresh()
      closeModal()
    },
    {
      manual: true,
    }
  )
  const onChange = (...res) => {}
  const isEmpty = needLogin && !isLogin ? true : (propData || data).length === 0

  return (
    <div
      className={classNames(styles['order-table-layout-wrapper'], {
        'in-trade': inTrade,
        'no-data': isEmpty,
        'auto-width': autoSetWidth,
      })}
    >
      {!onlyTable && (
        <div className="flex justify-between">
          <div className="flex flex-wrap">
            <div className="mr-2">{filters}</div>
          </div>
          {cancelAllConfig && (
            <div>
              <Button disabled={data.length === 0} loading={cancelAllLoading} type="outline" onClick={runCancelAll}>
                {cancelAllConfig.buttonText}
              </Button>
            </div>
          )}
        </div>
      )}
      <div
        className={classNames({
          'arco-table-body-full': tableBodyFullHeight,
        })}
      >
        <Table
          placeholder="--"
          scroll={{
            y: tableHeight,
          }}
          autoWidth
          fitByContent
          minWidthWithColumn={false}
          noDataElement={<NoDataElement needLogin={needLogin} isFuture={isFuture} />}
          border={false}
          onChange={onChange}
          pagination={showPagination ? tablePaginationProps : false}
          rowClassName={getRowClassName}
          rowKey={i => i.id}
          loading={loading}
          columns={columns}
          data={isEmpty ? [] : propData || data}
          expandedRowRender={expandedRowRender}
          expandProps={expandProps}
        />
        {children}
      </div>
    </div>
  )
}
