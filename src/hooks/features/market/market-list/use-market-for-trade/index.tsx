import { MarketLisModulesEnum, SpotMarketSectorCategoryEnum } from '@/constants/market/market-list'
import useApiAllCoinSymbolInfo from '@/hooks/features/market/common/use-api-all-coin-symbol-info'
import useApiAllMarketTradePair, {
  useApiAllMarketFuturesTradePair,
} from '@/hooks/features/market/common/use-api-all-market-trade-pair'
import { useFuturesFavList, useSpotFavList } from '@/hooks/features/market/favourite'
import { useMarketStore } from '@/store/market'
import { useMarketListStore } from '@/store/market/market-list'
import { useMount } from 'ahooks'
import { useEffect } from 'react'

/**
 * 行情在交易页面的初始化
 */
export const useMarketSpotForTrade = () => {
  const marketState = useMarketStore()
  const marketListStore = useMarketListStore()
  const marketSpotTradeStore = marketListStore.spotMarketsTradeModule
  const curPair = marketState.currentCoin
  const { setActiveModule } = useMarketListStore()

  /** 提前加载必要的行情数据 */
  useApiAllMarketTradePair()
  useApiAllCoinSymbolInfo()
  useSpotFavList()

  /** 重置现货交易搜索状态 */
  useEffect(() => {
    if (!curPair.symbolName) return
    marketSpotTradeStore.setSelectedBaseCurrencyFilter(String(curPair.buyCoinId))
    marketSpotTradeStore.setSelectedCategroyFilter(SpotMarketSectorCategoryEnum.total)
  }, [curPair.symbolName])

  useMount(() => {
    setActiveModule(MarketLisModulesEnum.spotMarketsTrade)
  })
}

/**
 * 行情在期货交易页面的初始化
 */
export const useMarketFuturesForTrade = () => {
  // const marketState = useContractMarketStore()
  // const marketListStore = useMarketListStore()
  const { setActiveModule } = useMarketListStore()

  /** 提前加载必要的行情数据 */
  useApiAllMarketFuturesTradePair()
  useApiAllCoinSymbolInfo()
  useFuturesFavList()

  useMount(() => {
    setActiveModule(MarketLisModulesEnum.futuresMarketsTrade)
  })

  /** 重置现货交易搜索状态 */
  // useEffect(() => {
  //   if (!curPair.symbolName) return
  // }, [curPair.symbolName])
}
