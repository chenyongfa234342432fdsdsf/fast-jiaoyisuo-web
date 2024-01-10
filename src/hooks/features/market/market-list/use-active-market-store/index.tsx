import { MarketLisModulesEnum } from '@/constants/market/market-list'
import { IMarketSpotStore, baseMarketStore, useMarketStore } from '@/store/market'
import { IMarketFuturesStore, baseContractMarketStore, useContractMarketStore } from '@/store/market/contract'
import { StoreApi, UseBoundStore } from 'zustand'

export type IActiveMarketBaseStoreType = UseBoundStore<StoreApi<IMarketFuturesStore | IMarketSpotStore>>
export type IActiveMarketStoreType = IMarketFuturesStore | IMarketSpotStore

export function getActiveMarketStore(storeType: MarketLisModulesEnum) {
  let baseMarketActiveStore: IActiveMarketBaseStoreType
  let useMarketActiveStore: () => IActiveMarketStoreType

  switch (storeType) {
    case MarketLisModulesEnum.futuresMarketsTrade:
      baseMarketActiveStore = baseContractMarketStore
      useMarketActiveStore = useContractMarketStore
      break

    case MarketLisModulesEnum.spotMarketsTrade:
    default:
      baseMarketActiveStore = baseMarketStore
      useMarketActiveStore = useMarketStore
      break
  }

  return { baseMarketActiveStore, useMarketActiveStore }
}
