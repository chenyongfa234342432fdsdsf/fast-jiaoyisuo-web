import { useState, useEffect } from 'react'
import { TableColumnProps, Popover, Checkbox, Tooltip, Spin } from '@nbit/arco'
import { t } from '@lingui/macro'
import { getIsLogin } from '@/helper/auth'
import SortableTable from '@/components/sortable-table'
import { rateFilter, formatCoinAmount, sortCurrencyAssetsFn } from '@/helper/assets'
import { getCoinAssetData } from '@/apis/assets/main'
import LazyImage from '@/components/lazy-image'
import { AssetsListResp } from '@/typings/api/assets/assets'
import { useAssetsStore } from '@/store/assets'
import useApiAllMarketTradePair from '@/hooks/features/market/common/use-api-all-market-trade-pair'
import Icon from '@/components/icon'
import { NoDataElement } from '@/features/orders/order-table-layout'
import classNames from 'classnames'
import Link from '@/components/link'
import { useUpdateEffect } from 'ahooks'
import styles from './index.module.css'

/** 现货交易 - 我的资产组件 */
export function TradeAssetsList() {
  const allTradePair = useApiAllMarketTradePair().data
  const assetsStore = useAssetsStore()
  /** 获取隐藏小额资产状态 */
  const { hideSmallAssets } = assetsStore
  const isLogin = getIsLogin()
  const [loading, setLoading] = useState(false)
  // 现货资产列表
  const [assetListData, setAssetListData] = useState<AssetsListResp[]>([])
  // 汇率接口
  const { fetchCoinRate } = useAssetsStore()

  /**
   * 过滤列表数据 - 是否要隐藏小额资产 (隐藏 1USD 以下的资产)
   */
  const displayAssetsList = assetListData
    .filter((item: AssetsListResp) => {
      const { usdBalance = 0 } = item || {}
      return !hideSmallAssets || usdBalance > 1
    })
    .sort(sortCurrencyAssetsFn)

  const tableColumns: TableColumnProps[] = [
    {
      title: t`assets.financial-record.search.coin`,
      dataIndex: 'coinName',
      render: (col, record) => (
        <div>
          {record.tradeList && record.tradeList.length > 0 ? (
            <Popover
              key={record.coinId}
              className="flex"
              position="bottom"
              trigger="hover"
              triggerProps={{
                className: styles['coin-popup-wrapper'],
              }}
              content={
                <div className="flex-1 text-xs">
                  {record.tradeList.map(item => {
                    return (
                      <Link href={`/trade/${item.symbolName}`} key={item.sellCoinId} className="coin-item">
                        {`${item.baseSymbolName || '--'}/${item.quoteSymbolName || '--'}`}
                      </Link>
                    )
                  })}
                </div>
              }
            >
              <div className="coin-wrap">
                <LazyImage className="icon" src={record.webLogo} alt={record.coinName} />
                <span className="ml-2">{record.coinName}</span>
                <Icon hasTheme name="next_arrow" className="ml-1 translate-y-px" />
              </div>
            </Popover>
          ) : (
            <div className="coin-wrap">
              <LazyImage className="icon" src={record.webLogo} alt={record.coinName} />
              <span className="ml-2">{record.coinName}</span>
            </div>
          )}
        </div>
      ),
      align: 'left',
    },
    {
      title: t`features/assets/futures/history-list/index-0`,
      dataIndex: 'totalAmount',
      align: 'right',
      render: (col, record) => formatCoinAmount(record.symbol, record.totalAmount),
    },
    {
      title: t`assets.common.flow_assets`,
      dataIndex: 'availableAmount',
      align: 'right',
      render: (col, record) => formatCoinAmount(record.symbol, record.availableAmount),
    },
    {
      title: t`assets.common.position_assets`,
      align: 'right',
      dataIndex: 'positionAmount',
      render: (col, record) => formatCoinAmount(record.symbol, record.positionAmount),
    },
    {
      title: t`features_assets_common_trade_myassets_list_index_2571`,
      dataIndex: 'lockAmount',
      align: 'right',
      render: (col, record) => formatCoinAmount(record.symbol, record.lockAmount),
    },
    {
      title: t`features_assets_common_trade_myassets_list_index_2572`,
      align: 'right',
      dataIndex: 'btcAmount',
      render: (col, record) => formatCoinAmount(record.symbol, record.btcAmount),
    },
    {
      title: t`features_assets_common_trade_myassets_list_index_2573`,
      align: 'right',
      dataIndex: 'usdBalance',
      render: (col, record) => rateFilter({ symbol: record.symbol, amount: record.totalAmount }),
    },
  ]

  // 获取币对信息
  const pushTradePairData = assetsList => {
    assetsList.forEach(async (item, index) => {
      try {
        const coinTradePair = allTradePair.filter(data => `${data.sellCoinId}` === `${item.coinId}`)
        if (coinTradePair) {
          item.tradeList = coinTradePair
        } else {
          item.tradeList = null
        }
      } catch (error) {
        item.tradeList = null
      }

      // 更新资产持仓
      if (index === assetsList.length - 1) {
        setAssetListData(assetsList)
      }
    })
  }

  /**
   * 获取现货资产总资产等
   * @returns
   */
  const getCoinAssetsListData = async () => {
    // pageSize 为 0 时返回全部
    const params = { isGt: true, pageNum: 1, pageSize: 0 }
    const res = await getCoinAssetData(params)
    const assetsList: any = res.data?.list
    if (res.isOk && assetsList) {
      try {
        pushTradePairData(assetsList)
      } catch (error) {
        // 交易币对接口异常时，不阻塞资产展示
        setAssetListData(assetsList)
      }
    }
  }

  /** 资产折合和资产列表依赖汇率接口 */
  const initData = async () => {
    if (!isLogin) {
      setAssetListData([])
      return
    }
    setLoading(true)
    try {
      fetchCoinRate()
      await getCoinAssetsListData()
    } catch (error) {
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    initData()
  }, [])

  // 监听可用资产的 store，更新时更新持仓资产列表
  useUpdateEffect(() => {
    if (!assetsStore.userAssetsSpot.buyCoin.symbol) return
    if (assetsStore.isHasAssetsWSInfo) {
      initData()
      assetsStore.updateIsHasAssetsWSInfo(false)
    }
  }, [assetsStore.isHasAssetsWSInfo])

  // 币对或资产列表变化时，更新持仓列表数据
  useEffect(() => {
    pushTradePairData(assetListData)
  }, [allTradePair, assetListData])

  return (
    <div
      className={classNames(styles.scoped, 'h-full', {
        'no-data': displayAssetsList.length === 0,
      })}
    >
      <div className="trade-assets-list-arco-table-wrapper arco-table-body-full">
        <Spin loading={loading}>
          <SortableTable
            sortable
            rowKey={record => `trade_list_${record.coinId}`}
            columns={tableColumns}
            data={displayAssetsList}
            // loading={loading}
            pagination={false}
            scroll={{
              y: displayAssetsList.length === 0 ? 180 : undefined,
            }}
            noDataElement={!loading && <NoDataElement />}
            border={{
              bodyCell: false,
              cell: false,
              wrapper: false,
            }}
          />
        </Spin>
      </div>
    </div>
  )
}

/** 隐藏小额资产 */
export function HideSmallAssetsNode() {
  const assetsStore = useAssetsStore()
  const { hideSmallAssets, updateHideSmallAssets } = { ...assetsStore } // 获取资产加密状态
  const changeHideSmallAssets = val => {
    updateHideSmallAssets(val)
  }

  return (
    <div className="flex items-center ml-14">
      <Tooltip content={<span className="text-xs">{t`features_assets_common_search_form_hide_less_index_2555`}</span>}>
        <Checkbox checked={hideSmallAssets} onChange={changeHideSmallAssets} />
        <span className="ml-1 text-text_color_02 text-xs">{t`features/assets/main/index-5`}</span>
      </Tooltip>
    </div>
  )
}
