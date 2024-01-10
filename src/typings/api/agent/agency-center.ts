export type AgencyCenterGetMethodDefaultReq = {} 

export type AgencyCenterGetMethodDefaultResp = {} 

export type InfoHistoryOverviewReq = {
  startDate?: number // 开始时间
  endDate?: number // 结束时间
}

export type AgencyCenterOverviewResp = {
  totalIncome: number // 总收益
  spot: number // 现货
  contract: number // 合约
  borrowCoin: number // 借币
  legalCur: string // 法币
  totalNum: number // 伞下总数
  invitedNum: number // 邀请数
}

export type AgencyCenterQueryIncomeDetailsReq = {
  productCd?: string // 产品线 字典表 code：agent_product_cd
  startTime?: number // 开始时间
  endTime?: number // 结束时间
  minAmount?: number // 最小金额
  maxAmount?: number // 最小金额
  page: number // 页
  pageSize: number // 条数
}

type IncomesType = {
  spot:	number // 现货收益	
  contract: number // 合约收益	
  borrowCoin:	number // 借币收益	
  dateType:	string	// 统计日期类型（1 今日，2 七日，3 三十日）	
  total: number	// 当前日期总收益
}

export type IncomeDetailsType = {
  key?: string
  settlementCur: string	// 当时结算币种	
  productCd: string	// 产品线	
  createdByTime: string	// 日期	
  settlementCurIncome: number	// 结算币种手续费	
  legalCurIncome:	number	// 法币手续费
}

export type AgencyCenterQueryIncomeDetailsResp = {
  totalIncome: number // 总收益
  settlementCur: string // 结算币种
  incomes: Array<IncomesType> // 收益
  incomeDetails: {
    list: Array<IncomeDetailsType>
    pageNum: number
    pageSize: number
    total: number
  } // 收益详情
  legalCur: string // 法币币种
}

export type AgencyCenterQueryInviteDetailsReq = {
  isAgt?: string // 邀请类型
  uid?: number | string // 搜索用户 id
  kycStatus?: number | null // 实名状态 1 为未认证，不传默认已认证
  minChildNum?: number // 最小伞下人数
  maxChildNum?: number // 最大伞下人数
  minSpot?: number // 最小现货比例
  maxSpot?: number // 最大现货比例
  minContract?: number // 最小合约比例
  maxContract?: number // 最大合约比例
  minBorrow?: number // 最小借币比例
  maxBorrow?: number // 最大借币比例
  registerStartTime?: number // 注册开始时间
  registerEndTime?: number // 注册结束时间
  registerSort?: string // 注册时间排序 1 正序 2 倒序
  childNumSort?: string // 伞下人数排序 1 正序 2 倒序
  page: number // 页
  pageSize: number // 条数
}

type InviteDetailsMembersScalesType = {
  productCd: string	// 产品线	
  selfScale: string	// 自身分成
  childScale: string // 好友分成	
}

export type InviteDetailsMembersType = {
  nickName: string	// 用户名称	
  uid: number	// 用户 id	
  inviteCount: string	 // 伞下人数	
  isAgt: string	// 是否代理	
  createdTime: string	// 注册时间
  scales: Array<InviteDetailsMembersScalesType>
  kycStatus: number // 实名状态 1 为未认证，不传默认已认证
  spotSelf: string // 现货自身分成
  spotChild: string // 现货好友分成
  contractSelf: string // 合约自身分成
  contractChild: string // 合约好友分成
  borrowSelf: string // 借币利息自身分成
  borrowChild: string // 借币利息好有分成
}

export type AgencyCenterQueryInviteDetailsResp = {
  invitedNum: number // 总收益
  totalNum: number // 结算币种
  today: number // 收益
  sevenDays: number // 收益详情
  thirtyDays: string // 法币币种
  members: {
    list: Array<InviteDetailsMembersType>
    pageNum: number
    pageSize: number
    total: number
  }
}

type ScaleList = {
  childScale: number
  productCd: string
  selfScale: number
  uid: string
}

export type AgencyCenterInvitationCodeQueryProductCdResp = {
  spot: string
  contract: string
  borrowCoin: string
  scaleList: Array<ScaleList>
}