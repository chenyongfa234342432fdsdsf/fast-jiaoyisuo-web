import { isShowBannerEnum } from "@/constants/agent/agent"

export type AgentManageInviteQueryReq = {}

interface InvitationCode {
  isDefault: number
  scaleList?: any
  isAgt: string
  invitationCodeName: string
  id: string
  invitationCode: string
  invitationLink: string
}

interface AgtInvitationCode {
  isDefault: number
  scaleList: ScaleList[]
  isAgt: string
  invitationCodeName: string
  id: string
  invitationCode: string
  invitationLink: string
}

interface ScaleList {
  uid?: any
  childScale: number
  selfScale: number
  productCd: string
}

interface AgtApplicationResp {
  createdByTime: string
  rebates: Rebates
  updatedByTime: string
  isDelete: number
  agtTypeCd: string
  businessId: number
  updateById?: any
  uid: number
  approvalRemark?: any
  approvalStatrusInd: number
  comment?: any
  id?: any
  createdById?: any
  productCds: string
}

interface Rebates {
  spot: string
  contract: string
  borrowCoin: string
}

export type AgentManageInviteQueryResp = {
  agtApplicationResp: AgtApplicationResp
  agtInvitationCode: AgtInvitationCode
  invitationCode: InvitationCode
  level?: number
  isShowBanner: isShowBannerEnum // 1: 为 1 则可以展示横幅，为 2 则不可以申请
}

export type AgentManageInvitePageListReq = {
  page: string // 页数
  pageSize: string // 条数
}

type AgentManageInvitePageList = {
  createdByTime?: string // 创建时间
  updatedByTime?: string
  borrowCoinSelfRate: number // 自身借币分成
  isDelete: number
  agtTypeCd: string
  businessId: number
  invitationCodeName: string // 邀请码名称
  updateById?: number
  invitationLink: string // 邀请连接
  createdCode: number // 剩余可创建邀请码数
  uid: number
  isDefault: number
  spotSelfRate: number // 自身现货分成
  invitationNum: number // 好友数
  spotChildRate: number // 好友现货分成
  contractSelfRate: number // 自身合约分成
  borrowCoinChildRate: number // 好友借币分成
  contractChildRate: number // 好友合约分成
  statusInd: number
  id: number
  beginTime?: string
  endTime?: any
  analysisList?: {
    date: string // 时间
    uid: string // uid
  }[] // 邀请人详情
  invitationCode: string // 邀请码
  createdById?: number
}

export type AgentManageInvitePageListResp = {
  startRow: number
  navigatepageNums?: any
  prePage: number
  hasNextPage: boolean
  nextPage: number
  pageSize: number
  endRow: number
  list: AgentManageInvitePageList[]
  pageNum: number
  navigatePages: number
  total: number // 总数
  navigateFirstPage: number
  pages: number
  size: number
  isLastPage: boolean
  hasPreviousPage: boolean
  navigateLastPage: number
  isFirstPage: boolean
}

export type AgentManageInviteAddReq = {
  invitationCodeName: string // 邀请码名称
  spotSelfRate: string // 现货自身
  spotChildRate: string // 现货好友
  contractSelfRate: string // 合约自身
  contractChildRate: string // 合约好友
  borrowCoinSelfRate: string // 合约自身
  borrowCoinChildRate: string // 合约好友
  isDefault: string // 是否默认邀请码：1 是 2 否
}

export type AgentManageInviteAddResp = {}

export type AgentManageInviteUpdateReq = {
  invitationCodeName?: string // 邀请码名称
  spotSelfRate?: string // 现货自身
  spotChildRate?: string // 现货好友
  contractSelfRate?: string // 合约自身
  contractChildRate?: string // 合约好友
  borrowCoinSelfRate?: string // 合约自身
  borrowCoinChildRate?: string // 合约好友
  isDefault?: string // 是否默认邀请码：1 是 2 否
  id: string // 邀请码 id
  invitationCode?: string // 邀请码
}

export type AgentManageInviteUpdateResp = {}

export type AgentInviteQueryMaxReq = {}

export type AgentInviteQueryMaxResp = {
  spot: string // 现货
  contract: string // 合约
  borrowCoin: string // 借币
  scaleList?: Array<ScaleList>
  isAgt?: string // 是否是代理商
}

export type JoinInviteAddReq = {
  contact: string // 联系类型  1 为手机 2 为邮箱 3 为社交媒体
  contactInformation: string // 联系方式
  invitationNum: string // 预计可邀请用户数
  rebates: {
    spot: number // 现货
    contract: number // 合约
    borrowCoin: number // 借币
  }
  comment?: string // 申请补充说明
  mobileCountryCd?: string // 区号，contact 为 1 时必传
  socialMedia?: string // 社交媒体名称，contact 为 3 时必传
}

export type JoinInviteAddResp = {
  spot: string // 现货
  contract: string // 合约
  borrowCoin: string // 借币
}