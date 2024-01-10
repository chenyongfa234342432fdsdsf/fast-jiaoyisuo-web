/**
 * 现货 - 资产总览
 */
import { useState, useEffect } from 'react'
import { useDebounce } from 'ahooks'
import { Spin } from '@nbit/arco'
import { getCoinAssetData, getCoinOverview } from '@/apis/assets/main'
import { AssetsListResp, AssetsCoinOverviewResp } from '@/typings/api/assets/assets'
import { SearchWrap } from '@/features/assets/common/search-form'
import { useGetWsAssets } from '@/hooks/features/assets'
import { Asset_Body } from '@/plugins/ws/protobuf/ts/proto/Asset'
import { getAssetListWS, sortCurrencyAssetsFn } from '@/helper/assets'
import { AssetWsSubscribePageEnum } from '@/constants/assets'
import { useAssetsStore } from '@/store/assets'
import { getMergeModeStatus } from '@/features/user/utils/common'
import { TotalAssets } from './common/total-assets'
import { AssetsList } from './assets-list'

export function CoinAccountIndex() {
  /** 资产总览默认值 */
  const totalDataDefault: AssetsCoinOverviewResp = {
    /** 总资产 */
    totalAmount: '0',
    /** 流动资产 */
    availableAmount: '0',
    /** 冻结资产 */
    lockAmount: '0',
    /** 币种名称 */
    coinName: '--',
    /** 币种符号 */
    symbol: '',
    /** 仓位资产 */
    positionAmount: '0',
  }
  const [searchKey, setSearchKey] = useState('')
  const [hideLessState, setHideLessState] = useState(false) // 隐藏零额资产
  const [totalData, setTotalData] = useState<AssetsCoinOverviewResp>(totalDataDefault) // 总资产折合等数据
  const [assetListData, setAssetListData] = useState<AssetsListResp[]>() // 现货资产列表
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

  /**
   * 获取现货资产总资产等
   * @returns
   */
  const getCoinAssetsListData = async () => {
    const isMergeMode = getMergeModeStatus()
    // pageSize 为 0 时返回全部
    const baseParams = { pageNum: 1, pageSize: 0 }
    const params = isMergeMode ? { ...baseParams, coin: 'USDT' } : baseParams
    const res = await getCoinAssetData(params)
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
    const res = await getCoinOverview({})
    let results = res.data
    if (res.isOk && results) {
      results && setTotalData(results)
    }
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
        <AssetsList loading={loading} assetsListData={displayAssetsList} />
      </Spin>
    </div>
  )
}
