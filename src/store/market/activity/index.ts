import create from 'zustand'
import produce from 'immer'
import { createTrackedSelector } from 'react-tracked'

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  return {
    /** 行情异动列表 */
    marketActivityList: [],

    updateMarketActivityList: newMarketActivityList =>
      set(produce(() => ({ marketActivityList: newMarketActivityList }))),
  }
}

const baseMarketActivityStore = create<IStore>(getStore)

const useMarketActivityStore = createTrackedSelector(baseMarketActivityStore)

export { useMarketActivityStore, baseMarketActivityStore }
