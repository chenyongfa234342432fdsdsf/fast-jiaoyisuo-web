/**
 * 合约交易页 - 资产列表
 */
import { t } from '@lingui/macro'
import { Button, TableColumnProps } from '@nbit/arco'
import AssetsTable from '@/features/assets/common/assets-table'
import { NoDataElement } from '@/features/orders/order-table-layout'
import classNames from 'classnames'
import { rateFilterFuturesMargin } from '@/helper/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { ThemeEnum } from '@nbit/chart-utils'
import { useCommonStore } from '@/store/common'
import { DetailMarginListChild } from '@/typings/api/assets/futures'
import LazyImage from '@/components/lazy-image'
import { formatCoinAmount } from '@/helper/assets'
import { AssetsTransferTypeEnum } from '@/constants/assets/futures'
import styles from './index.module.css'

interface ITradeFutureAssetesListProps {
  loading?: boolean
  assetsListData?: DetailMarginListChild[] | undefined
  baseCoin?: string
  height?: number | string
  onSuccess?: (val: any) => void
}

/** 合约资产列表 */
export function AssetsListFutures(props: ITradeFutureAssetesListProps) {
  const { assetsListData, baseCoin, height } = props
  const assetsFuturesStore = useAssetsFuturesStore()
  /** 商户设置的计价币的法币精度和法币符号，USD 或 CNY 等 */
  const {
    futuresCurrencySettings: { currencySymbol, offset },
    updateFuturesTransferModal,
  } = { ...assetsFuturesStore }

  const commonState = useCommonStore()
  const theme = commonState.theme

  const cellStyle: any = {
    headerCellStyle: {
      textAlign: 'right',
    },
    bodyCellStyle: {
      textAlign: 'right',
    },
  }

  const handleTransferClick = (record: DetailMarginListChild, type: AssetsTransferTypeEnum) => {
    updateFuturesTransferModal({
      coinId: record.coinId,
      visible: true,
      type,
    })
  }

  const columns: TableColumnProps[] = [
    {
      title: t`order.filters.coin.placeholder`,
      headerCellStyle: {
        paddingLeft: 32,
      },
      bodyCellStyle: {
        paddingLeft: 32,
      },
      render: (col, record) => (
        <div className="flex items-center">
          <LazyImage className="inline-block mr-2" src={record.webLogo} width={20} height={20} />
          {record.coinName}
        </div>
      ),
    },
    {
      // 数量
      title: t`Amount`,
      dataIndex: 'size',
      width: '25%',
      ...cellStyle,
      render: (col, record) => <div>{formatCoinAmount(record.symbol, record.amount)}</div>,
    },
    {
      // 折算价值
      title: t({
        id: 'features_assets_futures_common_assets_list_index_jtnblrqs7e6dhsh9bhmm-',
        values: { 0: baseCoin || currencySymbol },
      }),
      width: '30%',
      ...cellStyle,
      render: (col, record) => (
        <span>
          {rateFilterFuturesMargin({
            amount: record.amount,
            symbol: record.symbol,
            currencySymbol: baseCoin,
            needUnit: false,
          })}
        </span>
      ),
    },
    {
      title: t`order.columns.action`,
      sorter: false,
      width: '30%',
      headerCellStyle: {
        padding: '0 32px 0 0',
        textAlign: 'right',
      },
      bodyCellStyle: {
        padding: '0 24px 0 0',
        textAlign: 'right',
      },
      render: (col, record) => (
        <>
          <Button
            className="p-2 text-xs"
            type="text"
            onClick={() => handleTransferClick(record, AssetsTransferTypeEnum.from)}
          >{t`constants_assets_futures_csby62i3ft99c8b9dvjun`}</Button>
          <Button
            className="p-2 text-xs"
            type="text"
            onClick={() => handleTransferClick(record, AssetsTransferTypeEnum.to)}
          >{t`constants_assets_futures_q5wfmtnqqp0edc5cg1wab`}</Button>
        </>
      ),
    },
  ]

  return (
    <div
      className={classNames(
        styles['futures-assets-table'],
        theme === ThemeEnum.dark ? 'assets-table-dark' : 'assets-table-light',
        {
          'arco-table-body-full': true,
          'auto-width': true,
        }
      )}
      style={{ height }}
    >
      <AssetsTable
        className="list"
        rowKey={record => `${record.coinId}`}
        columns={columns}
        data={assetsListData}
        border={false}
        pagination={false}
        noDataElement={<NoDataElement isFuture />}
        scroll={{ y: height }}
      />
    </div>
  )
}
