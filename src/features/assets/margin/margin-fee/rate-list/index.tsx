import { t } from '@lingui/macro'
import { TableColumnProps } from '@nbit/arco'
import AssetsTable from '@/features/assets/common/assets-table'
import SupportIcon from '@/features/assets/common/support-icon'

/** 借贷利率和全仓限额 */
export default function MarginRateList({ loading, tableData }: { loading: boolean; tableData: any }) {
  const tableColumns: TableColumnProps[] = [
    {
      title: t`assets.financial-record.search.coin`,
      render: (col, record) => (
        <div className="flex flex-row items-center">
          {/* <img src={record.imageUrl} alt="" className="w-8 h-8 mr-4" /> */}
          <span>{record.coinName}</span>
        </div>
      ),
    },
    {
      title: t`features/assets/margin/margin-fee/rate-list/index-0`,
      render: (col, record) => <SupportIcon val={record.transferInAble} />,
    },
    {
      title: t`features/assets/margin/margin-fee/rate-list/index-1`,
      dataIndex: 'borrowable',
      render: (col, record) => <SupportIcon val={record.borrowable} />,
    },
    {
      title: t`features/assets/margin/margin-fee/rate-list/index-2`,
      render: (col, record) => `${record.dailyInterestRate}% / ${record.yearInterestRate}%`,
    },
    {
      title: t`features/assets/margin/margin-fee/rate-list/index-3`,
      dataIndex: 'maxBorrowable',
    },
  ]

  return (
    <AssetsTable
      rowKey={record => `${record.coinId}`}
      columns={tableColumns}
      data={tableData}
      loading={loading}
      pagination={false}
    />
  )
}
