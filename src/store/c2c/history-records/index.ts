import create from 'zustand'

import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { YapiGetV1C2CCoinAllListData } from '@/typings/yapi/C2cCoinAllV1GetApi'
import { c2cMaHelpers } from '@/helper/c2c/merchant-application'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi'
import { C2cHistoryRecordsRequest } from '@/typings/api/c2c/history-records'
import {
  C2cHistoryRecordAreaId,
  C2cHistoryRecordCoinId,
  C2cHistoryRecordDealTypeCd,
  C2cHistoryRecordTabEnum,
} from '@/constants/c2c/history-records'
import { useC2cHistoryRecords } from '@/hooks/features/c2c/history-records'

type IStore = ReturnType<typeof getStore>

const defaultRequestData = () => {
  return {
    coinId: C2cHistoryRecordCoinId.all,
    dealTypeCd: C2cHistoryRecordDealTypeCd.all,
    directCd: C2cHistoryRecordDealTypeCd.all,
    areaIds: C2cHistoryRecordAreaId.all,
    statusCd: C2cHistoryRecordTabEnum.all,
  } as C2cHistoryRecordsRequest
}

function getStore(set, get) {
  const state = {
    requestData: defaultRequestData(),
    setRequestData: (data: C2cHistoryRecordsRequest) => {
      set(
        produce((draft: IStore) => {
          draft.requestData = { ...draft.requestData, ...data }
        })
      )
    },
    resetRequestData: (data = {}) => {
      set(
        produce((draft: IStore) => {
          draft.requestData = { ...defaultRequestData(), ...data }
        })
      )
    },

    apis: {
      fetchAllCoins: () => {
        c2cMaHelpers.getAllCoins().then(data => {
          set(
            produce((draft: IStore) => {
              draft.cache.allCoins = data
            })
          )
        })
      },
      fetchTradeArea: () => {
        c2cMaHelpers.getTradeArea().then(data => {
          set(
            produce((draft: IStore) => {
              draft.cache.tradeArea = data
            })
          )
        })
      },
    },
    hooks: {
      useC2cHistoryRecords,
    },
    cache: {
      allCoins: [] as YapiGetV1C2CCoinAllListData[],
      tradeArea: [] as YapiGetV1C2CAreaListData[],
    },
  }

  return state
}
const baseC2CHrStore = create(getStore)

const useC2CHrStore = createTrackedSelector(baseC2CHrStore)

export { useC2CHrStore, baseC2CHrStore }
