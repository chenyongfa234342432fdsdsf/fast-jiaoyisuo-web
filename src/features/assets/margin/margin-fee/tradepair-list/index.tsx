import { t } from '@lingui/macro'
import { TableColumnProps, Button } from '@nbit/arco'
import AssetsTable from '@/features/assets/common/assets-table'
import SupportIcon from '@/features/assets/common/support-icon'

/** 逐仓档位信息 */
export default function TradePairList({ loading, tableData }: { loading: boolean; tableData: any }) {
  const tableColumns: TableColumnProps[] = [
    {
      title: t`features/assets/margin/margin-fee/index-1`,
      render: (col, record) => `${record.base}% / ${record.quote}`,
    },
    {
      title: t`features/assets/margin/margin-fee/tradepair-list/index-0`,
      render: (col, record) => `${record.maxMarginRatio}X`,
    },
    {
      title: t`assets.financial-record.search.coin`,
      render: (col, record) => (
        <>
          {record.base} <br /> {record.quote}
        </>
      ),
    },
    {
      title: t`features/assets/margin/margin-fee/rate-list/index-0`,
      render: (col, record) => (
        <>
          <SupportIcon val={record.baseTransferinable} />,
          <br />
          <SupportIcon val={record.quoteTransferinable} />,
        </>
      ),
    },
    {
      title: t`features/assets/margin/margin-fee/tradepair-list/index-1`,
      render: (col, record) => (
        <>
          <SupportIcon val={record.baseBorrowable} />,
          <br />
          <SupportIcon val={record.quoteBorrowable} />,
        </>
      ),
    },
    {
      title: t`features/assets/margin/margin-fee/rate-list/index-2`,
      render: (col, record) => (
        <>
          {record.baseDailyInterestRate}/{record.baseYearInterestRate}
          <br />
          {record.quoteDailyInterestRate}/{record.quoteYearInterestRate}
        </>
      ),
    },
    {
      title: t`features/assets/margin/margin-fee/rate-list/index-3`,
      render: (col, record) => (
        <>
          {record.baseMaxBorrow}
          <br />
          {record.quoteMaxBorrow}
        </>
      ),
    },
    {
      title: t`order.columns.action`,
      dataIndex: 'Operation',
      render: (col, record) => (
        <div className="flex">
          <Button type="text" onClick={() => {}}>{t`features/assets/margin/margin-fee/tradepair-list/index-2`}</Button>
        </div>
      ),
    },
  ]

  return (
    <AssetsTable
      rowKey={record => `${record.tradeId}_${record.tradeArea}`}
      columns={tableColumns}
      data={tableData}
      loading={loading}
      pagination={false}
    />
  )
}
