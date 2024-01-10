export type IC2cOrderItem = {
  id: string
  tid: string
  businessId: string
  merchantUid: string
  uid: string
  advertId: string
  typeCd: string
  number: string
  totalPrice: string
  paymentId: string,
  mainchainAddrId?: string
  statusCd: string
  expireTime: number
  freezeEndTime: number
  side: string
  createdTime: number
  currencySymbol?: string
  price: string
  coinName: string
  remark?: string
  /** 站内或站外 */
  dealTypeCd: string
  paymentName: string
  nickName: string
  paymentAccount: string
  paymentBankOfDeposit?: string
  paymentQrCodeAddr?: string
  mainchainAddrName?: string
  buyerUid: string
  buyerUserName: string
  sellerUid: string
  sellerUserName: string
  sellerMerNickName: string
  buyerMerNickName: string
  /** 是否已提交申诉资料 (申诉的状态时) */
  isComplaintInformation: boolean
  isMerchant: boolean
  mainchainAddrMemo?: string
  buyAndSellRole: string
  cancelReason?: string
  appealUserName?: string
  appealUserId?: string
  appealReason?: string
  appealSpecificReason?: string
  paymentUserName?: string
  cancelUserId?: string
  directCd?: string
  currencyEnName: string
  advertUserName: string
}

export type IC2cOrderDetail = IC2cOrderItem & {
  urge: number
  isAppealWinner: boolean
  isAppealer: boolean
  appealVideo: string
  appealPicture: string[]
  cancelUid: string
  appealWinnerUserName: string
}

export type IC2cQueryOrderListResp = {
  list: IC2cOrderItem[]
  total: number
}

export type IC2cUpdateOrderStatusReq = {
  id: string
  statusCd: string
}
export type IC2cCancelOrderReq = {
  id: string
  type: string
  reason: string
}
export type IC2cAppealOrderReq = {
  id: string
  appealReason: string
  specificReason: string
  picture: string[]
  video: string
}