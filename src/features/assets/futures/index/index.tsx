/**
 * 资产 - 合约组列表
 */
import { useState, useEffect } from 'react'
import { useDebounce, useUnmount, useMemoizedFn, useUpdateEffect, useInterval } from 'ahooks'
import { Spin } from '@nbit/arco'
import { useAssetsStore } from '@/store/assets'
import { useAssetsFuturesStore, totalDataDefault } from '@/store/assets/futures'
import { OpenFuturesLayout } from '@/features/assets/futures/index/open-futures'
import { getAssetsFuturesOverview } from '@/apis/assets/futures/overview'
import { FuturesAssetsResp, FuturesList as FuturesListResp } from '@/typings/api/assets/futures'
import { FuturesAssetsTypeEnum } from '@/constants/assets/futures'
import { getFuturesCurrencySettings, onGetContractOverview } from '@/helper/assets/futures'
import { PerpetualGroupDetail } from '@/plugins/ws/protobuf/ts/proto/PerpetualGroupDetails'
import ListEmpty from '@/components/list-empty'
import { t } from '@lingui/macro'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { decimalUtils } from '@nbit/utils'
import { TotalAssets } from './total-assets'
import { FuturesList } from './futures-list'
import SearchForm from './search-form'
import AssetsFuturesTransfer from '../../common/transfer/assets-futures-transfer'

export function FuturesAccountIndex({ isRefresh = false }) {
  const searchParamsDefault = {
    unrealizedProfitType: '',
    groupName: '',
  }
  const [searchParams, setSearchParams] = useState(searchParamsDefault)
  const [loading, setLoading] = useState(true)
  const debouncedSearchKey = useDebounce(searchParams.groupName, { wait: 500 })
  // 汇率接口
  const { fetchCoinRate } = useAssetsStore()
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    wsPerpetualGroupDetailSubscribe,
    wsPerpetualGroupDetailUnSubscribe,
    assetsFuturesOverview,
    updateAssetsFuturesOverview,
    futuresTransferModal,
    updateFuturesTransferModal,
    futuresGroupList,
  } = {
    ...assetsFuturesStore,
  }
  /** 合约偏好设置 */
  const { contractPreference, getContractPreference } = useContractPreferencesStore()
  const [overviewData, setOverviewData] = useState<FuturesAssetsResp>()

  /**
   * 过滤资产列表 - 列表搜索、隐藏零额等
   */
  const displayAssetsList =
    (futuresGroupList &&
      futuresGroupList.length > 0 &&
      futuresGroupList.filter((item: FuturesListResp) => {
        const ignoreCaseKey = debouncedSearchKey && debouncedSearchKey.toString().toUpperCase()
        const { groupName = '', unrealizedProfit = '' } = item || {}
        const { unrealizedProfitType = '' } = searchParams
        const isShowName = groupName && (groupName.toUpperCase().includes(ignoreCaseKey) || ignoreCaseKey === '')

        return !!(
          (isShowName && !unrealizedProfitType) ||
          (isShowName && unrealizedProfitType === FuturesAssetsTypeEnum.just && Number(unrealizedProfit) > 0) ||
          (isShowName && unrealizedProfitType === FuturesAssetsTypeEnum.negative && Number(unrealizedProfit) < 0)
        )
      })) ||
    []

  /** 资产总览数据 */
  const getAssetsFuturesOverviewData = async () => {
    try {
      // 首次调用接口才出现 loading
      !assetsFuturesOverview.apiState && setLoading(true)
      const res = await getAssetsFuturesOverview({})
      if (res.isOk) {
        const { data } = res
        if (data) {
          setOverviewData(data)
        }

        const totalDataOverview = await onGetContractOverview(true)
        updateAssetsFuturesOverview({ ...assetsFuturesOverview, ...data, ...totalDataOverview, apiState: true })
      }
    } finally {
      setLoading(false)
    }
  }

  /** 查逐仓列表，计算合约资产 */
  const getFuturesListData = async () => {
    const totalDataOverview = await onGetContractOverview(true)
    updateAssetsFuturesOverview({
      ...assetsFuturesOverview,
      ...totalDataOverview,
      apiState: true,
      marginAmount: overviewData?.marginAmount,
      isAutoAdd: overviewData?.isAutoAdd,
    })
  }

  /**
   * 合约组详情推送回调
   */
  const onWsCallBack = useMemoizedFn(async (data: PerpetualGroupDetail[]) => {
    if (data && data.length > 0) {
      getFuturesListData()
    }
  })

  /** 划转回调 */
  const onTransferCallBackFn = async () => {
    updateFuturesTransferModal({ visible: false })
    await getFuturesListData()
  }
  useEffect(() => {
    // 获取商户法币设置信息
    getFuturesCurrencySettings()
    // 获取偏好设置
    getContractPreference()
    // 获取汇率
    fetchCoinRate()
  }, [])

  /** 轮询逐仓列表接口 */
  useInterval(() => {
    if (assetsFuturesOverview.apiState && overviewData?.isOpen) {
      getFuturesListData()
    }
  }, 5000)

  const initData = async () => {
    await getAssetsFuturesOverviewData()
  }

  useEffect(() => {
    initData()
  }, [])

  useUpdateEffect(() => {
    initData()

    // 订阅合约组详情和仓位
    wsPerpetualGroupDetailSubscribe(onWsCallBack)
  }, [contractPreference.isAutoAdd, isRefresh])

  useUnmount(() => {
    // 取消订阅 - 合约组详情和仓位
    wsPerpetualGroupDetailUnSubscribe(onWsCallBack)
    updateAssetsFuturesOverview(totalDataDefault)
  })
  function renderFutureDetailContent() {
    return (
      <div className="flex-1">
        <TotalAssets assetsData={assetsFuturesOverview} />
        <hr className="border-line_color_02"></hr>
        <SearchForm onSearchChangeFn={setSearchParams} />
        <FuturesList
          assetsListData={displayAssetsList}
          onSuccess={() => {
            initData()
          }}
          loading={loading}
        />
        {futuresTransferModal.visible && (
          <AssetsFuturesTransfer
            type={futuresTransferModal?.type}
            coinId={futuresTransferModal?.coinId}
            groupId={futuresTransferModal?.groupId}
            currencySymbol={assetsFuturesOverview?.baseCoin}
            visible={futuresTransferModal.visible}
            setVisible={updateFuturesTransferModal}
            onSubmitFn={onTransferCallBackFn}
          />
        )}
      </div>
    )
  }

  return (
    <Spin loading={loading}>
      {assetsFuturesOverview.apiState && overviewData?.isOpen && renderFutureDetailContent()}
      {assetsFuturesOverview.apiState && overviewData?.isOpen === false && <OpenFuturesLayout onSubmitFn={initData} />}
      {!assetsFuturesOverview.apiState && !loading && (
        <ListEmpty text={t`features_assets_main_assets_detail_trade_pair_index_2562`} loading={loading} />
      )}
    </Spin>
  )
}
