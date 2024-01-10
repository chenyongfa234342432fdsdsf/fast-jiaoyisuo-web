// 邀请明细表单筛选条件 Enum

import { t } from '@lingui/macro'

// 邀请类型
export enum InviteFilterInviteTypeEnum {
  // TODO-LE0 value
  total = '',
  agentInvite = '1',
  normalInvite = '2',
}

// 实名状态 1 为未认证，不传默认已认证
export enum InviteFilterKycEnum {
  total = '',
  verified = '2',
  notVerified = '1',
}
// 排序约定 1 正序 2 倒序
export enum InviteFilterSortEnum {
  default = '',
  asc = '1',
  desc = '2',
}

export enum DateOptionsTypesInvite {
  now,
  last7Days,
  last30Days,
  custom,
  all,
}

export const dateOptionsTypesInviteApiKeyMap = {
  [DateOptionsTypesInvite.now]: 'today',
  [DateOptionsTypesInvite.last7Days]: 'sevenDays',
  [DateOptionsTypesInvite.last30Days]: 'thirtyDays',
}

// export const dateOptionsInvite = () => [
//   {
//     label: t`constants_agent_invite_index_5101402`,
//     value: DateOptionsTypesInvite.now,
//   },
//   {
//     label: t`constants_agent_5101365`,
//     value: DateOptionsTypesInvite.last7Days,
//   },
//   {
//     label: t`constants_agent_5101366`,
//     value: DateOptionsTypesInvite.last30Days,
//   },
// ]

export const infoHeaderTypesInvite = () => {
  return {
    [DateOptionsTypesInvite.now]: {
      title: t`constants_agent_invite_index_5101586`,
      content: t`constants_agent_invite_index_5101587`,
    },
    [DateOptionsTypesInvite.last7Days]: {
      title: t`constants_agent_invite_index_5101588`,
      content: t`constants_agent_invite_index_5101589`,
    },
    [DateOptionsTypesInvite.last30Days]: {
      title: t`constants_agent_invite_index_5101590`,
      content: t`constants_agent_invite_index_5101591`,
    },
  }
}

export const inviteFilterFormHelper = {
  /* api 返回结果，kycStatus 不是 1 则为已认证 */
  isKycVerified(kycStatus: string | number) {
    if (String(kycStatus) === InviteFilterKycEnum.notVerified) return false
    return true
  },

  getCheckMoreDefaultPage() {
    return {
      total: 0,
      current: 1,
      showTotal: true,
      showJumper: true,
      sizeCanChange: true,
      hideOnSinglePage: false,
      pageSize: 20,
    }
  },
}

export enum InviteTypeModeEnum {
  all = 0,
  levelLimit = 1,
  searhing = 3,
  lookingUp = 4,
}

export const InviteCheckOnlyUnderMe = 1
