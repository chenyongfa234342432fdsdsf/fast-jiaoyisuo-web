import { t } from '@lingui/macro'
import { TableColumnProps, Popover, Button } from '@nbit/arco'
import AssetsTable from '@/features/assets/common/assets-table'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { link } from '@/helper/link'

// 列表渲染
function AssetsList({
  loading,
  assetsListData,
  onTransferFn,
}: {
  loading: boolean
  assetsListData: any
  onTransferFn(val): void
}) {
  const tableColumns: TableColumnProps[] = [
    {
      title: t`assets.financial-record.search.coin`,
      dataIndex: 'shortName',
    },
    {
      title: t`assets.withdraw.available`,
      render: (col, record) => <AssetsEncrypt content={record.totalStr} />,
    },
    {
      title: t`features/assets/main/my-assets/index-2`,
      render: (col, record) => <AssetsEncrypt content={record.frozenStr} />,
    },
    {
      title: t`features/assets/main/index-10`,
      render: (col, record) => <AssetsEncrypt content={record.borrowStr} />,
    },
    {
      title: t`features/assets/main/index-11`,
      render: (col, record) => <AssetsEncrypt content={record.totalAmoutStr} />,
    },
    {
      title: t`features/assets/main/index-12`,
      render: (col, record) => <AssetsEncrypt content={record.totalAssetsInCny} />,
    },
    {
      title: t`order.columns.action`,
      dataIndex: 'Operation',
      render: (col, record) => (
        <div className="flex">
          <Button type="text" onClick={() => onTransferFn(record.coinId)}>{t`features/assets/main/index-4`}</Button>
          <Button
            type="text"
            onClick={() => link(`/assets/main/withdraw?id=${record.coinId}`)}
          >{t`assets.withdraw.withdrawName`}</Button>
          {record.isOtc || record.symbolList.length > 0 ? (
            <Popover
              trigger="hover"
              content={
                <div className="cursor-pointer">
                  {record.isOtc && <p onClick={() => link(`/express/buy`)}>{t`features/assets/main/index-13`}</p>}
                  {record.symbolList.map(v => (
                    <p key={v.tradeId} onClick={() => link(`/trade/${v.symbolName}`)}>
                      {v.sellSymbol} / {v.buySymbol}
                    </p>
                  ))}
                </div>
              }
            >
              <Button
                type="text"
                onClick={() => link(`/assets/main/deposit?id=${record.coinId}`)}
              >{t`assets.common.deposit`}</Button>
            </Popover>
          ) : (
            <Button
              type="text"
              onClick={() => link(`/assets/main/deposit?id=${record.coinId}`)}
            >{t`assets.common.deposit`}</Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <AssetsTable
      sortable
      rowKey={record => `${record.shortName}_${record.sortId}`}
      columns={tableColumns}
      data={assetsListData}
      loading={loading}
      pagination={false}
    />
  )
}

export { AssetsList }
