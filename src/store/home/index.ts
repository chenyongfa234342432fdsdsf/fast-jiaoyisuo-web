import create, { StoreApi } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import { getTradePair } from '@/apis/home'
import { devtools } from 'zustand/middleware'
import { generateCommonApiAndStoreFormat } from '@/helper/store'
import { MainTradePair } from '@/typings/api/home'

enum HomeApiStore {
  MainTrade = 'mainTradePair',
  Notices = 'notices',
}

type HomeStore = {
  // api request
  getTradePair: () => void

  // api responses
  [HomeApiStore.MainTrade]: MainTradePair[]
}

function getStore(set: StoreApi<HomeStore>['setState'], get: StoreApi<HomeStore>['getState']): HomeStore {
  const homeApiAndStoreFormat = generateCommonApiAndStoreFormat(set)

  return {
    ...(homeApiAndStoreFormat(
      HomeApiStore.MainTrade,
      getTradePair,
      { type: '1' },
      res => res.data as MainTradePair[]
    ) as unknown as Pick<HomeStore, 'getTradePair' | HomeApiStore.MainTrade>),
  }
}

const baseHomeStore = create(devtools(getStore, { name: 'home-store' }))

const useBaseHomeStore = createTrackedSelector(baseHomeStore)

export { useBaseHomeStore, baseHomeStore }

/**
 * Transform chart api data to usable format
 * @param data api data
 * @returns formatted data
 */
export function transformChartData(data?: Array<Array<string>>) {
  if (!data) return []
  return data.map(each => {
    return {
      time: Number(each[0]),
      value: Number(each[1]),
    }
  })
}
