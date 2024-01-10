/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [热币理财记录详情↗](https://yapi.coin-online.cc/project/72/interface/api/1625) 的 **请求类型**
 *
 * @分类 [热币宝理财↗](https://yapi.coin-online.cc/project/72/interface/api/cat_452)
 * @标签 `热币宝理财`
 * @请求头 `GET /finance/asset/record/detail`
 * @更新时间 `2022-08-29 13:58:12`
 */
export interface YapiGetFinanceAssetRecordDetailApiRequest {
  'user.tradeList.relatedArray'?: string
  'user.tradeList.componentType'?: string
  'user.tradeList'?: string
  'user.fid'?: string
  'user.fshowid'?: string
  'user.fintrocode'?: string
  'user.floginname'?: string
  'user.fnickname'?: string
  'user.floginpassword'?: string
  'user.ftradepassword'?: string
  'user.ftelephone'?: string
  'user.femail'?: string
  'user.frealname'?: string
  'user.country'?: string
  'user.fidentityno'?: string
  'user.fidentitytype'?: string
  'user.fgoogleauthenticator'?: string
  'user.fgoogleurl'?: string
  'user.fstatus'?: string
  'user.fhasrealvalidate'?: string
  'user.fhasrealvalidatetime'?: string
  'user.identityType'?: string
  'user.identityStatus'?: string
  'user.fistelephonebind'?: string
  'user.fismailbind'?: string
  'user.fgooglebind'?: string
  'user.fupdatetime'?: string
  'user.ftradepwdtime'?: string
  'user.fareacode'?: string
  'user.version'?: string
  'user.fintrouid'?: string
  'user.finvalidateintrocount'?: string
  'user.fiscny'?: string
  'user.fiscoin'?: string
  'user.fbirth'?: string
  'user.flastlogintime'?: string
  'user.fregistertime'?: string
  'user.fleverlock'?: string
  'user.fqqopenid'?: string
  'user.funionid'?: string
  'user.fagentid'?: string
  'user.flastip'?: string
  'user.folduid'?: string
  'user.fplatform'?: string
  'user.isVideo'?: string
  'user.videoTime'?: string
  'user.isOpenPhoneValidate'?: string
  'user.isOpenGoogleValidate'?: string
  'user.isOpenEmailValidate'?: string
  'user.photo'?: string
  'user.isHavedModNickname'?: string
  'user.isOtcAction'?: string
  'user.isActivateContract'?: string
  'user.isActivateMargin'?: string
  'user.marginActivateDatetime'?: string
  'user.remark'?: string
  'user.type'?: string
  'user.salt'?: string
  'user.tradeSalt'?: string
  'user.fstatus_s'?: string
  'user.fiscny_s'?: string
  'user.fiscoin_s'?: string
  'user.fFavoriteTradeList'?: string
  'user.canOpenOrepool'?: string
  'user.ip'?: string
  'user.score'?: string
  'user.level'?: string
  'user.loginTTL'?: string
  'user.rcfailuretime'?: string
  'user.canOpenOtc'?: string
  'user.openPhoneValidate'?: string
  'user.openGoogleValidate'?: string
  'user.openEmailValidate'?: string
  'user.otcAction'?: string
  'user.unrealFiatWithdraw'?: string
  'user.leveracctid'?: string
  'user.isOpenLever'?: string
  'user.lastLoginTimeStamp'?: string
  /**
   * 页码
   */
  'pageNum'?: string
  /**
   * 每页显示条数
   */
  'pageSize'?: string
  /**
   * 是否返回总记录数，默认true
   */
  'count'?: string
  'userId'?: string
  /**
   * 币种id
   */
  'coinId'?: string
  /**
   * 币种名称
   */
  'coinName'?: string
  /**
   * 理财产品id
   */
  'productId'?: string
  /**
   * 理财产品id
   */
  'productType'?: string
  /**
   * 累计收益阶段，本月1，本季度3、本年度12、所有0，默认本年度
   */
  'profitPeriod'?: string
  /**
   * 是否可购，1可购，默认0不区分
   */
  'purchaseEnable'?: string
  'autoTransfer'?: string
  /**
   * 理财记录id
   */
  'recordId'?: string
  /**
   * 订单id
   */
  'orderId'?: string
}

/**
 * 接口 [热币理财记录详情↗](https://yapi.coin-online.cc/project/72/interface/api/1625) 的 **返回类型**
 *
 * @分类 [热币宝理财↗](https://yapi.coin-online.cc/project/72/interface/api/cat_452)
 * @标签 `热币宝理财`
 * @请求头 `GET /finance/asset/record/detail`
 * @更新时间 `2022-08-29 13:58:12`
 */
export interface YapiGetFinanceAssetRecordDetailApiResponse {
  code?: number
  data?: YapiDtoFinAssetRecordDTO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoFinAssetRecordDTO {
  amount?: string
  coinId?: number
  createdTime?: string
  currency?: number
  direction?: number
  lockPeriod?: number
  operateType?: number
  operateTypeDesc?: string
  productType?: number
  recordId?: number
  remark?: string
  status?: number
  statusDesc?: string
  transNo?: string
  updatedTime?: string
}

/* prettier-ignore-end */