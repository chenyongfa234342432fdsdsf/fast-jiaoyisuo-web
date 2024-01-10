/**
 * 交易 - 现货手续费列表组件
 */
import { TableColumnProps, Tooltip } from '@nbit/arco'
import { t } from '@lingui/macro'
import AssetsTable from '@/features/assets/common/assets-table'
import ListEmpty from '@/components/list-empty'
import LazyImage from '@/components/lazy-image'
import { YapiGetV1CoinQueryMainCoinListCoinListData } from '@/typings/yapi/CoinQueryMainCoinListV1GetApi'
import { useState, useEffect } from 'react'
import { useRequest } from 'ahooks'
import { getSymbolLabelInfo } from '@/apis/market'
// import { onSortArray } from '@/helper/assets'

interface ISpotFeeProps {
  /** 主币信息获取图片 */
  symbolInfo: YapiGetV1CoinQueryMainCoinListCoinListData[]
  searchKey?: string
}

/** 现货 - 手续费率 */
export function SpotFee(props: ISpotFeeProps) {
  const { symbolInfo, searchKey } = props

  const [list, setList] = useState<any[]>([])

  const { runAsync: queryListData, loading } = useRequest(
    async () => {
      const res = await getSymbolLabelInfo({})
      const { isOk, data } = res || {}
      if (!isOk || !data) {
        return
      }

      if (data?.list && data.list.length > 0) {
        const newList: any = data.list
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
    const { baseSymbolName = '', quoteSymbolName = '', symbolName = '' } = item || {}
    return (
      baseSymbolName &&
      quoteSymbolName &&
      (symbolName.toUpperCase().includes(ignoreCaseKey) ||
        baseSymbolName.toUpperCase().includes(ignoreCaseKey) ||
        quoteSymbolName.toUpperCase().includes(ignoreCaseKey))
    )
  })

  /**
   * 根据币种 symbol 获取 appLogo
   */
  const getCoinLogo = (symbol: string) => {
    if (!symbol || !symbolInfo) {
      return ''
    }

    const coin = symbolInfo.find((item: YapiGetV1CoinQueryMainCoinListCoinListData) => item.symbol === symbol)
    return coin?.webLogo || ''
  }

  useEffect(() => {
    queryListData()
  }, [])

  const tableColumns: TableColumnProps[] = [
    {
      title: t`order.columns.currency`,
      dataIndex: 'symbolName',
      sorter: true,
      headerCellStyle: {
        width: '25%',
      },
      render: (col, record) => (
        <div className="coin-wrap">
          <LazyImage src={getCoinLogo(record.baseSymbolName)} className="mr-1" width={24} height={24} />
          <div className="ml-2">
            {record.baseSymbolName || '--'}
            <span className="text-text_color_02">{`/${record.quoteSymbolName || '--'}`}</span>
          </div>
        </div>
      ),
    },
    {
      title: t`features_trade_help_fee_withdraw_fee_index_5101196`,
      dataIndex: 'minAmount',
      sorter: false,
      headerCellStyle: {
        width: '30%',
        textAlign: 'right',
      },
      bodyCellStyle: {
        textAlign: 'right',
      },
    },
    {
      title: (
        <Tooltip content={<span className="text-xs">{t`features_trade_help_fee_spot_fee_index_5101203`}</span>}>
          <span className="tip-text">{t`features_trade_help_fee_withdraw_fee_index_5101197`}</span>
        </Tooltip>
      ),
      dataIndex: 'sellFee',
      sorter: false,
      headerCellStyle: {
        textAlign: 'right',
      },
      bodyCellStyle: {
        textAlign: 'right',
      },
      render: (col, record) => <div>{`${record.sellFee * 100}%`}</div>,
    },
  ]

  return (
    <AssetsTable
      border={{
        bodyCell: false,
        cell: false,
        wrapper: false,
      }}
      sortable
      rowKey={record => `spot_fee_list_${record.id}`}
      loading={loading}
      columns={tableColumns}
      data={displayList}
      pagination={false}
      noDataElement={<ListEmpty loading={loading} />}
    />
  )
}
