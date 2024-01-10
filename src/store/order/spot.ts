import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import coinWs from '@/plugins/ws'
import { ISubscribeParams } from '@/plugins/ws/types'
import { IBaseOrderItem, ISpotPlanOrderItem, IWsSpotOrder } from '@/typings/api/order'
import { querySpotNormalOpenOrderList, querySpotPlanOpenOrderList } from '@/apis/order'
import { getIsLogin } from '@/helper/auth'
import { getSymbolLabelInfo } from '@/apis/market'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { WsBizEnum, WsThrottleTimeEnum, WsTypesEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { OrderTabTypeEnum } from '@/constants/order'
import { fetchStoreEnums, mergeStateFromCache } from '@/helper/store'
import { setSpotOrderSettingsToCache, getSpotOrderSettingsFromCache } from '@/helper/cache'
import { IStoreEnum } from '@/typings/store/common'

export type IBaseOrderSpotStore = ReturnType<typeof getBaseStore>

let subscribed = false

export function createOrderSettings(set) {
  type ITempState = typeof state
  const state = {
    orderSettings: {
      /** 仅展示当前交易对订单 */
      showCurrentCoinOrders: false,
      updateShowCurrentCoinOrders(show: boolean) {
        set(
          produce((draft: ITempState) => {
            draft.orderSettings.showCurrentCoinOrders = show
          })
        )
      },
      /** 交易页默认的 tab 选项 */
      defaultOrderTab: OrderTabTypeEnum.current,
      updateDefaultOrderTab(tab: OrderTabTypeEnum) {
        set(
          produce((draft: ITempState) => {
            draft.orderSettings.defaultOrderTab = tab
          })
        )
      },
    },
  }

  return state
}

function createOnWs(set, get) {
  return {
    onEntrustPush(order: IWsSpotOrder[]) {
      const state: IBaseOrderSpotStore = get()
      state.fetchOpenOrders()
    },
    onPlanEntrustPush(order: IWsSpotOrder[]) {
      const state: IBaseOrderSpotStore = get()
      state.fetchOpenOrders()
    },
  }
}

function getBaseStore(set, get) {
  const baseState = {
    openOrderModule: {
      normal: {
        data: [] as any as IBaseOrderItem[],
        total: 0,
      },
      plan: {
        data: [] as any as ISpotPlanOrderItem[],
        total: 0,
      },
      removePlanOrder(id?: any) {
        set(
          produce((state: IBaseOrderSpotStore) => {
            state.openOrderModule.plan.data = state.openOrderModule.plan.data.filter(item =>
              id ? item.id !== id : false
            )
            state.openOrderModule.plan.total = state.openOrderModule.plan.data.length
          })
        )
      },
      removeNormalOrder(id?: any) {
        set(
          produce((state: IBaseOrderSpotStore) => {
            state.openOrderModule.normal.data = state.openOrderModule.normal.data.filter(item =>
              id ? item.id !== id : false
            )
            state.openOrderModule.normal.total = state.openOrderModule.normal.data.length
          })
        )
      },
    },
    resetOpenModule() {
      set(
        produce((draft: IBaseOrderSpotStore) => {
          draft.openOrderModule.normal = {
            data: [],
            total: 0,
          }
          draft.openOrderModule.plan = {
            data: [],
            total: 0,
          }
        })
      )
    },
    pairList: [] as {
      name: string
      id: any
    }[],
    subscribe() {
      // 因为是模块调用，不用担心空函数无法取消订阅
      if (subscribed) {
        return () => {}
      }
      if (!getIsLogin()) {
        return () => {}
      }
      const { onEntrustPush, onPlanEntrustPush } = createOnWs(set, get)
      const subscribeParams: ISubscribeParams[] = [
        {
          subs: {
            biz: WsBizEnum.spot,
            type: WsTypesEnum.order,
            base: '',
            quote: '',
            granularity: '',
          },
          callback: onEntrustPush,
          throttleType: WSThrottleTypeEnum.increment,
          throttleTime: WsThrottleTimeEnum.Market,
        },
        {
          subs: {
            biz: WsBizEnum.spot,
            type: WsTypesEnum.planOrder,
            base: '',
            quote: '',
            granularity: '',
          },
          throttleType: WSThrottleTypeEnum.increment,
          throttleTime: WsThrottleTimeEnum.Market,
          callback: onPlanEntrustPush,
        },
      ]
      subscribeParams.forEach(({ callback, ...params }) => {
        coinWs.subscribe({
          ...params,
          callback,
        })
      })
      subscribed = true
      return () => {
        subscribed = false
        subscribeParams.forEach(params => {
          coinWs.unsubscribe(params)
        })
      }
    },
    async fetchOpenOrders({ tradeId }: { tradeId?: string } = {}) {
      const [normalRes, planRes] = await Promise.all([
        querySpotNormalOpenOrderList({ pageSize: 1000 } as any),
        querySpotPlanOpenOrderList({ pageSize: 1000 } as any),
      ])
      set(
        produce((draft: IBaseOrderSpotStore) => {
          draft.openOrderModule.normal = {
            data: ((normalRes.data && normalRes.data.list) as any) || [],
            total: (normalRes.data && normalRes.data.total!) || 0,
          }
          draft.openOrderModule.plan = {
            data: ((planRes.data && planRes.data.list) as any) || [],
            total: (planRes.data && planRes.data.total!) || 0,
          }
        })
      )
    },
    async fetchPairList() {
      const res = await getSymbolLabelInfo({})
      if (!res.isOk || !res.data) {
        return
      }
      set(
        produce((draft: IBaseOrderSpotStore) => {
          draft.pairList = ((res.data as any)?.list as YapiGetV1TradePairListData[])?.map(item => {
            return {
              name: `${item.baseSymbolName}/${item.quoteSymbolName}`,
              id: item.id,
            }
          })
        })
      )
    },
    ...createOrderSettings(set),
    /** 订单枚举，从后端获取的数据字典 */
    orderEnums: {
      orderStatus: {
        codeKey: 'statusCode',
        enums: [],
      } as IStoreEnum,
      planOrderStatus: {
        codeKey: 'orderStatusCd',
        enums: [],
      } as IStoreEnum,
      orderStatusInFilters: {
        codeKey: 'web_SpotOrderStatusInFilters',
        enums: [],
      } as IStoreEnum,
      planOrderStatusInFilters: {
        codeKey: 'web_SpotTriggerOrderStatusInFilters',
        enums: [],
      } as IStoreEnum,
      orderDirection: {
        codeKey: 'sideInd',
        enums: [],
      } as IStoreEnum,
      // 和下面的这个区别是，限价，限价委托
      entrustType: {
        codeKey: 'web_SpotEntrustType',
        enums: [],
      } as IStoreEnum,
      entrustTypeWithSuffix: {
        codeKey: 'web_SpotEntrustTypeWithSuffix',
        enums: [],
      } as IStoreEnum,
      planEntrustTypeWithSuffix: {
        codeKey: 'web_SpotTriggerEntrustTypeWithSuffix',
        enums: [],
      } as IStoreEnum,
    },
    updateOrderEnums(enums: Record<string, IStoreEnum>) {
      set((draft: IBaseOrderSpotStore) => {
        const state: IBaseOrderSpotStore = {
          ...draft,
          orderEnums: enums as any,
        }

        return state
      })
    },
    setDefaultEnums() {
      // 规避初始化时，多语言无法载入的问题
      const state: IBaseOrderSpotStore = get()
      state.updateOrderEnums(
        produce(state.orderEnums, draft => {
          const items = Object.values(draft)
          items.forEach(item => {
            item.enums = item.getDefault?.() || []
          })
        })
      )
    },
    async fetchOrderEnums() {
      const state: IBaseOrderSpotStore = get()
      const data = await fetchStoreEnums(state.orderEnums)
      state.updateOrderEnums(data)
    },
  }

  mergeStateFromCache(baseState, getSpotOrderSettingsFromCache())

  return baseState
}
function getStore(set, get) {
  return {
    ...getBaseStore(set, get),
  }
}

const baseSpotStore = create(getStore)

const useBaseOrderSpotStore = createTrackedSelector(baseSpotStore)
baseSpotStore.subscribe(state => {
  setSpotOrderSettingsToCache(state)
})

export { useBaseOrderSpotStore, baseSpotStore }
