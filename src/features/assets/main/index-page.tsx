/**
 * 现货 - 币种资产列表 - 前端分页功能
 */
import { useState, useEffect } from 'react'
import { useDebounce } from 'ahooks'
import { Spin, Pagination } from '@nbit/arco'
import { getCoinAssetData } from '@/apis/assets/main'
import { AssetsOverviewResp, AssetsListResp } from '@/typings/api/assets/assets'
import { TotalAssets } from '@/features/assets/common/total-assets'
import { SearchWrap } from '@/features/assets/common/search-form'
import { useGetWsAssets } from '@/hooks/features/assets'
import { Asset_Body } from '@/plugins/ws/protobuf/ts/proto/Asset'
import { getAssetsOverview, getAssetListWS, sortCurrencyAssetsFn } from '@/helper/assets'
import { AssetWsSubscribePageEnum } from '@/constants/assets'
import { useAssetsStore } from '@/store/assets'
import { AssetsList } from './assets-list'
import AssetsPagination from '../common/pagination'

export function CoinAccountIndex() {
  /** 资产总览默认值 */
  const totalDataDefault: AssetsOverviewResp = {
    totalAmount: '0',
    availableAmount: '0',
    lockAmount: '0',
    coinName: '--',
    financialAssetsData: {
      totalAmount: '0',
      availableAmount: '0',
      lockAmount: '0',
      coinName: '--',
    },
    coinAssetsData: {
      totalAmount: '0',
      availableAmount: '0',
      lockAmount: '0',
      coinName: '--',
    },
    futuresAssetsData: {
      totalAmount: '0',
      availableAmount: '0',
      lockAmount: '0',
      coinName: '--',
    },
    marginAssetsData: {
      totalAmount: '0',
      availableAmount: '0',
      lockAmount: '0',
      coinName: '--',
    },
  }
  const [searchKey, setSearchKey] = useState('')
  const [hideLessState, setHideLessState] = useState(false) // 隐藏零额资产
  const [totalData, setTotalData] = useState<AssetsOverviewResp>(totalDataDefault) // 总资产折合等数据
  const [assetListData, setAssetListData] = useState<AssetsListResp[]>([]) // 现货资产列表
  const [loading, setLoading] = useState(false)
  const debouncedSearchKey = useDebounce(searchKey, { wait: 500 })
  // 汇率接口
  const { fetchCoinRate } = useAssetsStore()
  /**
   * 过滤资产列表 - 列表搜索、隐藏零额等
   */
  const displayAssetsList =
    assetListData &&
    assetListData
      .filter((item: AssetsListResp) => {
        const ignoreCaseKey = debouncedSearchKey && debouncedSearchKey.toUpperCase()
        const { coinName = '', coinFullName = '', usdBalance = 0 } = item || {}
        return (
          ((coinName && coinName.toUpperCase().includes(ignoreCaseKey)) ||
            (coinFullName && coinFullName.toUpperCase().includes(ignoreCaseKey))) &&
          (!hideLessState || +usdBalance > 1)
        )
      })
      .sort(sortCurrencyAssetsFn)

  const [page, setPage] = useState({
    pageNum: 1, // 第几页
    pageSize: 10, // 每页多少条数据
  })
  const totalAmount = displayAssetsList.length
  const assetsListDataCurrent: AssetsListResp[] = displayAssetsList.slice(
    (page.pageNum - 1) * page.pageSize,
    page.pageSize + (page.pageNum - 1) * page.pageSize
  ) // 这里就是截取出来第一页的十条数据

  /**
   * 获取现货资产总资产等
   * @returns
   */
  const getCoinAssetsListData = async () => {
    // pageSize 为 0 时返回全部
    const res = await getCoinAssetData({ pageNum: 1, pageSize: 0 })
    let results = res.data?.list
    if (res.isOk && results) {
      results && setAssetListData(results)
    }
  }

  /**
   * 获取现货资产总资产等
   * @returns
   */
  const getAssetsOverviewData = async () => {
    const overviewAsset = await getAssetsOverview()
    overviewAsset && setTotalData(overviewAsset)
  }

  /** 资产折合和资产列表依赖汇率接口 */
  const initData = async () => {
    setLoading(true)
    try {
      fetchCoinRate()
      getAssetsOverviewData()
      await getCoinAssetsListData()
    } catch (error) {
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    initData()
  }, [])

  /** ws 回调 */
  const coinAssetWSCallBack = async (data: Asset_Body) => {
    data = data[0]
    // const { isRefresh } = data
    // isRefresh 为 true 时，刷新资产总览接口
    // isRefresh && getAssetsOverviewData()
    getAssetsOverviewData()
    // 更新资产列表信息
    const newAssetListData = getAssetListWS(assetListData, data)
    setAssetListData(newAssetListData)
  }

  // websocket 推送资产
  useGetWsAssets({ wsCallBack: coinAssetWSCallBack, page: AssetWsSubscribePageEnum.other })

  return (
    <div className="flex-1">
      <Spin loading={loading}>
        <TotalAssets assetsData={totalData} />
        <hr className="border-line_color_02"></hr>
        <SearchWrap onSearchChangeFn={setSearchKey} onHideLessFn={setHideLessState} />
        <AssetsList loading={loading} assetsListData={assetsListDataCurrent} />
        {displayAssetsList && totalAmount > 0 && (
          <div className="page-wrap">
            <AssetsPagination
              size={'default'}
              current={page.pageNum}
              pageSize={page.pageSize}
              total={totalAmount}
              onChange={(pageNumber: number, pageSize: number) => {
                setPage({ ...page, pageNum: pageNumber, pageSize })
              }}
            />
          </div>
        )}
      </Spin>
    </div>
  )
}
