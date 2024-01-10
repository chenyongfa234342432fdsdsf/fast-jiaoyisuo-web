import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { useAssetsStore } from '@/store/assets'
import { SearchWrap } from '@/features/assets/common/search-form'
import { TradeMarginEnum } from '@/constants/trade'
import { IMarginAssetsListProps } from '@/typings/assets'
import { getMarginCrossAssets } from '@/apis/assets/margin'
import { TotalAssets } from '../total-assets'
import { AssetsList } from './assets-list'

function MarginAllIndex({ onTransferFn }: { onTransferFn(val): void }) {
  const assetsStore = useAssetsStore()
  const [searchKey, setSearchKey] = useState('')
  // const debouncedSearchKey = useDebounce(searchKey, { wait: 800 })

  const [hideLessState, setHideLessState] = useState(false) // 隐藏零额资产
  const [userWalletListData, setUserWalletListData] = useState<any>() // 资产列表数据
  const [loading, setLoading] = useState(false)

  /** 获取全仓杠杆资产 */
  const getMarginCrossAssetsRequset = async params => {
    const res = await getMarginCrossAssets(params)
    let results = res.data
    if (res.isOk && results) {
      return results
    }
    return []
  }

  /** 查询杠杆资产列表 */
  const getMarginAssetsList = async (options: IMarginAssetsListProps) => {
    const { onSuccess } = { ...options }
    const params = {}
    let allAssets
    const resData = await getMarginCrossAssetsRequset(params)
    allAssets = resData

    allAssets.riskText =
      Number(resData.marginLevel) >= 1.5
        ? t`features/assets/margin/all/index-0`
        : Number(resData.marginLevel) >= 1.3
        ? t`features/assets/margin/all/index-1`
        : t`features/assets/margin/all/index-2`
    allAssets.riskPath =
      Number(resData.marginLevel) >= 1.5 ? 'low' : Number(resData.marginLevel) >= 1.3 ? 'center' : 'height'

    onSuccess && onSuccess(allAssets)
    return allAssets
  }

  /**
   * 获取资产列表和总资产等
   * @returns
   */
  const getAssetsList = async () => {
    const params = { activeName: TradeMarginEnum.margin }

    setLoading(true)
    const assetsList = await getMarginAssetsList(params)
    setLoading(false)

    // 接口返回数据存到 store，total-assets 组件用到
    assetsStore.updateAllMarginAssets(assetsList)

    // 列表数据
    const coinAssetsList = assetsList.assetDetails

    if (!coinAssetsList) return

    setUserWalletListData(coinAssetsList)
  }

  /** 列表搜索、隐藏零额、加密等操作 */
  const getCoinAssetsList = () => {
    let coinAssetsList = userWalletListData

    coinAssetsList =
      coinAssetsList &&
      coinAssetsList.filter((item: { coinName: string; crossAssets: number }) => {
        const ignoreCaseKey = searchKey.toUpperCase()
        return item.coinName.toUpperCase().includes(ignoreCaseKey) && (!hideLessState || item.crossAssets > 0)
      })

    return coinAssetsList
  }

  useEffect(() => {
    getAssetsList()
  }, [])

  return (
    <>
      <TotalAssets type={TradeMarginEnum.margin} />
      <SearchWrap onSearchChangeFn={setSearchKey} onHideLessFn={setHideLessState} />
      <AssetsList loading={loading} tableData={getCoinAssetsList()} onTransferFn={onTransferFn} />
    </>
  )
}

export { MarginAllIndex }
