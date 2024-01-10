import { useEffect } from 'react'
import { useSafeState, useMemoizedFn } from 'ahooks'
import { getMyAssetsDataProps } from '@/typings/assets'
import { getMyAssetsData } from '@/helper/assets'
import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { useAssetsStore, defaultCoinAsset } from '@/store/assets'
import { useAssetsFuturesStore, defaultUserAssetsFutures } from '@/store/assets/futures'
import { AssetWsSubscribePageEnum } from '@/constants/assets'
import { TradeModeEnum } from '@/constants/trade'
import { useUserStore } from '@/store/user'
import { UserFuturesTradeStatus } from '@/constants/user'

/** 获取用户资产 - 方法入参 */
type useGetWsAssetProps = {
  /** ws subs 入参 */
  subs?: any
  /** 订阅来源：trade、other，交易页订阅判断币对 id */
  page?: string
  /** ws 回调方法 */
  wsCallBack(data: any): void
}

/**
 * 资产数据推送 - 目前只支持币币资产
 * @param page: trade、other，ws 订阅来源：交易页订阅判断币对 id
 * @param wsCallBack ws 回调
 */
export function useGetWsAssets({ page, wsCallBack }: useGetWsAssetProps) {
  const marketState = useMarketStore()
  const assetsStore = useAssetsStore()
  const { isLogin } = useUserStore()
  const { wsSpotAssetsSubscribe, wsSpotAssetsUnSubscribe } = {
    ...assetsStore,
  }
  // useMemoizedFn 解决循环订阅、解订阅的问题
  wsCallBack = useMemoizedFn(wsCallBack)

  // websocket 推送资产
  useEffect(() => {
    // 未登录不订阅
    if (!isLogin) return

    // 交易页还未拿到币对 id 时不订阅
    if (page === AssetWsSubscribePageEnum.trade && !marketState.currentCoin.id) return

    wsSpotAssetsSubscribe(wsCallBack)

    return () => {
      wsSpotAssetsUnSubscribe(wsCallBack)
    }
  }, [marketState.currentCoin.id, isLogin, wsCallBack])
}

/** 获取用户资产 - 方法入参 */
type useGetMyAssetsWSProps = {
  /** ws subs 入参 */
  subs?: any
  /** 订阅来源：trade、other，交易页订阅判断币对 id */
  page?: string
  accountType?: TradeModeEnum
}

/**
 * 交易页查可用资产数据推送 - 目前支持币币资产、合约资产
 * @param page: trade、other，ws 订阅来源：交易页订阅判断币对 id
 */
export function useGetMyAssetsWS({ page, accountType }: useGetMyAssetsWSProps) {
  const marketState = useMarketStore()
  const { userInfo, isLogin } = useUserStore()
  const isOpenFutures = userInfo.isOpenContractStatus === UserFuturesTradeStatus.open

  const assetsStore = useAssetsStore()
  const assetsFuturesStore = useAssetsFuturesStore()
  const { wsSpotAssetsSubscribe, wsSpotAssetsUnSubscribe } = {
    ...assetsStore,
  }
  const { wsSpotAssetsChangeSubscribe, wsSpotAssetsChangeUnSubscribe } = { ...assetsFuturesStore }
  // websocket 推送资产
  useEffect(() => {
    // 未登录不订阅
    if (!isLogin) return

    switch (accountType) {
      case TradeModeEnum.spot:
        // 现货交易页 - 未拿到币对信息时不订阅
        if (page === AssetWsSubscribePageEnum.trade && !marketState.currentCoin.id) return
        wsSpotAssetsSubscribe()
        break
      case TradeModeEnum.futures:
        // 合约交易页 - 未开通合约或者未拿到币对信息时不订阅
        if (!isOpenFutures) return
        wsSpotAssetsChangeSubscribe()
        break
      default:
        break
    }

    return () => {
      switch (accountType) {
        case TradeModeEnum.spot:
          wsSpotAssetsUnSubscribe()
          break
        case TradeModeEnum.futures:
          wsSpotAssetsChangeUnSubscribe()
          break
        default:
          break
      }
    }
  }, [marketState.currentCoin.id, isLogin, isOpenFutures])
}

/**
 * 查询现货、合约、杠杆的资产信息
 * @param options
 */
export const useGetMyAssets = (options: getMyAssetsDataProps) => {
  const marketState = useMarketStore()
  const assetsStore = useAssetsStore()
  const assetsFuturesStore = useAssetsFuturesStore()
  const { userInfo, isLogin } = useUserStore()
  const isOpenFutures = userInfo.isOpenContractStatus === UserFuturesTradeStatus.open
  const { userAssetsSpot, userAssetsMargin, updateUserAssetsSpot } = {
    ...assetsStore,
  }
  const { userAssetsFutures, updateUserAssetsFutures } = { ...assetsFuturesStore }
  let defaultAsset
  const { accountType } = options
  if (accountType === TradeModeEnum.margin) {
    defaultAsset = userAssetsMargin
  } else if (accountType === TradeModeEnum.futures) {
    // 合约 - 可用资产
    defaultAsset = userAssetsFutures
  } else {
    // 默认现货
    defaultAsset = userAssetsSpot
  }

  const [assetData, setAssetData] = useSafeState(defaultAsset)
  const getAssetData = async () => {
    const userAssets = await getMyAssetsData(options)
    setAssetData(userAssets)
  }

  useEffect(() => {
    if (!isLogin) {
      updateUserAssetsSpot(defaultCoinAsset)
      updateUserAssetsFutures(defaultUserAssetsFutures)
    }
    if (!marketState.currentCoin.id && accountType === TradeModeEnum.spot) {
      updateUserAssetsSpot(defaultCoinAsset)
      return
    }
    if (accountType === TradeModeEnum.futures && !isOpenFutures) {
      updateUserAssetsFutures(defaultUserAssetsFutures)
      return
    }
    getAssetData()
  }, [marketState.currentCoin.id, isLogin, isOpenFutures])

  // websocket 资产推送
  useGetMyAssetsWS({ page: AssetWsSubscribePageEnum.trade, accountType })

  // 暂时只支持现货资产
  return assetData
}
