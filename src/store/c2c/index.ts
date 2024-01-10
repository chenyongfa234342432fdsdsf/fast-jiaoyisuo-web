import create from 'zustand'

import { createTrackedSelector } from 'react-tracked'
import { getC2CShortAreaList, getC2CAreaCoinList, getTransactionRate, getC2COrderDetail } from '@/apis/c2c/c2c-trade'
import produce from 'immer'
import { ISubscribeParams } from '@/plugins/ws/types'
import ws from '@/plugins/ws'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi.d'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi.d'
import { WsTypesEnum, WsBizEnum } from '@/constants/ws'

let subscribed = false

function createOnWs(_, get) {
  return {
    onC2COrderStatusPush() {
      const state = get()
      state.getC2COrderStatusDetail({ id: state?.searchOrderId })
    },
  }
}

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  const state = {
    c2cTrade: {
      c2cAreaList: [] as YapiGetV1C2CAreaListData[],
      c2cCoinList: [] as YapiPostV1C2CCoinListData[],
      transactionPayRate: '',
      transactionPayOffset: 2,
    },
    showThirdPartyPayment: false,
    updateShowThirdPartyPayment(newShowThirdPartyPayment) {
      set(
        produce((draft: IStore) => {
          draft.showThirdPartyPayment = newShowThirdPartyPayment
        })
      )
    },
    C2COrderStatusDetail: undefined as YapiGetV1C2COrderDetailData | undefined,
    searchOrderId: 0,
    clearc2cCoinAndAreaList() {
      set(
        produce((draft: IStore) => {
          draft.c2cTrade.c2cCoinList = []
          draft.c2cTrade.c2cAreaList = []
        })
      )
    },
    clearC2CStatusDetail() {
      set(
        produce((draft: IStore) => {
          draft.C2COrderStatusDetail = undefined
        })
      )
    },
    setSearchOrderId(uid) {
      set(
        produce((draft: IStore) => {
          draft.searchOrderId = uid
        })
      )
    },
    getC2CAreaPayList: async params => {
      const { isOk, data } = await getC2CShortAreaList(params)
      if (isOk) {
        const sortData = [...data]?.sort((a, b) => {
          // 将 hasCoins 为 false 的元素排在后面
          if (a.hasCoins && !b.hasCoins) {
            return -Infinity
          } else if (!a.hasCoins && b.hasCoins) {
            return Infinity
          }
          // 将 legalCurrencyId 越小的元素排在前面
          if (a.legalCurrencyId < b.legalCurrencyId) {
            return -Infinity
          } else if (a.legalCurrencyId > b.legalCurrencyId) {
            return Infinity
          }
          return 0
        })
        set(
          produce((draft: IStore) => {
            if (data && !params?.showSelectList) {
              draft.c2cTrade.c2cAreaList = sortData
            }
          })
        )

        return sortData
      }
    },
    getC2CAreaCoinPayList: async items => {
      const { isOk, data } = await getC2CAreaCoinList(items)
      if (isOk) {
        set(
          produce((draft: IStore) => {
            if (data && !items?.showSelectList) {
              draft.c2cTrade = {
                ...draft.c2cTrade,
                c2cCoinList: [...data],
              }
            }
          })
        )
        return data
      }
    },
    getTransactionPayRate: async props => {
      const { isOk, data } = await getTransactionRate({ ...props })
      if (isOk) {
        set(
          produce((draft: IStore) => {
            draft.c2cTrade.transactionPayRate = data?.rate
            draft.c2cTrade.transactionPayOffset = data?.precesion
          })
        )
        return { rate: data?.rate }
      }
    },
    getC2COrderStatusDetail: async props => {
      const { isOk, data } = await getC2COrderDetail({ ...props })
      if (isOk) {
        set(
          produce((draft: IStore) => {
            draft.C2COrderStatusDetail = { ...data } as YapiGetV1C2COrderDetailData
          })
        )
      }
    },
    c2cOrderSubscribe() {
      if (subscribed) {
        return () => {}
      }
      const { onC2COrderStatusPush } = createOnWs(set, get)
      const subscribeParams: ISubscribeParams[] = [
        {
          subs: {
            biz: WsBizEnum.c2c,
            type: WsTypesEnum.c2corder,
          },
          callback: onC2COrderStatusPush,
        },
      ]
      subscribeParams.forEach(({ callback, ...params }) => {
        ws.subscribe({
          ...params,
          callback,
        })
      })
      subscribed = true
      return () => {
        subscribed = false
        subscribeParams.forEach(params => {
          ws.unsubscribe(params)
        })
      }
    },
  }

  return state
}
const baseC2CStore = create(getStore)

const useC2CStore = createTrackedSelector(baseC2CStore)

export { useC2CStore, baseC2CStore }
