import { t } from '@lingui/macro'
import { TableColumnProps, Button } from '@nbit/arco'
import AssetsTable from '@/features/assets/common/assets-table'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'

// 列表渲染
function AssetsList({
  loading,
  tableData,
  onTransferFn,
}: {
  loading: boolean
  tableData: any
  onTransferFn(val): void
}) {
  const tableColumns: TableColumnProps[] = [
    {
      title: t`assets.financial-record.search.coin`,
      render: (col, record) => (
        <div className="flex flex-row items-center">
          <img src={record.imageUrl} alt="" className="w-8 h-8 mr-4" />
          <span>{record.coinName}</span>
        </div>
      ),
    },
    {
      title: t`features/assets/main/index-11`,
      render: (col, record) => <AssetsEncrypt content={record.crossAssets} />,
    },
    {
      title: t`features/assets/margin/all/assets-list/index-0`,
      render: (col, record) => <AssetsEncrypt content={record.crossAssetsInCny} />,
    },
    {
      title: t`features/assets/margin/all/assets-list/index-1`,
      render: (col, record) => <AssetsEncrypt content={record.free} />,
    },
    {
      title: t`features/assets/margin/all/assets-list/index-2`,
      render: (col, record) => <AssetsEncrypt content={record.frozen} />,
    },
    {
      title: t`features/assets/margin/all/assets-list/index-3`,
      render: (col, record) => <AssetsEncrypt content={record.borrowed} />,
    },
    {
      title: t`features/assets/margin/all/assets-list/index-4`,
      render: (col, record) => <AssetsEncrypt content={record.interest} />,
    },
    {
      title: t`features/assets/margin/all/assets-list/index-5`,
      render: (col, record) => <AssetsEncrypt content={record.crossNetAssets} />,
    },
    {
      title: t`features/assets/margin/all/assets-list/index-3`,
      render: (col, record) => <AssetsEncrypt content={record.borrowed} />,
    },
    {
      title: t`order.columns.action`,
      dataIndex: 'Operation',
      render: (col, record) => (
        <div className="flex">
          <Button type="text" onClick={() => onTransferFn(record.coinId)}>{t`features/assets/main/index-4`}</Button>
          <Button
            type="text"
            onClick={() => onTransferFn(record.coinId)}
          >{t`features/assets/margin/all/assets-list/index-6`}</Button>
          <Button
            type="text"
            onClick={() => onTransferFn(record.coinId)}
          >{t`features/assets/margin/all/assets-list/index-7`}</Button>
        </div>
      ),
    },
  ]

  return (
    <AssetsTable
      sortable
      rowKey={record => `${record.coinId}`}
      columns={tableColumns}
      data={tableData}
      loading={loading}
      pagination={false}
    />
  )
}

export { AssetsList }
