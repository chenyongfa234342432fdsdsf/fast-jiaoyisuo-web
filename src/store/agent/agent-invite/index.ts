import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import { useInviteDetailsAnalysis } from '@/hooks/features/agent'
import {
  getV1AgentInvitationCodeQueryMaxApiRequest,
  postV1AgentInviteDetailsAnalysisApiRequest,
  postV1AgentInviteDetailsApiRequest,
  postV1AgentInviteHistoryApiRequest,
} from '@/apis/agent/invite'
import {
  useAgentInviteAnalysis,
  useAgentInviteInfoList,
  useAgentInviteInfoOverviewInit,
  useAgentInviteTableCheckMore,
  useGetContractStatusCode,
} from '@/hooks/features/agent/invite'
import {
  YapiPostV1AgentInviteDetailsApiResponseReal,
  YapiPostV1AgentInviteDetailsListMembersReal,
  YapiPostV1AgentInviteHistoryApiRequestReal,
} from '@/typings/api/agent/invite'
import { inviteFilterFormHelper, InviteTypeModeEnum } from '@/constants/agent/invite'
import { YapiGetV1AgentInvitationCodeQueryMaxData } from '@/typings/yapi/AgentInvitationCodeQueryMaxV1GetApi'
import { YapiGetV1AgentInvitationCodeQueryProductCdData } from '@/typings/yapi/AgentInvitationCodeQueryProductCdV1GetApi'
import { getV1AgentInvitationCodeQueryProductCdApiRequest } from '@/apis/agent'

type TStore = ReturnType<typeof getStore>
export type IAgentInviteStore = TStore

export function getDefaultChartFilterSetting() {
  return {
    startDate: undefined,
    endDate: undefined,
  }
}

function defaultPageConfig() {
  return {
    finished: false,
    page: 1,
    pageSize: 20,
  }
}

