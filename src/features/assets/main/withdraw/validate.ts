import { t } from '@lingui/macro'
/** 充提币校验 */
export const WithdrawValidateRules = {
  coinInfo: {
    required: true,
    message: t`features/assets/main/withdraw/validate-0`,
  },
  withdrawAddress: {
    required: true,
    message: t`features/assets/main/withdraw/validate-1`,
  },
  network: {
    required: true,
    message: t`features/assets/main/withdraw/validate-2`,
  },
  memoAddress: {
    required: true,
    message: t`features/assets/main/withdraw/validate-3`,
  },
  count: {
    required: true,
    type: 'number',
    message: t`features/assets/main/withdraw/validate-4`,
  },
  targetUID: {
    required: true,
    message: t`features/assets/main/withdraw/validate-5`,
  },
  remark: {
    required: true,
    message: t`features/assets/main/withdraw/validate-6`,
  },
}
