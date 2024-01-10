export type C2CUserProfileReq = {
  uid?: string // 用户 id
}

export type C2CUserProfileResp = {
  avgConfirmTimeInside: number
  avgPayTime: number
  sumPayTime: number
  avgConfirmTimeOutside: number
  registerTime?: any
  nickName: string // 昵称
  sumConfirmTimeInside: number
  regCountryCd: string
  businessId: string
  orderCount: number
  sumConfirmTimeOutside: number
  avatarPath?: any
  isMerchant: number
  customerCnt: number
  completedOrderCount: number
  followed: boolean
  uid: string
  completedOrderRate: number
  totalOrderAmount: number
  blocked: boolean
  id: string
  kycType: number
  regCountryName: string
}

export type C2CUserBalanceListResp = {
  appLogo: string
  balance: number
  businessId: string
  coinId: string
  freezeBalance: number
  merchantFreezeBalance: number
  usdBalance: string
  name: string
  symbol: string
  uid: string
  webLogo: string
  coinName: string
  coinFullName: string
}

export type CoinListType = {
  id: string // 交易对 id
  symbol: string // 交易对 名称
  img: string // 图片 url
  balance: string // 余额
}


export type FollowListType = {
  avatarPath: string
  avgConfirmTimeInside: number
  avgConfirmTimeOutside: number
  avgPayTime: number
  blockTime: string
  completedOrderRate: number
  followTime: number
  isFollowed: boolean
  isMerchant: number
  kycType: number
  nickName: string
  registerTime: number
  uid: string
}

export type BlackListType = {
  avatarPath: string
  avgConfirmTimeInside: number
  avgConfirmTimeOutside: number
  avgPayTime: number
  blockTime: string
  completedOrderRate: number
  followTime: number
  isMerchant: number
  kycType: number
  nickName: string
  registerTime: number
  uid: string
}

export type ChatSettingType = {
  businessId: string
  connectTime: string
  id: string
  online: boolean
  receiveOrderStatus: number
  receiveOrderTimeJson: string
  uid: string
  welcomeInfoMessage: string
  welcomeInfoType: number
}