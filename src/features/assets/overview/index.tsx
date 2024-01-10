import { useState, useEffect } from 'react'
import { AssetsOverviewResp } from '@/typings/api/assets/assets'
import { Spin } from '@nbit/arco'
import { TotalAssets } from '@/features/assets/common/total-assets'
import { Asset_Body } from '@/plugins/ws/protobuf/ts/proto/Asset'
import { useGetWsAssets } from '@/hooks/features/assets'
import { getAssetsOverview, rateFilter, rateFilterCoinQuantity } from '@/helper/assets'
import { useAssetsStore } from '@/store/assets'
import { useInterval, useUnmount } from 'ahooks'
import { AssetWsSubscribePageEnum } from '@/constants/assets'
import { decimalUtils } from '@nbit/utils'
import { onGetContractOverview } from '@/helper/assets/futures'
import { AssetsList } from './assets-list'

export function AssetsOverview() {
  /** 资产总览默认值 */
  const overviewDataDefault: AssetsOverviewResp = {
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
  const [loading, setLoading] = useState(false)
  const [overviewData, setOverviewData] = useState<AssetsOverviewResp>(overviewDataDefault) // 用户资产数据
  // 汇率接口
  const { fetchCoinRate, wsRateSubscribe, wsRateUnSubscribe, wsC2CAccountSubscribe, wsC2CAccountUnSubscribe } =
    useAssetsStore()

  /**
   * 获取总览资产数据
   * @returns
   */
  const getAssetsOverviewData = async () => {
    setLoading(true)
    const overviewAsset = await getAssetsOverview()
    overviewAsset && setOverviewData(overviewAsset)
    setLoading(false)
  }

  const calculateOverviewData = async () => {
    const SafeCalcUtil = decimalUtils.SafeCalcUtil
    const coinAssetsData = overviewData?.coinAssetsData
    const c2cAssetsData = overviewData?.c2cAssetsData
    const futuresAssetsData = overviewData?.futuresAssetsData
    /** 查逐仓列表，计算合约资产 */
    const futuresInfo = await onGetContractOverview()

    // 接口异常或无数据时不需要重新计算
    if (!futuresInfo) {
      return
    }
    const futuresTotal = futuresInfo.totalPerpetualAsset
    const spotTotal = rateFilter({
      symbol: coinAssetsData?.symbol,
      amount: coinAssetsData?.totalAmount || '',
      rate: overviewData?.symbol,
      showUnit: false,
      isFormat: false,
    })
    const c2cTotal = rateFilter({
      symbol: c2cAssetsData?.symbol,
      amount: c2cAssetsData?.totalAmount || '',
      rate: overviewData?.symbol,
      showUnit: false,
      isFormat: false,
    })
    const futuresListTotal = rateFilterCoinQuantity({
      currencySymbol: overviewData?.symbol,
      amount: futuresTotal,
      symbol: futuresAssetsData?.symbol,
    })

    const assetsTotal = `${SafeCalcUtil.add(SafeCalcUtil.add(futuresTotal, spotTotal), c2cTotal)}`
    futuresAssetsData &&
      setOverviewData({
        ...overviewData,
        positionAmount: String(futuresTotal),
        totalAmount: assetsTotal,
        futuresAssetsData: { ...futuresAssetsData, totalAmount: String(futuresListTotal) },
      })
  }

  /** 轮询逐仓列表接口 */
  useInterval(() => {
    if (overviewData?.symbol) {
      calculateOverviewData()
    }
  }, 5000)

  /** ws 回调 */
  const coinAssetWSCallBack = async () => {
    // 先考虑覆盖式更新，后续考虑增量覆盖
    getAssetsOverviewData()
  }

  /** 初始化时获取总览资产 */
  useEffect(() => {
    fetchCoinRate()
    getAssetsOverviewData()
    // 汇率订阅
    wsRateSubscribe()
    // C2C 资产订阅
    wsC2CAccountSubscribe(coinAssetWSCallBack)
  }, [])

  useUnmount(() => {
    wsC2CAccountUnSubscribe(coinAssetWSCallBack)
    wsRateUnSubscribe()
  })

  // 交易账户资产推送
  useGetWsAssets({ wsCallBack: coinAssetWSCallBack, page: AssetWsSubscribePageEnum.other })

  return (
    <Spin loading={loading}>
      <TotalAssets assetsData={overviewData} />
      <AssetsList assetsData={overviewData} />
    </Spin>
  )
}
