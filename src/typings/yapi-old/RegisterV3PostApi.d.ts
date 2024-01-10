/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [注册↗](https://yapi.coin-online.cc/project/72/interface/api/2255) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/register`
 * @更新时间 `2022-09-02 11:56:34`
 */
export interface YapiPostV3RegisterApiRequest {
  /**
   * 加密后的业务数据
   */
  bizData?: string
  bizDataView: YapiDtoundefined
  /**
   * 随机向量
   */
  randomIv?: string
  /**
   * 随机密钥
   */
  randomKey?: string
  /**
   * 签名串
   */
  signature?: string
  targetObj?: {}
  /**
   * 时间戳
   */
  timestamp?: number
}
/**
 * bizData的请求参数格式（仅展示）
 */
export interface YapiDtoundefined {
  /**
   * 手机号码或者邮箱，手机号格式 86-15711941299
   */
  address: string
  /**
   * 国家或地区，例如中国 传CN
   */
  country?: string
  /**
   * 密码
   */
  pwd: string
  /**
   * 邀请码
   */
  inviteCode?: string
  /**
   * 极验验证码
   */
  imageCode: string
  /**
   * 邮箱或手机验证码
   */
  validCode: string
  lang?: string
}

/**
 * 接口 [注册↗](https://yapi.coin-online.cc/project/72/interface/api/2255) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/register`
 * @更新时间 `2022-09-02 11:56:34`
 */
export interface YapiPostV3RegisterApiResponse {
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
