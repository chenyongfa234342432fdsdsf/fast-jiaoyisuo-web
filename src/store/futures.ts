import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { getFuturePerpetualList } from '@/apis/future/common'
import {
  getFuturesCurrentLeverageCache,
  getFuturesTradeUnit,
  getGroupMarginSourceCacheMap,
  setFuturesCurrentLeverageCache,
  setFuturesTradeUnit,
  setGroupMarginSourceCacheMap,
} from '@/helper/cache'
import { TradeFuturesOrderAssetsTypesEnum, TradeMarketAmountTypesEnum } from '@/constants/trade'
import { ISubscribeParams } from '@/plugins/ws/types'
import { WsTypesEnum, WsBizEnum, WsThrottleTimeEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@nbit/chart-utils'
import contractWs from '@/plugins/ws'
import { subscribeWithSelector } from 'zustand/middleware'
import { envIsClient } from '@/helper/env'

import { YapiGetV1PerpetualGroupListData } from '@/typings/yapi/PerpetualGroupListV1GetApi.d'
import { getResetLever } from '@/helper/trade'
import { baseContractMarketStore } from './market/contract'
import { baseUserStore } from './user'

const futuresCurrentLeverageCache = getFuturesCurrentLeverageCache()
const groupMarginSourceCacheMap = getGroupMarginSourceCacheMap()
const futuresTradeUnit = getFuturesTradeUnit()

let subscribed = false

function createOnWs(_, get) {
  return {
    async onContractGroupListPush() {
      const state = get()
      const groupList = await state.getContractGroupList()
      const { selectedContractGroup, updateContractGroup } = get()
      if (selectedContractGroup?.groupId) {
        const selectedGroup = groupList?.find(item => item?.groupId === selectedContractGroup?.groupId)
        updateContractGroup(selectedGroup)
      }
    },
  }
}

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  const state = {
    tradePanel: {
      tradeUnit: futuresTradeUnit || TradeMarketAmountTypesEnum.amount,
    },
    updateTradeUnit: val =>
      set(
        produce((draft: IStore) => {
          draft.tradePanel.tradeUnit = val
          setFuturesTradeUnit(val)
        })
      ),
    groupMarginSourceCache:
      groupMarginSourceCacheMap || ({} as Record<string | number, TradeFuturesOrderAssetsTypesEnum>),
    updateGroupMarginSource: val =>
      set(
        produce((draft: IStore) => {
          draft.groupMarginSourceCache[`${draft.selectedContractGroup?.groupId}`] = val
          setGroupMarginSourceCacheMap(draft.groupMarginSourceCache)
        })
      ),
    isClickOrderBook: false,
    setIsClickOrderBook: val =>
      set(
        produce((draft: IStore) => {
          draft.isClickOrderBook = val
        })
      ),
    openQuestionsMsg: '',
    setOpenQuestionsMsg: val =>
      set(
        produce((draft: IStore) => {
          draft.openQuestionsMsg = val
        })
      ),
    currentGroupOrderAssetsTypes: TradeFuturesOrderAssetsTypesEnum.assets,
    setCurrentGroupOrderAssetsTypes: val =>
      set(
        produce((draft: IStore) => {
          draft.currentGroupOrderAssetsTypes = val
        })
      ),
    currentLeverageCache: (futuresCurrentLeverageCache || {}) as Record<string, number>,
    currentLeverage: 20,
    setCurrentLeverage: val =>
      set(
        produce((draft: IStore) => {
          draft.currentLeverageCache[`${baseContractMarketStore.getState().currentCoin.symbolName}`] = val
          draft.currentLeverage = val
          setFuturesCurrentLeverageCache(draft.currentLeverageCache)
        })
      ),
    selectedContractGroup: { groupName: '' } as YapiGetV1PerpetualGroupListData,
    updateContractGroup: contractGroup =>
      set(
        produce((draft: IStore) => {
          draft.selectedContractGroup = contractGroup
        })
      ),
    contractGroupList: [] as YapiGetV1PerpetualGroupListData[],
    async getContractGroupList() {
      const { isOk, data } = await getFuturePerpetualList({})
      const groupList = data?.list
      if (isOk) {
        set(
          produce((draft: IStore) => {
            draft.contractGroupList = groupList || []
          })
        )
        return groupList
      }
      return false
    },
    contractGroupSubscribe() {
      if (subscribed) {
        return () => {}
      }
      const { onContractGroupListPush } = createOnWs(set, get)
      const subscribeParams: ISubscribeParams[] = [
        {
          subs: {
            biz: WsBizEnum.perpetual,
            type: WsTypesEnum.perpetualGroupDetail,
          },
          throttleTime: WsThrottleTimeEnum.Market,
          throttleType: WSThrottleTypeEnum.cover,
          callback: onContractGroupListPush,
        },
      ]
      subscribeParams.forEach(({ callback, ...params }) => {
        contractWs.subscribe({
          ...params,
          callback,
        })
      })
      subscribed = true
      return () => {
        subscribed = false
        subscribeParams.forEach(params => {
          contractWs.unsubscribe(params)
        })
      }
    },
  }

  return state
}
const baseFuturesStore = create(subscribeWithSelector(getStore))
baseFuturesStore.subscribe(
  state => state.selectedContractGroup?.groupId,
  groupId => {
    if (envIsClient) {
      const store = baseFuturesStore.getState()
      const type = store.groupMarginSourceCache[`${groupId}`] || TradeFuturesOrderAssetsTypesEnum.assets
      store.setCurrentGroupOrderAssetsTypes(type)
    }
  }
)
/**
 * 杠杆默认值逻辑
 */
baseContractMarketStore.subscribe(
  state => state.currentCoin?.symbolName,
  symbolName => {
    if (envIsClient && symbolName) {
      const store = baseFuturesStore.getState()
      const currentLeverageCache = store.currentLeverageCache
      const max = getResetLever(baseContractMarketStore.getState().currentCoin?.tradePairLeverList)
      const cacheLevel = currentLeverageCache[`${symbolName}`]
      store.setCurrentLeverage(cacheLevel || max)
    }
  }
)
/** 登录状态改变后判断当前用户合约组缓存是否合法，然后清空 */
baseUserStore.subscribe(
  state => state.isLogin,
  async isLogin => {
    if (envIsClient && isLogin) {
      const store = baseFuturesStore.getState()
      const groupList = await store.getContractGroupList()
      const { selectedContractGroup, updateContractGroup } = store
      if (selectedContractGroup?.groupId) {
        const selectedGroup = groupList && groupList?.find(item => item?.groupId === selectedContractGroup?.groupId)
        updateContractGroup(selectedGroup)
      }
    }
  }
)
const useFuturesStore = createTrackedSelector(baseFuturesStore)

export { useFuturesStore, baseFuturesStore }
