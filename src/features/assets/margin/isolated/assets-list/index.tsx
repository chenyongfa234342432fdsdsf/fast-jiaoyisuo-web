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
  /** 风险等级说明 */
  const getRiskTest = riskLevel => {
    return [
      '',
      t`features/assets/margin/all/index-0`,
      t`features/assets/margin/all/index-1`,
      t`features/assets/margin/all/index-2`,
    ][riskLevel]
  }

  const tableColumns: TableColumnProps[] = [
    {
      title: t`assets.financial-record.search.coin`,
      render: (col, record) => (
        <>
          {record.base ? record.base.coinName : ''}/{record.quote ? record.quote.coinName : ''}
        </>
      ),
    },
    {
      title: t`features/assets/margin/isolated/assets-list/index-0`,
      render: (col, record) => (
        <AssetsEncrypt content={`${record.marginLevel}<br />${getRiskTest(record.marginLevelRisk)}`} />
      ),
    },
    {
      title: t`features/assets/margin/isolated/assets-list/index-1`,
      render: (col, record) => <AssetsEncrypt content={`${record.marginRatio}x`} />,
    },
    {
      title: t`assets.financial-record.search.coin`,
      render: (col, record) => (
        <AssetsEncrypt
          content={`${record.base ? record.base.coinName : ''}<br />${record.quote ? record.quote.coinName : ''}`}
        />
      ),
    },
    {
      title: t`features/assets/main/index-11`,
      render: (col, record) => (
        <AssetsEncrypt
          content={`${record.base ? record.base.magIsolatedAssets : '-'}<br />${
            record.quote ? record.quote.magIsolatedAssets : '-'
          }`}
        />
      ),
    },
    {
      title: t`features/assets/margin/all/assets-list/index-0`,
      render: (col, record) => (
        <AssetsEncrypt
          content={`${record.base ? record.base.magIsolatedAssetsInCny : '-'}<br />${
            record.quote ? record.quote.magIsolatedAssetsInCny : '-'
          }`}
        />
      ),
    },
    {
      title: t`features/assets/margin/all/assets-list/index-1`,
      render: (col, record) => (
        <AssetsEncrypt
          content={`${record.base ? record.base.free : '-'}<br />${record.quote ? record.quote.free : '-'}`}
        />
      ),
    },
    {
      title: t`features/assets/margin/all/assets-list/index-2`,
      render: (col, record) => (
        <AssetsEncrypt
          content={`${record.base ? record.base.frozen : '-'}<br />${record.quote ? record.quote.frozen : '-'}`}
        />
      ),
    },
    {
      title: t`features/assets/margin/all/assets-list/index-3`,
      render: (col, record) => (
        <AssetsEncrypt
          content={`${record.base ? record.base.borrowed : '-'}<br />${record.quote ? record.quote.borrowed : '-'}`}
        />
      ),
    },
    {
      title: t`features/assets/margin/all/assets-list/index-4`,
      render: (col, record) => (
        <AssetsEncrypt
          content={`${record.base ? record.base.interest : '-'}<br />${record.quote ? record.quote.interest : '-'}`}
        />
      ),
    },
    {
      title: t`features/assets/margin/all/assets-list/index-5`,

      render: (col, record) => (
        <AssetsEncrypt
          content={`${record.base ? record.base.magIsolatedNetAssets : '-'}<br />${
            record.quote ? record.quote.magIsolatedNetAssets : '-'
          }`}
        />
      ),
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
      rowKey={record => `${record.base.coinId}_${record.quote.coinId}`}
      columns={tableColumns}
      data={tableData}
      loading={loading}
      pagination={false}
    />
  )
}

export { AssetsList }
