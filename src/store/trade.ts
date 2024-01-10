import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import {
  getCacheTradeLayout,
  getCacheTradeSetting,
  getTradeUnit,
  setCacheTradeLayout,
  setCacheTradeSetting,
  setTradeUnit,
} from '@/helper/cache'
import { TradeLayoutEnum, TradeMarketAmountTypesEnum } from '@/constants/trade'
import { mergeStateFromCache } from '@/helper/store'

const tradeSettingCache = getCacheTradeSetting()
const tradeUnit = getTradeUnit()
const tradeLayoutCache: IStore['layout'] = getCacheTradeLayout()
const getSettingDefault = (result = true) => ({
  /** 普通委托 */
  common: {
    limit: {
      spot: result,
      futures: result,
    },
    market: { spot: result, futures: result },
    /** 限价止盈止损委托         */
    limitStopLimit: { futures: result },
    /** 市价止盈止损委托         */
    marketStopLimit: { futures: result },
  },
  /** 计划委托 */
  trailing: {
    limit: {
      spot: result,
      futures: result,
    },
    market: { spot: result, futures: result },
    limitStopLimit: { futures: result },
    marketStopLimit: { futures: result },
  },
})
type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  const state = {
    layout: {
      announcementShow: true,
      kLineHistory: true,
      tradeFormPosition: TradeLayoutEnum.default,
    },
    setLayout: (key, val) =>
      set((store: IStore) => {
        const newStore = produce(store, _store => {
          _store.layout[key] = val
        })
        setCacheTradeLayout(newStore.layout)
        return newStore
      }),
    tradePanel: {
      tradeUnit: tradeUnit || TradeMarketAmountTypesEnum.amount,
    },
    updateTradeUnit: val =>
      set(
        produce((draft: IStore) => {
          draft.tradePanel.tradeUnit = val
          setTradeUnit(val)
        })
      ),
    setting: tradeSettingCache || getSettingDefault(),
    setSetting: (type, orderType, key, val) =>
      set((store: IStore) => {
        const newStore = produce(store, _store => {
          _store.setting[type][orderType][key] = val
        })
        setCacheTradeSetting(newStore.setting)
        return newStore
      }),
    setSettingFalse: () =>
      set((store: IStore) => {
        const newStore = produce(store, _store => {
          _store.setting = getSettingDefault(false)
        })
        setCacheTradeSetting(newStore.setting)
        return newStore
      }),
  }
  if (tradeLayoutCache) {
    state.layout = mergeStateFromCache(state.layout, tradeLayoutCache)
  }

  return state
}
const baseTradeStore = create(getStore)

const useTradeStore = createTrackedSelector(baseTradeStore)

export { useTradeStore, baseTradeStore }
