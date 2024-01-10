import { Message } from '@nbit/arco'
import create from 'zustand'
import { t } from '@lingui/macro'
import { subscribeWithSelector } from 'zustand/middleware'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import cacheUtils from 'store'
import { ContractPreferenceResp, ContractPreferenceSettingReq } from '@/typings/api/future/preferences'
import { getMemberContractPreference, postMemberContractPreferenceSetting } from '@/apis/future/preferences'
import {
  UserEnableEnum,
  UserOpenEnum,
  UserMarginSourceEnum,
  UserRetrieveWayEnum,
  GearEnum,
  UserContractVersionEnum,
} from '@/constants/user'
import { baseUserStore } from '@/store/user'

type IStore = ReturnType<typeof getStore>

const userContractPreference = 'USER_CONTRACT_PREFERENCE'

/** 合约偏好设置默认值 */
const contractPreferenceDefault = {
  isAutoAdd: UserEnableEnum.yes,
  autoAddThreshold: GearEnum.low,
  autoAddQuota: 0,
  isAutoAddExtra: UserEnableEnum.yes,
  retrieveWay: UserRetrieveWayEnum.manual,
  protect: UserOpenEnum.open,
  isAvg: UserEnableEnum.no,
  marginSource: UserMarginSourceEnum.wallet,
  isSettingAutoMargin: false,
  perpetualVersion: UserContractVersionEnum.professional,
  autoCloseIsolatedPosition: UserOpenEnum.close,
  hasOpenSpecializeVersion: UserContractVersionEnum.base,
}

function getStore(set, get) {
  return {
    contractPreference: <ContractPreferenceResp>contractPreferenceDefault,
    setContractPreference: (values: ContractPreferenceSettingReq) =>
      set((store: IStore) => {
        return produce(store, _store => {
          const contractPreferenceData = { ..._store.contractPreference, ...values }
          _store.contractPreference = contractPreferenceData
          cacheUtils.set(userContractPreference, contractPreferenceData)
        })
      }),
    async getContractPreference() {
      const res = await getMemberContractPreference({})
      if (res.isOk) {
        set((store: IStore) => {
          return produce(store, _store => {
            const contractPreferenceData = { ...(res.data as ContractPreferenceResp) }
            _store.contractPreference = contractPreferenceData
            cacheUtils.set(userContractPreference, contractPreferenceData)
          })
        })
      }
    },
    async updateContractPreference(options: ContractPreferenceSettingReq, msg?: string) {
      const { setPersonalCenterSettings } = baseUserStore.getState()
      const res = await postMemberContractPreferenceSetting(options)
      if (!res.isOk) {
        return false
      }

      const state: IStore = get()
      /** 判断是否是首次启动自动追加保证金 */
      if (options.isAutoAdd && options.isAutoAdd === UserEnableEnum.yes) {
        setPersonalCenterSettings({ automaticMarginCall: UserEnableEnum.yes })
      }

      Message.success(msg || t`features/user/personal-center/settings/converted-currency/index-0`)
      state.getContractPreference()
      return true
    },
  }
}
const baseContractPreferencesStore = create(subscribeWithSelector(getStore))

const useContractPreferencesStore = createTrackedSelector(baseContractPreferencesStore)

export { useContractPreferencesStore, baseContractPreferencesStore }
