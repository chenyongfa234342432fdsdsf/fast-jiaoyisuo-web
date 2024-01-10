/**
 * 现货 - 资产总览
 */
import { useState, useEffect } from 'react'
import { useDebounce, useUnmount } from 'ahooks'
import { Spin } from '@nbit/arco'
import { SearchWrap } from '@/features/assets/common/search-form'
import { baseAssetsStore, useAssetsStore } from '@/store/assets'
import { AssetsC2CListResp } from '@/typings/api/assets/c2c'
import { YapiGetV1C2cBalanceAllApiRequest } from '@/typings/yapi/C2cBalanceAllV1GetApi'
import { getV1C2cBalanceAllApiRequest } from '@/apis/assets/c2c'
import { HomeAssetsList } from './assets-list/home-index'

export function CoinAccountHomeIndex() {
  /**
   * 注释暂时需要
   */
  /** 资产总览默认值 */
  // const totalDataDefault: AssetsCoinOverviewResp = {
  //   /** 总资产 */
  //   totalAmount: '0',
  //   /** 流动资产 */
  //   availableAmount: '0',
  //   /** 冻结资产 */
  //   lockAmount: '0',
  //   /** 币种名称 */
  //   coinName: '--',
  //   /** 币种符号 */
  //   symbol: '',
  //   /** 仓位资产 */
  //   positionAmount: '0',
  // }
  const { c2cAssetsListAll, updateAssetsModule } = useAssetsStore().assetsModule
  const [apiParams, setapiParams] = useState<YapiGetV1C2cBalanceAllApiRequest>({ pageNum: '1', pageSize: '0' })

  const [searchKey, setSearchKey] = useState('')
  const [hideLessState, setHideLessState] = useState(false) // 隐藏零额资产
  // const [totalData, setTotalData] = useState<AssetsCoinOverviewResp>(totalDataDefault) // 总资产折合等数据
  // const [assetListData, setAssetListData] = useState<AssetsListResp[]>() // 现货资产列表
  const [loading, setLoading] = useState(false)
  const debouncedSearchKey = useDebounce(searchKey, { wait: 500 })
  // 汇率接口
  // const { fetchCoinRate } = useAssetsStore()
  /**
   * 过滤资产列表 - 列表搜索、隐藏零额等
   */
  /* const displayAssetsList =
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
  console.log('displayAssetsList=>', displayAssetsList) */
  const displayList =
    c2cAssetsListAll.filter(item => {
      const ignoreCaseKey = debouncedSearchKey.toUpperCase()
      const { coinName = '', coinFullName = '' } = item || {}
      const isShowName =
        (coinName || coinFullName) &&
        (coinName?.toUpperCase().includes(ignoreCaseKey) ||
          coinFullName?.toUpperCase().includes(ignoreCaseKey) ||
          ignoreCaseKey === '')

      return isShowName
    }) || ([] as AssetsC2CListResp[])
  // console.log('displayList=>', displayList)

  /**
   * 资产总览 - 查询 c2c 资产列表 all
   */
  const onGetC2cAssetsListAll = async (params: YapiGetV1C2cBalanceAllApiRequest) => {
    setLoading(true)
    const { assetsModule } = baseAssetsStore.getState()
    const res = await getV1C2cBalanceAllApiRequest(params)
    // console.log('getV1C2cBalanceAllApiRequest=>', res.data)
    setLoading(false)
    const { isOk, data } = res || {}
    const { list = [] } = data || {}

    if (!isOk || !data) return
    assetsModule.updateAssetsModule({ c2cAssetsListAll: list })
  }

  useUnmount(() => {
    updateAssetsModule({ coinAssetsList: [] })
  })

  useEffect(() => {
    onGetC2cAssetsListAll(apiParams)
  }, [apiParams])

  return (
    <div className="flex-1">
      <Spin loading={loading}>
        <hr className="border-line_color_02"></hr>
        <SearchWrap
          onSearchChangeFn={setSearchKey}
          onHideLessFn={setHideLessState}
          className="search-input-bgc"
          onChangeHideLess={(isGt: boolean) =>
            setapiParams(prev => {
              return {
                ...prev,
                isGt: isGt as unknown as string,
              }
            })
          }
        />
        <HomeAssetsList loading={loading} assetsListData={displayList} />
      </Spin>
    </div>
  )
}
