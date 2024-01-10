/**
 * c2c - 广告单详情 - 历史订单
 */
import { Pagination } from '@nbit/arco'
import { t } from '@lingui/macro'
import AssetsTable from '@/features/assets/common/assets-table'
import { formatDate } from '@/helper/date'
import ListEmpty from '@/components/list-empty'
import { AdvertOrderHistoryResp, IAdvertOrderHistoryList } from '@/typings/api/c2c/advertise/post-advertise'
import { formatCurrency } from '@/helper/decimal'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { link } from '@/helper/link'
import { getC2CCenterPagePath, getC2cOrderDetailPageRoutePath } from '@/helper/route'
import { getAgainstNameAndUid } from '@/helper/c2c/history-records'
import { C2cHistoryRecordsResponse } from '@/typings/api/c2c/history-records'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import AssetsPagination from '@/features/assets/common/pagination'
import { useRef } from 'react'
import styles from './index.module.css'
import { StatusMessage } from '../order-status-item'

interface IOrderListProps {
  tableData: AdvertOrderHistoryResp
  callbackFn(val?): void
  loading?: boolean
}

/** 渲染列表 */
export default function OrderList(props: IOrderListProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const {
    tableData: { list, total, pageSize, pageNum },
    loading,
    callbackFn,
  } = props

  const cellStyleRight: any = {
    headerCellStyle: {
      textAlign: 'right',
    },
    bodyCellStyle: {
      textAlign: 'right',
    },
  }
  const tableColumns = [
    {
      title: t`order.columns.date`,
      dataIndex: 'createdTime',
      render: (col, record) => formatDate(record.createdTime),
    },
    {
      title: t`Amount`,
      dataIndex: 'number',
      render: (col, record) => (
        <>
          {formatCurrency(record.number)} {record.coinName}
        </>
      ),
    },
    {
      title: t`features_trade_trade_amount_input_index_5101476`,
      dataIndex: 'totalPrice',
      render: (col, record) => (
        <>
          {formatCurrency(record.totalPrice)} {record.currencyEnName}
        </>
      ),
    },
    {
      title: t`features_c2c_advertise_advertise_detail_order_list_index_ijp6vfalwkjft7swngx0f`,
      dataIndex: 'advertUserName',
      render: (col, record: IAdvertOrderHistoryList & C2cHistoryRecordsResponse) => {
        const { name, uid } = getAgainstNameAndUid(record)
        return (
          <div className="user-info">
            <span
              onClick={e => {
                e.stopPropagation()
                link(getC2CCenterPagePath(uid, undefined))
              }}
            >
              {name || '--'}
            </span>
            <LazyImage
              src={`${oss_svg_image_domain_address}c2c/c2c_user_verified.png`}
              className="user-icon"
              width={16}
              height={16}
            />
          </div>
        )
      },
    },
    {
      title: t`order.filters.status.label`,
      dataIndex: 'statusCd',
      ...cellStyleRight,
      render: (col, record: IAdvertOrderHistoryList) => (
        <div className="count-down-info">
          <StatusMessage item={record} />
          <Icon name="next_arrow" hasTheme className="next-icon" />
        </div>
      ),
    },
  ]

  return (
    <div className={classNames(styles.scoped, 'assets-wrapper')} ref={tableContainerRef}>
      <AssetsTable
        border={{
          bodyCell: false,
          cell: false,
          wrapper: false,
        }}
        rowKey={record => `${record.id}`}
        columns={tableColumns}
        data={list}
        pagination={false}
        sortable
        onRow={(record, index) => {
          return {
            onClick: () => link(getC2cOrderDetailPageRoutePath(record?.id)), // 点击表身行
          }
        }}
        noDataElement={!loading && <ListEmpty />}
      />
      {list && list.length > 0 && (
        <AssetsPagination
          targetRef={tableContainerRef}
          size={'default'}
          current={pageNum}
          pageSize={pageSize}
          total={total}
          onChange={(pageNum1, pageSize1) => {
            callbackFn && callbackFn({ pageNum1, pageSize1 })
          }}
        />
      )}
    </div>
  )
}
