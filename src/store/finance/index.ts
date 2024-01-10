import { createTrackedSelector } from 'react-tracked'
import create, { StoreApi } from 'zustand'
import { FinanceEarnStore, getEarnStore } from './earn'
import { FinanceLoanStore, getLoanStore } from './loans'

type FinanceStore = FinanceLoanStore & FinanceEarnStore

function getStore(set: StoreApi<FinanceStore>['setState'], get: StoreApi<FinanceStore>['getState']): FinanceStore {
  return {
    ...getLoanStore(set),
    ...getEarnStore(set, get),
  }
}

const baseFinanceStore = create(getStore)

const useBaseFinanceStore = createTrackedSelector(baseFinanceStore)

export { baseFinanceStore, useBaseFinanceStore }
