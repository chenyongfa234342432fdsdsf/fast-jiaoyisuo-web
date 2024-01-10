/**
 * 提币地址列表
 */
import { TableColumnProps, Message, Popconfirm } from '@nbit/arco'
import { t } from '@lingui/macro'
import { IWithdrawAddressList } from '@/typings/api/assets/assets'
import AssetsTable from '@/features/assets/common/assets-table'
import { deleteWithdrawAddress } from '@/apis/assets/main'
import ListEmpty from '@/components/list-empty'

export function WithdrawAddressList({
  onClickEdit,
  getWithdrawAddressData,
  addressList,
  loading,
}: {
  onClickEdit(val): void
  getWithdrawAddressData(): void
  addressList: IWithdrawAddressList[]
  loading: boolean
}) {
  let tableData = addressList

  const removeRowData = async id => {
    const res = await deleteWithdrawAddress({ id })
    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      // isOk 为 false 时，底层框架会抛 message
      return false
    }

    if (data && !data.isSuccess) {
      Message.error(message)
      return
    }
    getWithdrawAddressData()
    Message.success(t`user.field.reuse_34`)
    return true
  }

  const tableColumns: TableColumnProps[] = [
    {
      title: t`assets.withdraw.withdrawAddress`,
      dataIndex: 'address',
      width: '50%',
    },
    // {
    //   title: t`assets.withdraw.memoAddress`,
    //   dataIndex: 'memo',
    // },
    {
      title: t`assets.withdraw.remark`,
      dataIndex: 'remark',
      render: (col, record) => <span className="text-text_color_02">{record.remark || '--'}</span>,
      width: '15%',
    },
    {
      title: '',
      dataIndex: 'Operation',
      width: '15%',
      render: (col, record) => (
        <div className="flex flex-row justify-end">
          <Popconfirm
            focusLock
            title={t`features_assets_main_withdraw_address_address_list_index_5101299`}
            onOk={() => {
              removeRowData(record.id)
            }}
            onCancel={() => {}}
          >
            <div className="mr-6 cursor-pointer text-warning_color">{t`assets.common.delete`}</div>
          </Popconfirm>
          <div
            className="cursor-pointer text-brand_color"
            onClick={() => {
              onClickEdit(record)
            }}
          >
            {t`assets.common.edit`}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col flex-1">
      <AssetsTable
        rowKey={record => record.id}
        columns={tableColumns}
        data={tableData}
        border={{
          bodyCell: false,
          cell: false,
          wrapper: false,
        }}
        loading={loading}
        pagination={false}
        noDataElement={<ListEmpty loading={loading} />}
      />
    </div>
  )
}
