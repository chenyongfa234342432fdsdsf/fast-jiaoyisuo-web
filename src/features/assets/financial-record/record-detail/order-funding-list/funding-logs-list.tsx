/**
 * 财务记录详情 - 资金明细
 */
import { TableColumnProps } from '@nbit/arco'
import Table from '@/components/table'
import { formatDate } from '@/helper/date'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { PerpetualAssetDetail } from '@/typings/api/assets/assets'
import { RecordTransactionDetailsList } from '@/constants/assets'
import { getTextFromStoreEnums } from '@/helper/store'
import { useAssetsStore } from '@/store/assets'
import styles from './base.module.css'

// 资金明细
export function FundingLogs({ logs, typeInd }: { logs: PerpetualAssetDetail[]; typeInd: any }) {
  const { assetsEnums } = useAssetsStore()
  let columns: TableColumnProps<PerpetualAssetDetail>[] = [
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
            <IncreaseTag value={log.amount} kSign hasColor={false} /> {log.coinName}
          </div>
        )
      },
    },
  ]

  if (RecordTransactionDetailsList.indexOf(typeInd) > -1) {
    columns = [
      {
        title: t`features_orders_details_base_5101359`,
        align: 'right',
        render(_, log) {
          return (
            <div>
              1{log.coinName} = {log.rate}
              {log.currencyName}
            </div>
          )
        },
      },
      {
        title: t`assets.coin.trade-records.table.type`,
        align: 'right',
        render(_, log) {
          return (
            <div>{getTextFromStoreEnums(log.assetType, assetsEnums.financialRecordTypePerpetualBillList.enums)}</div>
          )
        },
      },
      ...columns,
    ]
  }
  if (!logs || logs.length === 0) {
    return <div className="text-center text-text_color_03 py-9 text-xs">{t`trade.c2c.noData`}</div>
  }

  return (
    <div className={styles['logs-table-wrapper']}>
      <Table
        border={false}
        scroll={
          RecordTransactionDetailsList.indexOf(typeInd) > -1
            ? {
                y: 100,
                x: 700,
              }
            : { y: 200 }
        }
        className="scrollbar-custom"
        pagination={false}
        columns={columns}
        data={logs}
        rowKey={record => `${record.time}${Math.ceil(Math.random() * 100)}`}
      />
    </div>
  )
}
