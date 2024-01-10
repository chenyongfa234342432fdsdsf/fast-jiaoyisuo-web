import { t } from '@lingui/macro'
import { Select } from '@nbit/arco'
import { useState, useEffect } from 'react'
import { MarginFeeTypeEnum } from '@/constants/assets/margin'
import AesstsTabs from '@/features/assets/common/assets-tabs-old'
import { usePageContext } from '@/hooks/use-page-context'
import { getMarginIsolatedLadder, getMarginCrossCoin, getMarginIsolatedPair } from '@/apis/assets/margin'
import { useAssetsStore } from '@/store/assets'
import CoinSearch from '@/features/assets/common/search-form/coin-search'
import { useUpdateEffect } from 'react-use'
import MarginRateList from './rate-list'
import LadderList from './ladder-list'
import TradePairList from './tradepair-list'
import styles from './index.module.css'
import { AssetSelect } from '../../common/assets-select'

/** 杠杠数据 */
function MarginFeeIndex() {
  const Option = Select.Option
  const pageContext = usePageContext()
  const typeId = pageContext?.urlParsed?.search?.type
  const [type, setType] = useState(typeId)
  const assetsStore = useAssetsStore()
  const [searchKey, setSearchKey] = useState('')
  const [userWalletListData, setUserWalletListData] = useState<any>() // 资产列表数据
  const [tradeList, setTradeList] = useState<any>() // 逐仓交易对
  const [tradeId, setTradeId] = useState() // 逐仓交易对 id

  const [loading, setLoading] = useState(false)

  interface IMarginFeeListProps {
    tabType: MarginFeeTypeEnum | string
    /** 回调，返回当前币种的资产数据 */
    onSuccess?(data: any): void
  }

  /** 获取交易对名字 */
  const getTradeName = (tradePair, id) => {
    const obj = tradePair.find(v => {
      return v.tradeId === id
    })
    return obj ? `${obj.base}/${obj.quote}` : ''
  }
  /** 查逐仓交易对 */
  const getTradePair = async () => {
    let resData
    const res = await getMarginIsolatedPair({})
    if (res.isOk && res.data) {
      resData = res.data
      setTradeList(resData)
      setTradeId(resData[0].tradeId)
      assetsStore.updateMarginTradePair(resData)
    }

    return resData
  }
  /** 查询杠杆数据列表 */
  const getMarginCrossCoinList = async (options: IMarginFeeListProps) => {
    const { tabType } = { ...options }
    let res
    let resData

    if (tabType === MarginFeeTypeEnum.isolatedLadder) {
      const tradeListData = await getTradePair()
      if (tradeId) {
        const params = { tradeId }
        res = await getMarginIsolatedLadder(params)
        if (res.isOk && res.data) {
          resData = res.data

          resData.forEach(item => {
            item.coinName = getTradeName(tradeListData, item.tradeId)
          })
        }
      }

      return resData
    }

    if (tabType === MarginFeeTypeEnum.isolatedPair) {
      res = await await getTradePair()
      if (res.isOk && res.data) {
        resData = res.data
      }
      return resData
    }

    // if (feeType === MarginFeeTypeEnum.marginRate) {
    res = await getMarginCrossCoin({})
    if (res.isOk && res.data) {
      resData = res.data
    }
    return resData
    // }
  }

  /**
   * 获取资产列表和总资产等
   * @returns
   */
  const getInitListData = async () => {
    const params = { tabType: type }

    setLoading(true)
    const assetsList = await getMarginCrossCoinList(params)
    setLoading(false)

    // 列表数据
    const coinAssetsList = assetsList

    if (!coinAssetsList) return

    setUserWalletListData(coinAssetsList)
  }

  /** 列表搜索、隐藏零额、加密等操作 */
  const getListData = () => {
    let coinAssetsList = userWalletListData

    coinAssetsList =
      coinAssetsList &&
      coinAssetsList.filter((item: { coinName: string }) => {
        const ignoreCaseKey = searchKey.toUpperCase()
        return item.coinName.toUpperCase().includes(ignoreCaseKey)
      })

    return coinAssetsList
  }

  /** 逐仓币币对选择 */
  const onChangeIsTradeList = val => {
    setTradeId(val)
  }

  useEffect(() => {
    getInitListData()
  }, [])

  useUpdateEffect(() => {
    getInitListData()
  }, [type])

  const onChangeLogsType = val => {
    setType(val)
  }

  const tabList = [
    {
      title: t`features/assets/margin/margin-fee/index-0`,
      content: (
        <>
          <div className="flex mb-8">
            <CoinSearch onSearchChangeFn={setSearchKey} />
          </div>
          <MarginRateList loading={loading} tableData={getListData()} />
        </>
      ),
      id: MarginFeeTypeEnum.marginRate,
    },
    {
      title: t`features/assets/margin/margin-fee/index-1`,
      content: (
        <>
          <div className="flex mb-8">
            <CoinSearch onSearchChangeFn={setSearchKey} />
          </div>
          <TradePairList loading={loading} tableData={getListData()} />
        </>
      ),
      id: MarginFeeTypeEnum.isolatedPair,
    },
    {
      title: t`features/trade/index-2`,
      content: (
        <>
          <div className="search-tradepair">
            <AssetSelect onChange={onChangeIsTradeList} showSearch defaultValue={tradeList && tradeList[0].tradeId}>
              {tradeList &&
                tradeList.map(option => (
                  <Option key={option.tradeId} value={option.tradeId}>
                    {option.base}/{option.quote}
                  </Option>
                ))}
            </AssetSelect>
          </div>
          <LadderList loading={loading} tableData={getListData()} />
        </>
      ),
      id: MarginFeeTypeEnum.isolatedLadder,
    },
  ]

  return (
    <div className={styles.scoped}>
      <AesstsTabs tabList={tabList} onChangeFn={onChangeLogsType} defaultActiveTab={MarginFeeTypeEnum.marginRate} />
    </div>
  )
}

export { MarginFeeIndex }
