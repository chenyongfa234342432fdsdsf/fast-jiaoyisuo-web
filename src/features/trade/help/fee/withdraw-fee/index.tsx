/**
 * 交易 - 提现手续费列表组件
 */
import { TableColumnProps, Tooltip } from '@nbit/arco'
import { t } from '@lingui/macro'
import AssetsTable from '@/features/assets/common/assets-table'
import { WithdrawsFeeListResp } from '@/typings/api/assets/assets'
import ListEmpty from '@/components/list-empty'
import LazyImage from '@/components/lazy-image'
import { getWithdrawsFeeList } from '@/apis/assets/common'
import { useState, useEffect } from 'react'
import { useRequest } from 'ahooks'

interface IWithdrawFeeProps {
  searchKey?: string
}

// 处理接口数据
function FeeTableCell({ data, isWithdrawFees }: { data: string; isWithdrawFees?: boolean }) {
  const dataList = data?.split(',') || []

  return (
    <div className="flex flex-col">
      {dataList.length > 0 &&
        dataList.map((item: string, index: number) => {
          if (isWithdrawFees) {
            const feeObj = item.split(':') || []
            return (
              <span key={index}>
                {feeObj[0]} {feeObj[1]}
              </span>
            )
          }
          return <span key={index}>{item}</span>
        })}
    </div>
  )
}

/** 渲染列表 */
export function WithdrawFee(props: IWithdrawFeeProps) {
  const { searchKey } = props

  const [list, setList] = useState<any[]>([])

  const { runAsync: queryListData, loading } = useRequest(
    async () => {
      const res = await getWithdrawsFeeList({})
      const { isOk, data } = res || {}
      if (!isOk || !data) {
        return
      }

      if (data) {
        const newList: any = data
        // const newList: any = data.list.sort(onSortArray)
        setList(newList)
      }
    },
    {
      manual: true,
      debounceWait: 300,
    }
  )

  /**
   * 过滤列表数据
   */
  const displayList = list.filter((item: any) => {
    const ignoreCaseKey = searchKey?.toUpperCase()
    const { coinName = '', fullName = '' } = item || {}
    return (
      (coinName && coinName.toUpperCase().includes(ignoreCaseKey)) ||
      (fullName && fullName.toUpperCase().includes(ignoreCaseKey))
    )
  })

  useEffect(() => {
    queryListData()
  }, [])

  const tableColumns: TableColumnProps[] = [
    {
      title: t`assets.financial-record.search.coin`,
      dataIndex: 'coinName',
      sorter: true,
      headerCellStyle: {
        width: '20%',
      },
      render: (col, record) => (
        <div className="coin-wrap">
          <LazyImage src={record.webLogo} alt={record.coinName} width={24} height={24} />
          <span className="ml-2 font-medium">{record.coinName}</span>
        </div>
      ),
    },
    {
      title: t`features_trade_help_fee_spot_fee_index_5101198`,
      dataIndex: 'fullName',
      sorter: false,
      headerCellStyle: {
        width: '20%',
      },
    },
    {
      title: t`features_trade_help_fee_spot_fee_index_5101199`,
      dataIndex: 'publicChains',
      sorter: false,
      headerCellStyle: {
        width: '20%',
      },
      render: (col, record) => <FeeTableCell data={record.publicChains} />,
    },
    {
      title: t`features_trade_help_fee_spot_fee_index_5101200`,
      dataIndex: 'minWithdrawCounts',
      sorter: false,
      headerCellStyle: {
        width: '20%',
      },
      render: (col, record) => <FeeTableCell data={record.minWithdrawCounts} />,
    },
    {
      title: (
        <Tooltip content={<span className="text-xs">{t`features_trade_help_fee_withdraw_fee_index_5101202`}</span>}>
          <span className="tip-text">{t`features_trade_help_fee_spot_fee_index_5101201`}</span>
        </Tooltip>
      ),
      dataIndex: 'withdrawFees',
      sorter: false,
      headerCellStyle: {
        textAlign: 'right',
      },
      bodyCellStyle: {
        textAlign: 'right',
      },
      render: (col, record) => <FeeTableCell data={record.withdrawFees} isWithdrawFees />,
    },
  ]
  let rowKey = 1
  return (
    <AssetsTable
      sortable
      // components={components}
      // scroll={{
      //   y: true,
      // }}
      border={{
        bodyCell: false,
        cell: false,
        wrapper: false,
      }}
      rowKey={record => `withdraw_fee_list_${record.fullName}${(rowKey += 1)}`}
      loading={loading}
      columns={tableColumns}
      data={displayList}
      pagination={false}
      noDataElement={<ListEmpty loading={loading} />}
    />
  )
}
