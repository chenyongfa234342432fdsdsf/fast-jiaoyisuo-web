import { t } from '@lingui/macro'

export function getFutureOrderFundingFeeLogTypeEnumNames() {
  const values = {
    openPosition: t`constants/assets/common-0`,
    orderLock: t`features_trade_trade_setting_futures_automatic_margin_call_margin_record_index_5101508`,
    cancelOrderUnlock: t`features_trade_trade_setting_futures_automatic_margin_call_margin_record_index_5101509`,
    closePosition: t`constants/assets/common-1`,
    openPositionFee: t`constants/assets/common-2`,
    closePositionFee: t`constants/assets/common-3`,
    closePositionProfitAndLoss: t`constants/assets/common-4`,
    forcedClosePosition: t`constants/assets/common-5`,
    forcedReducePosition: t`constants/assets/common-6`,
    fundsFee: t`constants/assets/common-8`,
    withdrawMargin: t`constants_assets_futures_5101426`,
    depositMargin: t`constants_assets_futures_5101427`,
    lockPositionFee: t`constants/assets/common-7`,
    migrate: t`constants/assets/common-9`,
    forcedClosePositionReturn: t`constants/assets/common-10`,
    forcedClosePositionFee: t`constants/assets/common-11`,
    crossPositionInsuranceInjection: t`constants/assets/common-12`,
  }

  return Object.keys(values).map(key => ({
    label: values[key],
    value: key,
  }))
}
