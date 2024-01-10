import create from 'zustand'

import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { YapiGetV1C2CCoinAllListData } from '@/typings/yapi/C2cCoinAllV1GetApi'
import { c2cMaHelpers } from '@/helper/c2c/merchant-application'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi'
import { C2cMaUserCurrentStatusEnum } from '@/constants/c2c/merchant-application'
import { c2cMaApis } from '@/apis/c2c/merchant-application'
import { YapiGetV1C2CMerchantInfoMerchantInfoData } from '@/typings/yapi/C2cMerchantInfoV1GetApi'
import { YapiGetV1C2CCommonSettingDataReal } from '@/typings/api/c2c/merchant-application'
import { YapiGetV1C2CCommonSettingKycLevelData } from '@/typings/yapi/C2cCommonSettingKycLevelV1GetApi'
import { C2CUserProfileResp } from '@/typings/api/c2c/center'
import { YapiGetV1C2CUserProfileData } from '@/typings/yapi/C2cUserProfileV1GetApi'
import { baseUserStore } from '@/store/user'

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  const state = {
    userApplicationStatus: C2cMaUserCurrentStatusEnum.none,

    apis: {
      fetchUserApplicationStatus: () => {
        c2cMaApis.getUserInfo({}).then(res => {
          set(
            produce((draft: IStore) => {
              if (res.isOk) {
                draft.userApplicationStatus = (res.data?.status ||
                  C2cMaUserCurrentStatusEnum.none) as C2cMaUserCurrentStatusEnum
                draft.cache.userApplicationInfo = res.data?.merchantInfo
              }
            })
          )
        })
      },
      fetchAllCoins: () => {
        c2cMaHelpers.getAllCoins().then(data => {
          set(
            produce((draft: IStore) => {
              draft.cache.allCoins = data
            })
          )
        })
      },

      fetchAllCoinsV1: () => {
        c2cMaHelpers.getAllCoinsV1().then(data => {
          set(
            produce((draft: IStore) => {
              draft.cache.allCoinsV1 = data
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
      fetchCommonSettings: () => {
        c2cMaApis.getCommonSettings({}).then(res => {
          if (res.isOk && res.data) {
            set(
              produce((draft: IStore) => {
                draft.cache.commonSettings = res.data
              })
            )
          }
        })
      },
      fetchKycInfo() {
        c2cMaApis.getKycLevel({}).then(res => {
          if (res.isOk && res.data) {
            set(
              produce((draft: IStore) => {
                draft.cache.kycSettings = res.data
              })
            )
          }
        })
      },
      fetchC2cUserInfo() {
        const uid = baseUserStore.getState().userInfo.uid
        c2cMaApis.getSelfUserInfo({ uid }).then(res => {
          if (res.isOk && res.data) {
            set(
              produce((draft: IStore) => {
                draft.cache.c2cUserInfo = res.data
              })
            )
          }
        })
      },
    },
    cache: {
      allCoins: [] as YapiGetV1C2CCoinAllListData[],
      allCoinsV1: [] as YapiGetV1C2CCoinAllListData[],
      tradeArea: [] as YapiGetV1C2CAreaListData[],
      commonSettings: {} as YapiGetV1C2CCommonSettingDataReal | undefined,
      userApplicationInfo: undefined as YapiGetV1C2CMerchantInfoMerchantInfoData | undefined,
      kycSettings: undefined as YapiGetV1C2CCommonSettingKycLevelData | undefined,
      c2cUserInfo: undefined as YapiGetV1C2CUserProfileData | undefined,
    },
  }

  return state
}
const baseC2CMaStore = create(getStore)

const useC2CMaStore = createTrackedSelector(baseC2CMaStore)

export { useC2CMaStore, baseC2CMaStore }
