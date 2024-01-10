import {
  C2cHistoryRecordDealTypeCd,
  C2cHistoryRecordDirectCd,
  C2cHistoryUserRole,
  getC2cHistoryDealTypeTitle,
  getC2cHistoryDirectionTitle,
} from '@/constants/c2c/history-records'
import OrderdetailHeaderTime from '@/features/c2c/trade/c2c-orderdetail-header/orderdetail-header-time'
import { useShowOrderComponent } from '@/features/c2c/trade/c2c-orderdetail-header/use-show-order-component'
import { C2COrderStatus, IsNotOtc } from '@/features/c2c/trade/c2c-trade'
import InlineLongTextWrapper from '@/components/long-text-wrapper'
import { getAgainstNameAndUid } from '@/helper/c2c/history-records'
import { formatDate } from '@/helper/date'
import { link } from '@/helper/link'
import { getC2CCenterPagePath, getC2cOrderDetailPageRoutePath } from '@/helper/route'
import { C2cHistoryRecordsResponse } from '@/typings/api/c2c/history-records'
import { t } from '@lingui/macro'
import { TableColumnProps } from '@nbit/arco'
import { IncreaseTag } from '@nbit/react'
import classNames from 'classnames'

function ShowDashIfEmpty({
  val,
  children,
  defaultValue,
}: {
  val: any
  children?: React.ReactNode
  defaultValue?: string
}) {
  if (val) return children ? <span>{children}</span> : null
  return <span>{defaultValue || '--'}</span>
}

function FinanceValue({ val, currency, precision }: { val: any; currency?: string; precision?: number | string }) {
  if (!val && val !== 0) {
    return <span>{'--'}</span>
  }

  return (
    <IncreaseTag
      value={val}
      digits={precision || 2}
      delZero={false}
      kSign={false}
      defaultEmptyText={'--'}
      hasPrefix={false}
      hasColor={false}
      hasPostfix={false}
      right={` ${currency || 'USD'}`}
    />
  )
}

