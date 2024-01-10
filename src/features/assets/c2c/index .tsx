import { useState, useEffect } from 'react'
import { useDebounce, useUnmount } from 'ahooks'
import { Spin } from '@nbit/arco'
import { AssetsOverviewResp } from '@/typings/api/assets/assets'
import { SearchWrap } from '@/features/assets/common/search-form'
import { getAssetsOverview } from '@/helper/assets'
import { useAssetsStore } from '@/store/assets'
import { getC2CList } from '@/apis/assets/c2c'
import { AssetsC2CListResp } from '@/typings/api/assets/c2c'
import { C2cAccountChanged } from '@/plugins/ws/protobuf/ts/proto/C2cAccountChanged'
import { AssetsList } from './assets-list'
import { TotalAssets } from './total-assets'

export function C2CAccountIndex() {
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
    c2cAssetsData: {
      totalAmount: '0',
      availableAmount: '0',
      lockAmount: '0',
      coinName: '--',
    },
  }
  const [searchKey, setSearchKey] = useState('')
  const [hideLessState, setHideLessState] = useState(false) // 隐藏零额资产
  const [totalData, setTotalData] = useState<AssetsOverviewResp>(totalDataDefault) // 总资产折合等数据
  const [assetListData, setAssetListData] = useState<AssetsC2CListResp[]>() // 现货资产列表
  const [loading, setLoading] = useState(false)
  const debouncedSearchKey = useDebounce(searchKey, { wait: 500 })
  // 汇率接口
  const { fetchCoinRate, wsC2CAccountSubscribe, wsC2CAccountUnSubscribe } = useAssetsStore()

  /** 法币汇率折合排序 */
  function sortCurrencyAssetsFn(a: AssetsC2CListResp, b: AssetsC2CListResp) {
    return (b.usdBalance as unknown as number) - (a.usdBalance as unknown as number)
  }
  /**
   * 过滤资产列表 - 列表搜索、隐藏零额等
   */
  const displayAssetsList =
    (assetListData &&
      assetListData
        .filter((item: AssetsC2CListResp) => {
          const ignoreCaseKey = debouncedSearchKey && debouncedSearchKey.toUpperCase()
          const { coinName = '', coinFullName = '', usdBalance = 0 } = item || {}
          return (
            ((coinName && coinName.toUpperCase().includes(ignoreCaseKey)) ||
              (coinFullName && coinFullName.toUpperCase().includes(ignoreCaseKey))) &&
            (!hideLessState || usdBalance > 1)
          )
        })
        .sort(sortCurrencyAssetsFn)) ||
    []

  /**
   * 获取 c2c 资产列表
   * @returns
   */
  const getCoinAssetsListData = async () => {
    // pageSize 为 0 时返回全部
    const res = await getC2CList({ pageNum: 1, pageSize: 0 })
    let results = res.data
    if (res.isOk && results) {
      results && setAssetListData(results)
    }
  }

  /**
   * 获取 c2c 资产总资产
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

  /** ws 回调 */
  const coinAssetWSCallBack = async (data: C2cAccountChanged) => {
    initData()
  }

  useEffect(() => {
    initData()
    // C2C 资产推送
    wsC2CAccountSubscribe(coinAssetWSCallBack)
  }, [])

  useUnmount(() => {
    wsC2CAccountUnSubscribe(coinAssetWSCallBack)
  })

  return (
    <Spin loading={loading}>
      <TotalAssets assetsData={totalData} />
      <hr className="border-line_color_02"></hr>
      <SearchWrap onSearchChangeFn={setSearchKey} onHideLessFn={setHideLessState} />
      <AssetsList loading={loading} assetsListData={displayAssetsList} />
    </Spin>
  )
}
