import { getLoanables, getLoanLiquidation, getLoanOrders, getLoanRates, getLoanRepayment } from '@/apis/finance'
import { generateCommonApiAndStoreFormat } from '@/helper/store'
import { YapiDtoDerLiquidationListResp } from '@/typings/yapi-old/DerOrderLiquidationListPostApi'
import { YapiDtoDerPledgeRateAdjustListResp } from '@/typings/yapi-old/DerOrderPledgerateadjustListPostApi'
import { YapiDtoDerRepaymentListResp } from '@/typings/yapi-old/DerOrderRepaymentListPostApi'
import { YapiDtoLoanCoinProductListRespVO } from '@/typings/yapi-old/FinanceDerPledgeProductLoanCoinsListV1GetApi'
import { StoreApi } from 'zustand'
import { LoanStoreNames } from '../constant'

type FinanceLoanStore = {
  // api responses
  [LoanStoreNames.Loanables]: YapiDtoLoanCoinProductListRespVO[]
  [LoanStoreNames.LoanOrders]: YapiDtoDerRepaymentListResp[]
  [LoanStoreNames.LoanRepayment]: YapiDtoDerRepaymentListResp[]
  [LoanStoreNames.LoanRates]: YapiDtoDerPledgeRateAdjustListResp[]
  [LoanStoreNames.LoanLiquidation]: YapiDtoDerLiquidationListResp[]

  // api requests
  getLoanables: () => void
  getLoanOrders: () => void
  getLoanRepayment: () => void
  getLoanRates: () => void
  getLoanLiquidation: () => void
}

function getLoanStore(set: StoreApi<FinanceLoanStore>['setState']): FinanceLoanStore {
  const loanApiAndStore = generateCommonApiAndStoreFormat(set)
  return {
    ...(loanApiAndStore(LoanStoreNames.Loanables, getLoanables, {}, res => res.data?.data ?? []) as unknown as Pick<
      FinanceLoanStore,
      'getLoanables' | LoanStoreNames.Loanables
    >),

    ...(loanApiAndStore(
      LoanStoreNames.LoanRepayment,
      getLoanRepayment,
      {},
      res => res.data?.data ?? []
    ) as unknown as Pick<FinanceLoanStore, 'getLoanRepayment' | LoanStoreNames.LoanRepayment>),

    ...(loanApiAndStore(
      LoanStoreNames.LoanOrders,
      getLoanOrders,
      { pageNum: 1, pageSize: 1, orderStatusList: [0, 1, 2] },
      res => res.data?.data ?? []
    ) as unknown as Pick<FinanceLoanStore, 'getLoanOrders' | LoanStoreNames.LoanOrders>),

    ...(loanApiAndStore(
      LoanStoreNames.LoanRates,
      getLoanRates,
      { pageNum: 1, pageSize: 6 },
      res => res.data?.data ?? []
    ) as unknown as Pick<FinanceLoanStore, 'getLoanRates' | LoanStoreNames.LoanRates>),

    ...(loanApiAndStore(
      LoanStoreNames.LoanLiquidation,
      getLoanLiquidation,
      {},
      res => res.data?.data ?? []
    ) as unknown as Pick<FinanceLoanStore, 'getLoanLiquidation' | LoanStoreNames.LoanLiquidation>),
  }
}

export { FinanceLoanStore, getLoanStore }
