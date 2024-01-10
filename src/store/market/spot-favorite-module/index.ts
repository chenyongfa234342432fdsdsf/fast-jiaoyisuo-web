import create, { StoreApi } from 'zustand'
import { FavStore } from '@/typings/market/market-favourite'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { YapiGetV1FavouriteListData } from '@/typings/yapi/FavouriteListV1GetApi'

function getFavStore(set: StoreApi<FavStore>['setState'], get: StoreApi<FavStore>['getState']): FavStore {
  return {
    hasListUpdated: false,
    updateList: () =>
      set(
        produce((draft: FavStore) => {
          draft.hasListUpdated = !draft.hasListUpdated
        })
      ),
    favList: [],
    updateFavList: (list: YapiGetV1FavouriteListData[]) => {
      set(
        produce((draft: FavStore) => {
          draft.favList = list
        })
      )
    },
  }
}

const baseSpotFavStore = create(getFavStore)
const useSpotFavStore = createTrackedSelector(baseSpotFavStore)

const baseFuturesFavStore = create(getFavStore)
const useFuturesFavStore = createTrackedSelector(baseFuturesFavStore)

export { useSpotFavStore, baseSpotFavStore, useFuturesFavStore, baseFuturesFavStore }