export function getC2cHistoryRecordsColumns(orderDetailModalRef) {
  const baseColumns: (TableColumnProps<C2cHistoryRecordsResponse> & {
    dataIndex?: keyof C2cHistoryRecordsResponse
  })[] = [
    {
      title: t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_flbmtloamvqed3vejwwfk`,
      dataIndex: 'id',
      width: 120,
      render(_col, item) {
        return (
          <ShowDashIfEmpty val={item.id}>
            {
              <span
                className="order-id"
                onClick={() => {
                  if (IsNotOtc.isOtc === item?.isOtc) {
                    orderDetailModalRef.current?.openChartSettingModal(item)
                  } else {
                    link(getC2cOrderDetailPageRoutePath(String(item.id)))
                  }
                }}
              >
                {item.id}
              </span>
            }
          </ShowDashIfEmpty>
        )
      },
    },
    {
      title: t`order.columns.direction`,
      dataIndex: 'buyAndSellRole',
      width: 60,
      render(_col, item) {
        const isSell = item.buyAndSellRole === C2cHistoryUserRole.seller
        return (
          <ShowDashIfEmpty val={item.buyAndSellRole}>
            {
              <span className={classNames('direct-wrapper', isSell ? 'text-sell_down_color' : 'text-buy_up_color')}>
                {getC2cHistoryDirectionTitle(item.buyAndSellRole || '')}
              </span>
            }
          </ShowDashIfEmpty>
        )
      },
    },
    {
      title: t`features_c2c_advertise_post_advertise_index_4yidfqk_wu8ypinnwmsd7`,
      dataIndex: 'typeCd',
      width: 128,
      render(_col, item) {
        const isInside = item.dealTypeCd === C2cHistoryRecordDealTypeCd.inside
        const directwrapper = IsNotOtc.isOtc === item?.isOtc ? 'otc-status' : isInside ? 'inside' : 'outside'
        return (
          <ShowDashIfEmpty val={item.dealTypeCd}>
            {
              <span className="flex deal-type-wrapper">
                <span className={classNames('mr-2', directwrapper)}>
                  {getC2cHistoryDealTypeTitle(item.dealTypeCd || '')}
                </span>
                <span className="chain-address"> {item.mainChainName}</span>
              </span>
            }
          </ShowDashIfEmpty>
        )
      },
    },
    {
      title: t`trade.c2c.singleprice`,
      dataIndex: 'price',
      width: 106,
      render(_col, item) {
        return (
          <span>
            <FinanceValue val={item.price} currency={item.currencyEnName} precision={item.currencyPrecision} />
          </span>
        )
      },
    },
    {
      title: t`Amount`,
      dataIndex: 'number',
      width: 148,
      render(_col, item) {
        return (
          <ShowDashIfEmpty val={item.number}>
            {
              <span className="number-wrapper">
                <FinanceValue val={item.number} currency={item.symbol} precision={item.coinPrecision} />
              </span>
            }
          </ShowDashIfEmpty>
        )
      },
    },
    {
      title: t`features_c2c_trade_c2c_chat_c2c_chat_window_index_064niyem2qfqd6m_zr4sv`,
      width: 148,
      dataIndex: 'totalPrice',
      render(_col, item) {
        return (
          <span className="total-price-wrapper">
            <FinanceValue val={item.totalPrice} currency={item.currencyEnName} precision={item.currencyPrecision} />
          </span>
        )
      },
    },
    {
      title: t`features_c2c_trade_history_records_content_table_column_ue0mabhoav2cvxvdmkrpk`,
      width: 220,
      render(_col, item) {
        const { name, uid } = getAgainstNameAndUid(item)

        return (
          <InlineLongTextWrapper targetNodeMaxWidth={220} targetNodeClassName={'against-wrapper'}>
            {IsNotOtc.isOtc === item?.isOtc ? (
              <span className="against-wrapper-otc">
                {t`features_c2c_trade_history_records_content_table_order_detail_modal_atbry5spxl`}
              </span>
            ) : (
              <span
                className="against-wrapper"
                onClick={() => {
                  link(getC2CCenterPagePath(uid))
                }}
              >
                {name}
              </span>
            )}
          </InlineLongTextWrapper>
        )
      },
    },
    {
      title: t`features_c2c_trade_history_records_content_table_column_ap_3_dxsit_u8b5lxdlzx`,
      width: 220,
      dataIndex: 'statusCd',
      render(_col, item) {
        return (
          <InlineLongTextWrapper targetNodeMaxWidth={116} targetNodeClassName={'title'}>
            <span className="title-wrapper">
              <StatusMessage item={item} />
            </span>
          </InlineLongTextWrapper>
        )
      },
    },
    {
      title: t`features_c2c_trade_history_records_content_table_column_gkswfpwsjnnnigaff1dwq`,
      width: 128,
      align: 'right',
      dataIndex: 'createdTime',
      render(_col, item) {
        return <span>{formatDate(item.createdTime || '')}</span>
      },
    },
  ]

  return baseColumns
}

function StatusMessage({ item }) {
  const { statusTitle = '', timeText } = useShowOrderComponent({}, item, {}, {}).showSelectedOrderComponent
  const isShowExp = [
    C2COrderStatus.CREATED,
    C2COrderStatus.WAS_PAYED,
    C2COrderStatus.WAS_TRANSFER_COIN,
    C2COrderStatus.WAS_COLLECTED,
  ].includes((item.statusCd || '') as C2COrderStatus)
  return (
    <span>
      <span className="status-wrapper flex">
        {isShowExp && IsNotOtc.isOtc === item?.isOtc ? (
          <span className="title mr-1">进行中</span>
        ) : (
          <>
            <span className="title mr-1">{statusTitle}</span>
            {isShowExp && item?.expireTime && <OrderdetailHeaderTime targetDateTime={item.expireTime - Date.now()} />}
          </>
        )}
      </span>
    </span>
  )
}
