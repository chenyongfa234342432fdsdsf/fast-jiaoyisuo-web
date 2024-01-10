export enum emailOrPhoneEnum {
  /** 手机号 */
  phone = 1,

  /** 邮箱 */
  email = 2,

  /** 社交媒体账号 */
  socialMedia = 3,
}

/** 代理商申请状态 */
export enum JoinStatusEnum {
  /** 未提交 */
  default = -1,

  /** 待审批 */
  noReview = 0,

  /** 通过 */
  pass = 1,

  /** 拒绝 */
  noPass = 2,
}

export enum AgentCodeEnum {
  /** 代理商邀请码 */
  agent = 0,

  /** 普通邀请码 */
  ordinary = 1,
}

export const InviteQueryRespEnum = {
  [AgentCodeEnum.agent]: 'agtInvitationCode',
  [AgentCodeEnum.ordinary]: 'invitationCode',
} as const

export type AuditStatusType = {
  /** 审核状态 */
  status: JoinStatusEnum

  /** 拒绝理由 */
  approvalRemark: ''
}

export enum isShowBannerEnum {
  show = 1, // 可以展示横幅
  hidden = 2, // 则不可以申请
}

export enum AutoFocusEnum {
  spot = 1,
  contract = 2,
  borrowCoin = 3,
  userNumber = 4,
}

export type WebSocializeType = {
  label: string
  value: string
}
