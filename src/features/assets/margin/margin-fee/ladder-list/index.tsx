import { t } from '@lingui/macro'
import { TableColumnProps } from '@nbit/arco'
import AssetsTable from '@/features/assets/common/assets-table'

/** 逐仓交易对 */
export default function LadderList({ loading, tableData }: { loading: boolean; tableData: any }) {
  const tableColumns: TableColumnProps[] = [
    {
      title: t`future.funding-history.index-price.ingredient.column.pair`,
      render: (col, record) => (
        <div className="flex flex-row items-center">
          {/* <img src={record.imageUrl} alt="" className="w-8 h-8 mr-4" /> */}
          <span>{record.coinName}</span>
        </div>
      ),
    },
    {
      title: t`features/assets/margin/margin-fee/ladder-list/index-0`,
      dataIndex: 'ladder',
    },
    {
      title: t`features/assets/margin/isolated/assets-list/index-1`,
      dataIndex: 'marginRatio',
    },
    {
      title: t`features/assets/margin/margin-fee/ladder-list/index-1`,
      dataIndex: 'initialRatio',
    },
    {
      title: t`features/assets/margin/margin-fee/ladder-list/index-2`,
      dataIndex: 'liquidationRatio',
    },
    {
      title: t`features/assets/margin/margin-fee/ladder-list/index-3`,
      dataIndex: 'quoteMaxBorrow',
    },
    {
      title: t`features/assets/margin/margin-fee/ladder-list/index-4`,
      dataIndex: 'baseMaxBorrow',
    },
  ]

  return (
    <AssetsTable
      rowKey={record => record.tradeId}
      columns={tableColumns}
      data={tableData}
      loading={loading}
      pagination={false}
    />
  )
}
