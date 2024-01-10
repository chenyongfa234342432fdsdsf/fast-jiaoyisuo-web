/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [ajax定时请求是否有用户扫描了二维码↗](https://yapi.coin-online.cc/project/72/interface/api/2012) 的 **请求类型**
 *
 * @分类 [扫码登录↗](https://yapi.coin-online.cc/project/72/interface/api/cat_446)
 * @标签 `扫码登录`
 * @请求头 `POST /scanLogin/login`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiPostScanLoginLoginApiRequest {
  /**
   * qrCodeToken
   */
  qrCodeToken: string
}

/**
 * 接口 [ajax定时请求是否有用户扫描了二维码↗](https://yapi.coin-online.cc/project/72/interface/api/2012) 的 **返回类型**
 *
 * @分类 [扫码登录↗](https://yapi.coin-online.cc/project/72/interface/api/cat_446)
 * @标签 `扫码登录`
 * @请求头 `POST /scanLogin/login`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiPostScanLoginLoginApiResponse {
  code?: number
  data?: YapiDtoLoginResponse
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoLoginResponse {
  contractToken?: string
  secretKey?: string
  token?: string
  userinfo?: YapiDtoFUser
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

/* prettier-ignore-end */
