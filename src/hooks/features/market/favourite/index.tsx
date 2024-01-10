import { MarketLisModulesEnum } from '@/constants/market/market-list'
import { contractFavFn, spotFavFn } from '@/helper/market/market-favorite'
import { useMarketListStore } from '@/store/market/market-list'
import { useFuturesFavStore, useSpotFavStore } from '@/store/market/spot-favorite-module'
import { IApiResponse } from '@/typings/api/market'
import { YapiGetV1FavouriteListData } from '@/typings/yapi/FavouriteListV1GetApi'
import { useEffect, useState } from 'react'

/**
 * 获取当前状态下的自选列表
 * @returns fav 数据和状态
 */
function useFavList(contextFn, contextStore) {
  const { getFavList } = contextFn
  const [state, setState] = useState<IApiResponse<YapiGetV1FavouriteListData[]>>({ isLoading: true, data: [] })
  const { hasListUpdated, updateFavList } = contextStore()

  useEffect(() => {
    getFavList()
      .then(res => {
        updateFavList(res || [])

        setState(prev => ({
          ...prev,
          data: res || [],
        }))
      })
      .finally(() => {
        setState(prev => ({
          ...prev,
          isLoading: false,
        }))
      })
  }, [hasListUpdated])

  return state
}

function useFavActions(contextFn, contextStore) {
  const { addFav, removeFav } = contextFn
  const { updateList } = contextStore()
  return {
    addFavToList: async (items: YapiGetV1FavouriteListData[]) => {
      await addFav(items)
      updateList()
    },
    rmFavFromList: async (items: YapiGetV1FavouriteListData[]) => {
      await removeFav(items)
      updateList()
    },
  }
}

const useSpotFavList = () => useFavList(spotFavFn, useSpotFavStore)
const useSpotFavActions = () => useFavActions(spotFavFn, useSpotFavStore)

const useFuturesFavList = () => useFavList(contractFavFn, useFuturesFavStore)
const useFuturesFavActions = () => useFavActions(contractFavFn, useFuturesFavStore)

function useFavActionsSwitch(): typeof useSpotFavActions {
  const active = useMarketListStore().activeModule
  if (active === MarketLisModulesEnum.futuresMarkets) return useSpotFavActions
  return useFuturesFavActions
}

export { useSpotFavList, useSpotFavActions, useFuturesFavList, useFuturesFavActions, useFavActionsSwitch }
