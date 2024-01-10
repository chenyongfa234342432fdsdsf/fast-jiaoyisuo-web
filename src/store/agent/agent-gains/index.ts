import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import dayjs from 'dayjs'

type TStore = ReturnType<typeof getStore>
type TFilterSetting = {
  productCd: number
  startTime?: string | number
  endTime?: string | number
  minAmount?: string | number
  maxAmount?: string | number
  columnDetails: boolean
}

function getDefaultFilterSetting(): TFilterSetting {
  return {
    productCd: 0,
    // default last 3 months data
    startTime: dayjs().subtract(2, 'month').valueOf(),
    endTime: dayjs().valueOf(),
    minAmount: undefined,
    maxAmount: undefined,
    columnDetails: false,
  }
}

export function getDefaultChartFilterSetting() {
  return {
    startDate: undefined,
    endDate: undefined,
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
    rebateCurrency: '-',
    setRebateCurrency: cur => {
      set(
        produce((draft: TStore) => {
          draft.rebateCurrency = cur
        })
      )
    },
    settlementCurrency: '-',
    setSettlementCurrency: cur => {
      set(
        produce((draft: TStore) => {
          draft.rebateCurrency = cur
        })
      )
    },
    productCodeMap: {},
    setProductCodeMap: codeMap =>
      set(
        produce((draft: TStore) => {
          draft.productCodeMap = codeMap
        })
      ),

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

    filterSetting: getDefaultFilterSetting(),
    setFilterSetting: setting =>
      set(
        produce((draft: TStore) => {
          draft.filterSetting = {
            ...draft.filterSetting,
            ...setting,
          }
        })
      ),

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
  }
}

const baseAgentStatsStore = create(devtools(getStore, { name: 'market-agent-stats-store' }))

const useAgentStatsStore = createTrackedSelector(baseAgentStatsStore)

export { useAgentStatsStore, baseAgentStatsStore }
