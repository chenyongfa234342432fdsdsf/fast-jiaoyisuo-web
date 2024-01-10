/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [活期持仓资产赎回接口↗](https://yapi.coin-online.cc/project/72/interface/api/1643) 的 **请求类型**
 *
 * @分类 [热币宝理财↗](https://yapi.coin-online.cc/project/72/interface/api/cat_452)
 * @标签 `热币宝理财`
 * @请求头 `POST /finance/flexible/asset/redeem`
 * @更新时间 `2022-08-29 13:58:12`
 */
export interface YapiPostFinanceFlexibleAssetRedeemApiRequest {
  autoTransfer?: number
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  /**
   * 是否返回总记录数，默认true
   */
  count?: boolean
  /**
   * 订单id
   */
  orderId?: number
  /**
   * 页码
   */
  pageNum?: number
  /**
   * 每页显示条数
   */
  pageSize?: number
  /**
   * 理财产品id
   */
  productId?: number
  /**
   * 理财产品id
   */
  productType?: number
  /**
   * 累计收益阶段，本月1，本季度3、本年度12、所有0，默认本年度
   */
  profitPeriod?: number
  /**
   * 是否可购，1可购，默认0不区分
   */
  purchaseEnable?: number
  /**
   * 理财记录id
   */
  recordId?: number
  redeemAmount?: string
  redeemType?: number
  user?: YapiDtoFUser
  userId?: number
}
export interface YapiDtoFUser {
  canOpenOrepool?: string
  canOpenOtc?: number
  country?: string
  fFavoriteTradeList?: string
  fagentid?: number
  fareacode?: string
  fbirth?: string
  femail?: string
  fgoogleauthenticator?: string
  fgooglebind?: boolean
  fgoogleurl?: string
  fhasrealvalidate?: boolean
  fhasrealvalidatetime?: string
  fid?: number
  fidentityno?: string
  fidentitytype?: number
  fintrocode?: string
  fintrouid?: number
  finvalidateintrocount?: number
  fiscny?: number
  fiscny_s?: string
  fiscoin?: number
  fiscoin_s?: string
  fismailbind?: boolean
  fistelephonebind?: boolean
  flastip?: number
  flastlogintime?: string
  fleverlock?: number
  floginname?: string
  floginpassword?: string
  fnickname?: string
  folduid?: number
  fplatform?: number
  fqqopenid?: string
  frealname?: string
  fregistertime?: string
  fshowid?: number
  fstatus?: number
  fstatus_s?: string
  ftelephone?: string
  ftradepassword?: string
  ftradepwdtime?: string
  funionid?: string
  fupdatetime?: string
  identityStatus?: number
  identityType?: number
  ip?: string
  isActivateContract?: boolean
  isActivateMargin?: boolean
  isHavedModNickname?: boolean
  isOpenEmailValidate?: boolean
  isOpenGoogleValidate?: boolean
  isOpenLever?: string
  isOpenPhoneValidate?: boolean
  isOtcAction?: boolean
  isVideo?: boolean
  lastLoginTimeStamp?: number
  level?: number
  leveracctid?: number
  loginTTL?: number
  marginActivateDatetime?: string
  openEmailValidate?: boolean
  openGoogleValidate?: boolean
  openPhoneValidate?: boolean
  otcAction?: boolean
  photo?: string
  rcfailuretime?: string
  realIdentityType?: number
  remark?: string
  salt?: string
  score?: number
  tradeList?: {}[]
  tradeSalt?: string
  type?: number
  unrealFiatWithdraw?: boolean
  version?: number
  videoTime?: string
}

/**
 * 接口 [活期持仓资产赎回接口↗](https://yapi.coin-online.cc/project/72/interface/api/1643) 的 **返回类型**
 *
 * @分类 [热币宝理财↗](https://yapi.coin-online.cc/project/72/interface/api/cat_452)
 * @标签 `热币宝理财`
 * @请求头 `POST /finance/flexible/asset/redeem`
 * @更新时间 `2022-08-29 13:58:12`
 */
export interface YapiPostFinanceFlexibleAssetRedeemApiResponse {
  code?: number
  data?: YapiDtoFinAssetRedeemResp
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoFinAssetRedeemResp {
  coinId?: number
  redeemAmount?: string
  redeemId?: number
  redeemStepList?: YapiDtoFinanceRedeemStep[]
}
export interface YapiDtoFinanceRedeemStep {
  stepNo?: number
  stepStatus?: number
  stepTime?: string
}

/* prettier-ignore-end */