function getStore(set) {
  return {
    isEncrypt: false,
    toggleEncrypt: () => {
      set(
        produce((draft: TStore) => {
          draft.isEncrypt = !draft.isEncrypt
        })
      )
    },
    isInfoPopUnderOpen: [],
    setInfoPopUnderState: callback =>
      set(
        produce((draft: TStore) => {
          draft.isInfoPopUnderOpen = callback(draft.isInfoPopUnderOpen)
        })
      ),
    isFilterFormOpen: false,
    toggleFilterForm: () =>
      set(
        produce((draft: TStore) => {
          draft.isFilterFormOpen = !draft.isFilterFormOpen
        })
      ),

    isFilterFormOpenCheckMore: false,
    toggleFilterFormCheckMore: () =>
      set(
        produce((draft: TStore) => {
          draft.isFilterFormOpenCheckMore = !draft.isFilterFormOpenCheckMore
        })
      ),

    checkMoreTableUpUidHide: false,
    toggleCheckMoreUpUidHide() {
      set(
        produce((draft: TStore) => {
          draft.checkMoreTableUpUidHide = !draft.checkMoreTableUpUidHide
        })
      )
    },

    page: defaultPageConfig(),

    setPage: setting =>
      set(
        produce((draft: TStore) => {
          draft.page = {
            ...draft.page,
            ...setting,
          }
        })
      ),

    filterSettingCheckMoreSelectedUids: [] as string[],
    setfilterSettingCheckMoreSelectedUids(newId: string) {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreSelectedUids = [...draft.filterSettingCheckMoreSelectedUids, newId]
        })
      )
    },
    setfilterSettingCheckMoreSelectedUidsPop() {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreSelectedUids = [
            ...draft.filterSettingCheckMoreSelectedUids.slice(0, draft.filterSettingCheckMoreSelectedUids.length - 1),
          ]
        })
      )
    },
    resetfilterSettingCheckMoreSelectedUids() {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreSelectedUids = []
        })
      )
    },
    filterSettingCheckMoreActiveUid: '',
    setFilterSettingCheckMoreActiveUid(id: any) {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreActiveUid = id
        })
      )
    },
    filterSettingCheckMore: {} as YapiPostV1AgentInviteHistoryApiRequestReal,
    resetFilterSettingCheckMore() {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMore = {}
        })
      )
    },
    setFilterSettingCheckMore: (setting: YapiPostV1AgentInviteHistoryApiRequestReal) => {
      set(
        produce((draft: TStore) => {
          const merged = {
            ...draft.filterSettingCheckMore,
            ...setting,
          }
          draft.filterSettingCheckMore = merged
        })
      )
    },

    checkMoreMode: InviteTypeModeEnum.all,
    resetCheckMoreMode() {
      set(
        produce((draft: TStore) => {
          draft.checkMoreMode = InviteTypeModeEnum.all
        })
      )
    },
    setCheckMoreMode(val: InviteTypeModeEnum) {
      set(
        produce((draft: TStore) => {
          draft.checkMoreMode = val
        })
      )
    },

    isSearchFocused: false,
    setOnSearchFocus(val: boolean) {
      set(
        produce((draft: TStore) => {
          draft.isSearchFocused = val
        })
      )
    },

    searchInput: '',
    setSearchInput(val: string) {
      set(
        produce((draft: TStore) => {
          draft.searchInput = val
        })
      )
    },

    chartFilterSetting: getDefaultChartFilterSetting(),
    setChartFilterSetting: setting =>
      set(
        produce((draft: TStore) => {
          draft.chartFilterSetting = {
            ...draft.chartFilterSetting,
            ...setting,
          }
        })
      ),

    selectedInvited: {} as YapiPostV1AgentInviteDetailsListMembersReal,
    setSelectedInvited: (data: YapiPostV1AgentInviteDetailsListMembersReal) =>
      set(
        produce((draft: TStore) => {
          draft.selectedInvited = data
        })
      ),

    contractStatusCode: {} as any,
    setContractStatusCode(data) {
      set(
        produce((draft: TStore) => {
          draft.contractStatusCode = data
        })
      )
    },

    async fetchProductLines() {
      getV1AgentInvitationCodeQueryMaxApiRequest({}).then(res => {
        if (res.isOk) {
          set(
            produce((draft: TStore) => {
              draft.cache.productLineEnabledState = res.data || {}
            })
          )
        }
      })
    },

    // 叠加代理商开通的产品
    async fetchProductLinesWithFee() {
      getV1AgentInvitationCodeQueryProductCdApiRequest({}).then(res => {
        if (res.isOk) {
          set(
            produce((draft: TStore) => {
              draft.cache.productLineEnabledStateWithFee = res.data || {}
            })
          )
        }
      })
    },

    apis: {
      // overviewInitApi: useAgentInviteInfoOverviewInit,
      inviteDetailsApi: postV1AgentInviteDetailsApiRequest,
      inviteDetailsAnalysisApi: postV1AgentInviteDetailsAnalysisApiRequest,
      inviteDetailsCheckMoreTableApi: postV1AgentInviteHistoryApiRequest,
    },
    cache: {
      productLineEnabledState: {} as Partial<YapiGetV1AgentInvitationCodeQueryMaxData>,
      productLineEnabledStateWithFee: {} as Partial<YapiGetV1AgentInvitationCodeQueryProductCdData>,

      overviewInit: {} as YapiPostV1AgentInviteDetailsApiResponseReal,
      setOverviewInit(data?: YapiPostV1AgentInviteDetailsApiResponseReal) {
        set(
          produce((draft: TStore) => {
            draft.cache.overviewInit = data || {}
          })
        )
      },
    },
    hooks: {
      useAgentInviteInfoOverviewInit,
      useAgentInviteInfoList,
      useAnalysis: useAgentInviteAnalysis,
      useInviteDetailsAnalysis,
      useAgentInviteTableCheckMore,
      useGetContractStatusCode,
    },
    helper: inviteFilterFormHelper,
  }
}

const baseAgentInviteStore = create(devtools(getStore, { name: 'market-agent-invite-store' }))

const useAgentInviteStore = createTrackedSelector(baseAgentInviteStore)

export { useAgentInviteStore, baseAgentInviteStore }
